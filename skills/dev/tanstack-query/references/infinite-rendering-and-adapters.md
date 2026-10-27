> **Read this when:** implementing or reviewing infinite queries, cursor/page behavior, `maxPages`, tracked properties, selectors, structural sharing, or a non-React adapter.

# Infinite queries, rendering, and adapters

## Infinite-query identity and shape

An infinite query stores `{ pages, pageParams }`, so it must not share a key with a normal query.
In v5 provide `initialPageParam` and derive subsequent parameters with `getNextPageParam`; add
`getPreviousPageParam` for backwards navigation. Returning `null` or `undefined` means no page is
available.

Keep every manual cache update, `initialData`, `placeholderData`, and `select` result in the same
`pages` plus `pageParams` shape. Update both arrays together when removing, reversing, or trimming
pages.

One infinite cache entry coordinates all pages. Avoid starting `fetchNextPage` while another fetch
is active unless overlapping behavior is explicitly intended and verified. Distinguish initial
pending, background refetch, next-page fetch, and previous-page fetch in the UI.

Stale infinite queries refetch pages sequentially from the first page to avoid reusing stale
cursors. Use `maxPages` when retained page count and sequential refetch cost are proven concerns. In
v5, bidirectional eviction requires both next- and previous-page parameter functions so evicted
pages can be fetched again in either direction.

## React subscriptions and selectors

React Query structurally shares JSON-compatible data and tracks accessed result properties. The
hook's top-level result object is not referentially stable, while preserved `data` references can
be. Therefore:

- read only the result properties the component needs;
- avoid object rest destructuring of query results because it accesses all remaining properties and
  defeats tracked-property optimization;
- rely on tracked properties before maintaining `notifyOnChangeProps` lists by hand;
- use `select` for a cache-derived projection; it changes observer output, not cached source data;
- keep validation/failure in `queryFn` or the transport boundary—throwing from `select` does not turn
  the query into an error state correctly;
- stabilize a selector when it is shared, dependency-sensitive, or demonstrably expensive. An
  inline selector rerunning is not by itself a defect worth mandatory memoization.

Do not disable structural sharing without evidence. For non-JSON values or measured large-response
costs, verify whether a custom structural-sharing function better preserves useful references.

## Adapter gate

Core concepts—keys, query state, invalidation, cancellation, mutation state, and cache shape—travel
across adapters. Syntax and reactivity do not. Inspect the installed adapter's official page and
types before translating examples:

- React uses hooks and proxy-based tracked properties.
- Vue exposes Vue-reactive APIs; preserve refs/reactive inputs according to installed conventions.
- Solid wraps its own reactive primitives; do not impose React memoization advice.
- Svelte v5 adapter functions use Svelte reactivity conventions; current v5 docs require wrapping
  `create*` options in a function to preserve reactivity.
- Angular uses `@tanstack/angular-query-experimental`; minor and patch releases may break API, so
  exact installed declarations outrank generic examples.
- `@tanstack/query-core` has no framework provider or component rendering contract.

When framework docs disagree with copied React examples, use the adapter docs and installed types.

## Sources

- [Infinite queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries)
- [`useInfiniteQuery` reference](https://tanstack.com/query/v5/docs/framework/react/reference/useInfiniteQuery)
- [Render optimizations](https://tanstack.com/query/v5/docs/framework/react/guides/render-optimizations)
- [No rest destructuring ESLint rule](https://tanstack.com/query/v5/docs/eslint/no-rest-destructuring)
- [Vue adapter overview](https://tanstack.com/query/v5/docs/framework/vue/overview)
- [Solid adapter overview](https://tanstack.com/query/v5/docs/framework/solid/overview)
- [Svelte adapter overview](https://tanstack.com/query/v5/docs/framework/svelte/overview)
- [Angular adapter overview](https://tanstack.com/query/v5/docs/framework/angular/overview)
