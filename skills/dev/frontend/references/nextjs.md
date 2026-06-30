> **Read this when:** the user mentions Next.js, App Router, Pages Router, RSC,
> Server Components, Server Actions, hydration mismatch, `suppressHydrationWarning`,
> `React.cache`, `after()`, or asks how to choose between SSR/SSG/ISR/CSR/RSC.
>
> **Not the right file?** TypeScript types in Next.js → `type-system.md`.
> Component composition and Tailwind → `ui-patterns.md`. Token storage and
> CSP in Next.js → `security.md`.

> **Priority: HIGH** — Next.js App Router patterns break in non-obvious ways
> when misapplied: Server Components converted to Client Components for minor
> interactivity, Server Actions used for reads (serializing parallel fetches),
> missing `React.cache` causing duplicate DB queries per request. Wrong choices
> here have structural consequences that get more expensive to fix over time.
>

# Next.js — App Router, Rendering Models, Data Fetching

## App Router vs Pages Router

| | App Router | Pages Router |
|---|---|---|
| Default since | Next.js 13.4 | Next.js 0–12 |
| Component model | React Server Components by default | All client components |
| Data fetching | `fetch` in components, Server Actions | `getServerSideProps`, `getStaticProps` |
| Layouts | Nested `layout.tsx` | `_app.tsx` + manual wrapping |
| Streaming | Yes — `loading.tsx`, `Suspense` | No |
| Migration | Coexists with pages/ | — |

**When to still use Pages Router:** migrating a large existing codebase where
rewriting is not feasible. New projects should use App Router.

---

## RSC vs Client Components — Decision Tree

Start with Server Components (the default). Add `'use client'` only when you
need:

```
Does this component need...
  ├─ onClick, onChange, or any event handler?  → 'use client'
  ├─ useState or useReducer?                   → 'use client'
  ├─ useEffect?                                → 'use client'
  ├─ browser-only APIs (window, localStorage)? → 'use client'
  ├─ third-party client libs (charts, maps)?   → 'use client'
  └─ none of the above?                        → Server Component ✅
```

**Key insight:** `'use client'` marks a boundary, not the whole tree. Children
of a Client Component can still be Server Components if they're passed as
`children` props from a Server Component ancestor.

```typescript
// ✅ Server Component passes a Server Component as children to a Client Component
// server-wrapper.tsx (RSC)
import { ClientShell } from './client-shell';
import { ServerContent } from './server-content'; // RSC

export default function Page() {
  return (
    <ClientShell>
      <ServerContent /> {/* Still a Server Component */}
    </ClientShell>
  );
}
```

---

## Rendering Model Decision Framework

### SSG (Static Site Generation)
- **When:** content rarely or never changes — docs, marketing, blog
- **Trade-off:** fastest TTFB, zero server cost; content can be stale
- **Next.js:** no `revalidate` option, or `revalidate: false`

### ISR (Incremental Static Regeneration)
- **When:** mostly static with periodic updates (pricing pages, product listings)
- **Trade-off:** near-static speed with freshness; stale window = `revalidate` seconds
- **Next.js:** `export const revalidate = 3600` in the route segment

### SSR (Server-Side Rendering)
- **When:** per-request dynamic data WITH SEO requirements (personalized dashboards
  that must be indexable, search result pages)
- **Trade-off:** always fresh; TTFB depends on server response time. **SSR can be
  WORSE than CSR** on slow servers or high-latency data sources, because the
  browser waits for the full HTML before showing anything. Measure.
- **Next.js:** `export const dynamic = 'force-dynamic'` or a dynamic function
  (`cookies()`, `headers()`) in the route segment

### CSR (Client-Side Rendering)
- **When:** rich real-time interactivity with no SEO requirement (admin dashboards,
  collaborative tools, real-time feeds)
- **Trade-off:** fast initial shell, then JS executes and data fetches. Not indexed
  by default.
- **Next.js:** `'use client'` + `useEffect` fetch or TanStack Query

### RSC (React Server Components)
- **When:** you want to reduce client bundle while keeping selective client
  interactivity — most App Router pages fall here by default
- **Trade-off:** streaming, partial hydration, zero JS for pure server UI; requires
  careful Client Component boundary placement
- **Next.js:** default in App Router

---

## Server Actions — Rules and Gotchas

Server Actions are RPC calls to the server. They are **mutations only**.

### Why not reads?

```typescript
// ❌ Server Action for a read — serializes every call
async function getUser(id: string) {
  'use server';
  return db.users.findUnique({ where: { id } });
}

// In the component: every call is a sequential network round-trip
// Two of these = waterfall; you can't Promise.all() them
const [user, posts] = await Promise.all([
  getUser(id),   // Server Action
  getPosts(id),  // Server Action
]); // Still sequential — Server Actions serialize
```

```typescript
// ✅ For reads: regular API endpoint + TanStack Query (client) or
// parallel fetch/RSC composition (server)
const [user, posts] = await Promise.all([
  fetch(`/api/users/${id}`).then(r => r.json()),
  fetch(`/api/users/${id}/posts`).then(r => r.json()),
]);
```

**Rule:** Server Actions for writes (form submits, DB mutations). API routes or
RSC composition for reads.

### Always authenticate Server Actions

