> **Read this when:** deciding frontend composition, state ownership, routing,
> rendering, hydration, delivery, or performance architecture.

# Frontend Architecture Patterns

Treat frontend architecture as several independent decisions. Do not collapse
render location, data location, caching, streaming, and interactivity into one
label.

## Rendering and delivery

### Decision dimensions

1. **Data origin:** database, internal service, public API, cache, filesystem, or
   client state.
2. **Fetch location:** build process, request-time server, edge runtime, or
   browser.
3. **Render location:** build time, request-time server, edge runtime, or browser.
4. **Network payload:** HTML, serialized component data, JSON, streamed chunks,
   and JavaScript.
5. **Interactivity:** server-only output, hydrated subtree, or client-owned UI.
6. **Hydration:** which boundaries ship code, when they become interactive, and
   how user input affects priority.
7. **Caching:** scope, key, freshness, invalidation, and acceptable staleness.
8. **Execution placement:** proximity to users versus proximity to authoritative
   data and supported runtime capabilities.

JSX is authoring syntax, not a rendering location. A parent component may compose
server-rendered and client-rendered descendants; describe each boundary rather
than assigning one strategy to the whole application.

### Common techniques

| Technique | Provides | Primary costs and constraints |
|---|---|---|
| Client rendering | Browser-owned interaction and navigation | JavaScript startup, loading states, client-visible data access |
| Build-time rendering | Cacheable output prepared before requests | Rebuild/invalidation path, stale content |
| Request-time rendering | Per-request data and personalization | Server work, latency, cache design, failure surface |
| Incremental regeneration | Cached output refreshed after deployment | Staleness semantics, invalidation complexity |
| Server components | Server-owned component execution and reduced client code where supported | Framework boundary rules, serialization, caching semantics |
| Streaming | Progressive delivery of independently ready output | Boundary placement, error handling after headers, observability |
| Selective hydration | Independent hydration boundaries with interaction priority | Suspense/code boundaries, client bundle arrival, framework support |
| Deferred hydration/loading | Code and hydration triggered by visibility, idle time, media, or intent | First-interaction delay, event replay, accessibility, implementation support |
| Edge execution | Compute near selected regions | Runtime limits, data distance, deployment and debugging constraints |

These techniques compose. Server components may be static or dynamic; server
rendering may stream; cached output may be served from an edge without executing
application code there. Selective hydration schedules independent boundaries;
deferred or progressive hydration is the broader architectural choice to delay
code or interactivity until a condition is met. Verify what the selected runtime
and framework actually support.

### Selection questions

- Which content must be indexable or useful before JavaScript runs?
- Which output is shared, per tenant, per user, or per request?
- How stale may each data source become, and what invalidates it?
- Does compute benefit more from user proximity or data proximity?
- Which interactions need browser state or browser APIs?
- What fails when an upstream source is slow after streaming begins?
- How much client JavaScript and hydration work does the design introduce?

Validate with representative data, network conditions, cache behavior, and
real-user measurements. Technique names alone do not predict TTFB, LCP, bundle
size, or indexing behavior.

## Component composition

### Presentational boundary

Separate domain/data orchestration from reusable display when they change for
different reasons. The split can be a server/client boundary, parent/child
composition, or a plain module interface; it does not require a named container
component.

Use when the display should be reusable or testable without the data source. Keep
them together when the split would only add pass-through interfaces.

### Compound components

Use related child components under one owner when consumers need layout control
and the parts share state or invariants. Keep the public interface smaller than
the implementation details it coordinates.

### Hooks

Use a hook to share stateful React behavior across multiple callers. A hook is
not automatically a domain module: move framework-independent rules behind a
plain interface when other runtimes or tests need them.

### Higher-order components

Use a wrapper component for uniform tree-level behavior applied across many
component shapes, such as an error, suspense, authorization, or telemetry
boundary. Account for prop collisions, ref behavior, debugging names, wrapper
order, and static properties. Prefer a hook or ordinary composition when the
consumer needs control or only shares logic.

### Render callbacks

Use a render callback when consumers must control rendering while a provider owns
behavior, lifecycle, or a ref. Prefer ordinary composition when no behavior must
cross that interface.

### Providers

Use context for genuinely ambient values or coordination within a bounded
subtree. Provider value identity and consumer access patterns determine rerender
cost; measure the actual tree rather than assuming context is free or uniformly
expensive.

## State ownership

Classify state before choosing tooling:

| State | Default owner | Decision forces |
|---|---|---|
| Remote data | Authoritative remote system plus an application cache | freshness, deduplication, invalidation, optimistic writes, offline behavior |
| URL state | URL/router | shareability, navigation semantics, serialization |
| Local interaction | Nearest owning component | lifetime, reset behavior, render scope |
| Cross-tree UI state | Smallest shared subtree or store | write frequency, selectors, transitions, persistence |
| Workflow/state machine | Explicit transition owner | valid states, forbidden transitions, effects, recovery |
| Form state | Form boundary | validation timing, dirty state, submission, server errors |

Prefer the repository's established state mechanism when it satisfies the
required ownership and update semantics. Select or migrate a library only after
identifying a concrete limitation.

## Route and navigation boundaries

Treat a route as a product and data boundary, not only a URL-to-component map.
Define ownership of loading, authorization, errors, metadata, cache scope, and
navigation state. Preserve URL semantics for shareable state and browser history.
Place data dependencies where independent branches can start in parallel rather
than discovering each fetch after its parent renders.

Persistent layouts and nested routes can reduce repeated work, but they also
extend state lifetime. Specify when state resets across navigation and how stale
route data is revalidated.

## Mutations and reconciliation

For every mutation, identify the authoritative write, optimistic state, conflict
policy, invalidation or reconciliation path, retry/idempotency behavior, and user
feedback. Streaming a response and persisting a change are separate concerns.
Forms, actions, and client caches must converge on the same outcome after error,
navigation, or reload.

## Frontend trust boundaries

Treat browser input, URL state, storage, hydration payloads, and third-party
scripts as untrusted. Keep secrets and authoritative authorization on the server.
For each server/client boundary, verify output encoding, data minimization, cache
scope, mutation authorization, CSRF posture, content-security policy, and tenant
isolation. Client visibility rules improve UX but do not enforce access.

Map which data is serialized into HTML or component payloads and which code runs
with access to user content. Third-party scripts and dependencies need explicit
capability, loading, and failure boundaries.

## Performance as architecture

Trace critical user journeys as dependency chains:

- request and data waterfalls
- server work before first bytes
- resources required before meaningful rendering
- client code required before interaction
- duplicate or extraneous work across boundaries

Choose interventions from measured bottlenecks: cache, parallelize, preload,
stream, split code, virtualize rendering, or move computation. Each intervention
shifts complexity; record the new invalidation, failure, and observability costs.
