> **Read this when:** designing events, coordination, interchangeable behavior,
> explicit state transitions, queued operations, or traversal.

# Behavioral Patterns

Start with the interaction problem and demonstrated variation. A pattern names a
shape that may fit; it is not a requirement to introduce classes or framework
infrastructure.

## Routing

| Need | Candidate pattern |
|---|---|
| Multiple independent consumers react to one source | Observer |
| A coordinator prevents peers from knowing one another | Mediator |
| One operation has interchangeable implementations | Strategy |
| Behavior depends on explicit states and transitions | State |
| Operations need queueing, logging, undo, or replay | Command |
| Consumers traverse without knowing representation | Iterator |

## Observer

A source publishes change notifications to independent subscribers through a
stable subscription interface.

Use when subscriber count or identity varies and the source should not know each
consumer. Define ordering, error isolation, unsubscribe lifecycle, delivery
semantics, and re-entrancy. A direct callback is simpler when there is one stable
consumer.

```ts
type Listener<T> = (event: T) => void

function createSignal<T>() {
  const listeners = new Set<Listener<T>>()
  return {
    subscribe(listener: Listener<T>) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    publish(event: T) {
      for (const listener of listeners) listener(event)
    },
  }
}
```

## Mediator

A coordinator owns interactions among peers so they do not depend directly on
one another.

Use when coordination rules are real domain/application behavior. Keep the
mediator focused on coordination; move participant-specific rules back to their
owners. Shared storage alone does not make a mediator, and a mediator that owns
unrelated workflows becomes a new concentration of complexity.

## Strategy

A caller depends on one interface while configuration or context selects among
multiple demonstrated implementations.

```ts
type Price = (input: Cart) => Money

function checkout(cart: Cart, price: Price) {
  return createOrder(cart, price(cart))
}
```

Use when multiple implementations must vary independently of the caller. A
conditional is often clearer when there is one stable choice or the variants do
not share a coherent interface.

## State

Represent valid states and transitions explicitly when independent booleans can
create impossible combinations or transition rules carry business meaning.

```ts
type State =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "failed"; reason: string }
  | { type: "complete"; receiptId: string }
```

For each transition define trigger, guard, effect, failure, and recovery. A union
and reducer may be sufficient; specialized tooling is justified by hierarchy,
parallel states, visualization, or complex effects—not by state count alone.

## Command

Represent an operation as data or an object when the system must queue, log,
retry, undo, authorize, or replay it.

```ts
type Command = {
  execute(): Promise<void>
  compensate?(): Promise<void>
}
```

Define identity, idempotency, serialization, failure, and compensation when
commands cross process or time boundaries. A direct function call is clearer for
an immediate one-shot operation.

## Iterator

Expose traversal without exposing representation when a custom structure,
pagination model, or lazy sequence needs a stable consumer interface. Use the
language's ordinary iteration primitives for arrays and standard collections.

## Selection gate

Before recommending a pattern, name:

1. the observed interaction problem
2. the participants and ownership
3. the variation or lifecycle the pattern isolates
4. the simpler alternative and why it is insufficient
5. the new failure or debugging cost introduced
