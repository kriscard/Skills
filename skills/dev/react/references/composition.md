> **Read this when:** assigning page, section, container, composer, or leaf roles;
> designing component APIs; reducing pass-through wrappers or boolean-prop growth; or
> choosing props, Context, slots, render callbacks, and provider-backed composition.

# React Composition

Start top-down and simple. Composition divides responsibilities; it does not require a
container/presentational split or a file for every role. Props are a component's public
API: expose stable choices and hide volatile implementation.

For small BAD/GOOD examples covering data-owning sections, optional multi-query
coordination, narrow Context, injected boundary clients, and a component that should
remain simple, read [`composition-examples.md`](composition-examples.md).

## Assign roles by responsibility

Use these names as reasoning roles, not mandatory filenames:

- **Page:** arranges product sections. It may load or branch for responsibilities the
  page itself owns.
- **Section:** owns an independently meaningful region, including its data, decisions,
  pending/error/recovery behavior, and feedback.
- **Container:** optionally coordinates several queries, a shared draft, one submit
  flow, or a synchronized snapshot when the backend contract actually provides one.
- **Composer:** arranges already-owned props and may call plain business functions to
  choose what to show.
- **Leaf:** displays props or children and emits user intent.

Independent sections should be able to load, fail, and recover independently. When work
is transactional or one result depends on another, give the flow one common owner rather
than manufacturing independence. Remove wrappers that only forward props or JSX; keep a
layer when it owns coordination, decisions, feedback, semantics, or a stable interface.

## Separate React from plain decisions

Hooks own React state, lifecycle, subscriptions, or integration with an installed data
library such as SWR or Query. A feature-focused UI-state hook used by a provider is a
valid owner.

A calculation that depends only on current facts remains a plain function. Pass it the
minimum facts it needs, including values such as the current date or translated
messages. Do not add a hook, `useMemo`, or provider merely to call it. Use
[`state-and-data-flow.md`](state-and-data-flow.md) for state categories,
[`async-and-suspense.md`](async-and-suspense.md) for waiting ownership, and
[`re-renders.md`](re-renders.md) for measured performance decisions.

Data hooks and sections may call boundary integration, but response validation and
mapping belong to the frontend trust boundary. Keep eligibility or pricing policy and
screen formatting outside transport mapping. Route file placement and runtime schemas
to the `frontend` skill.

## Extraction pressure

Extract a component when at least one is true:

- it owns a distinct responsibility or state transition;
- multiple callers reuse it;
- callers need different compositions of the same primitives;
- its behavior needs an independent test or semantic boundary;
- the parent has become difficult to understand because changes have unrelated causes.

Keep a small single-use component intact when extraction would only move JSX, add a
pass-through layer, or create a configuration API for hypothetical reuse.

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

## Narrow Context and providers

Use Context for non-server UI coordination across a real subtree boundary: selection,
expanded state, a shared draft, actions, or imperative metadata. Prefer local state, the
nearest common parent, and children first. Context is not a second server cache and does
not need to carry pure functions that callers can import directly.

Sibling features coordinate through explicit interfaces or a common owner. A nested
feature may consume a parent context when the hierarchy is intentional and the required
provider is explicit. Actions and callbacks are valid context values. A provider may
read server data when it legitimately coordinates that data with subtree UI; avoid
copying the same remote record into redundant state.

Compound components are justified when multiple callers compose the same primitives
differently or descendants need shared behavior across composition boundaries. Guard
consumption outside the provider and let subcomponents consume only what they need.

For coordinated families, a stable contract may separate concerns:

```typescript
interface ComponentContext<State, Actions, Meta> {
  state: State;
  actions: Actions;
  meta: Meta;
}
```

The provider can hide whether UI state comes from a local hook, reducer, or installed
store. This is a response to demonstrated coordination pressure, not a default wrapper.

## Stable dependency test

A good component API depends on concepts likely to remain stable while hiding details
likely to change. Before approving an abstraction, ask:

- Can internal logic change without changing callers?
- Can a new real variant compose existing primitives without another mode flag?
- Does each public prop represent a user or product concept?
- Is misuse constrained by types, provider guards, and semantics?
- Is the abstraction easier to understand than the concrete callers it replaces?

## Completion criterion

Composition work is complete when each role owns real behavior, independent sections
can recover independently, coordinated flows have one common owner, plain decisions stay
plain, state has one owner, unsupported states are constrained, semantic behavior is
preserved, and the simplest caller remains simple.
