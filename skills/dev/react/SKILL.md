---
name: react
description: >-
  Audits React and Next.js code for high-leverage runtime and rendering
  pitfalls, then routes to deep-dive references on useEffect anti-patterns,
  re-render causes, rendering model selection, React 19 APIs, and waterfall
  chains. Use when a .tsx or .jsx file is opened or reviewed, the user asks
  "is my React code good", mentions useEffect, re-renders, memoization, React
  Compiler, Server Components, Server Actions, SSR vs CSR, hydration,
  waterfalls, or bundle size. Triggers on React runtime/rendering reviews.
---

# React Best Practices Audit

Focused audit layer for React and Next.js runtime/rendering issues. Start with
the universal checks, then route to the reference that matches the user's
specific question.

## Universal Checks (no exceptions — run these every time)

These checks take seconds to scan for and catch common high-impact mistakes.
Skip them only if you have already verified them in the same session.

1. **Components defined inside other components**
   They are re-created on every render; state resets and memoization is lost.
   Extract to module scope.

2. **Array index as `key` in dynamic lists**
   `key` is React's identity anchor. When lists reorder, insert, or delete, an
   index key reassigns identity to the wrong element. Use a stable ID from the
   data. Exception: truly static, never-reordered lists.

3. **Derived state via `useState` + `useEffect`**
   If state is only a calculation from props/state, compute it during render
   (optionally `useMemo` for expensive work) instead of syncing with an Effect.

4. **Data fetching in `useEffect` without cleanup**
   Slow responses can overwrite fresh data. Use cleanup/cancellation, TanStack
   Query, or Server Components so stale requests cannot win the race.

5. **Unmemoized Context provider value**
   New object/function references make every consumer re-render. Memoize the
   provider value or split data and API contexts.

6. **Server Actions for client-side data reads**
   Server Actions serialize calls and are for mutations. Reads should use RSC,
   route handlers, or a client data layer that can parallelize and dedupe.

7. **`React.FC` and `forwardRef` as default patterns**
   Prefer plain function components. `React.FC` adds noise and misleading
   children behavior; React 19 makes `ref` a normal prop for new code. Load the
   React 19 reference for version-specific migration details.

## Ownership Boundary with Frontend

`react` owns React runtime/rendering issues: Effects, re-renders, Context,
keys, Server Actions, hydration, React 19 APIs, waterfalls, and bundle/runtime
performance. `frontend` owns broader TypeScript, UI accessibility, browser
security, Next.js file boundaries, Tailwind/component API patterns, and frontend
file structure.

## Priority Checklist (run after universal checks)

Use this for full audits. The universal checks above catch the most common bugs;
this checklist catches the rest.

**CRITICAL — Eliminating Waterfalls:**
- [ ] No sequential awaits that could run in parallel
- [ ] `Promise.all` for independent operations
- [ ] API routes don't chain awaits unnecessarily
- [ ] Strategic Suspense boundaries for streaming

**CRITICAL — Bundle Size:**
- [ ] Direct imports (no barrel files)
- [ ] Dynamic imports for heavy components
- [ ] Conditional module loading
- [ ] Non-critical libs deferred
- [ ] Preload based on user intent

**HIGH — Server-Side Performance:**
- [ ] Server Actions have authentication
- [ ] RSC props minimized (only needed data)
- [ ] Parallel data fetching via composition
- [ ] `React.cache()` for per-request dedup
- [ ] `after()` for non-blocking operations
- [ ] No duplicate serialization

**MEDIUM-HIGH — Client Data Fetching:**
- [ ] SWR/TanStack Query for automatic deduplication
- [ ] Passive event listeners for scroll
- [ ] Global event listeners deduplicated
- [ ] `localStorage` versioned and minimal

**MEDIUM — Re-render Optimization:**
- [ ] Functional `setState` updates (no stale closures)
- [ ] Lazy state initialization for expensive values
- [ ] Narrow effect dependencies (primitives > objects)
- [ ] `useTransition` for non-urgent updates
- [ ] Derived state calculated during render (not via `useEffect`)
- [ ] Interaction logic in event handlers (not state + effect)
- [ ] `useRef` for transient values (mouse trackers, intervals)
- [ ] Extract to memoized components when re-render scope is too broad
- [ ] No unnecessary `useMemo` wrapping (prefer React Compiler if available)

