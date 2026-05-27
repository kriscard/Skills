> **Read this when:** user is building a web frontend, discussing component architecture, state management strategy, or rendering model choice.

# Frontend Architecture Patterns

## Rendering Strategy

The rendering model is the most consequential architectural decision for a fullstack web app. It affects SEO, performance, infrastructure cost, and developer experience. Choose at the architecture level — migrating later is expensive.

**For React implementation depth (hydration pitfalls, Server Actions, RSC boundaries) → load the react skill's `references/rendering-models.md`.**

### Decision Table

| Strategy | SEO | Personalized | Data freshness | Client bundle | TTFB |
|----------|-----|-------------|----------------|--------------|------|
| **CSR** | ❌ | ✅ | ✅ real-time | Large | Slow |
| **SSR** | ✅ | ✅ | ✅ per-request | Small | Fast |
| **SSG** | ✅ | ❌ | ❌ build-time | Small | Fastest |
| **ISR** | ✅ | ❌ | ~periodic | Small | Fast |
| **RSC** | ✅ | ✅ | ✅ | Reduced | Fast |
| **Streaming SSR** | ✅ | ✅ | ✅ | Small | Progressive |
| **Edge Rendering** | ✅ | ✅ | ✅ | Small | Globally fast |

### Decision Path

```
SEO required?
├── No → CSR (dashboards, tools, authenticated apps)
└── Yes
    ├── Personalized per user?
    │   ├── No → SSG (marketing, docs, blogs) or ISR (periodically updated)
    │   └── Yes → SSR / RSC / Streaming SSR
    │       ├── Need to reduce JS bundle? → RSC
    │       ├── Need progressive loading? → Streaming SSR
    │       └── Need low global latency? → Edge Rendering
    └── Mixed (some static, some dynamic)?
        └── RSC (static shell + dynamic islands)
```

**Trade-off to watch:** SSR can increase LCP vs CSR on slow networks with fast clients — the full HTML document may take longer than a cached JS bundle loading data lazily. Measure with real-user metrics before committing.

---

## Component Patterns

### Container / Presentational
Separate data-fetching and logic from rendering. Container owns state and effects; presentational component is pure props-in, UI-out.

```tsx
// Container
function UserProfileContainer({ userId }: { userId: string }) {
  const { data: user } = useUser(userId)
  return user ? <UserProfileCard user={user} /> : <Skeleton />
}

// Presentational — no hooks, no fetching, fully testable
function UserProfileCard({ user }: { user: User }) {
  return <div>{user.displayName}</div>
}
```

**2026 note:** TanStack Query + pure components largely replaces this pattern. The "container" is now `useQuery`. The presentational component stays the same.

### Compound Components
State lives in a parent component; children access it via Context without explicit prop-passing. The consumer controls composition.

```tsx
// Usage looks natural — no prop threading
<Select value={value} onChange={setValue}>
  <Select.Option value="a">Option A</Select.Option>
  <Select.Option value="b">Option B</Select.Option>
</Select>
```

**Use when:** a group of related components must share state but the consumer needs control over their arrangement (tabs, accordions, dropdown menus, form field groups).

### Custom Hooks
Extract logic from components into reusable hooks. The primary composition tool in 2026.

```ts
// Logic extracted — both components and pages can use it
function useUserPermissions(userId: string) {
  const { data } = useQuery(['permissions', userId], () => fetchPermissions(userId))
  return {
    canEdit: data?.roles.includes('editor') ?? false,
    canDelete: data?.roles.includes('admin') ?? false,
  }
}
```

**Use when:** the same stateful logic appears in more than one component. Prefer this over HOC for logic reuse. Hooks can compose other hooks — build complex behavior from simple building blocks.

### Render Props
Inject behavior via a function-as-child or render prop. Less common in 2026 but still the right tool for some cases.

```tsx
// When a hook doesn't work (e.g., drag-and-drop with ref + render logic intertwined)
<Draggable>
  {({ isDragging, ref }) => (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>Content</div>
  )}
</Draggable>
```

**Use when:** the consumer needs both behavior and ref access together, or the library requires it (animation libraries, DnD libraries).

### Provider Pattern
Ambient state via Context. Avoids prop drilling for values needed deep in the tree.

```tsx
// For truly cross-cutting concerns
<ThemeProvider theme={theme}>
  <AuthProvider>
    <App />
  </AuthProvider>
</ThemeProvider>
```

**Use when:** genuinely cross-cutting concerns — theme, locale, auth state, feature flags.
**Don't use as:** a performance optimization or to avoid thinking about component structure. Context re-renders all consumers on every change.

---

## State Management (Trade-off First, Not Framework First)

There is no single default. Choose based on what kind of state you're managing.

| State type | Where it lives | Best tool |
|-----------|----------------|-----------|
| **Server state** (data from API) | Server, cached on client | TanStack Query, SWR |
| **Global UI state** (modals, sidebars, multi-page wizard) | Client, shared across routes | Zustand |
| **Local UI state** (input value, toggle, hover) | Component | `useState` |
| **Complex UI state machine** (multi-step flow with transitions) | Component or context | `useReducer`, XState |
| **URL state** (filters, pagination, selected tab) | URL | `useSearchParams` |
| **Form state** | Form scope | React Hook Form, Formik |

**State colocation principle:** state should live as close as possible to where it's used. Only lift it when multiple components genuinely need it. Don't pre-emptively centralize.

**Redux in 2026:** TanStack Query has replaced Redux for most data-fetching. Zustand has replaced Redux for most UI state. Redux remains appropriate for large codebases with complex cross-slice state dependencies and middleware pipelines.

---

## Architectural Insights

### CQRS Mirrors Redux
Redux is an implementation of CQRS: selectors are the read model (Query), dispatch+actions are the write model (Command). Separating reads from writes is architectural — it applies to any state design, not just Redux.

Implication: design your state queries (what data looks like when read) independently from your state mutations (how data changes). Reselect/selectors = query layer. Actions/reducers = command layer.

### Optimistic Updates = Write-Behind Cache
Optimistic UI updates follow the Write-Behind Cache pattern: update the local state (cache) immediately, sync to the server asynchronously. If the server rejects, roll back.

This pattern is principled, not magic:
1. Apply the change locally (instant feedback)
2. Send to server in background
3. On success: confirm (no-op or reconcile)
4. On failure: roll back to previous state + show error

TanStack Query's `onMutate` / `onError` / `onSettled` callbacks map exactly to these steps.

---

## Performance as Architecture (PRPL)

Performance is an architectural concern, not a last-minute optimization. PRPL is a framework for thinking about it:

- **Push** critical resources for the initial route (preload, early hints)
- **Render** the initial route as fast as possible (SSR, SSG, or minimal JS for CSR)
- **Pre-cache** remaining routes in the background (service worker, prefetch)
- **Lazy-load** remaining routes and features on demand (dynamic import, route-based splitting)

**Route-based code splitting** is the most impactful single change for most SPAs:
```ts
// Each route loads only its own code
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
```

**Import-on-interaction** for non-critical UI: don't load a rich text editor or date picker until the user clicks the field that needs it.
