> **Read this when:** working with `useEffect`, subscriptions, timers, browser or
> network synchronization, stale closures, race conditions, effect loops, or derived
> state implemented through Effects.

# Effects as Synchronization

An Effect synchronizes React with a system outside React. If no external system exists,
keep the work in render, an event, a reducer, or the owning data layer.

## Classify before writing an Effect

### Derivation

Values determined by current props or state belong in render. Use memoization only when
the computation is measured or demonstrably expensive.

### Interaction

Logic caused by a click, submit, or other user event belongs in that event path. Moving it
through state into an Effect loses causality and often runs more than intended.

### Subscription

External stores, media queries, browser events, observers, sockets, and timers require a
subscription contract: subscribe, emit current state when required, and clean up the
exact resource created by the Effect. Prefer a purpose-built hook or
`useSyncExternalStore` when it models the source.

### Async synchronization

When an Effect starts asynchronous work, stale results must not overwrite newer intent.
Use the installed data layer when it owns caching and cancellation. Otherwise use an
abort signal or an ignore mechanism tied to cleanup.

## Dependencies

Dependencies describe every reactive value read by the Effect. Change the design rather
than hiding a dependency:

- move interaction logic to the event;
- derive during render;
- depend on stable primitives rather than a freshly assembled object;
- use a reducer when transitions belong together;
- use the version-supported Effect Event API when non-reactive logic must observe the
  latest values without retriggering synchronization.

## Lifecycle pressure

Strict Mode development replays expose Effects that are not reversible. The setup and
cleanup pair should be safe to run repeatedly. Initialization that must occur once per
application belongs in an application boundary or idempotent module-level mechanism,
not a component Effect guarded by a ref.

Use `useLayoutEffect` only when a DOM measurement or mutation must happen before paint.
Prefer ordinary Effects for work that can happen after paint.

## Review questions

- What external system is synchronized?
- What starts and stops the synchronization?
- Can stale work win a race?
- Is every reactive read represented by the design?
- Does cleanup reverse the setup?
- Would render or the triggering event express the behavior more directly?

## Completion criterion

Effect work is complete when every remaining Effect names an external system, setup and
cleanup are symmetrical, dependencies reflect the synchronization contract, and races
or stale closures cannot produce obsolete UI.
