> **Read this when:** changes affect browser UI or its backing API, authorization, server rendering, cache, or persistence path.

# Frontend and full-stack risk checks

These are candidate generators, not automatic violations. Follow the core's evidence gate and
specialist routes. Detect installed framework/library versions before applying mechanics. Trace a
representative user task across browser → route/action/API → service → database/cache and back;
inspect real consumers and failure paths, not independent generic frontend/backend checklists.

## Trust and data ownership

- Name actor, protected asset, attacker-controlled inputs, and authoritative enforcement point.
  Trace URL/search params, form bodies, storage, cookies, headers, uploads, and messages through
  runtime validation. Types/client validation do not authorize a server write.
- Recheck authentication and object/tenant/field-level authorization on every reachable read/write
  entry point. A hidden button, route layout, middleware redirect, or unguessable identifier is not
  proof that a callable endpoint/action is protected. Test another user's/tenant's identifiers where
  authorized. Inspect impersonation/admin cases, session expiry, logout, and privilege changes.
- Parameterize queries; check context-appropriate encoding/sanitization at HTML/DOM/SQL/template/shell
  sinks. React text escaping does not sanitize explicit HTML, scriptable URLs, markdown plugins,
  third-party widgets, redirects, or cross-window messages. Inspect source → transformation → sink,
  including sanitizer configuration and bypasses. Separate exploit paths from defense-in-depth advice.
- Inspect server-only imports, public environment variables, logs/errors, serialized props, action
  return values, DTOs, and RSC payloads for secrets or excessive sensitive fields. Client boundaries
  must receive only intended data. For Next.js, inspect callable Server Actions like public HTTP
  entry points; match the installed version's action/security behavior rather than assuming a UI
  import is required to call one.
- Trace cookie attributes, CSRF/origin defenses, CORS, CSP/nonces, auth storage, and third-party script
  access where affected. Configuration evidence is not deployed-header observation. Cross-tab logout
  and cache clearing must agree with the session model; avoid exposing credentials in URLs or storage.

## Mutations, cache, and persistence

Trace a concrete update through validation, authorization, transaction, retry/idempotency, response,
cache invalidation, and displayed state. Check:

- Duplicate clicks, retries, concurrent tabs, out-of-order responses, and navigation during a request.
  A disabled button is useful feedback, not server-side deduplication for consequential operations.
- Lost updates, optimistic rollback on rejection, stale success overwriting a later error, and
  mutation success followed by failed refresh. Preserve input and make partial failure recoverable.
- Query keys/cache tags partitioning by user/tenant/filter and matching all affected reads. Shared
  personalized caches must use trusted identity and correct lifetime. Trace read-after-write across
  server and client caches, pagination and aggregates, not only the current detail view.
- Request cancellation, subscription/timer cleanup, stale closure/race protection, and effects
  replay/remount behavior. Distinguish canceling a wait from undoing a server-side side effect.
- Nullable/empty/long/unexpected API values, timezone/date/currency conversion, pagination boundaries,
  and API/schema compatibility with existing clients. Validate migration/deploy order when old and
  new code coexist; inspect constraints and indexes on the actual query path.

## React rendering and composition

- Trace state owners and consumers. Mirrored props/derived state, broad contexts, effect chains,
  boolean-mode APIs, and pass-through wrappers are prompts to compare a simpler contract, not
  automatic defects. Show caller burden or reachable stale state before reporting a finding.
- Check render purity, stable identity/keys across reordering, immutable props/state, hook ordering,
  effect dependencies/cleanup, and subscription lifecycles against installed React behavior.
  Effects synchronize external systems; deriving values or handling a user action usually belongs
  in render/events. Preserve genuine synchronization rather than deleting every effect.
- Follow server/client boundaries, serialization and hydration, nondeterministic time/random/browser
  reads, error recovery, and Suspense/pending placement. A missing loading boundary can block a whole
  task; a skeleton alone does not prove intended streaming order or layout stability.
