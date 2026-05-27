> **Read this when:** user needs to compose, wrap, adapt, structure objects, or provide simplified access to complex subsystems. Also covers creational patterns (how objects are created).

# Structural & Creational Patterns (Frontend 2026)

The classic GoF patterns map directly to modern frontend development. Instead of class hierarchies, these patterns manifest through ES6 modules, closures, hooks, and component composition.

---

## Creational Patterns

### Factory Method
**Problem:** Creating different components or objects based on dynamic input, without a massive `if/switch` block that grows with every new type.

**Frontend use:**
```tsx
// Instead of:
if (type === 'text') return <TextBlock data={data} />
if (type === 'image') return <ImageBlock data={data} />
if (type === 'video') return <VideoBlock data={data} />

// Factory function:
const blockComponents = { text: TextBlock, image: ImageBlock, video: VideoBlock }
const BlockFactory = ({ type, data }) => {
  const Component = blockComponents[type]
  return Component ? <Component data={data} /> : null
}
```

**Use when:** rendering varies by data type, API-driven UI, CMS block systems, dynamic forms.

---

### Singleton
**Problem:** Ensuring a single shared instance of a resource (API client, WebSocket connection, global store).

**Frontend use:**
```ts
// ES module export is a natural Singleton — evaluated once, shared everywhere
export const apiClient = new ApiClient({ baseURL: process.env.API_URL })
export const wsConnection = new WebSocketManager()
```

**Use when:** shared global resources that must be initialized once.
**Warning:** Singletons are hard to test. For testing, inject via props/context instead of importing directly.

---

### Builder
**Problem:** Constructing complex objects step-by-step before committing to the final output.

**Frontend use:**
```ts
// Building a complex GraphQL query or chart config incrementally
const query = new QueryBuilder()
  .select(['id', 'name', 'avatar'])
  .where({ status: 'active' })
  .orderBy('createdAt', 'desc')
  .limit(20)
  .build()
```

**Use when:** object construction has many optional steps, deeply nested GraphQL queries, complex chart/table configurations assembled from user input.

---

## Structural Patterns

### Adapter
**Problem:** Translating between two incompatible interfaces — typically an external API response and your internal data model.

**Frontend use:**
```ts
// External API returns snake_case, your components expect camelCase
function adaptUser(apiResponse: ApiUser): User {
  return {
    id: apiResponse.user_id,
    displayName: apiResponse.display_name,
    avatarUrl: apiResponse.avatar_url,
  }
}
```

**Use when:** external data format ≠ internal component format. API response shape changes don't cascade into components — only the adapter changes.

---

### Composite
**Problem:** Treating individual items and groups of items uniformly so they can be nested arbitrarily.

**Frontend use:** The foundation of React's component model. `<Button>` and `<Form>` are both "components" to their parent. Recursive tree structures (file explorers, nested menus, comment threads) use this pattern directly.

```tsx
// Both leaf and composite implement the same interface
const MenuItem = ({ item }) => item.children
  ? <MenuGroup items={item.children} />
  : <MenuLeaf label={item.label} />
```

**Use when:** building tree structures, nested UIs, or any hierarchy where parent and child have the same conceptual type.

---

### Decorator
**Problem:** Adding behavior to an existing component or function without modifying it — cross-cutting concerns like logging, telemetry, access control, or memoization.

**Frontend use:**
```tsx
// HOC as Decorator — adds auth check without touching the wrapped component
function withAuth<P>(Component: React.ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Redirect to="/login" />
    return <Component {...props} />
  }
}
```

**2026 note:** Custom hooks have replaced HOCs for most logic extraction. Prefer hooks over HOCs unless the decoration must happen at the JSX tree level (auth guards, error boundaries, portals).

**Use when:** adding behavior that's orthogonal to the component's core responsibility — analytics, error handling, feature flags, access control.

---

### Facade
**Problem:** Complex browser APIs or third-party libraries have verbose, inconsistent interfaces. Hide them behind a clean, domain-specific abstraction.

**Frontend use:**
```ts
// Wrap the verbose IntersectionObserver API into a clean hook
function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<Element>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [options])
  return { ref, isIntersecting }
}
```

**Other examples:** `useGeolocation()` over `navigator.geolocation`, `useLocalStorage()` over `localStorage`, a typed API client over raw `fetch`.

**Use when:** the raw API is verbose, the same setup/teardown is repeated in many places, or you want to swap the underlying implementation later.

---

### Proxy
**Problem:** Controlling or intercepting access to another object — for lazy loading, caching, access control, or logging.

**Frontend use:**
- **Lazy-loaded components:** `React.lazy()` is a Proxy — it intercepts component rendering and defers loading until needed
- **API interceptors:** Axios/fetch interceptors intercept requests before they reach the network (add auth headers, log, handle 401s)
- **Test doubles:** mock service workers intercept actual HTTP calls
- **JavaScript Proxy for reactive objects:** Vue 3's reactivity system uses `Proxy` to intercept property access

**Use when:** you need to intercept access to something (requests, component renders, object properties) without the caller knowing.
