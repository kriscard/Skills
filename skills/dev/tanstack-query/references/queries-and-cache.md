> **Read this when:** implementing or reviewing query keys/options, reusable definitions, freshness, invalidation, dependent reads, transformations, Suspense queries, or cancellation.

# Queries and cache lifecycle

## Start from one resource definition

A key is a serializable top-level array. Include the resource identity and every input that changes
the result. Object-property order hashes deterministically; array order remains significant.

```ts
import { queryOptions } from "@tanstack/react-query"

type IssueFilters = { state: "open" | "closed"; assignee?: string }
type Issue = { id: string; title: string; state: IssueFilters["state"] }

async function getIssues(input: {
  projectId: string
  filters: IssueFilters
  signal: AbortSignal
}): Promise<Issue[]> {
  const response = await fetch(
    `/api/projects/${input.projectId}/issues?${new URLSearchParams({
      state: input.filters.state,
      ...(input.filters.assignee ? { assignee: input.filters.assignee } : {}),
    })}`,
    { signal: input.signal },
  )
  if (!response.ok) throw new Error(`Issues request failed: ${response.status}`)
  return response.json() as Promise<Issue[]>
}

export const issuesOptions = (projectId: string, filters: IssueFilters) =>
  queryOptions({
    queryKey: ["projects", projectId, "issues", filters] as const,
    queryFn: ({ signal }) => getIssues({ projectId, filters, signal }),
  })
```

This definition earns extraction when more than one caller must agree on identity, `queryFn`, or
shared policy. A local inline query remains the clearest choice for one isolated caller. Add a key
factory only when repeated hierarchy or filtering operations make it useful.

### Reuse without constraining consumers

The same options can serve route loading, observers, and imperative work while preserving the
`Issue[]` type:

```ts
const options = issuesOptions(projectId, filters)

// Route/server owner decides whether this read blocks navigation or rendering.
await queryClient.query(options)

// Observer owns a consumer-specific projection and policy override.
const openTitles = useQuery({
  ...options,
  select: (issues) => issues.filter((issue) => issue.state === "open").map((issue) => issue.title),
})

// An event owner may warm the same identity without installing an observer.
void queryClient.query(options).catch(reportPrefetchError)
```

Place overrides after the spread. Keep `select`, `enabled`, placeholders, polling, and genuinely
consumer-specific policy at the consumer unless every consumer shares it. Add `staleTime` only from a
supplied resource requirement or an existing project policy; when neither exists, leave it unset and
report freshness as unresolved rather than copying a duration from an example. Avoid accepting a
broad unparameterized `UseQueryOptions` object in a wrapper: its defaults can widen `data` to `unknown`
and make `select` inference brittle. A custom hook is earned when it composes behavior—such as local
filter state, a stable feature result, or related effects—not merely to hide one `useQuery` call.

**Failure checks:** loader, hook, and imperative callers use the same options inputs; callsite
`select` infers its return; invalidation uses `options.queryKey`; removing a consumer also removes
unneeded warming.

## Keep transport, domain, cache, and UI seams explicit

A query function coordinates a repeatable read. The transport/API boundary performs HTTP concerns,
authentication, runtime decoding when the application requires it, and error classification. Query
stores the successful value returned from that boundary. Domain functions operate on typed values;
observers and UI choose their projections.

```ts
async function getInvoice(id: string, signal: AbortSignal): Promise<Invoice> {
  const response = await fetch(`/api/invoices/${id}`, { signal })
  if (!response.ok) throw toTransportError(response)
  const payload: unknown = await response.json()
  return InvoiceDecoder.parse(payload) // Existing decoder; validation failure rejects the query.
}

const invoiceOptions = (id: string) =>
  queryOptions({
    queryKey: ["invoices", id] as const,
    queryFn: ({ signal }) => getInvoice(id, signal),
  })
```

