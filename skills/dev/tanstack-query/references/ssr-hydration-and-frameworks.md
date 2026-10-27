> **Read this when:** implementing or reviewing SSR, hydration, pending-query dehydration, RSC/cache layers, or TanStack Router/Start integration.

# SSR, hydration, and framework ownership

## Request and browser client lifetime

Create an isolated server `QueryClient` per request/render ownership boundary. Share that request
client only where deduplication is intended. In the browser, retain one stable client through the
adapter's supported provider pattern; recreating it during render or an initial Suspense retry loses
the cache.

Server and client must use the same keys and compatible query functions. Include tenant/user scope
and every result-changing input. By default, dehydration includes successful queries and paused
mutations, not failed queries. Decide whether a critical failure should fail the server response,
degrade to client retry, or be included by a supported predicate.

Dehydrate only data safe for that identity and use the framework's XSS-safe transfer mechanism.
Raw `JSON.stringify` embedded in custom HTML is not safe escaping. Pair `serializeData` and
`deserializeData` for non-JSON values. Clear identity-bound browser data when the account changes.

Choose client `staleTime` only from a supplied resource/project policy. If that policy is unknown,
preserve the existing/default behavior, report the gap, and verify the resulting hydration refetch
rather than inventing a duration. Server cache retention is separate: server `gcTime` commonly
defaults to `Infinity`; if overridden, clear request caches when ownership ends and avoid removing
entries before hydration finishes.

**Failure checks:** two server requests cannot see each other's data; initial HTML and hydrated data
agree; the first client observer uses the hydrated entry; account changes cannot expose old cache.

## Awaited and streamed reads

Await critical reads when routing or the server response needs their result/error. Start secondary
reads without awaiting only when the framework can transfer or later consume them and the promise has
an explicit rejection owner.

Current Query clients expose `query(options)` for imperative reads. Check installed declarations
rather than copying an article's older method spelling. A non-blocking warm-up still needs a handled
promise:

```ts
void queryClient.query(secondaryOptions).catch(() => {
  // Deliberate graceful degradation; the client observer may retry.
})

const critical = await queryClient.query(criticalOptions)
```

Pending-query dehydration is capability- and framework-dependent. Preserve the default successful
predicate when opting pending entries in:

```ts
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
  },
})
```

This belongs to a request-local server client. Plain JSON cannot transfer promises. When a
persistence adapter shares the client, keep pending streamed promises out of storage while retaining
normal successful-query persistence.

## Next.js and React Server Components

Load the React and framework owners for actual boundary, streaming, and route mechanics. Start with
the framework's server data facilities; add Query when the client needs an observable cache,
background synchronization, mutations, or resource reuse.

Next server/route caches and the browser Query cache are independent. Query `staleTime` does not
configure Next caching, and server tag/path revalidation does not invalidate browser query keys. A
write can require both framework invalidation and Query reconciliation when it changes both layers.

RSC may preload data for a client Query observer. Avoid rendering a second server-owned copy that is
expected to stay synchronized with a client query after refetch. Pick one display owner or define the
refresh handoff. Hydration only transfers an initial snapshot.

## TanStack Router and Start

Let the installed Router/Start integration own loaders, request-local clients, streaming, hydration,
and context wiring. Query owns resource identity, freshness, imperative reads, observer activity, and
cache reconciliation.

A bounded integration shape is:

```ts
const projectOptions = (projectId: string, asOf?: string) =>
  queryOptions({
    queryKey: ["projects", projectId, { asOf }] as const,
    queryFn: ({ signal }) => getProject({ projectId, asOf, signal }),
  })

// Router-owned loader lifecycle; exact signature comes from installed Router.
loader: ({ context, params, deps }) =>
  context.queryClient.query(projectOptions(params.projectId, deps.asOf))

// Component remains the active Query observer.
const project = useSuspenseQuery(projectOptions(projectId, asOf))
```

The exact Router syntax belongs to its installed docs. The Query-facing assertions are stable:

1. router context and adapter provider receive the same `QueryClient`;
2. validated search values that affect the result agree across `loaderDeps`, options inputs, the
   query key, loader, and component;
3. loader and observer share one options definition when both consume the same resource;
4. a component installs `useQuery`/`useSuspenseQuery` when Query owns active refetch and retention;
   `useLoaderData` alone does not create a Query observer;
5. blocking reads are awaited and route-failing errors propagate; secondary warming is non-blocking
   with intentional rejection handling;
6. Query invalidation and `router.invalidate()` are used only for the ownership layers that changed;
7. freshness is inherited from an existing/supplied policy; when unknown, options leave it unset and
   the implementation reports the unresolved owner decision instead of fabricating a TTL.

A loader/consumer drift bug often looks like this: the loader fetches today's project, the component
includes `asOf` in its key, navigation waits for unused data, then the component starts a second
request and suspends again. Assert the exact key/options on both sides, not merely that “prefetching
exists.” Remove stale loader warming when the consumer is removed.

Router route data can be the right owner for route-specific values. Query is useful for resources
shared across routes, independently observed, background-refetched, or mutated. Do not combine both
caches automatically; make the owner decision per resource. Router cache settings and documented
sharing mechanisms remain framework decisions.

## Sources

- [SSR](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [Hydration reference](https://tanstack.com/query/latest/docs/framework/react/reference/hydration)
- [Router Query integration](https://tanstack.com/router/latest/docs/integrations/query)
- [Start Query integration](https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query)
- [TanStack Router and Query](https://tkdodo.eu/blog/tan-stack-router-and-query)
- [Reliable Query Prefetching with TanStack Router](https://tkdodo.eu/blog/reliable-query-prefetching-with-tanstack-router)
