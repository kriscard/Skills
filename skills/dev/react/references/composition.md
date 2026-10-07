> **Read this when:** designing component APIs, reducing boolean-prop growth,
> choosing children, slots, render callbacks, explicit variants, compound components,
> or provider-backed composition.

# React Composition

Start top-down and simple. Composition is the default way to divide UI, but advanced
composition is earned by real variation. Props are a component's public API: expose
stable choices and hide volatile implementation.

## Extraction pressure

Extract a component when at least one is true:

- it owns a distinct responsibility or state transition;
- multiple callers reuse it;
- callers need different compositions of the same primitives;
- its behavior needs an independent test or semantic boundary;
- the parent has become difficult to understand because changes have unrelated causes.

Keep a single-use orchestrator explicit when extraction would only move JSX or create a
configuration API for hypothetical reuse.

## Prefer explicit composition

A cluster of interacting boolean mode props creates combinations the component may not
support. Replace modes with one of:

- explicit variant components when each mode is a stable product concept;
- a discriminated union when one component owns a closed set of states;
- children or named slots when callers choose layout or content;
- compound components when multiple callers arrange shared-state primitives differently.

Ordinary independent booleans such as `disabled` or `required` are not mode
proliferation. Diagnose interaction between flags before changing the API.

## Children, slots, and render callbacks

Use `children` for one natural composition region. Use named element props for a small,
fixed set of semantic slots. Use a render callback when the parent must expose dynamic
state or behavior to caller-owned rendering. Avoid render callbacks that only return
static children.

## Compound components

Compound components are justified when at least one demonstrated pressure exists:

- multiple callers compose the same primitives differently;
- one component family needs flexible composition around shared behavior or state; or
- descendants coordinate across a tree where explicit props no longer express ownership
  clearly.

The provider is the coordination boundary. Subcomponents consume only the slice they
need. Account for discoverability, invalid use outside the provider, Context rerenders,
and accessibility behavior.

For coordinated families, expose a stable contract:

```typescript
interface ComponentContext<State, Actions, Meta> {
  state: State;
  actions: Actions;
  meta: Meta;
}
```

The provider is the only layer that knows whether state comes from local hooks, a
reducer, an external store, or another adapter. This pattern follows demonstrated
coordination pressure; it is not a default wrapper for every feature.

## State and implementation independence

Keep state at the nearest owner. Lift it when siblings or caller-owned controls need the
same transition. Decouple the UI from state implementation only when alternate providers,
tests, or reuse require that seam.

Children may communicate upward through intention-revealing callbacks. Expose actions
such as `onSubmit` or `onSelectionChange`, not raw setters that leak internal state
shape.

## Stable dependency test

A good component API depends on concepts likely to remain stable while hiding details
likely to change. Before approving an abstraction, ask:

- Can internal logic change without changing callers?
- Can a new real variant compose existing primitives without adding another mode flag?
- Does each public prop represent a user or product concept?
- Is misuse constrained by types, provider guards, and semantics?
- Is the abstraction easier to understand than the concrete callers it replaces?

## Completion criterion

Composition work is complete when the API is driven by observed callers, unsupported
states are constrained, state has one owner, the semantic and accessibility contract is
preserved, and the simplest caller remains simple.
