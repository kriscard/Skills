> **Read this when:** implementing or reviewing mutations, callback/promise ownership, invalidation timing, optimistic UI/cache writes, rollback, overlapping writes, scopes, or paused persistence.

# Mutations and optimistic updates

## Reconcile from the server contract

A mutation is an intentional server write. Keep transport in `mutationFn`; place cache
reconciliation, rollback, user feedback, and navigation in the mutation/event flow that owns them.
A `mutationKey` is useful when defaults, `useMutationState`, persistence, or conflict matching depend
on mutation identity.

Choose the success path from what the server returns:

```ts
const updateIssue = useMutation({
  mutationKey: ["issues", issueId, "update"],
  mutationFn: (patch: IssuePatch) => api.updateIssue(issueId, patch),
  onSuccess: async (updatedIssue) => {
    // The response is authoritative for the detail entry.
    queryClient.setQueryData(issueOptions(issueId).queryKey, updatedIssue)

    // Lists may have server sorting/filtering/aggregate consequences.
    await queryClient.invalidateQueries({ queryKey: ["projects", projectId, "issues"] })
  },
})
```

Use direct writes only for cache shapes the response fully represents. Invalidate details, lists, or
aggregates when the server may have changed fields, membership, ordering, or counts the client cannot
reconstruct. `onSuccess` fits writes whose failures changed nothing. Select `onSettled` only when both
outcomes require reconciliation, such as uncertain commit state or a refetch after optimistic
rollback. A global invalidation policy can be valid for an application with matching freshness and
traffic tradeoffs, but it is an explicit policy rather than mutation boilerplate.

**Failure checks:** the exact detail key updates, affected list variants become stale, unrelated
families stay untouched, and the cached value has the complete expected shape.

## Promise and callback ownership

Promises returned from `onMutate`, `onSuccess`, `onError`, and `onSettled` are awaited in lifecycle
order. Return required invalidation to keep the mutation pending until refreshed truth is ready; use
fire-and-forget only when navigation or UI may proceed before that work completes.

In React, hook-level callbacks own cache correctness and run for every invocation. Per-call callbacks
passed to `mutate` belong to the current mounted observer; with consecutive calls only the latest
per-call handlers run, and unmount removes them. Keep durable work in hook/cache callbacks and leave
still-mounted UI effects at the callsite:

```ts
const saveIssue = useMutation({
  mutationFn: api.saveIssue,
  onSuccess: (_data, variables) =>
    queryClient.invalidateQueries({ queryKey: issueOptions(variables.id).queryKey }),
})

saveIssue.mutate(input, {
  onSuccess: () => navigate({ to: "/issues" }),
  onError: (error) => showInlineError(error),
})
```

Use `mutate` when mutation state and callbacks own completion. Use `mutateAsync` when the caller must
compose that exact promise, and catch rejection:

```ts
const results = await Promise.allSettled(rows.map((row) => saveIssue.mutateAsync(row)))
```

Choose `Promise.all` only when the first rejection should reject the batch contract; choose
`allSettled` when every independent outcome must be reported. Mutations do not retry by default.
Enable retries only for writes the server can safely repeat through idempotency or another explicit
contract.

## Prefer the smallest optimistic surface

### UI-only preview

When one interaction owns the preview, render pending variables instead of rewriting shared cache:

```tsx
const addComment = useMutation({ mutationFn: api.addComment })

return (
  <ul>
    {comments.map((comment) => <CommentRow key={comment.id} comment={comment} />)}
    {addComment.isPending && (
      <CommentRow
        key={`pending-${addComment.submittedAt}`}
        comment={{ id: "pending", body: addComment.variables.body }}
        pending
      />
    )}
  </ul>
)
```

This keeps retry/error presentation local and avoids rollback. Across components, use a meaningful
`mutationKey` with `useMutationState` to select pending variables rather than duplicating them into a
query cache.

### Shared cache preview

Use cache optimism when multiple observers must see the pending state. The transaction is:

1. await cancellation for every cache entry the preview touches;
2. snapshot enough prior state to recover this operation;
3. update immutably from current cache data;
4. return rollback context from `onMutate`;
5. remove or restore only the failed operation's contribution in `onError`;
6. reconcile with an authoritative response or targeted invalidation.

