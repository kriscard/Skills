> **Priority: CRITICAL** — Breaking changes fail silently. `defaultProps` on
> function components is ignored in React 19 without a warning. Suspense siblings
> no longer pre-render in parallel, creating hidden waterfalls. Apply this
> reference before any MEDIUM/HIGH reference when React 19 is the context.
>
> **Read this when:** user mentions React 19, `useActionState`, `useOptimistic`,
> `use()` hook, ref as prop, action props, async transitions, `nuqs`, form
> actions, or asks "why does `defaultProps` not work" / "do I still need
> `forwardRef`?"
>
> **Not the right file?** Rendering model strategy → `rendering-models.md`.
> Server Actions waterfalls → `waterfalls.md`.

# React 19 — Breaking Changes and New Patterns

React 19 shipped in December 2024. This file covers what broke, what replaced it,
and the new patterns built around async Actions.

---

## Breaking Changes

### ref is now a regular prop — no more `forwardRef`

```tsx
// ❌ React 18 — forwardRef required for passing refs to DOM elements
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <input ref={ref} {...props} />
));

// ✅ React 19 — ref is a normal prop, destructure it like any other
function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />;
}

// forwardRef still works (not removed), but is no longer needed for new code
```

### `defaultProps` silently ignored for function components

```tsx
// ❌ React 19 — silently does nothing for function components
function Button({ variant }: ButtonProps) { ... }
Button.defaultProps = { variant: 'primary' }; // ignored!

// ✅ Destructuring defaults — the only correct pattern in React 19
function Button({ variant = 'primary', size = 'md' }: ButtonProps) { ... }
```

`defaultProps` still works for class components.

### Suspense siblings no longer pre-render in parallel

This is the most subtle breaking change. In React 18, sibling Suspense boundaries
started pre-rendering while a sibling was suspended. In React 19, they don't.

```tsx
// React 18: UserPosts starts fetching while UserHeader is suspended
// React 19: UserPosts waits for UserHeader to fully resolve first (waterfall!)
<UserHeader userId={id} />
<UserPosts userId={id} />

// Fix: pre-fetch before render — don't rely on React to parallelize
// Next.js App Router: use cache() preloading (starts fetch without awaiting)
// TanStack Query: use prefetchQuery in route loaders
```

### `FormEvent` / `FormEventHandler` deprecated

```tsx
// ❌ Deprecated in React 19
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

// ✅ Use native SubmitEvent, or use the action attribute pattern below
const handleSubmit = (e: SubmitEvent) => { ... };
```

The recommended path is `useActionState` with the `action` attribute (see below)
which handles this automatically.

---

## New APIs

### `useActionState` — Form state + server-side validation + progressive enhancement

```tsx
import { useActionState } from 'react';

// Server Action (in actions.ts)
async function submitContact(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  if (!email.includes('@')) return { error: 'Invalid email' };
  await sendContactEmail(email);
  return { success: true };
}

// Component
function ContactForm() {
  const [state, action, isPending] = useActionState(submitContact, null);

  return (
    <form action={action}>
      <input name="email" type="email" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending…' : 'Send'}
      </button>
      {state?.error && <p role="alert">{state.error}</p>}
      {state?.success && <p>Sent!</p>}
    </form>
  );
}
```

**Why**: Works without JavaScript (progressive enhancement), handles race conditions
automatically, and gives you loading state without manual `useState` + `useTransition`.

### `useOptimistic` — Instant UI updates before the server responds

```tsx
import { useOptimistic } from 'react';

function LikeButton({ post }: { post: Post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (currentLikes: number, increment: number) => currentLikes + increment,
  );

  async function handleLike() {
    addOptimisticLike(1); // immediate UI update
    await likePost(post.id); // background server call
    // If server throws, React rolls back to post.likes automatically
  }

  return <button onClick={handleLike}>{optimisticLikes} likes</button>;
}
```