```typescript
// ❌ Unauthenticated Server Action
async function deletePost(id: string) {
  'use server';
  await db.posts.delete({ where: { id } });
}

// ✅ Authenticate before every mutation
async function deletePost(id: string) {
  'use server';
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  if (!(await canDeletePost(session.user.id, id))) throw new Error('Forbidden');
  await db.posts.delete({ where: { id } });
}
```

---

## Data Fetching Patterns

### Parallel fetches in RSC

```typescript
// ❌ Sequential waterfall — second fetch waits for first
export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);
  const posts = await getPosts(params.id); // waits for user unnecessarily
  return <UserPosts user={user} posts={posts} />;
}

// ✅ Parallel — both start at the same time
export default async function Page({ params }: { params: { id: string } }) {
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getPosts(params.id),
  ]);
  return <UserPosts user={user} posts={posts} />;
}
```

### `React.cache()` for per-request deduplication

```typescript
// utils/user.ts
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  return db.users.findUnique({ where: { id } });
});

// Now multiple RSCs in the same request tree that call getUser(id) with the
// same id will only hit the database once. Resets per request.
```

### `after()` for non-blocking post-response work

```typescript
import { after } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const result = await createPost(data);

  // Runs AFTER the response is sent — doesn't delay TTFB
  after(async () => {
    await sendNotificationEmails(result.id);
    await logAnalyticsEvent('post_created', result.id);
  });

  return Response.json(result);
}
```

---

## Hydration Pitfalls

Hydration mismatch = server-rendered HTML doesn't match what React renders on
the client. Causes a full re-render, flickering, and console errors.

### Common causes

```typescript
// ❌ Date.now() differs between server and client
<span>{new Date(Date.now()).toLocaleDateString()}</span>

// ❌ Math.random() differs
<div id={`item-${Math.random()}`}>

// ❌ Browser-only API in render
<div>{window.innerWidth}px wide</div>

// ❌ localStorage read during render
const theme = localStorage.getItem('theme') ?? 'light';
```

### Fixes

```typescript
// ✅ useId() for stable unique IDs
const id = useId(); // Same on server and client
<div id={id}>

// ✅ useEffect for client-only values (causes single flash, not mismatch)
const [width, setWidth] = useState<number | null>(null);
useEffect(() => { setWidth(window.innerWidth); }, []);

// ✅ suppressHydrationWarning for known, intentional differences (e.g., timestamps)
<time suppressHydrationWarning>{new Date().toLocaleTimeString()}</time>
```

### When `suppressHydrationWarning` is acceptable

Only for leaf-node differences where the server/client delta is expected and
harmless (timestamps, ad slots, analytics IDs). Never suppress on structural
elements — it hides real bugs.

---

## App Structure Patterns

### Route Groups — organize without affecting URLs

Parenthesized directory names `(group)` create organizational groupings in the
file system but do not appear in the URL. Used in dub, midday, and most
production Next.js apps to apply different layouts to different route sets:

```
app/
├── (auth)/
│   ├── layout.tsx             ← auth layout (centered card, no sidebar)
│   ├── login/page.tsx         → /login
│   └── register/page.tsx      → /register
├── (dashboard)/
│   ├── layout.tsx             ← dashboard layout (sidebar, topbar)
│   ├── overview/page.tsx      → /overview
│   └── settings/page.tsx      → /settings
└── (marketing)/
    ├── layout.tsx             ← marketing layout (full-width, no auth)
    ├── page.tsx               → /
    └── pricing/page.tsx       → /pricing
```

Without route groups, a single root `layout.tsx` must conditionally show/hide
the sidebar — which gets messy. Route groups give each section its own layout.

### Centralized `providers.tsx` — all client providers in one place

Extract all client-side providers into a single `providers.tsx` component. This
keeps `layout.tsx` a Server Component (no `'use client'` needed at root) and
gives one place to audit what wraps the entire app.

```typescript
// app/providers.tsx  ← 'use client' boundary lives here
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient in state so each browser tab gets its own instance
  // (not a module-level singleton — that leaks state between server requests)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// app/layout.tsx  ← stays a Server Component
import { Providers } from './providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

`suppressHydrationWarning` on `<html>` is expected when using `next-themes` —
it patches the class before hydration, so the mismatch is intentional.

---

## Common App Router Gotchas

### `cookies()` / `headers()` opt the entire segment into dynamic rendering

```typescript
// ❌ This forces the whole page to be dynamic even if only one component needs it
import { cookies } from 'next/headers';

export default async function Page() {
  const theme = cookies().get('theme')?.value; // opt-in to dynamic
  return <BigPage theme={theme} />;
}

// ✅ Isolate dynamic reads into small components, keep the rest static
async function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = cookies().get('theme')?.value ?? 'light';
  return <div data-theme={theme}>{children}</div>;
}
```

### Metadata must be in Server Components

```typescript
// ✅ page.tsx (Server Component) — metadata export works
export const metadata = {
  title: 'My Page',
  description: '...',
};

// ❌ 'use client' components cannot export metadata
```

### Streaming with Suspense

```typescript
// ✅ Stream the shell immediately, then stream in the slow data
export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent /> {/* Streams in when ready */}
      </Suspense>
      <StaticFooter />
    </>
  );
}
```

---

## Further Reading

- [Next.js App Router docs](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md)
- [Leerob — Next.js patterns](https://leerob.io)
- [TkDodo — React Query with Next.js](https://tkdodo.eu/blog/using-react-query-with-next-js)
