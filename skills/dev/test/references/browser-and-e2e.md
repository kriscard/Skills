> **Read this when:** testing rendered browser behavior, component interaction, navigation, or an end-to-end user flow.

# Browser and end-to-end testing

Choose browser scope from the behavior, then use the repository's installed runner and conventions.

## Choose the browser boundary

| Boundary | Use when |
|---|---|
| Component in a real browser | The contract depends on DOM semantics, focus, layout, browser APIs, or component interaction without full application wiring |
| Browser integration | Several frontend modules, routing, data loading, or storage must collaborate in one application runtime |
| End to end | The requirement depends on deployed wiring across frontend, backend, authentication, persistence, or external infrastructure |

A simulated DOM is sufficient only when it preserves the semantics being claimed. Use a real browser for focus, selection, clipboard, observers, navigation, layout, rendering, or other browser behavior that the simulation does not faithfully implement.

Completion: the selected environment can reproduce every browser semantic named by the requirement.

## Exercise the user contract

Drive the flow through semantic roles, accessible names, labels, visible text, or stable product identifiers. Assert what the user or assistive technology observes:

- semantic content and control state;
- focus movement and keyboard behavior;
- navigation and URL state;
- loading, empty, success, validation, failure, retry, offline, and stale states where applicable;
- persisted or server-visible outcomes;
- authorization independent of UI visibility.

Treat CSS structure, generated class names, DOM depth, timing guesses, and incidental request counts as implementation details unless the accepted contract names them.

Completion: selectors and assertions survive a visual or structural refactor that preserves the user experience.

## Synchronize on evidence

Wait for observable readiness: a response, element state, navigation, event, or persisted outcome. Use the runner's retrying assertions and locators. Fixed sleeps are evidence only when elapsed time is itself the behavior under test.

Keep data unique and clean it through the repository's established API, fixture, database, or environment reset. Capture console errors, network failures, traces, screenshots, or video when they help diagnose a failed requirement.

Completion: the test has deterministic readiness, isolated data, and diagnostic evidence for failure.

## Bound end-to-end scope

Use end-to-end coverage for behavior that lower boundaries cannot prove. Keep branching edge cases at cheaper credible boundaries while preserving at least one real path through critical wiring.

Stub an external provider only when it lies outside the declared scope; preserve its relevant protocol and failure behavior. Record what the stub leaves unverified.

For browser-visible work, invoke an installed browser or frontend specialist skill when available for runner-specific interaction and accessibility guidance. Keep version-specific configuration in that specialist or current official documentation rather than this reference.

Completion: the browser test proves a named requirement, and its untested external assumptions are explicit.
