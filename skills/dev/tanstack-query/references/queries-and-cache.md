> **Read this when:** implementing or reviewing query keys/options, freshness, garbage collection, invalidation, disabled queries, query functions, or cancellation.

# Queries and cache lifecycle

## Cache identity

Start with the server resource, not the component. A key is a top-level array, is serializable, and
is unique to the cached data. Include every query-function input that changes the result:

```ts
const projectOptions = (projectId: string, filters: ProjectFilters) =>
  queryOptions({
    queryKey: ["projects", projectId, "issues", filters],
    queryFn: ({ signal }) => getIssues({ projectId, filters, signal }),
  })
```

Object-property order hashes deterministically; array order remains significant. Prefer direct
local keys while there is one caller. Introduce an options helper or key factory when several
callers must share identity, defaults, prefetching, invalidation, or type inference. Do not require
one globally.

A query function should perform a repeatable read, validate/normalize at the transport boundary as
the project requires, return defined data, and throw failures. Keep notifications, navigation,
analytics, and unrelated cache writes with their actual event/mutation owner because queries can
retry and refetch in the background.

## Freshness and retention

Choose policy from the data's change rate and UX:

- `staleTime` is the period during which an observer treats cached data as fresh. The v5 default is
  `0`, so mount, focus, or reconnect can refetch stale active data.
- `staleTime: Infinity` keeps data fresh until manual invalidation.
- `staleTime: "static"` is stricter in v5 and resists manual invalidation-driven refetch; reserve it
  for data that cannot change during the application lifetime.
- `gcTime` begins only after the last observer leaves. It controls inactive cache retention, not
  freshness; the browser default is five minutes and SSR defaults can differ.
- Polling is independent of `staleTime`.

Tune these from evidence. Increasing `gcTime` does not stop active refetches, and increasing
`staleTime` does not guarantee memory retention after inactivity.

## Invalidation and cache writes

Use the least broad operation that restores truth:

- `setQueryData` / `setQueriesData` when a successful response is authoritative enough to update a
  known cache shape immediately;
- `invalidateQueries` when related cached views must be marked stale and active matches should
  refetch;
- exact keys for one resource, prefixes for a known family, and predicates only when key structure
  cannot express the relation clearly;
- `removeQueries` for data that must no longer exist locally, such as identity-bound data after
  logout, rather than as a routine refresh mechanism.

Disabled queries (`enabled: false` or adapter equivalent) opt out of automatic refetching and ignore
normal invalidation/refetch triggers. Use dependency-driven keys and conditional enablement for
lazy/dependent reads instead of building a permanently imperative query API. In TypeScript,
`skipToken` can provide typesafe disabling, but its query cannot be manually `refetch`ed.

## Cancellation

Consume the `signal` supplied to the query function and pass it through every nested request that
supports cancellation:

```ts
queryFn: async ({ signal }) => {
  const response = await fetch(`/api/projects/${projectId}`, { signal })
  if (!response.ok) throw new Error("Project request failed")
  return response.json() as Promise<Project>
}
```

Without consuming the signal, an unused request may still resolve into cache. When the signal is
consumed and cancellation occurs, TanStack Query aborts the transport and reverts query state to
its prior state. Manual cancellation uses filters such as
`queryClient.cancelQueries({ queryKey })`.

Cancellation is part of optimistic-write correctness: await cancellation for the affected reads
before snapshotting and writing optimistic data, or a late response can overwrite the optimistic
state. Verify special constraints before promising cancellation for suspense hooks.

## Sources

- [Query keys](https://tanstack.com/query/v5/docs/framework/react/guides/query-keys)
- [Query options](https://tanstack.com/query/v5/docs/framework/react/guides/query-options)
- [Query functions](https://tanstack.com/query/v5/docs/framework/react/guides/query-functions)
- [Important defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults)
- [Query invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation)
- [Query filters](https://tanstack.com/query/v5/docs/framework/react/guides/filters)
- [Disabling queries](https://tanstack.com/query/v5/docs/framework/react/guides/disabling-queries)
- [Query cancellation](https://tanstack.com/query/v5/docs/framework/react/guides/query-cancellation)
