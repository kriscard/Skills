> **Priority: MEDIUM-HIGH** — Client-side data fetching without TanStack Query
> patterns creates race conditions, duplicate requests, and manual loading state
> that TanStack handles automatically. Apply after CRITICAL waterfall and bundle
> issues are resolved.
>
> **Read this when:** user mentions TanStack Query, React Query, `useQuery`,
> `useMutation`, `queryOptions`, `queryClient`, `staleTime`, `gcTime`,
> optimistic updates, query invalidation, or asks "how do I fetch data in React"
> outside of an RSC/Server Action context.
>
> **Not the right file?** RSC + Next.js data fetching → `waterfalls.md`.
> Sequential fetches / waterfall chains → `waterfalls.md`.

# TanStack Query Patterns

Patterns drawn from tkdodo.eu (primary TanStack Query advocate and maintainer
contributor). The goal: stop treating TanStack Query as a fetch wrapper and start
using it as a server state synchronization layer.

---

## The `queryOptions` Abstraction — Prefer Over Custom Hooks

Custom hook wrappers are the most common TanStack Query pattern, but they have a
fatal limitation: they can only be used inside components. `queryOptions` works
everywhere — components, loaders, prefetch functions, tests.

```typescript
// ❌ Custom hook wrapper — trapped inside components
function useUserQuery(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000,
  });
}

// ✅ queryOptions — works in components AND outside
import { queryOptions } from '@tanstack/react-query';

const userQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    staleTime: 5 * 60 * 1000,
  });

// In a component:
const { data } = useQuery(userQueryOptions(userId));

// In a route loader (outside component):
await queryClient.prefetchQuery(userQueryOptions(userId));

// In a test:
const queryState = queryClient.getQueryState(userQueryOptions(userId).queryKey);
```

This pattern is from tkdodo's "The Query Options API" — it separates the query
definition from its execution context.

---

## `select` — Decouple Storage from Observation

TanStack Query caches the full server response. `select` lets individual
components subscribe to only the slice they need — so they only re-render when
their slice changes.

```typescript
// ❌ Every todos change re-renders this component, even if the count didn't change
const { data: todos } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});
const doneCount = todos?.filter(t => t.done).length ?? 0;

// ✅ Component only re-renders when doneCount specifically changes
const { data: doneCount } = useQuery({
  ...todoQueryOptions(),
  select: todos => todos.filter(t => t.done).length,
});

// ✅ Also useful for data transformation — the cache stores raw, component gets transformed
const { data: userNames } = useQuery({
  ...usersQueryOptions(),
  select: users => users.map(u => u.name),
});
```

The cache always holds the full data. `select` is a projection, not a filter of
what gets stored.

---

## `staleTime` vs `gcTime` — Get These Right

The two most misunderstood options.

```typescript
const options = queryOptions({
  queryKey: ['user', id],
  queryFn: () => fetchUser(id),

  // staleTime: how long data is "fresh"
  // During this window: no background refetch on mount/focus/reconnect
  // After this window: background refetch next time the query is used
  // Default: 0 (always immediately stale → always refetches)
  staleTime: 5 * 60 * 1000, // 5 minutes — reasonable for user data

  // gcTime (formerly cacheTime): how long INACTIVE query data stays in memory
  // Inactive = no component is currently subscribed to this query
  // After gcTime: data is garbage collected (removed from cache)
  // Default: 5 minutes
  gcTime: 10 * 60 * 1000, // keep in memory 10 minutes after last use
});
```

**Common pattern:** set `staleTime` based on how often your data actually changes.
User profile: 5 min. Exchange rates: 30 sec. Static config: Infinity.

```typescript
// Static reference data — never refetch automatically
const countryQueryOptions = queryOptions({
  queryKey: ['countries'],
  queryFn: fetchCountries,
  staleTime: Infinity, // always "fresh", fetched once per session
  gcTime: Infinity,    // never garbage collected
});
```

---

## Query Key Factories — Structured, Invalidation-Safe Keys

Scattered string arrays break when you need to invalidate related queries.
Key factories give you a single source of truth.

```typescript
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: TodoFilters) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: string) => [...todoKeys.details(), id] as const,
};

// Usage in queries:
useQuery({ queryKey: todoKeys.detail(todoId), queryFn: () => fetchTodo(todoId) });

// Targeted invalidation:
queryClient.invalidateQueries({ queryKey: todoKeys.all });        // all todo queries
queryClient.invalidateQueries({ queryKey: todoKeys.lists() });    // only list queries
queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) }); // one specific todo
```

