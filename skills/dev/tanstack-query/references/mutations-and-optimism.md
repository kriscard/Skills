> **Read this when:** implementing or reviewing mutations, response-driven cache updates, invalidation timing, optimistic UI/cache writes, rollback, concurrent writes, or mutation scopes.

# Mutations and optimistic updates

## Place side effects with the write

A mutation represents an intentional server write. Keep the transport in `mutationFn`; place cache
reconciliation, rollback, user feedback, and navigation in the mutation/event flow that owns them.
A `mutationKey` is optional, but use one when defaults, `useMutationState`, or global matching depend
on mutation identity.

Choose post-success reconciliation from the response contract:

- write returned authoritative entities with `setQueryData` when the response fully represents the
  cache entry;
- invalidate affected detail/list/aggregate keys when the server may have applied additional
  changes;
- await required invalidation when the mutation should remain pending until refreshed data is
  available;
- avoid unconditional invalidation of unrelated families.

`onSuccess` is the normal invalidation point when failed writes changed nothing. Use `onSettled`
only when both outcomes genuinely require reconciliation, such as an optimistic cache write whose
error path must refetch after rollback or a server contract with uncertain commit state. It is an
option, not a universal rule.

## Choose the smallest optimistic surface

Prefer UI-only optimism through pending mutation variables when one view owns the preview. It avoids
cache rollback and naturally supports retry/error presentation.

Write optimistically to the cache when multiple consumers must observe the pending value. The
transaction is:

1. await `cancelQueries` for every cache entry the optimistic write will touch;
2. snapshot enough previous data to restore each entry;
3. update immutably with `setQueryData` / `setQueriesData`;
4. return the snapshot or rollback function from `onMutate`;
5. restore it in `onError` when the server rejects the write;
6. reconcile authoritative state by response update or targeted invalidation.

Model absent cache data deliberately; do not manufacture a partial entity that violates the cached
type. Preserve concurrent optimistic items with stable temporary identity such as mutation
variables plus submission time when the adapter exposes mutation state.

## Concurrency and ordering

Mutations run in parallel by default. Keep that behavior for independent writes. Before serializing,
name the invariant that concurrent execution violates—for example, ordered edits to one document
revision or commands that the server must process sequentially.

In v5, mutations with the same `scope.id` run serially. Scope the narrowest conflicting resource,
not the entire mutation type or application. Serialization does not replace server idempotency,
optimistic concurrency control, revisions, or conflict responses.

For concurrent optimistic cache writes, test overlap and out-of-order completion. A single snapshot
can erase another pending mutation; derive updates from current cache state and make rollback remove
or restore only the failed operation's contribution when overlap is possible.

## Sources

- [Mutations](https://tanstack.com/query/v5/docs/framework/react/guides/mutations)
- [Invalidations from mutations](https://tanstack.com/query/v5/docs/framework/react/guides/invalidations-from-mutations)
- [Updates from mutation responses](https://tanstack.com/query/v5/docs/framework/react/guides/updates-from-mutation-responses)
- [Optimistic updates](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates)
- [`useMutation` reference](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation)
