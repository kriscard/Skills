---
name: tanstack-query
description: >-
  Implement, debug, or review modern TanStack Query code using the installed
  @tanstack query package and adapter. Use for query keys/options, cache freshness,
  invalidation, cancellation, retries, network modes, mutations and optimism,
  offline persistence, infinite queries, tracked properties, selectors,
  adapter-specific APIs, SSR/hydration, or Router/Start integration. Inspect the
  resolved adapter, core, framework peers, and declarations before choosing syntax.
  Compose with react only for React-owned work and test when evidence is requested
  or affected. Do not use for general client state or generic fetch/MSW work without
  Query behavior.
---

# TanStack Query

Treat Query as a synchronization layer for remotely owned asynchronous state. Model the resource,
its cache identity, and how truth is restored before choosing a hook or client method.

## Workflow

### 1. Detect the installed boundary

Inspect manifests, lockfiles, imports, configuration, and resolved declarations. Record the adapter,
its exact version, the separately resolved `@tanstack/query-core`, framework peer version, and any
router, SSR, hydration, persistence, devtools, or lint integration. Current documentation describes
current releases; installed exports and types decide which capabilities this project can use.

**Complete when:** the adapter/core/peer boundary and nearby project conventions are known.

### 2. Name the state owner

Use Query for server-owned snapshots that can become stale. Keep ephemeral UI state, URL state,
forms, and editable drafts with their existing owners. Derive UI validity from query data where
possible; preserve a local draft when the user intentionally edits a snapshot.

**Complete when:** each changed value has one owner and Query has a reason to participate.

### 3. Define the resource contract

For every read, identify the resource, every result-changing input, canonical cached shape,
freshness, cancellation path, and error boundary. For every write, identify the affected resources,
authoritative response data, completion boundary, and concurrency behavior. Keep transport,
runtime validation, domain transformation, Query policy, and UI projection as explicit seams.

**Complete when:** cache identity and the path back to server truth are unambiguous.

### 4. Load the applicable reference

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Keys/options, reusable definitions, freshness, retries, network modes, invalidation, disabled/dependent reads, cancellation, transformations, Suspense queries | `references/queries-and-cache.md` |
| 1 — High | Mutations, callback/promise ownership, invalidation timing, optimistic UI/cache writes, overlapping writes, scopes, paused/offline persistence | `references/mutations-and-optimism.md` |
| 1 — High | Infinite queries, pagination cursors, tracked properties, `select`, structural sharing, non-React adapters | `references/infinite-rendering-and-adapters.md` |
| 1 — High | SSR, hydration, pending dehydration, RSC/cache layers, Router or Start integration | `references/ssr-hydration-and-frameworks.md` |
| 2 — High | Broken behavior, capability uncertainty, cache/performance review, or adapter/version mismatch | `references/debugging-and-review.md` |
| 2 — Medium | Tests or executable evidence requested or affected | `references/testing.md` |

**Complete when:** each relevant branch is loaded and its examples match installed declarations.

### 5. Compose at owner seams

- Load `react` for component ownership, Effects, Suspense/error boundaries, transitions, Context, and
  rendering behavior. Keep the Query-facing seam here even when React owns the surrounding mechanic.
- Load `test` when tests or executable evidence are requested or affected; use the installed runner.
- Use existing runtime validation in the transport/API layer before data enters the cache. Schema
  selection belongs to that owner; Query should receive typed data or a thrown failure.
- Let Router/Start/Next own route and server mechanics while Query owns its client, observers, keys,
  freshness, and cache reconciliation.

**Complete when:** each concern has one owner and the handoff between owners is visible in code.

### 6. Verify transitions

Run the narrowest typecheck, lint, and tests that cover the changed behavior, then repository checks.
Assert outcomes: equal identities share work, changed inputs select another cache entry, cancellation
reaches transport, writes restore the intended truth, optimistic overlap does not flash stale data,
and hydration/integration uses the intended client and observer.

Report detected versions, cache identities, freshness/invalidation decisions, owner handoffs,
checks, and remaining gaps.

**Complete when:** installed-version syntax passes and each changed transition has evidence.

## Guardrails

1. **Identity:** keys include every result-changing input; normal and infinite data use distinct keys.
2. **Repeatability:** `queryFn` returns or throws repeatably; event effects stay with event/mutation owners.
3. **Freshness:** choose `staleTime` from the resource; use `gcTime` for inactive retention.
4. **Reconciliation:** update from an authoritative response or invalidate the resources made stale.
5. **Cancellation:** pass `AbortSignal` to transport and cancel conflicting reads before cache optimism.
6. **Optimism:** prefer a local pending preview; use cache optimism when multiple observers need it and
   provide overlap-safe rollback/reconciliation.
7. **Composition:** share `queryOptions` when loaders, hooks, or imperative callers need one identity;
   keep consumer overrides at the callsite and add hooks only when they own behavior.
8. **Observation:** use tracked properties and structural sharing first; select a narrower result when
   that subscription or transformation is valuable.
9. **Adapters:** transfer core semantics, then verify the adapter's exports, reactive inputs, provider,
   return shape, peer range, and experimental status.
