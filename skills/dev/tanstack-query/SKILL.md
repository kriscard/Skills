---
name: tanstack-query
description: >-
  Implement, debug, migrate, or review TanStack Query code using the installed
  @tanstack query package and adapter. Use for query keys/options, cache freshness
  and garbage collection, invalidation, cancellation, mutations and optimistic
  rollback, mutation scopes, infinite queries, tracked properties, adapter-specific
  APIs, or v4-to-v5 migration. Detect the installed package and version before
  giving syntax. Compose with react and test when those branches apply. Do not use
  for general client state, generic fetch code, or MSW tests without TanStack Query
  behavior.
---

# TanStack Query

Treat TanStack Query as a server-state synchronization layer. Start from cache identity and server
freshness, then choose the smallest adapter API that preserves that model.

## Workflow

### 1. Detect the installed boundary

Inspect manifests, lockfiles, imports, configuration, and installed declarations before writing
code. Record:

- the exact package and version, such as `@tanstack/react-query`, `@tanstack/vue-query`,
  `@tanstack/solid-query`, `@tanstack/svelte-query`, `@tanstack/angular-query-experimental`, or
  `@tanstack/query-core`;
- the framework/runtime version and SSR, hydration, persistence, or offline integrations in use;
- whether the task targets current code, a v4-to-v5 migration, or a newer installed major;
- nearby key, option, client-default, error, and test conventions.

Use the installed types as the compatibility boundary. This skill's baseline is v5: for v4 load the
migration reference; for a newer major, verify current official docs and declarations rather than
projecting v5 syntax forward. Angular's adapter is experimental, so pin advice to its exact patch.

**Complete when:** package, adapter, exact version, runtime, and applicable compatibility branch are
known.

### 2. Confirm TanStack Query owns the state

Use it for remotely owned asynchronous state that can become stale. Keep ephemeral UI state,
editable client drafts, reducer workflows, and form state with their existing owners. Do not
introduce TanStack Query merely because code performs `fetch` or a test uses MSW.

**Complete when:** every changed value is classified as server cache, local UI state, form state,
URL state, or another owner.

### 3. Model cache identity and policy

Define the query key from the resource identity plus every query-function input that changes the
result. Then define the query function and freshness policy. Load the query/cache reference for any
query implementation, invalidation, cancellation, or cache-lifecycle work.

`queryOptions` / adapter equivalents may co-locate reusable key and function types. A key factory is
an earned abstraction for repeated hierarchy or shared filtering, not a prerequisite for every
query.

**Complete when:** each cache entry has one unambiguous identity and its freshness, retention, and
refetch behavior are intentional.

### 4. Implement the applicable branch

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Query keys/options, `staleTime`, `gcTime`, invalidation, filters, disabled queries, cancellation, query functions | `references/queries-and-cache.md` |
| 1 — High | Mutations, mutation responses, invalidation timing, optimistic UI/cache writes, rollback, concurrent writes, mutation scopes | `references/mutations-and-optimism.md` |
| 1 — High | Infinite queries, pagination cursors, `maxPages`, tracked properties, `select`, structural sharing, non-React adapters | `references/infinite-rendering-and-adapters.md` |
| 2 — High | v4-to-v5 migration, broken or surprising behavior, cache review, performance review, version uncertainty | `references/migration-debug-and-review.md` |
| 2 — Medium | Tests requested or affected, QueryClient isolation, retries/timers, HTTP interception, MSW | `references/testing.md` |

**Complete when:** every detected branch has loaded its reference and adapter syntax matches the
installed declarations.

### 5. Compose without duplicating owners

- Load `react` for component ownership, Effects, Suspense boundaries, transitions, and rendering
  behavior. TanStack Query owns server-cache semantics, not general React architecture.
- Load `test` when tests or executable evidence are requested or observable behavior changes. Use
  the repository's installed runner guidance as routed by that skill.
- When MSW is installed, use it as the HTTP boundary for relevant tests; do not turn a general MSW
  request into a TanStack Query task.
- Keep transport and response validation in the existing API boundary. Query functions fetch and
  return/throw; user-visible side effects belong to event, mutation, or rendering owners.

**Complete when:** each concern has one owner and no companion skill's guidance is restated as a
parallel policy.

### 6. Verify and report

Run the narrowest typecheck, lint, and tests that cover the changed behavior, then the repository's
broader required checks. For debugging, reproduce before changing policy. For review, report only
evidence-backed defects and distinguish adapter/version facts from design recommendations.

Report the detected package/version, cache identities, freshness/invalidation choices, cancellation
path, mutation/infinite-query behavior, adapter-specific decisions, tests/checks, and remaining
risk.

**Complete when:** installed-version syntax passes checks and every changed cache transition has
observable evidence or an explicit verification gap.

## Guardrails

1. **Keys express identity.** Include result-changing inputs; never share a key between normal and
   infinite queries because their cached shapes differ.
2. **Query functions are repeatable.** Keep analytics, notifications, navigation, and cache
   choreography out of `queryFn`; retries and background refetches can run it more than once.
3. **Freshness is not retention.** `staleTime` controls when observed data becomes stale; `gcTime`
   controls removal only after a query becomes inactive.
4. **Invalidate by relationship.** Target the resources a successful write made stale. Do not make
   universal `onSettled` invalidation a house rule; choose success, error, or settled timing from
   the server contract.
5. **Cancellation reaches transport.** Pass the provided `AbortSignal` through every cancellable
   request in the query function. Cancel relevant reads before optimistic cache writes.
6. **Optimism has a recovery path.** Prefer UI-only optimism when local; snapshot/rollback or a
   credible refetch when writing shared cache data.
7. **Serialization is exceptional.** Mutation scopes solve a real ordering constraint. Independent
   writes remain parallel.
8. **Use tracked properties by default.** Avoid hand-maintained notification property lists and
   React query-result rest destructuring. Stabilize selectors only when reuse or measured work
   justifies it; memoization is not mandatory.
9. **Adapter APIs are not interchangeable.** Share core semantics, then verify each adapter's
   reactive wrapper, function name, provider, and return shape.
