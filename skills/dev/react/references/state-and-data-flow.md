> **Read this when:** deciding where React state belongs, whether to lift it,
> introduce Context or a store, separate server cache, or coordinate URL, form, and
> application state.

# React State and Data Flow

Classify state before choosing a tool. Different state categories have different owners,
lifetimes, and synchronization rules.

## State categories

### Component state

Ephemeral interaction owned by one subtree. Keep it at the closest component that needs
to coordinate all consumers. Lift to the nearest common owner only when siblings share
the transition.

### Application state

Cross-tree client state such as theme, active workspace, notifications, or a global
interaction. Use Context for low-velocity values. For medium or high-frequency updates,
prefer an installed selector-based store or split contexts so unrelated consumers do not
rerender.

### Server cache

Remote data is a borrowed snapshot, not ordinary application state. Use the project's
established server-cache or framework data layer for deduplication, freshness,
cancellation, invalidation, and optimistic coordination. Avoid copying the same remote
record into a separate global store without a demonstrated ownership need.

### Form state

Keep draft values, validation, submission, and dirty state with the form system. Use the
project's established form library when present. Route detailed React Hook Form work to
`react-hook-form` or `react-hook-form-audit`.

### URL state

Use the URL for shareable, navigable state such as filters, search, tabs, sorting, or
pagination when browser history and deep links are part of the product contract.

## Provider threshold

Introduce a provider when descendants need coordinated access across composition
boundaries and props no longer express ownership clearly. A compound component family
may expose `state`, `actions`, and `meta`, while the provider hides the implementation.

Keep providers narrow. Place them near the subtree they coordinate, split high-velocity
state from stable actions or metadata when useful, and guard consumption outside the
provider.

## Derived and mirrored state

Derive values during render when they are fully determined by current props or state.
Store a value separately only when it has independent identity, lifecycle, or user edits.
Synchronize two owners only when an external contract requires it; document conflict and
reset behavior.

## Decision sequence

1. Name the state category.
2. Name the smallest owner covering every consumer.
3. Identify persistence, navigation, freshness, and frequency requirements.
4. Reuse the installed state system that owns those requirements.
5. Introduce a new provider or store only when the current owner cannot express the
   coordination without leakage.

## Completion criterion

State design is complete when each value has one authoritative owner, server cache is not
conflated with application state, derived values are computed rather than mirrored, and
the chosen tool matches update frequency and lifetime.
