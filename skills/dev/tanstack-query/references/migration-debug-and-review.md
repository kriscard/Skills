> **Read this when:** migrating v4 code to v5, diagnosing unexpected query behavior, reviewing TanStack Query usage, or resolving version uncertainty.

# Migration, debugging, and review

## v4 to v5 migration gate

Confirm the source is v4 and the target package resolves to v5 before applying migration rules.
Run the official codemod only on a clean tree, review every edit, then typecheck and test. The
high-value manual checks are:

- convert query, mutation, and QueryClient overloads to the single options-object signature;
- replace query callbacks (`onSuccess`, `onError`, `onSettled`) with derived rendering, explicit
  effects for external synchronization, or mutation/event ownership as appropriate;
- rename `cacheTime` to `gcTime` and preserve its inactive-cache meaning;
- rename `useErrorBoundary` to `throwOnError`;
- replace `keepPreviousData` with `placeholderData` / the identity helper and account for status and
  `dataUpdatedAt` differences;
- update `loading`/`isLoading` assumptions to v5 `pending`/`isPending` and the derived first-fetch
  `isLoading` semantics;
- provide explicit `initialPageParam` and `getNextPageParam` for infinite queries;
- replace `refetchPage` policy with bounded `maxPages` only when its new whole-cache behavior fits;
- update hydration names/behavior, removed custom context usage, default-error typing, and query
  default registration order where those APIs appear;
- verify React 18+ and TypeScript 4.7+ for the React adapter.

Live documentation can include forward-looking changes. Installed v5 declarations and the targeted
v5 release notes decide whether an API exists; do not migrate beyond the installed major as a
side-effect.

## Core minor-version gate

Track adapter and resolved core versions separately. These are introduction floors, not a license
to ignore installed declarations or adapter exports:

| Core floor | Capability |
| --- | --- |
| 5.25.0 | `skipToken` |
| 5.31.0 | Mutation `scope.id` |
| 5.40.0 | Dehydrate pending queries, including their promises, when explicitly selected |
| 5.79.0 | `staleTime: "static"` |
| 5.102.0 | `queryClient.query()` / `infiniteQuery()`; older fetch/prefetch/ensure methods deprecated |

Verify the resolved package's declarations and the matching release/tag before using a capability
in an older project. `/query/v5/` docs redirect to latest and are not frozen minor-version evidence.
Current docs may describe Svelte adapter 6 while core remains 5. Existing older-v5 imperative APIs
remain appropriate on installations that do not export the new methods; an upgrade is separate
scope, not a prerequisite imposed by this skill.

## ESLint configuration is versioned policy

Inspect the installed plugin config. Current `recommended` / `flat/recommended` includes
`exhaustive-deps`, `no-rest-destructuring` (warning), `stable-query-client`, `no-unstable-deps`,
`infinite-query-property-order`, `no-void-query-fn`, and `mutation-property-order`.
`recommendedStrict` / `flat/recommended-strict` adds `prefer-query-options`. Older plugin versions
may differ. Honor the project's selected preset, but do not promote the strict rule into a
universal requirement for options factories, custom hooks, or feature architecture.

## Diagnosis loop

Reproduce with the smallest public symptom, inspect Query Devtools/cache state when available, and
trace in this order:

1. **Client:** Is there exactly the intended `QueryClient`, provider boundary, and test/SSR client
   lifetime? Accidental clients split caches; a recreated client discards cache.
2. **Identity:** Does the observed key equal the updated/invalidated key, including types (`"1"`
   versus `1`), optional values, tenant/user scope, filters, and normal versus infinite shape?
3. **Execution:** Is the query enabled, supplied a valid function, online under its `networkMode`,
   and actually observed? Disabled queries ignore normal invalidation refetches.
4. **Freshness:** Is the result fresh, stale, inactive, garbage-collected, placeholder, or initial
   data? Separate `status` from `fetchStatus` and initial loading from background fetching.
5. **Transport:** Did retries delay the visible error? Is the `AbortSignal` consumed? Did the server
   or mock receive the expected parameters and return a defined value or thrown error?
6. **Reconciliation:** Did the mutation await cancellation, update the correct shape immutably, and
   invalidate at the intended point? Could an overlapping response overwrite optimistic data?
7. **Subscription:** Does the component access the property expected to trigger rendering? Did rest
   destructuring, a transforming selector, or custom `notifyOnChangeProps` alter observation?
8. **Environment:** Are focus/reconnect events, SSR hydration timing, persistence restoration, fake
   timers, or multiple package copies changing behavior?

Change one policy at a time and rerun the same reproduction.

## Review checklist

Report concrete impact, not stylistic preference:

- incomplete or colliding keys and cache-shape collisions;
- query functions with user-visible side effects or swallowed/undefined failures;
- `staleTime`/`gcTime` confusion and overly broad defaults;
- broad invalidation, invalidation at the wrong lifecycle point, or updates to the wrong key/shape;
- optimistic writes without cancellation and rollback, or rollback unsafe under concurrency;
- mutation scopes that serialize unrelated writes;
- infinite-query cursor, shape, overlap, or unbounded-page defects;
- React rest destructuring/manual notification lists that defeat safe defaults;
- adapter APIs copied from another framework or APIs absent from the installed version;
- tests sharing clients, relying on retries/timers, or mocking away the behavior under review.

Do not flag the absence of a key factory, universal `onSettled` invalidation, mutation serialization,
manual notification lists, selector memoization, custom-hook wrappers, optimistic cache writes, or
a schema library; none is a general requirement. Local options and UI-only optimism can be the
smallest correct design.

## Sources

- [Core release history](https://github.com/TanStack/query/releases) — match the package tag/minor
- [Published core declarations/source](https://www.npmjs.com/package/@tanstack/query-core?activeTab=code)
- [ESLint plugin configs](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)
- [Svelte v5-to-v6 migration](https://tanstack.com/query/latest/docs/framework/svelte/migrate-from-v5-to-v6)

- [Migrating to v5](https://tanstack.com/query/v5/docs/framework/react/guides/migrating-to-v5)
- [Important defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults)
- [Disabling queries](https://tanstack.com/query/v5/docs/framework/react/guides/disabling-queries)
- [Background fetching indicators](https://tanstack.com/query/v5/docs/framework/react/guides/background-fetching-indicators)
- [`QueryClient` reference](https://tanstack.com/query/v5/docs/framework/react/reference/QueryClient)
