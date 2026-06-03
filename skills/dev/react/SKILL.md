---
name: react
description: >-
  Audits React and Next.js code for the seven highest-leverage pitfalls, then
  routes to deep-dive references on useEffect anti-patterns, re-render causes,
  rendering model selection, and waterfall chains. Make sure to use this skill
  whenever a .tsx or .jsx file is opened or reviewed, the user asks "is my
  React code good", mentions useEffect, re-renders, memoization, React Compiler,
  Server Components, Server Actions, SSR vs CSR, hydration, waterfalls, or
  bundle size — even casually. Triggers on any React code review.
---

# React Best Practices Audit

Focused audit layer for React and Next.js. Start with the six universal checks
— these are the highest-leverage bugs and appear in almost every codebase. Then
route to the reference that matches the user's specific question.

## Universal Checks (no exceptions — run these every time)

These six checks take seconds to scan for and catch the most common,
highest-impact mistakes. Skip them only if you have already verified them in
the same session.

1. **Components defined inside other components**
   They are re-created on every render. Their state resets. All memoization is
   lost. `React.memo` on them does nothing. Extract to module scope.

2. **Array index as `key` in dynamic lists**
   `key` is React's identity anchor. When the list reorders, inserts, or
   deletes, an index-based key reassigns identity to the wrong element — causing
   visual artifacts, wrong focus, and lost form state. Use a stable ID from the
   data. Exception: truly static, never-reordered lists where index is fine.

3. **Derived state via `useState` + `useEffect`**
   ```typescript
   // ❌ Two state variables + an Effect that syncs them
   const [filteredItems, setFilteredItems] = useState(items);
   useEffect(() => { setFilteredItems(items.filter(f)); }, [items, f]);

   // ✅ One variable, computed during render — no Effect, no lag
   const filteredItems = useMemo(() => items.filter(f), [items, f]);
   // or just: const filteredItems = items.filter(f); (if not expensive)
   ```

4. **Data fetching in `useEffect` without cleanup**
   Without cleanup, a slow request that resolves after a faster one will
   overwrite the fresh data with stale data (race condition):
   ```typescript
   // ❌ Race condition
   useEffect(() => {
     fetchUser(id).then(setUser);
   }, [id]);

   // ✅ Cleanup flag
   useEffect(() => {
     let ignore = false;
     fetchUser(id).then(data => { if (!ignore) setUser(data); });
     return () => { ignore = true; };
   }, [id]);

   // ✅ Best — use TanStack Query or RSC. Handles this automatically.
   ```

5. **Unmemoized Context provider value**
   Every time the parent re-renders, a new object reference is created, and
   every consumer re-renders even if the data hasn't changed:
   ```typescript
   // ❌ New object every parent render
   <UserContext.Provider value={{ user, login, logout }}>

   // ✅ Stable reference
   const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
   <UserContext.Provider value={value}>

   // ✅ Or split data and API into separate contexts (API never changes)
   <UserDataContext.Provider value={user}>
     <UserAPIContext.Provider value={api}> {/* stable — defined outside render */}
   ```

6. **Server Actions for client-side data reads**
   Server Actions serialize calls — they can't run in parallel. Using them for
   reads kills the performance of any page that needs multiple data sources:
   ```typescript
   // ❌ Server Action reads — serialize even under Promise.all
   const [user, posts] = await Promise.all([getUser(id), getPosts(id)]);
   // These still serialize because Server Actions are not parallelizable

   // ✅ Server Actions for mutations only. Reads via RSC, API routes,
   //    or TanStack Query.
   ```

7. **`React.FC` and `forwardRef` — both deprecated patterns**
   `React.FC` adds an implicit `children` prop (wrong in React 18+), forces a
   return type annotation, and provides no benefit over plain functions. In React
   19, `ref` is a regular prop — `forwardRef` still works but is unnecessary for
   new code:
   ```typescript
   // ❌ React.FC — adds noise, implies children, removed from CRA defaults
   const Button: React.FC<ButtonProps> = ({ label }) => <button>{label}</button>;

   // ✅ Plain function declaration
   function Button({ label }: ButtonProps) {
     return <button>{label}</button>;
   }

   // ❌ forwardRef — React 18 boilerplate, unnecessary in React 19+
   const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => (
     <input ref={ref} {...props} />
   ));

   // ✅ React 19 — ref as a plain prop
   function Input({ ref, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) {
     return <input ref={ref} {...props} />;
   }
   ```


## Priority Checklist (run after universal checks)

Use this for full audits. The six universal checks above catch the most common bugs;
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

| Priority | Impact | Load when | Reference |
|----------|--------|-----------|-----------|
| 1 | **CRITICAL** | `React.FC`, `forwardRef`, `defaultProps`, React 19 APIs (`useActionState`, `useOptimistic`, `use()`), ref as prop, action props, `nuqs`, async transitions, Suspense sibling change | `references/react-19.md` |
| 2 | **CRITICAL** | sequential `await`, waterfall chains, `Promise.all`, Suspense streaming, `React.cache`, `after()`, parallel fetching | `references/waterfalls.md` |
| 3 | **CRITICAL** | slow initial load, bundle size, barrel file imports, code splitting, `rollup-plugin-visualizer`, Web Vitals, dynamic import | `references/bundle-and-perf-investigation.md` |
| 4 | **HIGH** | `useEffect` questions, "should I use an effect", stale closure, race condition, flickering UI, `useLayoutEffect` | `references/useeffect-antipatterns.md` |
| 5 | **HIGH** | SSR/CSR/SSG/ISR/RSC choice, "when should I use a Server Component", hydration mismatch, `suppressHydrationWarning` | `references/rendering-models.md` |
| 6 | **MEDIUM-HIGH** | TanStack Query, `useQuery`, `queryOptions`, `select`, `staleTime`, `gcTime`, mutations, optimistic updates, query keys | `references/tanstack-query.md` |
| 7 | **MEDIUM** | `useMemo`, `useCallback`, `React.memo`, "why does this re-render", React Compiler, memoization decision | `references/re-renders.md` |
| 8 | **MEDIUM** | modal, dialog, tooltip, popover, z-index, "appears behind", portal, stacking context | `references/portals-and-stacking-context.md` |

### When to load a reference

- Load the **highest-priority matching reference first** — fix CRITICAL issues before
  reaching for MEDIUM optimization references
- A rule-level question (*"should I do X?"*) → load the reference for that category
- A conceptual question (*"why does X happen?"*) → load the same reference; they
  include both explanation and the correct pattern
- When multiple references match, load in priority order — they don't overlap
- The universal checks + priority checklist above cover the most common violations
  without loading any reference; only load when depth is needed beyond the checklist