Keep transport, authorization, validation, and domain failures distinguishable when callers render or
retry them differently. Do not put navigation, toasts, analytics, or unrelated cache writes in
`queryFn`; retries and background refetches can execute it more than once.

Choose transformation placement deliberately:

| Placement | Use when | Cached/observer consequence |
| --- | --- | --- |
| Server/API | The producer can return the application contract | No client duplication |
| Transport or `queryFn` | Every consumer needs one canonical normalized/validated shape | Transformed shape is what cache and Devtools expose; runs per fetch |
| `select` | One observer needs a projection or narrower subscription | Source cache remains canonical; result is cached per observer |
| Render/domain function | Cheap ephemeral derivation or non-Query business logic | Runs with its normal owner; no cache semantic change |

`select` runs when source data changes or the selector reference changes. Stabilize it only when the
work is expensive or its dependency-sensitive identity matters. Throw validation failures before the
cache; throwing inside `select` does not correctly turn the query into an error state.

## Derive UI state; preserve legitimate drafts

Query data is already a subscribed server snapshot. Prefer deriving dependent UI validity rather
than effect-copying the snapshot into another store:

```ts
const users = usersQuery.data ?? []
const effectiveSelectedId = users.some((user) => user.id === selectedId) ? selectedId : null
```

This keeps the user's original selection available if the resource temporarily excludes it and avoids
a refetch overwriting client state through synchronization effects. An editable form is different:
initialize a local draft from the chosen server snapshot, then let the draft owner preserve unsaved
edits. Decide explicitly how a newer server snapshot is surfaced or merged; Query cache updates must
not silently replace active edits.

When a React subtree requires already-resolved query data, React Context can make that dependency
explicit without creating another mutable copy: the provider observes the query, handles its pending
and error states, then passes current `data` as dependency injection. Suspense can provide a similar
boundary. React owns the provider/boundary mechanics; Query still owns the source snapshot. Check for
a waterfall when that boundary delays unrelated child queries.

## Seed from known cache data deliberately

A new identity can use another cache entry as real `initialData` when the source is complete enough to
satisfy the target contract—for example, seeding a detail from a cached list. Carry the source
`dataUpdatedAt` into `initialDataUpdatedAt` so freshness reflects the source snapshot rather than the
component mount. Use `placeholderData` when the value is only a temporary visual stand-in and should
not be treated as successful cached truth. Verify that background fetch still replaces the seed and
that partial list entities are not presented as complete details.

## Freshness, retention, and refetch triggers

Choose policy from the resource's change rate and UX:

- `staleTime` controls how long observers treat data as fresh. The default is immediately stale, so
  stale active data can refetch on mount, focus, or reconnect.
- `Infinity` remains fresh until invalidated; `"static"` suppresses automatic refetch even after
  invalidation. Use either only when that resource contract warrants it.
- `gcTime` starts after the final observer leaves and controls inactive retention, not freshness.
- Polling is independent of `staleTime`.

A surprising repeated request is usually explained by identity, staleness, observer mount, focus,
reconnect, invalidation, or retry. Identify the trigger before disabling it. Increasing `gcTime` does
not prevent active refetches; increasing `staleTime` does not retain inactive data.

Observed browser queries retry by default with backoff; server and imperative defaults can differ.
During retries, inspect `failureReason`; `error` becomes final after retries are exhausted. Choose
retry predicates from whether the operation can plausibly succeed later, not from a copied blanket
setting.

When the required freshness window is unknown, keep the existing option/client default (or omit a new
option), record that the product/resource owner must decide it, and test no stronger freshness claim.
Numeric durations in examples are scenario inputs, never library recommendations.

## Connectivity and `networkMode`

Choose the mode from what the operation can execute without network connectivity:

| Mode | Use when | Observable state and failure behavior |
| --- | --- | --- |
| `"online"` (default) | The query or mutation needs the network | Work that cannot start offline does not call transport. A first load can be `status: "pending"` with `fetchStatus: "paused"`; retries pause and continue after reconnect. |
| `"always"` | The operation is connectivity-independent, such as local async storage or a worker call | It starts while Query's online manager is offline, never pauses for connectivity, and reaches success/error normally. Retries also continue; reconnect refetch defaults are not meaningful for this mode. |
| `"offlineFirst"` | A service worker, HTTP cache, or query persister should get one attempt before network retry behavior | The first attempt runs offline. A cache hit can succeed; after a miss/failure, retries pause until reconnect instead of failing through every retry immediately. |

Do not use `"always"` merely to force a network request through an offline state, and do not describe
`"offlineFirst"` as proof that arbitrary fetches work offline. Render paused work separately from an
active request or terminal error. For the selected branch, set Query's online manager offline and
assert transport call count, `fetchStatus`/`isPaused`, error timing, and whether reconnect continues
the same work. Test queries and mutations separately when both are changed.

## Conditional and parallel reads

Express data dependencies declaratively. Include the dependency in the key and use adapter-supported
conditional execution:

```ts
useQuery({
  ...projectOptions(projectId),
  enabled: Boolean(projectId),
})
```

When TypeScript narrowing benefits from `skipToken`, use it only if manual `refetch()` is not
required; a skipped query has no function to call. Permanently disabled queries ignore normal
invalidation/refetch triggers, so they are a poor substitute for a declarative dependency.

Independent ordinary React queries run in parallel. Multiple `useSuspenseQuery` calls in one
component suspend serially unless their requests were already started. Where that waterfall matters,
start predictable reads in the route lifecycle or use `useSuspenseQueries` for an independent batch.
Keep dependent queries serial and leave insignificant waterfalls alone.

Suspense queries provide defined data but do not support conditional `enabled` or `placeholderData`.
By default, a background refetch error is thrown only when there is no cached data, so stale data may
remain visible. If settled background failure must reach the boundary, throw the returned error after
fetching stops. Reset both owners: the React error boundary and Query through
`QueryErrorResetBoundary` or `useQueryErrorResetBoundary`.

## Invalidation and explicit cache operations

Use the operation that restores truth:

- `setQueryData` / `setQueriesData` for an authoritative value compatible with the cached shape;
- `invalidateQueries` for resources made stale, using an exact key for one entry or a known prefix
  for a family;
- `removeQueries` when data must no longer exist locally, such as identity-bound data on logout;
- `queryClient.query(options)` for current imperative reads; await it when failure belongs to the
  caller, or attach an intentional rejection handler for non-blocking warming.

Do not infer a method from a blog post or another adapter. Check the installed client declaration;
current releases expose unified `query`/`infiniteQuery`, while a project pinned to a different
capability surface must use its actual exports without forcing an upgrade.

## Cancellation

Pass the supplied signal through every cancellable nested request. Consuming it lets Query abort the
transport and revert query state when cancellation occurs; ignoring it allows unused work to finish
into cache. Await `cancelQueries` before optimistic cache writes so a late read cannot overwrite the
preview. React Suspense query hooks do not provide the same cancellation contract, so use a
non-Suspense observer when transport abort on observer loss is required.

## Sources

- [Query options](https://tanstack.com/query/latest/docs/framework/react/guides/query-options)
- [Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Network mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode)
- [Prefetching](https://tanstack.com/query/latest/docs/framework/react/guides/prefetching)
- [Disabling queries](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries)
- [Request waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls)
- [Suspense](https://tanstack.com/query/latest/docs/framework/react/guides/suspense)
- [Query cancellation](https://tanstack.com/query/latest/docs/framework/react/guides/query-cancellation)
- [Creating Query Abstractions](https://tkdodo.eu/blog/creating-query-abstractions)
- [React Query Data Transformations](https://tkdodo.eu/blog/react-query-data-transformations)
- [Deriving Client State from Server State](https://tkdodo.eu/blog/deriving-client-state-from-server-state)
