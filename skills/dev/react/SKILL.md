---
name: react
description: >-
  React component architecture and data-flow guidance for composition, state
  ownership, Effects, Suspense, async UI, rendering behavior, and measured
  performance. Use when building, recommending, or auditing React component APIs,
  hooks, providers, transitions, rerenders, or server/client component boundaries.
  Route Next.js-specific caching, routes, and App Router mechanics to
  nextjs-app-architecture; route browser security, styling systems, and file
  organization to frontend.
---

# React Engineering

Build React from ownership and composition: keep state with its owner, derive during
render, synchronize only with external systems, and introduce abstraction after real
variation appears. Match the user's request—build, recommend, or audit—without forcing a
full checklist onto focused work.

## Workflow

### 1. Detect the React environment

Inspect installed React and framework versions, compiler configuration, renderer,
routing/data libraries, and nearby conventions. Determine whether Server Components or
a client-only renderer are actually available. Use project or current primary docs for
version-sensitive mechanics.

When the task depends on Next.js routes, Cache Components, Server Actions, App Router
file conventions, or framework caching, load `nextjs-app-architecture` instead of
restating those mechanics here.

**Complete when:** React capabilities and framework ownership are known.

### 2. Trace ownership and data flow

Identify the component that owns each piece of state, the consumers that need it, the
server-cache boundary, URL state, form state, and external systems. Trace props and
context through the target interaction before changing abstractions.

**Complete when:** every changed state and side effect has one named owner and data path.

### 3. Choose the simplest composition

Start top-down with plain components and explicit props. Extract when a responsibility,
real reuse, independent variation, or testing seam appears. Compound components,
providers, slots, and render callbacks must be earned by multiple compositions or
cross-tree coordination.

**Complete when:** the component API exposes stable choices while volatile implementation
stays behind the boundary.

### 4. Model state and synchronization

Keep state local until coordination pressure requires the nearest shared owner. For a
composable family with real cross-tree coordination, use a provider contract that
separates state, actions, and imperative metadata from its implementation. Keep server
cache, URL state, form state, and application state in their appropriate systems.

Effects synchronize with systems outside React. Derived values, interaction logic, and
state transitions remain in render, events, reducers, or the owning data layer.

**Complete when:** no state is mirrored without a synchronization requirement and every
Effect has an external system to synchronize.

### 5. Design async and rendering behavior

Place Suspense, transitions, optimistic state, pending feedback, and error recovery at
the owner of the waiting experience. Keep stable UI visible while replaceable content
waits. Let the dedicated framework skill decide route-level streaming and caching.

**Complete when:** urgent interaction remains responsive and loading, success, failure,
and recovery behavior have clear owners.

### 6. Optimize from evidence

Fix waterfalls, unnecessary ownership breadth, and expensive rendering structure before
memoization or JavaScript micro-optimization. Use profiling, traces, bundle analysis, or
measured user impact. Account for the detected compiler before prescribing manual
memoization.

**Complete when:** each optimization names a measured or structurally demonstrated cost
and verification uses the same signal.

### 7. Implement or report

- **Build:** implement the smallest coherent React change and run project checks.
- **Recommend:** explain the ownership and composition trade-off and choose a default.
- **Audit:** report evidence-backed findings without duplicating general PR review.

**Complete when:** behavior is verified, relevant tests and checks pass, and unresolved
framework or browser behavior is explicit.

## References

| Priority | Load when | Reference |
|---|---|---|
| 1 — High | Boolean prop growth, component API design, compound components, slots, variants, render props | `references/composition.md` |
| 1 — High | State placement, Context, providers, reducers, server cache, URL/form/application state | `references/state-and-data-flow.md` |
| 1 — High | `useEffect`, synchronization, derived state, stale closures, subscriptions, race conditions | `references/useeffect-antipatterns.md` |
| 1 — High | Suspense, transitions, optimistic updates, pending UI, async dependencies, error boundaries | `references/async-and-suspense.md` |
| 2 — Medium | Rerender diagnosis, state breadth, Context churn, React Compiler, memoization | `references/re-renders.md` |
| 2 — Medium | Slow startup or interaction, waterfalls, bundle analysis, profiling, Web Vitals | `references/bundle-and-perf-investigation.md` |
| 2 — Medium | Dialogs, popovers, tooltips, portals, stacking context, focus restoration | `references/portals-and-stacking-context.md` |
| 2 — Conditional | Detected React 19+ APIs, ref as prop, `use`, action hooks, form actions | `references/react-19.md` |

## Ownership Boundary

- `react` owns React composition, state, Effects, rendering, and async primitives.
- `frontend` owns trust boundaries, TypeScript surface contracts, accessibility baseline,
  styling systems, browser behavior, security, and feature organization.
- `nextjs-app-architecture` owns Next.js-specific route, cache, streaming, and App Router
  mechanics.

## Completion Gate

Before finishing:

- version-sensitive guidance matches the detected React/framework version;
- component abstractions are justified by real variation or coordination;
- state and async behavior have explicit owners;
- Effects synchronize only with external systems;
- performance claims have evidence;
- the requested behavior and relevant checks are verified.
