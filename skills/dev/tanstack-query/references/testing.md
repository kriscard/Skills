> **Read this when:** tests are requested or affected, or the change involves QueryClient isolation, retries/timers, cancellation, optimistic updates, infinite queries, HTTP interception, or MSW.

# Testing TanStack Query behavior

Load `test` and choose the narrowest boundary that proves the consumer-visible cache behavior. Use
the installed runner and repository conventions.

## Harness

- Create a fresh `QueryClient` per test or per isolated wrapper. If a shared helper is established,
  clear it between tests and prevent parallel cache leakage.
- Set query retries to `false` for deterministic error tests unless retry behavior is the subject.
  Per-query retry options override client defaults.
- Control `gcTime` only when the runner's open-handle behavior or the scenario requires it; do not
  globally distort production cache policy merely for tests.
- Render through the adapter's real provider/hook/component boundary. Avoid mocking TanStack Query
  hooks or cache internals when the contract under test is fetching, invalidation, optimistic state,
  cancellation, or pagination.
- Await observable state with the runner's async utilities rather than sleeps. Account for v5
  `status` and `fetchStatus` separately.

## HTTP and MSW boundary

When MSW is already installed, prefer handlers at the HTTP boundary so the real query function,
AbortSignal, retries, cache, and UI state remain exercised. Reset handlers and request state between
tests. Assert the user-visible result and, where material, the request identity—not implementation
calls inside TanStack Query.

A generic API or MSW test does not need this skill unless TanStack Query behavior is part of the
contract. Conversely, a cache test need not mandate MSW when a smaller established transport seam
can prove the behavior without replacing the subject.

## High-value cases

Cover only branches changed by the task:

- equal keys deduplicate/share data; changed key inputs produce distinct requests/cache entries;
- fresh data avoids an unwanted refetch while invalidation marks the intended family stale;
- an enabled query responds to invalidation, while a deliberately disabled query does not;
- cancellation reaches the request signal and stale work cannot overwrite newer/optimistic data;
- successful mutations update or invalidate the intended entries and failed optimistic writes roll
  back without losing unrelated concurrent changes;
- scoped mutations serialize only the matching scope; independent scopes remain concurrent;
- infinite queries pass the expected page parameter, stop on `null`/`undefined`, preserve
  `pages`/`pageParams`, and prevent or intentionally handle overlapping fetches;
- components rerender for properties they consume without relying on private observer details;
- migration tests preserve user-visible loading, error, hydration, and pagination behavior.

For time-sensitive freshness, retry, polling, or garbage-collection tests, use the runner's fake
clock carefully and flush async work according to local conventions. Prefer direct invalidation or
small real durations when fake timers would obscure request scheduling.

## Sources

- [Testing guide](https://tanstack.com/query/v5/docs/framework/react/guides/testing)
- [Query cancellation](https://tanstack.com/query/v5/docs/framework/react/guides/query-cancellation)
- [Optimistic updates](https://tanstack.com/query/v5/docs/framework/react/guides/optimistic-updates)
- [Infinite queries](https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries)