- Judge architecture by responsibility and real variability. Compare a simpler concrete composition
  that removes coordination/knowledge while preserving policy and platform boundaries. Avoid making
  one specialist's preferred folder/page style a universal framework requirement.

## Semantics, keyboard, and assistive access

Trace the task with keyboard and meaningful semantics, using native controls/installed primitives
where appropriate. Inspect:

- Links versus actions, button types, programmatic labels, accessible names, descriptions, error
  associations, grouping, headings/landmarks, alternative text, and announced async status.
- Focus order/visibility, obscuring sticky layers, initial and return focus for overlays, modal
  background interaction, Escape/arrow behavior appropriate to the widget, and focus after deletion
  or route transitions. A `role` alone does not implement keyboard behavior.
- Zoom/reflow, narrow widths, text expansion/localization, long content, contrast, and using more
  than color/hover to convey essential state. Check measured criteria with the relevant WCAG level
  and exceptions; do not convert a screenshot into an accessibility-conformance claim.
- WCAG 2.2 considerations such as focus not obscured, non-drag alternatives, target size/spacing
  exceptions, redundant entry, and accessible authentication. Preserve paste/password-manager paths;
  inspect the actual applicable success criterion before calling it a standards violation.
- Motion, reduced-motion behavior, gesture alternatives, and input mode differences. Match actual
  platform/product requirements; avoid claiming every animation violates WCAG.

## Forms, resilience, and interaction

- Inspect validation timing, native defaults, autocomplete/name/type/inputmode contracts, conditional
  fields' retention/submission policy, server errors, dirty state, and accidental submits.
- Exercise loading, empty, error, disabled, pending, success, offline/timeout, unauthorized, and retry
  states that the task can reach. Keep values and focus through failure; make errors actionable.
- Prevent meaningful accidental data loss through proportional confirmation/undo or unsaved-work
  protection. Avoid blocking routine navigation without evidence of loss risk.
- Check mobile touch/virtual keyboard, viewport changes, scroll containers, stacking/portals,
  responsive navigation, and browser API availability on the supported platforms. Static CSS
  inspection cannot establish a real device flow.

## Performance and proof

Look for demonstrated waterfalls, N+1 queries, repeated I/O, unbounded DOM/data work, expensive
per-keystroke rendering, layout read/write thrashing, oversized client boundaries, unnecessary
network/image/font work, and missing reserved media dimensions on the changed task. State realistic
input size and mechanism; use profiling/traces when claiming latency or a measured improvement.
Memoization, virtualization, preloading, and URL-state rewrites are corrections only when their
mechanism addresses the evidenced cost or correctness problem.

Choose the observation boundary that can fail when the claimed behavior breaks:

| Claim | Useful evidence | Insufficient substitute |
| --- | --- | --- |
| Server rejects another tenant's object | Real handler/service authorization path with controlled identities | Hidden UI or mocked auth guard |
| Mutation persists and refreshes correctly | Integration through persistence plus user flow when cache/navigation matters | Mock success toast alone |
| Keyboard/dialog workflow works | Authorized browser interaction, focus/semantic observations | Screenshot or JSX roles alone |
| Loading order/layout remains usable | Throttled/controlled real flow and relevant visibility/layout assertions | Test that only waits for final content |
| Structural simplification reduces burden | Real callers no longer coordinate leaked policy/order/state | Fewer lines or renamed helper |

Use `test` for boundary selection and `playwright` for Playwright suite mechanics when available
and model-invocable. Prefer user-visible behavior, isolated state, role/label locators, and retrying
assertions over sleeps or implementation selectors. Doubles belong outside the claimed observation
boundary; mocked providers can prove UI response but not the real provider integration. Use
`agent-browser` for authorized one-off observation. Review-only may report missing runtime evidence
without starting a service or modifying tests.

Completion: each reported frontend/full-stack finding identifies the actor, interaction/data path,
platform or assistive context where relevant, concrete consequence, smallest safe correction,
static/observed proof level, and any unobserved boundary. Typography taste, arbitrary count limits,
copy voice, and generic pattern substitutions remain optional unless governing rules or concrete
impact makes them applicable.