**Across disconnected trees:** wrap in a Context provider. Pass the `[optimisticValue, addOptimistic]`
tuple through Context so components that don't share a parent can share optimistic state.

### `use()` — Reads resources conditionally (unlike all other hooks)

```tsx
import { use } from 'react';

// use(Promise) — suspends until resolved
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // suspends and returns the user
  return <div>{user.name}</div>;
}

// use(Context) — can be called inside conditions and loops
function Component({ show }: { show: boolean }) {
  if (!show) return null;
  const theme = use(ThemeContext); // valid — use() works inside conditionals
  return <div style={{ color: theme.primary }}>…</div>;
}
```

`use()` cannot be called in `try/catch` or `for` loops, but it can be called
after an early return — which is the important case.

### Async transitions — `useTransition` with async functions

```tsx
function SearchPage() {
  const [isPending, startTransition] = useTransition();
  const [results, setResults] = useState<SearchResult[]>([]);

  function handleSearch(query: string) {
    startTransition(async () => {
      const data = await searchAPI(query); // async fn inside transition
      setResults(data); // batched, non-urgent update
    });
  }

  return (
    <>
      <SearchInput onChange={handleSearch} />
      {isPending && <Skeleton />}
      <SearchResults results={results} />
    </>
  );
}
```

The transition marks the state update as non-urgent — React can interrupt and
restart it if a higher-priority update comes in (user typing again).

---

## Patterns Enabled by React 19

### Action props — components own their pending state

From Aurora Scharff's RSC patterns (aurorascharff.no): components accept async
functions as props and manage their own `useTransition`. This keeps the caller
clean and keeps pending state co-located with the UI.

```tsx
// Component owns isPending — caller just passes the action
function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => action())}
      disabled={isPending}
      aria-busy={isPending}
    >
      {isPending ? 'Deleting…' : 'Delete'}
    </button>
  );
}

// Usage — clean, no loading state management at the call site
<DeleteButton action={() => deletePost(post.id)} />
<DeleteButton action={() => deleteComment(comment.id)} />
```

### `nuqs` — type-safe URL search params with transition support

```tsx
import { useQueryState } from 'nuqs';

// URL state as first-class React state — shareable, bookmarkable, SSR-compatible
function ProductFilters() {
  const [sort, setSort] = useQueryState('sort', {
    defaultValue: 'newest',
    shallow: false, // triggers navigation → RSC re-render
  });

  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  return (
    <select value={sort} onChange={e => setSort(e.target.value)}>
      <option value="newest">Newest</option>
      <option value="price">Price</option>
    </select>
  );
}
```

### `catchError` — framework-aware error boundaries (Next.js 15.2+)

`react-error-boundary` catches all errors including Next.js control-flow throws
(`notFound()`, `redirect()`), which breaks routing. `catchError` is Next.js's
native solution that correctly distinguishes:

```tsx
// ❌ react-error-boundary catches notFound() and redirect() — breaks routing
<ErrorBoundary fallback={<ErrorPage />}>
  <PageComponent />
</ErrorBoundary>

// ✅ Next.js error.tsx — framework-aware, skips control-flow errors
// app/dashboard/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Migration Checklist

- [ ] Replace `React.FC` / `React.FunctionComponent` with plain function declarations
- [ ] Replace `defaultProps` on function components with destructuring defaults
- [ ] Remove `forwardRef` wrappers — accept `ref` as a regular prop
- [ ] Replace `React.FormEvent` handler pattern with `useActionState` + action prop
- [ ] Audit Suspense boundaries — siblings no longer pre-render in parallel; add prefetching
- [ ] Replace manual loading state (`useState(false)` + promise tracking) with `useTransition`
- [ ] Consider `nuqs` for URL state (replaces manual `useSearchParams` parsing)

---

## Further Reading

- [React 19 Blog Post — react.dev](https://react.dev/blog/2024/12/05/react-19)
- [Aurora Scharff — React 19 Patterns](https://aurorascharff.no/posts/)
- [nuqs docs](https://nuqs.47ng.com)
