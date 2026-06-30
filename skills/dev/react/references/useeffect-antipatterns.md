> **Read this when:** the user mentions `useEffect`, "should I use useEffect
> for...", side effects, stale closures, double renders in dev mode,
> `useLayoutEffect`, flickering after a measurement, or data fetching that
> smells off.
>
> **Not the right file?** If the issue is *why this re-renders too often* →
> `re-renders.md`. If it's *slow initial load or bundle* → open the
> `frontend` skill's `references/nextjs.md`.

> **Priority: HIGH** — Effect bugs (race conditions, stale closures, infinite
> loops) are hard to reproduce and often ship to production. An effect that
> fetches without cleanup creates a race condition on every unmount. An effect
> that syncs state is derived-state in disguise. Apply before MEDIUM re-render
> optimization — correctness before performance.
>

# useEffect Anti-Patterns

The single most useful question before writing a `useEffect`:

> **"Why does this code need to run?"**
> - Because the **component was displayed** → `useEffect` is probably right
> - Because the **user did something** → event handler
> - Because **it can be computed from props/state** → compute during render
> - Because **a calculation is expensive but stable** → `useMemo`
> - Because **you need to measure the DOM** → `useLayoutEffect` (not `useEffect`)

If the answer is not "the component was displayed," the Effect is likely the
wrong tool.

---

## When useEffect IS correct

Effects are for synchronizing React state with something outside React:
- Subscribing to DOM events, WebSocket connections, third-party libs
- Running analytics or auth init that must happen exactly once on mount
- Reading/writing external systems (not React state)

If you're only shuffling React state around, an Effect is wrong.

---

## 1. Derived state — compute during render instead

```typescript
// ❌ Two state variables + an Effect that syncs them = extra render + lag
const [filteredTodos, setFilteredTodos] = useState(todos);
useEffect(() => {
  setFilteredTodos(todos.filter(t => t.done === showDone));
}, [todos, showDone]);

// ✅ Compute during render — no Effect, no lag, one render
const filteredTodos = useMemo(
  () => todos.filter(t => t.done === showDone),
  [todos, showDone]
);
// Or skip useMemo if the computation is cheap:
const filteredTodos = todos.filter(t => t.done === showDone);
```

## 2. Resetting state on prop change — use `key` instead

```typescript
// ❌ Effect causes a stale render: component renders with old comment, then clears
useEffect(() => { setComment(''); }, [userId]);

// ✅ key tells React to mount a fresh instance — no stale flash
<ProfileForm userId={userId} key={userId} />
```

## 3. Adjusting partial state on prop change

```typescript
// ❌ Effect fires after render, causing a second render
useEffect(() => { setSelection(null); }, [items]);

// ✅ Adjust state during rendering (React handles it efficiently)
const [prevItems, setPrevItems] = useState(items);
if (items !== prevItems) {
  setPrevItems(items);
  setSelection(null); // React restarts rendering immediately
}

// ✅ Or derive it — no state at all
const selection = items.find(i => i.id === selectedId) ?? null;
```

## 4. POST requests — put in event handler

```typescript
// ❌ Effect fires whenever jsonToSubmit changes — hard to track intent
const [jsonToSubmit, setJsonToSubmit] = useState<FormData | null>(null);
useEffect(() => {
  if (jsonToSubmit) post('/api/register', jsonToSubmit);
}, [jsonToSubmit]);

// ✅ Post directly in the event handler — clear and explicit
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  await post('/api/register', { firstName, lastName });
}
```

## 5. Chains of computations

```typescript
// ❌ Each setState triggers the next Effect — 3 extra renders
useEffect(() => {
  if (card?.gold) setGoldCardCount(c => c + 1);
}, [card]);

useEffect(() => {
  if (goldCardCount > 3) setRound(r => r + 1);
}, [goldCardCount]);

useEffect(() => {
  if (isGameOver) setWinner(currentPlayer);
}, [isGameOver]);

// ✅ Compute all transitions inside a single event handler
function handlePlaceCard(nextCard: Card) {
  setCard(nextCard);
  const nextGoldCount = nextCard.gold ? goldCardCount + 1 : goldCardCount;
  const nextRound = nextGoldCount > 3 ? round + 1 : round;
  const nextIsGameOver = nextRound >= MAX_ROUNDS;

  setGoldCardCount(nextGoldCount > 3 ? 0 : nextGoldCount);
  if (nextRound !== round) setRound(nextRound);
  if (nextIsGameOver) setWinner(currentPlayer);
}
```

## 6. Sharing logic between event handlers

```typescript
// ❌ Effect fires every time `product` changes — even on initial render
useEffect(() => {
  if (product.isInCart) showNotification(`Added ${product.name}!`);
}, [product]);

// ✅ Share via a function called from each handler
function buyProduct() {
  addToCart(product);
  showNotification(`Added ${product.name}!`);
}
function checkoutNow() {
  addToCart(product);
  checkout();
  showNotification(`Added ${product.name}!`);
}
```

## 7. Notifying parent — update in the same handler

```typescript
// ❌ Extra render: setIsOn fires, then Effect fires onChange
useEffect(() => { onChange(isOn); }, [isOn, onChange]);

// ✅ Update both at once
function toggle() {
  const next = !isOn;
  setIsOn(next);
  onChange(next);
}
```

## 8. Fetching data — use TanStack Query or RSC

```typescript
// ❌ Race condition: response from stale query may overwrite fresh data
useEffect(() => {
  fetchResults(query, page).then(setResults);
}, [query, page]);

// ✅ Cleanup with ignore flag (minimum viable fix)
useEffect(() => {
  let ignore = false;
  fetchResults(query, page).then(json => {
    if (!ignore) setResults(json);
  });
  return () => { ignore = true; };
}, [query, page]);

// ✅ Best — TanStack Query handles cancellation, caching, and retries
const { data } = useQuery({
  queryKey: ['results', query, page],
  queryFn: () => fetchResults(query, page),
});
```