**MEDIUM — Rendering Performance:**
- [ ] `content-visibility` for long lists
- [ ] `useTransition` over manual loading states
- [ ] Explicit conditional rendering (not `&&` with truthy non-booleans)
- [ ] `suppressHydrationWarning` for known server/client differences
- [ ] Prevent hydration mismatch without UI flicker

**LOW-MEDIUM — JavaScript Performance:**
- [ ] `Set`/`Map` for O(1) lookups
- [ ] Early returns in functions
- [ ] Cached repeated function calls
- [ ] `toSorted()` over `sort()` for immutability
- [ ] Avoid layout thrashing
- [ ] Hoist `RegExp` creation outside render

**LOW — Advanced Patterns:**
- [ ] Event handlers in refs for stable references
- [ ] `useEffectEvent` for stable callback refs
- [ ] App initialization with module-level guards (not `useEffect`)

## Report Format

For each violation:
```
[PRIORITY] Rule Name
File: path/to/file.tsx:line
Issue: [description of the problem]
Fix: [code example showing correct pattern]
```

After the full checklist, provide:
1. **Violation Count by Priority** — CRITICAL: N · HIGH: N · MEDIUM: N · LOW: N
2. **Top 3 Highest-Impact Fixes** — brief description + expected improvement
3. **Overall Assessment** — Pass / Needs Work / Critical Issues

## Stack Context — Determine Before Routing

Before loading references, determine which stack the user is on:

- **Next.js App Router** → RSC, Server Actions, streaming, and `react-19.md`
  action props / `useActionState` patterns apply
- **Vite SPA (React Router / TanStack Router)** → no RSC, TanStack Query is the
  primary data layer, `tanstack-query.md` is the first reference to reach for
- **Both** → `re-renders.md`, `useeffect-antipatterns.md`, `portals-and-stacking-context.md`,
  and `bundle-and-perf-investigation.md` are stack-agnostic

If unsure, look at the imports: `next/` imports → App Router; `react-router-dom`
or `@tanstack/react-router` → Vite SPA.

## References — Priority Table

Load the reference that matches the issue. Higher-priority references fix more
users / cause more damage when missed — resolve CRITICAL before MEDIUM.

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — Critical | React 19 APIs (`useActionState`, `useOptimistic`, `use()`), ref as prop, action props, `nuqs`, async transitions, Suspense sibling change | `references/react-19.md` |
| 2 — Critical | sequential `await`, waterfall chains, `Promise.all`, Suspense streaming, `React.cache`, `after()`, parallel fetching | `references/waterfalls.md` |
| 3 — Critical | slow initial load, bundle size, barrel file imports, code splitting, `rollup-plugin-visualizer`, Web Vitals, dynamic import | `references/bundle-and-perf-investigation.md` |
| 4 — High | `useEffect` questions, "should I use an effect", stale closure, race condition, flickering UI, `useLayoutEffect` | `references/useeffect-antipatterns.md` |
| 5 — High | SSR/CSR/SSG/ISR/RSC choice, "when should I use a Server Component", hydration mismatch, `suppressHydrationWarning` | `references/rendering-models.md` |
| 6 — Medium-High | TanStack Query, `useQuery`, `queryOptions`, `select`, `staleTime`, `gcTime`, mutations, optimistic updates, query keys | `references/tanstack-query.md` |
| 7 — Medium | `useMemo`, `useCallback`, `React.memo`, "why does this re-render", React Compiler, memoization decision | `references/re-renders.md` |
| 8 — Medium | modal, dialog, tooltip, popover, z-index, "appears behind", portal, stacking context | `references/portals-and-stacking-context.md` |

### When to load a reference

- Load the **highest-priority matching reference first** — fix CRITICAL issues before
  reaching for MEDIUM optimization references
- A rule-level question (*"should I do X?"*) → load the reference for that category
- A conceptual question (*"why does X happen?"*) → load the same reference; they
  include both explanation and the correct pattern
- When multiple references match, load in priority order — they don't overlap
- The universal checks + priority checklist above cover the most common violations
  without loading any reference; only load when depth is needed beyond the checklist
