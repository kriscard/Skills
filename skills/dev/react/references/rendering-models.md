> **Priority: HIGH** — The rendering model is the most expensive architectural
> decision to reverse. Choosing CSR when SEO is required, or SSR when a static
> page would do, has infrastructure and performance consequences that compound
> over time. Apply when a new route or page is being designed; don't defer
> until after the implementation is built.
>
> **Read this when:** the user asks about SSR vs CSR vs SSG vs ISR vs RSC,
> "when should I use a Server Component", "do I need SSR for SEO", hydration
> mismatch, `suppressHydrationWarning`, or rendering model decision.
>
> **Not the right file?** Server Actions authentication and CORS → the
> `frontend` skill's `references/nextjs.md` (full detail). Data waterfall
> patterns → `waterfalls.md`.

# Rendering Models — Decision Framework

## The Models

| Model | When rendered | JS to client | SEO | Dynamic per-request | Next.js config |
|---|---|---|---|---|---|
| SSG | Build time | Full bundle | ✅ | ❌ | default, or `revalidate: false` |
| ISR | Build + on-demand revalidate | Full bundle | ✅ | Periodic | `revalidate: N` |
| SSR | Each request | Full bundle | ✅ | ✅ | `dynamic = 'force-dynamic'` |
| CSR | Client, after JS loads | Full bundle | ❌ by default | ✅ | `'use client'` + fetch in effect |
| RSC | Server (streamed) | Client components only | ✅ | ✅ | Default in App Router |

---

## Decision Tree

```
Does the page need to be indexed by search engines?
  ├─ No → CSR (rich interactivity, real-time data, no SEO needed)
  │        Examples: admin dashboards, collaborative editors, real-time feeds
  └─ Yes ↓

Does the content change per-request (personalized, live data)?
  ├─ No — content is the same for all users
  │   ├─ Updates periodically (hours/days)? → ISR
  │   │   Examples: pricing pages, product listings, blog with frequent posts
  │   └─ Rarely or never changes? → SSG
  │       Examples: docs, marketing, blog with infrequent posts
  └─ Yes — different per request
      ├─ Need the full page in HTML before JS executes (legacy SEO, zero JS budget)?
      │   → SSR — but measure TTFB; SSR can be SLOWER than CSR on slow servers
      └─ Have interactivity + want smaller client bundle?
          → RSC (App Router default) — server renders the static parts,
            client components handle interactivity
```

---

## SSG — Static Site Generation

Content is rendered at build time and served from a CDN.

```typescript
// Next.js App Router — default behavior (no revalidate = static)
export default async function Page() {
  const posts = await getPosts(); // Called once at build
  return <PostList posts={posts} />;
}

// Or explicitly
export const revalidate = false;
```

**Best for:** documentation, marketing sites, blogs, landing pages.
**Risk:** content can be stale between builds. Re-deploy or use ISR to refresh.

---

## ISR — Incremental Static Regeneration

Like SSG, but the page revalidates after `N` seconds. The first request after
the TTL triggers a background regeneration; subsequent requests see the cached
version until regeneration completes (stale-while-revalidate).

```typescript
// Revalidate every hour
export const revalidate = 3600;

export default async function Page() {
  const products = await getProducts();
  return <ProductGrid products={products} />;
}

// On-demand revalidation (cache tag)
import { revalidateTag } from 'next/cache';
export async function POST(req: Request) {
  await revalidateTag('products');
  return new Response(null, { status: 204 });
}
```

**Best for:** e-commerce listings, pricing pages, news feeds, any content that
changes but not every request.

---

## SSR — Server-Side Rendering

The full HTML is generated on every request. TTFB depends on the server and
data source.

**The SSR performance trap:** SSR TTFB includes the server's round-trip to the
database. On a fast device with a slow server/database, SSR can deliver a
*worse* experience than CSR (which at least shows a shell instantly). Measure
Core Web Vitals with both approaches before committing.

```typescript
// Force dynamic (opt-out of static optimization)
export const dynamic = 'force-dynamic';

// Or use a dynamic function — cookies/headers/searchParams
// automatically opt the segment into dynamic rendering
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const user = await getUserFromCookie(cookieStore.get('auth_token')?.value);
  return <Dashboard user={user} />;
}
```

**Best for:** personalized pages that must be SEO-indexed, search results pages,
any page where both freshness and indexability are hard requirements.

---

## CSR — Client-Side Rendering

HTML shell served immediately; data fetched by the client after JS executes.

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => fetch('/api/dashboard').then(r => r.json()),
  });

  if (isLoading) return <DashboardSkeleton />;
  return <DashboardView data={data} />;
}
```

**Best for:** admin dashboards, SaaS app interiors, real-time collaborative
tools, any UI where SEO is not a requirement.
**Risk:** poor LCP if the data-fetching phase is slow. Use a skeleton/loading
state to give feedback immediately.

---

## RSC — React Server Components

Components that run on the server. They can be `async`, access databases
directly, and have zero JavaScript cost on the client. Client components
(marked `'use client'`) handle interactivity.

```typescript
// RSC — runs on server, zero JS bundle cost
// app/users/page.tsx
export default async function UsersPage() {
  const users = await db.users.findMany(); // Direct DB access, no API needed
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>
          {user.name}
          <DeleteButton userId={user.id} /> {/* Client Component */}
        </li>
      ))}
    </ul>
  );
}

// Client Component — only what needs interactivity
// components/delete-button.tsx
'use client';
export function DeleteButton({ userId }: { userId: string }) {
  return <button onClick={() => deleteUser(userId)}>Delete</button>;
}
```

**The client boundary rule:** `'use client'` marks a module and everything it
imports as client code. Keep the boundary as deep in the tree as possible —
large Client Component subtrees lose the RSC benefit.

---

## Hydration Mismatches

Hydration = React attaches event handlers to server-rendered HTML. A mismatch
means the server HTML and the first client render differ → React discards the
HTML and re-renders from scratch (slower, sometimes visually jarring).

### Common causes

```typescript
// ❌ Date.now() / new Date() — server time ≠ client time
<span>{new Date().toLocaleDateString()}</span>

// ❌ Math.random() — different values each call
<div id={`item-${Math.random()}`}>

// ❌ window / document / navigator — don't exist on server
<div style={{ width: window.innerWidth }}>

// ❌ localStorage — doesn't exist on server
const theme = localStorage.getItem('theme');
```

### Fixes

```typescript
// ✅ useId() — stable ID, same on server and client
const id = useId();
<div id={id}>

// ✅ Client-only value with useEffect (causes one client-only paint, not mismatch)
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null; // or a skeleton

// ✅ suppressHydrationWarning — for leaf nodes with known, harmless differences
<time suppressHydrationWarning>{new Date().toLocaleTimeString()}</time>
```

**When to use `suppressHydrationWarning`:** only for leaf nodes where the
server/client difference is intentional (timestamps, user locale, ad slots).
Never on structural elements — that hides real bugs.

---

## Further Reading

- [Next.js rendering docs](https://nextjs.org/docs/app/building-your-application/rendering)
- [React — Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)
- [web.dev — Core Web Vitals](https://web.dev/vitals/)
