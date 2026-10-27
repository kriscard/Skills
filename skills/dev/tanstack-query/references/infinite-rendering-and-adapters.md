> **Read this when:** implementing or reviewing infinite queries, cursor behavior, `maxPages`, tracked properties, selectors, structural sharing, or a non-React adapter.

# Infinite queries, rendering, and adapters

## Infinite-query identity and shape

An infinite query stores `{ pages, pageParams }`, so it needs a different key from a normal query.
Provide `initialPageParam`, derive subsequent values with `getNextPageParam`, and add
`getPreviousPageParam` for backward navigation. `null` or `undefined` means no page remains.

Keep manual cache writes, initial/placeholder data, and `select` results in the same two-array shape.
Update `pages` and `pageParams` together when removing, reversing, or trimming pages.

One infinite cache entry coordinates all pages. Distinguish initial pending, background refetch,
next-page fetch, and previous-page fetch in the UI. Prevent a load-more action while a fetch is
already active unless overlap is intentional and tested; the adapter's `cancelRefetch` option changes
which overlapping result wins.

Stale infinite queries refetch pages sequentially from the first page so later cursors are derived
from refreshed data. Add `maxPages` when retained size or sequential refetch cost is an observed
problem. Bidirectional eviction needs both page-parameter functions so an evicted side can be loaded
again.

**Failure checks:** normal and infinite keys cannot collide; every fetched `pageParam` is asserted;
`hasNextPage` stops at the contract sentinel; manual updates preserve both arrays; overlap cannot
silently duplicate or drop pages.

## React observation and derived projections

React Query structurally shares JSON-compatible data and tracks result properties a component reads.
The top-level hook result is not referentially stable, while unchanged `data` references can be.

- Read the result properties the component needs.
- Destructure named properties rather than using object rest, which accesses all remaining tracked
  properties.
- Let tracked properties work before maintaining `notifyOnChangeProps` lists.
- Use `select` to derive observer output without changing cached source data.
- Keep decoding and failures before the cache; a selector is not a validation/error boundary.

```ts
const productOptions = (id: string) =>
  queryOptions({
    queryKey: ["products", id] as const,
    queryFn: ({ signal }) => getProduct(id, signal),
  })

const title = useQuery({
  ...productOptions(productId),
  select: (product) => product.title,
})
```

A component subscribed to `title` can skip an update when only another product field changes.
Structural sharing also stabilizes object projections when their selected fields remain equal. This
is useful for large or frequently changing resources, not a reason to add selectors to every query.

A selector runs when source data or selector identity changes and its result is cached per
`QueryObserver`. Extract a dependency-free expensive selector or wrap a dependency-sensitive one in
the framework's appropriate stabilization mechanism. Cross-observer memoization is an exceptional
optimization: measure repeated work before adding another cache. For non-JSON values or very large
responses, measure before disabling structural sharing; a custom structural-sharing function may
preserve the useful references better.

## Adapter capability gate

Core semantics—identity, state, invalidation, cancellation, mutation state, and cache shape—travel
across adapters. Syntax and reactivity do not. Inspect the installed adapter exports, declarations,
official adapter page, resolved core, and framework peer range before translating an example.

- **React:** hooks, provider/client context, tracked result properties, Suspense and error-boundary
  integration.
- **Vue:** Vue-reactive APIs; retain refs/reactive inputs according to installed declarations.
- **Solid:** Solid reactive primitives; React memoization guidance does not transfer.
- **Svelte Query 6:** Svelte 5 runes, `create*` options supplied as a reactive function, imports from
  `@tanstack/svelte-query`, and direct consumption of the returned reactive object. The adapter can
  still resolve Query Core 5; adapter and core majors describe different packages.
- **Angular:** `@tanstack/angular-query-experimental`; inspect the exact release because the adapter
  explicitly permits a changing surface.
- **Query Core:** no framework provider, hook, component, or rendering contract.

A current Svelte pattern is:

```svelte
<script lang="ts">
  import { createQuery } from '@tanstack/svelte-query'

  let { projectId }: { projectId: string } = $props()
  const project = createQuery(() => ({
    queryKey: ['projects', projectId],
    queryFn: ({ signal }) => getProject(projectId, signal),
  }))
</script>

<p>{project.status}</p>
```

The adapter's provider/client must surround the component. Read reactive inputs inside the options
function so a changed ID selects a changed key. Use the application's transport decoder in
`getProject`; the adapter does not own runtime validation.

**Failure checks:** imports come from the installed adapter, provider/client ownership is correct,
reactive inputs are read where that framework tracks them, peer versions satisfy the adapter, and no
React-only hook or memoization pattern leaked into another framework.

## Sources

- [Infinite queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)
- [Render optimizations](https://tanstack.com/query/latest/docs/framework/react/guides/render-optimizations)
- [React Query Selectors, Supercharged](https://tkdodo.eu/blog/react-query-selectors-supercharged)
- [Vue adapter](https://tanstack.com/query/latest/docs/framework/vue/overview)
- [Solid adapter](https://tanstack.com/query/latest/docs/framework/solid/overview)
- [Svelte adapter](https://tanstack.com/query/latest/docs/framework/svelte/overview)
- [Angular adapter](https://tanstack.com/query/latest/docs/framework/angular/overview)
