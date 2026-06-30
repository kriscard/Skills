> **Read this when:** the user mentions re-renders, "why does this re-render",
> `useMemo`, `useCallback`, `React.memo`, React Compiler, memoization, prop
> reference identity, or asks whether they need to memoize something.
>
> **Not the right file?** If the issue is a `useEffect` smell →
> `useeffect-antipatterns.md`. If the issue is SSR/CSR choice or hydration →
> `rendering-models.md`.

> **Priority: MEDIUM** — Re-render frequency rarely affects user-perceived
> performance as much as bundle size or data waterfalls. With React Compiler 1.0
> (GA Oct 2025), many re-render optimizations are automated. Measure with the
> React Profiler before adding `useMemo` / `useCallback` — premature memoization
> adds complexity without measurable benefit.
>

# Re-renders and Memoization

## React Compiler 1.0 (GA October 2025)

The React Compiler automatically memoizes components, hooks, and computed
values. With the Compiler enabled:

- Manual `useMemo` is usually unnecessary unless you have a measured performance
  issue or the value is in an effect dependency array where stability matters
- Manual `useCallback` is usually unnecessary unless you need a stable function
  identity for a non-React dependency (e.g., a WebSocket listener)
- Manual `React.memo` is usually unnecessary

**Check first:** is the React Compiler enabled in this project?

```bash
# Check for babel plugin
grep -r "babel-plugin-react-compiler\|react-compiler" package.json babel.config.*
# Check for Next.js experimental flag
grep -r "reactCompiler" next.config.*
```

If the Compiler is active, address the measured performance problem before
adding manual memoization — the Compiler may already handle it.

---

## Without Compiler — Memoization Decision Tree

Before wrapping anything in `useMemo`, `useCallback`, or `React.memo`, answer
both questions:

1. Does this component render **often**?
2. Is re-rendering it **expensive**?

If no to either, skip the memoization. The cost of memoization (memory
allocation, comparison overhead, code complexity) exceeds the cost of a cheap
re-render.

```
Re-render problem?
  ├─ Is the computation expensive? (>1ms measured in Profiler)
  │   ├─ Yes → useMemo for the computation
  │   └─ No  → skip, render is free
  ├─ Does a child component re-render unnecessarily?
  │   ├─ Does it receive a new object/function reference each render?
  │   │   ├─ Object → useMemo to stabilize
  │   │   └─ Function → useCallback to stabilize
  │   └─ Is the child wrapped in React.memo?
  │       ├─ No  → add React.memo, then check references
  │       └─ Yes → check whether props are actually stable
  └─ Is the whole tree too slow?
      → Use Profiler to find the actual bottleneck first
```

---

## useMemo — for expensive calculations

```typescript
// ❌ useMemo on a cheap calculation — overhead exceeds benefit
const double = useMemo(() => count * 2, [count]);

// ❌ useMemo to "prevent object recreation" — the real fix is React.memo
const style = useMemo(() => ({ color: 'red' }), []);

// ✅ useMemo for genuinely expensive computation
const sortedData = useMemo(() => {
  return largeArray
    .filter(item => item.active)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);
}, [largeArray]);
```

**What counts as expensive?** Time it with `console.time` or the Profiler.
If it's under ~1ms consistently, `useMemo` is overhead, not optimization.

---

## useCallback — for stable function references

```typescript
// ❌ useCallback on a function passed as onClick to a div — doesn't help
// because non-memoized divs don't care about reference stability
const handleClick = useCallback(() => doSomething(), []);

// ❌ useCallback on a function that's immediately recreated anyway
const fn = useCallback(() => compute(a, b), [a, b]);
// If `a` or `b` change every render, the callback identity still changes

// ✅ useCallback when passed to a React.memo'd child (prevents unnecessary re-render)
const handleSave = useCallback((id: string) => {
  updateItem(id, draft);
}, [draft]);
<MemoizedSaveButton onSave={handleSave} />

// ✅ useCallback when used as an effect dependency (prevents effect from re-running)
const fetchUser = useCallback(() => fetch(`/api/users/${id}`), [id]);
useEffect(() => {
  fetchUser().then(setUser);
}, [fetchUser]); // stable reference → effect runs only when id changes
```

---

## React.memo — skips re-render when props are shallowly equal

```typescript
// ✅ Memoize when: renders frequently AND the component is expensive
const UserCard = React.memo(function UserCard({ user, onSelect }: Props) {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  );
});

// ❌ React.memo fails when the parent passes new references each render
function Parent() {
  const user = { name: 'Alice' }; // New object every render
  const handleSelect = (id: string) => console.log(id); // New fn every render
  return <UserCard user={user} onSelect={handleSelect} />; // Re-renders anyway
}

// ✅ Fix: stable references from parent
function Parent() {
  const user = useMemo(() => ({ name: 'Alice' }), []);
  const handleSelect = useCallback((id: string) => console.log(id), []);
  return <UserCard user={user} onSelect={handleSelect} />; // Stays memoized
}
```

**React.memo with a custom comparison:**

```typescript
const UserCard = React.memo(
  function UserCard({ user }: { user: User }) { ... },
  (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
);
// Only re-renders when user.id changes — useful when user is a large object
// that gets recreated but only the id matters for rendering
```

---

## Profiler Workflow

Always profile before optimizing — intuition about what's slow is often wrong.

### React DevTools Profiler

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Click Record → perform the interaction that feels slow → Stop
4. Identify the bars: tall bars = slow components, wide bars = renders often
5. Click a component bar → see "Why did this render?"
   - "Props changed" → which prop? Is it a new reference or new value?
   - "Context changed" → which context? Is the value memoized?
   - "Hooks changed" → which hook? Is state changing when it shouldn't?

### Common findings and fixes

| Finding | Likely cause | Fix |
|---|---|---|
| `Props changed` → reference equality fails | Object/function prop recreated each render | `useMemo` / `useCallback` in parent |
| `Context changed` → all consumers re-render | Provider value not memoized | `useMemo` on provider value |
| Component renders on every parent render | Not wrapped in `React.memo` | Add `React.memo` |
| Long render duration | Expensive computation inside | `useMemo` or move work out of render |
| Too many renders in a row | Effect chain or state cascade | Consolidate state updates |

---

## Context Split Pattern

A common source of unnecessary re-renders is a context that mixes rapidly
changing data with stable API functions:

```typescript
// ❌ Every consumer re-renders when ANY value changes (including functions
//    that are recreated because they close over `user`)
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, pw: string) => Promise<void>;
  logout: () => void;
}>(null!);

// ✅ Split into data context (changes often) and API context (never changes)
const AuthDataContext = createContext<User | null>(null);
const AuthAPIContext = createContext<{
  login: (email: string, pw: string) => Promise<void>;
  logout: () => void;
}>(null!);

// AuthAPIContext value — defined once outside of any component render cycle
const authAPI = {
  login: async (email: string, pw: string) => { ... },
  logout: () => { ... },
};

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthAPIContext.Provider value={authAPI}> {/* never triggers re-renders */}
      <AuthDataContext.Provider value={user}>
        {children}
      </AuthDataContext.Provider>
    </AuthAPIContext.Provider>
  );
}
```

Components that only need `login`/`logout` now never re-render on user changes.

---

## Further Reading

- [React docs — Skipping expensive recalculations with useMemo](https://react.dev/reference/react/useMemo)
- [React Compiler docs](https://react.dev/learn/react-compiler)
- [Nadia Makarevich — How to use React.memo](https://www.developerway.com/posts/how-to-use-react-memo)
- [TkDodo — useState vs useReducer](https://tkdodo.eu/blog/use-state-vs-use-reducer)