```ts
useMutation({
  mutationKey: ["items", itemId, "toggle"],
  mutationFn: () => api.toggleItem(itemId),
  onMutate: async () => {
    const queryKey = itemOptions(itemId).queryKey
    await queryClient.cancelQueries({ queryKey, exact: true })
    const previous = queryClient.getQueryData<Item>(queryKey)
    queryClient.setQueryData<Item>(queryKey, (item) =>
      item ? { ...item, active: !item.active } : item,
    )
    return { previous, queryKey }
  },
  onError: (_error, _variables, context) => {
    if (context?.previous) queryClient.setQueryData(context.queryKey, context.previous)
  },
  onSettled: () => {
    const mutationKey = ["items", itemId, "toggle"] as const
    if (queryClient.isMutating({ mutationKey, exact: true }) === 1) {
      return queryClient.invalidateQueries({ queryKey: itemOptions(itemId).queryKey, exact: true })
    }
  },
})
```

The current mutation is still counted during its callback, hence `=== 1`. Scope the count to all and
only writes that can conflict. An unfiltered count can suppress unrelated reconciliation; a key that
is too narrow permits a stale refetch over another preview. This guard solves settlement invalidation
races, not overlapping rollback by itself.

Complex optimism duplicates server behavior. Filtering, sorting, permissions, generated IDs, and
cross-resource effects can make a seemingly simple cache patch incorrect. Prefer pending UI or
post-success reconciliation when the client cannot faithfully predict the server.

## Review a broad optimistic toggle concretely

Suppose a toggle snapshots an entire issues list, patches one item, restores the whole snapshot on
error, invalidates every query on settlement, and gives every issue write one mutation scope. Name the
failures rather than only asking for “safer optimism”:

- issue A's failed rollback can restore a list captured before issue B's successful change, erasing B
  until another refetch;
- invalidating every query refetches unrelated active resources and can overwrite another pending
  preview;
- one scope queues independent issue writes and adds latency without protecting a narrower invariant;
- reproducing filtered-list membership, sorting, permissions, or server-generated fields can make the
  optimistic list wrong even without concurrency.

The smallest correction is often UI-only: derive the clicked row's temporary toggle from that
mutation's pending variables, keep other rows on query data, and reconcile the affected issue/list on
success. No list snapshot or mutation scope is then needed. If every observer must see the preview,
use an issue-specific mutation key, cancel only affected reads, patch from current cache state, and
recover only that operation's contribution. Serialize only the same issue when its server contract
requires ordered writes; unrelated issue IDs remain parallel. Guard settlement invalidation with the
imperative exact-key count shown above when a related preview can still be pending.

## Ordering and serialization

Mutations run in parallel by default. Preserve that for independent writes. Use the installed
adapter's mutation scope only after naming the invariant concurrency violates, such as commands for
one document revision that the server must process in order. Scope the narrowest conflicting
resource. Serialization complements—not replaces—server idempotency, revisions, or conflict
responses.

For overlapping cache optimism, derive each write from current cache state and assign stable pending
identity. A single whole-list snapshot can erase another pending operation when rollback happens out
of order. Exercise A-success/B-failure and B-success/A-failure orders before accepting the design.

## Offline and persisted mutations

Use persistence when restart continuity is a product requirement. In `networkMode: "online"`, an
offline mutation can remain pending and paused, then continue after reconnect. Persisted state does
not include `mutationFn`; register a matching default with `setMutationDefaults` before hydration so
`resumePausedMutations()` can execute restored work.

Restore through the installed adapter's persistence integration. Align persisted `maxAge` with cache
retention, version or bust incompatible storage, resume only after restoration succeeds, and keep
identity/security policy with the application owner. Verify persistence package and provider versions
separately from core.

## Sources

- [Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [Invalidations from mutations](https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations)
- [Updates from mutation responses](https://tanstack.com/query/latest/docs/framework/react/guides/updates-from-mutation-responses)
- [Optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [Persisting offline mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations#persist-mutations)
- [Mastering Mutations](https://tkdodo.eu/blog/mastering-mutations-in-react-query)
- [Automatic Query Invalidation after Mutations](https://tkdodo.eu/blog/automatic-query-invalidation-after-mutations)
- [Concurrent Optimistic Updates](https://tkdodo.eu/blog/concurrent-optimistic-updates-in-react-query)