---

## Mutations + Optimistic Updates

The pattern: optimistically update the UI, sync to server, roll back on error.

```typescript
function useTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedTodo: UpdateTodoInput) => updateTodo(updatedTodo),

    onMutate: async (updatedTodo) => {
      // 1. Cancel outgoing refetches (prevents race condition)
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(updatedTodo.id) });

      // 2. Snapshot current state for rollback
      const previousTodo = queryClient.getQueryData(todoKeys.detail(updatedTodo.id));

      // 3. Optimistically update the cache
      queryClient.setQueryData(
        todoKeys.detail(updatedTodo.id),
        (old: Todo) => ({ ...old, ...updatedTodo }),
      );

      return { previousTodo }; // context for onError
    },

    onError: (err, updatedTodo, context) => {
      // Roll back to previous state
      queryClient.setQueryData(
        todoKeys.detail(updatedTodo.id),
        context?.previousTodo,
      );
    },

    onSettled: (data, error, updatedTodo) => {
      // Always re-sync with server (both success and error paths)
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(updatedTodo.id) });
    },
  });
}
```

---

## Dependent Queries — Sequential Dependencies via `enabled`

```typescript
function UserProjects({ userId }: { userId: string }) {
  // Step 1: fetch user
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Step 2: fetch projects — only when user.orgId is available
  const { data: projects } = useQuery({
    queryKey: ['projects', user?.orgId],
    queryFn: () => fetchProjects(user!.orgId),
    enabled: !!user?.orgId, // gate: won't run until this is truthy
  });

  // ...
}
```

**Note:** this creates a waterfall by necessity (projects needs orgId from user).
If you can pass orgId directly as a prop, do that instead. Only use `enabled` when
the dependency is genuinely unavoidable.

---

## Parallel Queries — No Manual Coordination Needed

Multiple `useQuery` calls in the same component fire in parallel automatically:

```typescript
function Dashboard({ userId }: { userId: string }) {
  // These start in parallel — no Promise.all needed
  const { data: user } = useQuery(userQueryOptions(userId));
  const { data: stats } = useQuery(statsQueryOptions(userId));
  const { data: notifications } = useQuery(notificationQueryOptions(userId));

  // ...
}
```

For dynamic parallel queries (unknown count at render time), use `useQueries`:

```typescript
const results = useQueries({
  queries: userIds.map(id => userQueryOptions(id)),
});
```

---

## Prefetching — Fix the React 19 Suspense Waterfall

React 19 changed Suspense so siblings no longer pre-render in parallel. TanStack
Query's prefetch pattern solves this — start the fetch before the component tree
renders:

```typescript
// In a Next.js route loader or parent RSC:
async function prefetchDashboardData(userId: string) {
  await Promise.all([
    queryClient.prefetchQuery(userQueryOptions(userId)),
    queryClient.prefetchQuery(statsQueryOptions(userId)),
  ]);
}

// In a TanStack Router loader (Vite SPA context):
const dashboardRoute = createRoute({
  loader: ({ params }) =>
    Promise.all([
      queryClient.prefetchQuery(userQueryOptions(params.userId)),
      queryClient.prefetchQuery(statsQueryOptions(params.userId)),
    ]),
  component: DashboardPage,
});
```

---

## Common Anti-Patterns

**Treating `queryFn` as the only place for error handling:**

```typescript
// ❌ Swallowing errors in queryFn
queryFn: async () => {
  try {
    return await fetchUser(id);
  } catch {
    return null; // TanStack Query won't know it failed — no retry, no error state
  }
}

// ✅ Let errors propagate — TanStack Query handles retry and error state
queryFn: () => fetchUser(id), // throws → caught by TanStack Query
```

**Using `queryClient.fetchQuery` when `prefetchQuery` is correct:**

```typescript
// ❌ fetchQuery — throws on error, puts you in charge of error handling
await queryClient.fetchQuery(options);

// ✅ prefetchQuery — silently fails, lets the component handle the error
await queryClient.prefetchQuery(options);
```

---

## Further Reading

- [TkDodo — Practical React Query](https://tkdodo.eu/blog/practical-react-query)
- [TkDodo — The Query Options API](https://tkdodo.eu/blog/the-query-options-api)
- [TkDodo — React Query and TypeScript](https://tkdodo.eu/blog/react-query-and-type-script)
- [TkDodo — Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)
- [TkDodo — Optimistic Updates in React Query](https://tkdodo.eu/blog/optimistic-updates-in-react-query)