## 9. App initialization — module-level guard

```typescript
// ❌ Runs twice in dev StrictMode — both calls execute
useEffect(() => {
  loadDataFromLocalStorage();
  checkAuthToken();
}, []);

// ✅ Module-level guard — runs once per module load
let didInit = false;
useEffect(() => {
  if (!didInit) {
    didInit = true;
    loadDataFromLocalStorage();
    checkAuthToken();
  }
}, []);

// ✅ Or move outside the component if order doesn't matter
if (typeof window !== 'undefined') {
  checkAuthToken();
}
```

## 10. Subscribing to external stores — useSyncExternalStore

```typescript
// ❌ Manual subscription — easy to get the snapshot wrong
const [isOnline, setIsOnline] = useState(true);
useEffect(() => {
  const update = () => setIsOnline(navigator.onLine);
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  return () => {
    window.removeEventListener('online', update);
    window.removeEventListener('offline', update);
  };
}, []);

// ✅ useSyncExternalStore — designed for this exact pattern
function subscribe(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}
const isOnline = useSyncExternalStore(
  subscribe,
  () => navigator.onLine,   // client snapshot
  () => true                // server snapshot (SSR safe)
);
```

---

## Advanced: Callback refs — prefer over `useRef + useEffect` for DOM nodes

A callback ref is a function passed as the `ref` prop. It fires synchronously
when the DOM node appears or disappears — which is not the same as component mount.
With conditional rendering, `useRef + useEffect` fires on mount even if the node
is null; a callback ref fires exactly when the node actually exists.

```typescript
// ❌ useRef + useEffect — effect fires on mount, but node may be null
// with conditional rendering this silently does nothing
const ref = useRef<HTMLElement>(null);
useEffect(() => {
  if (ref.current) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }
}, []); // runs once on mount, not when the node appears

// ✅ Callback ref — fires when the node appears in the DOM, not on component mount
const scrollRef = useCallback((node: HTMLElement | null) => {
  if (node) {
    node.scrollIntoView({ behavior: 'smooth' });
  }
}, []); // stable reference — empty deps is correct here

return condition && <div ref={scrollRef}>This element when it appears</div>;
```

**Combining with state** (for measuring or passing nodes to third-party libraries):

```typescript
// useState setter is stable — safe to use directly as a callback ref
const [node, setNode] = useState<HTMLDivElement | null>(null);

// Attach the chart library only when the container div is in the DOM
useEffect(() => {
  if (!node) return;
  const chart = new ChartLibrary(node);
  return () => chart.destroy();
}, [node]); // re-runs whenever the node appears or disappears

return <div ref={setNode} className="chart-container" />;
```

Use callback refs when:
- Scrolling to or measuring a conditionally-rendered element
- Initializing a third-party library that requires a DOM node
- Knowing exactly when a node enters or leaves the DOM (not just when the component mounts)

---

## Advanced: useLayoutEffect for DOM measurements

Use `useLayoutEffect` — not `useEffect` — when you measure the DOM and
immediately update state based on the measurement. `useEffect` runs after the
browser paints, causing a visible flash. `useLayoutEffect` runs synchronously
before paint.

```typescript
// ❌ useEffect — paints first, then adjusts — visual flicker
useEffect(() => {
  const rect = ref.current?.getBoundingClientRect();
  if (rect && rect.width < 200) setIsCompact(true);
}, []);

// ✅ useLayoutEffect — adjusts before first paint, no flicker
useLayoutEffect(() => {
  const rect = ref.current?.getBoundingClientRect();
  if (rect && rect.width < 200) setIsCompact(true);
}, []);
```

**SSR warning:** `useLayoutEffect` triggers a server warning because there is no
DOM server-side. Use `useIsomorphicLayoutEffect`:

```typescript
import { useEffect, useLayoutEffect } from 'react';
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
```

---

## Advanced: Stale closure ref-trick

When a memoized child needs a callback with access to the latest parent state,
but you don't want the callback identity to change (which would break
memoization):

```typescript
function Parent() {
  const [count, setCount] = useState(0);

  // Ref holds the latest closure — updated synchronously before any paint
  const latestRef = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    latestRef.current = () => console.log('count is', count);
  });

  // Stable callback — identity never changes, HeavyChild stays memoized
  const stableCallback = useCallback(() => {
    latestRef.current();
  }, []); // empty dep array — never changes

  return <HeavyChild onClick={stableCallback} />;
}
```

With React Compiler (GA Oct 2025), this pattern is less frequently needed
because the compiler handles stable references automatically.

---

## Quick checklist

When you see a `useEffect`:
- [ ] Could this be computed during render?
- [ ] Is it derived state? (use a variable or `useMemo`)
- [ ] Is it triggered by a user event? (move to the event handler)
- [ ] Is it resetting state when a prop changes? (use `key`)
- [ ] Is it fetching data? (use TanStack Query or RSC)
- [ ] Is it subscribing to an external store? (use `useSyncExternalStore`)
- [ ] Is it measuring the DOM? (use `useLayoutEffect`)
- [ ] If it's truly display-triggered: is the dependency array complete?
- [ ] If it fetches: is there a cleanup flag for race conditions?

---

## Further Reading

- [React docs — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [TkDodo — Simplifying useEffect](https://tkdodo.eu/blog/simplifying-use-effect)
- [Nadia Makarevich — Fantastic Closures](https://www.developerway.com/posts/fantastic-closures)
- [Nadia Makarevich — No More Flickering UI](https://www.developerway.com/posts/no-more-flickering-ui)
