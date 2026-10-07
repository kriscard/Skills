> **Read this when:** designing Suspense boundaries, transitions, optimistic state,
> pending UI, error recovery, parallel async dependencies, or component-level loading
> behavior in React.

# React Async UI and Suspense

Design waiting as part of the ownership tree. React primitives coordinate rendering;
the framework decides route loading, server caching, and transport mechanics.

## Remove structural waterfalls

Start independent work together and await it where its result is required. When one
operation depends on another, preserve the dependency but avoid delaying unrelated work.
Restructure component ownership when parent fetching unnecessarily blocks independent
children.

A waterfall finding needs a dependency graph or trace—not merely two `await` keywords.

## Suspense ownership

Place a boundary where the product can replace one region while preserving meaningful,
stable context. Keep headings, controls, and layout shells visible when only the body
waits. Coordinate sibling boundaries according to the intended reveal order.

A boundary fallback should approximate the final geometry when layout movement matters.
Avoid blank full-page fallbacks when useful stable UI can render immediately.

Suspense activates only for supported suspending sources, such as lazy code, `use`, or a
framework-integrated data source. It does not detect data fetched inside an Effect or
event handler. Keep those loading states in the owning data or interaction path.

## Transitions and deferred values

Use a transition when an update may suspend or perform expensive non-urgent rendering
while urgent input should remain responsive. Use a deferred value when consumers may lag
behind a rapidly changing value. Preserve visible previous content when that better
communicates continuity than replacing it with a fallback.

## Optimistic and pending behavior

Use optimistic state when success is likely, the rollback is understandable, and the
interaction benefits from immediate feedback. Keep the reducer or action with the owner
of the interaction. Pending state should prevent duplicate work without erasing user
context.

Use one feedback mechanism for one operation. Inline status, optimistic UI, a pending
control, and a toast should not all announce the same event unless they serve distinct
purposes.

## Errors and recovery

Place an error boundary around rendering or suspension work that can fail and recover
independently. Error boundaries do not catch ordinary event-handler failures or arbitrary
asynchronous callbacks; keep request and mutation failures in the owning action or data
state. Keep input or draft state when a recoverable action rejects it. Define retry,
reset, and navigation behavior rather than stopping at an error message.

## Completion criterion

Async UI is complete when independent work is not serialized accidentally, each waiting
region has an owner, urgent interaction remains responsive, pending and optimistic
feedback do not conflict, and failure has a tested recovery path.
