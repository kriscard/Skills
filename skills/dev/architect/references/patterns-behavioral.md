> **Read this when:** user needs to manage communication between objects, handle events and state changes, encapsulate varying algorithms, or design how components/modules interact.

# Behavioral Patterns (Frontend 2026)

Behavioral patterns define how objects communicate and assign responsibilities. In frontend, these patterns are the architecture behind reactivity, state management, form validation, and multi-step UI flows.

---

## Decision Rule (Read First)

| If you need to... | Pattern |
|---|---|
| Many components react to the same state change | **Observer** |
| Multiple components share state without knowing each other | **Mediator** |
| Swap algorithms based on configuration, not type | **Strategy** |
| Component behaves differently based on explicit internal states | **State** |
| Record, queue, or undo operations | **Command** |
| Traverse a custom data structure | **Iterator** |

---

## Observer (Pub/Sub)
**Problem:** Multiple consumers need to react when something changes, but they shouldn't be tightly coupled to the source.

**Frontend use:** The backbone of frontend reactivity.
```ts
// Zustand as Observer — components subscribe to slices of the store
const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

// Component A and Component B both "subscribe" — neither knows about the other
const Header = () => { const user = useUserStore(s => s.user); ... }
const Sidebar = () => { const user = useUserStore(s => s.user); ... }
```

Other examples: `EventEmitter`, `addEventListener`, React Context consumers, RxJS Observables, WebSocket message handlers.

**Use when:** one event must notify multiple independent consumers. Also the pattern behind: React's re-render system, Redux subscriptions, browser events.

**Warning:** circular subscriptions (A subscribes to B subscribes to A) cause infinite update loops. Keep subscription graphs acyclic.

---

## Mediator
**Problem:** Many components need to communicate, but direct connections between them create a web of dependencies that's hard to maintain.

**Frontend use:** Redux, Zustand, and MobX **are** the Mediator pattern. Components don't talk to each other directly — they all talk to the store.
```ts
// Without Mediator: CartSummary and Checkout are tightly coupled
CartSummary.updateTotal() → Checkout.recalculate()

// With Mediator (Zustand store):
// CartSummary dispatches to store → Checkout reads from store
// Neither component knows the other exists
```

Other examples: an event bus, a message broker, a Redux dispatcher.

**Use when:** more than 3 components need shared state; direct component-to-component communication is getting messy.

**Warning:** the Mediator can become a "God Object" — a store that knows everything and does everything. Keep stores focused. Split when a store has unrelated concerns.

---

## Strategy
**Problem:** An operation varies by configuration or context, and you want to swap the implementation without changing the caller.

**Frontend use:**
```ts
// Form validation as Strategy — inject different validators per field
const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  required: (value: string) => value.trim().length > 0,
  minLength: (min: number) => (value: string) => value.length >= min,
}

function useField(name: string, strategy: (v: string) => boolean) {
  const [value, setValue] = useState('')
  const isValid = strategy(value)
  return { value, setValue, isValid }
}
```

Other examples: sort algorithms injected into a table component, different animation strategies, theme-specific render logic, payment processor selection.

**Use when:** behavior varies by configuration, not by type. If behavior varies by *type*, consider polymorphism or a Factory instead.

---

## State
**Problem:** A component or workflow has multiple distinct states with explicit transitions between them. Boolean flags multiply: `isLoading`, `isError`, `isSuccess`, `isEmpty` — they can combine into impossible states.

**Frontend use:**
```ts
// useReducer as State pattern — explicit states prevent impossible combinations
type Status = 'idle' | 'loading' | 'success' | 'error'

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case 'FETCH': return 'loading'
    case 'SUCCESS': return 'success'
    case 'ERROR': return 'error'
    case 'RESET': return 'idle'
  }
}

// For complex multi-step flows with guards/side effects: XState
const checkoutMachine = createMachine({
  initial: 'cart',
  states: {
    cart: { on: { CHECKOUT: 'payment' } },
    payment: { on: { CONFIRM: 'processing', BACK: 'cart' } },
    processing: { on: { SUCCESS: 'confirmed', FAILURE: 'payment' } },
    confirmed: { type: 'final' },
  }
})
```

**Use when:**
- More than 3 states with transitions between them → `useReducer`
- Multi-step flows (onboarding, checkout, upload) with guards and side effects → XState or similar
- `useState` with booleans is producing impossible combinations (e.g., `isLoading: true` + `isSuccess: true` simultaneously)

---

## Command
**Problem:** Encapsulate an operation as an object so it can be queued, logged, undone, or replayed.

**Frontend use:**
```ts
// Redux actions are Commands
dispatch({ type: 'ADD_TO_CART', payload: { productId: '123', quantity: 1 } })

// Undo/redo — commands are stored in a history stack
type Command = { execute: () => void; undo: () => void }
const history: Command[] = []

function execute(cmd: Command) {
  cmd.execute()
  history.push(cmd)
}

function undo() {
  history.pop()?.undo()
}
```

Other examples: form submission queues, optimistic update rollbacks, audit trails, offline action queues that sync when reconnected.

**Use when:** you need to record what happened (audit, undo), queue operations (offline sync), or replay actions. Overkill for simple one-shot user actions.

---

## Iterator
**Problem:** Traverse a data structure without exposing its internal implementation to the consumer.

**Frontend use:** Already built into JavaScript via `Symbol.iterator` and `for...of`. The pattern surfaces when designing custom traversable structures.

```ts
// Array.map/filter/reduce — built-in iterators
const activeUsers = users
  .filter(u => u.status === 'active')
  .map(u => ({ id: u.id, name: u.displayName }))

// Custom iterator for a virtual scroll — expose a "window" of items without loading all
class VirtualList<T> {
  [Symbol.iterator]() {
    let index = this.startIndex
    return {
      next: () => index < this.endIndex
        ? { value: this.items[index++], done: false }
        : { done: true }
    }
  }
}
```

**Use when:** designing custom data structures (trees, virtual lists, paginated collections) where you want consumers to traverse without knowing the structure. For standard arrays, use built-in methods — no need to implement Iterator manually.
