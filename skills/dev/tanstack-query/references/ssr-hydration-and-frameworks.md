> **Read this when:** implementing or reviewing SSR, hydration, pending-query dehydration, Next.js cache layers, RSC/client ownership, or TanStack Router/Start integration.

# SSR, hydration, and framework ownership

## Client lifetime and cache identity

Create an isolated server `QueryClient` per request/render ownership boundary. Never share a
module-global server client across users. Within one request, share deliberately where deduplication
is required. In the browser, retain a stable client rather than recreating it during renders or
initial Suspense retries; use the adapter's supported provider/client pattern.

Use identical keys and compatible query functions on the server and client. Include tenant/user
scope and every result-changing input, and keep infinite and normal data shapes separate. Dehydrate
only data safe to send to that user; serialization, error redaction, and non-JSON values require the
framework's supported transfer mechanism. Clear identity-bound browser data on account changes.

Choose a deliberate client `staleTime` to avoid immediate unwanted refetch after hydration. SSR
cache retention is not freshness. Verify initial HTML, hydrated data, subsequent client refetch,
and request isolation rather than treating a successful typecheck as hydration proof.

## Awaited and pending dehydration

The simplest path awaits required reads, dehydrates the server cache, and hydrates under the client
provider (`HydrationBoundary` for React). On core 5.102+, awaited imperative reads can use
`queryClient.query(options)`; earlier v5 uses its available fetch/prefetch APIs. A failed awaited
read and a prefetch that swallows errors have different contracts.

Pending-query dehydration requires core 5.40+ and a framework that can transfer the promises. It is
opt-in; preserve the default success predicate when adding pending queries:

```ts
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    dehydrate: {
      shouldDehydrateQuery: (query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    },
  },
})
```

This config is a server request-local fragment, not a singleton recipe. Do not add it on older core
or assume plain JSON serialization can carry promises. Start supported non-awaited reads before
dehydration and handle rejected fire-and-forget promises explicitly. Keep framework error handling
and error redaction version-correct; do not copy a framework-specific redaction override elsewhere.

## Next.js and React Server Components

Load `react` for React-owned composition and `nextjs-app-architecture` for actual App Router
mechanics. First decide whether framework server reads already suffice; Query is useful when a
client-owned server cache needs refetching, mutations, or reuse, not merely because SSR fetches data.

Treat Next's server data/route caches and Query's browser cache as independent layers. Query
`staleTime` does not configure Next caching; Next tags/revalidation do not invalidate browser Query
keys. A successful write may need both the framework's server invalidation and targeted Query
reconciliation. Inspect the actual Next version, request policy, and cache configuration instead
of assuming all server fetches are cached.

RSC can preload for client Query consumers, but avoid rendering a second RSC-owned value that must
stay synchronized with a separately refetching client query (for example, a server total beside a
live client list). Choose one display owner or explicitly coordinate refresh; hydration alone does
not keep the server-rendered value current after client refetches.

Framework docs own streaming and route integration. Resolved Query declarations and matching
releases own Query method availability: a stale Next example using `prefetchQuery` is neither proof
that the new method is absent nor a reason to rewrite an older install to `query()`.

## TanStack Router and Start

Use the installed Router/Start Query integration as the owner of route preloading, request-local
server clients, streaming, hydration, and router context wiring. Share query identity/options
between loaders and consumers where there is real reuse. Prefetch predictable navigation in that
router lifecycle rather than inventing duplicate component-Effect fetching or a second cache.

Verify integration package versions and loader error/await semantics; do not mechanically copy
React Query imperative method names from a mismatched framework example. Keep feature organization
with `frontend` and application/framework owners rather than imposing Query-specific folders.

## Sources

- [SSR guide](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Advanced SSR and pending dehydration](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)
- [Hydration reference](https://tanstack.com/query/latest/docs/framework/react/reference/hydration)
- [Next.js SPA and Query integration](https://nextjs.org/docs/app/guides/single-page-applications)
- [Router Query integration](https://tanstack.com/router/latest/docs/integrations/query)
- [Start Query integration](https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query)
