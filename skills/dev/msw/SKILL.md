---
name: msw
description: >-
  Version-aware Mock Service Worker (MSW) guidance. Use when the task is to
  configure MSW in Node or a browser, write or fix MSW HTTP or GraphQL handlers
  and responses, validate request contracts through MSW behavior, control
  worker/server lifecycle and unhandled requests,
  diagnose MSW interception or matching, apply passthrough or bypass behavior,
  isolate concurrent MSW handlers, or migrate between MSW major versions.
---

# Mock Service Worker

Treat MSW as the network boundary, not as the owner of the test runner, UI waiting strategy, or
client cache.

## Workflow

### 1. Detect the installed contract

Inspect manifests, lockfiles, package-manager output, imports, and `node_modules/msw/package.json`
when available. Record the exact MSW version, its `engines` and peer requirements, module system,
test runner, and whether interception runs in Node, a browser, or both.

Do not infer syntax from "MSW" alone. Classify the installed major before editing:

- v1 uses `rest`, `(req, res, ctx)`, and response composition;
- v2 uses Fetch API request/response primitives and `HttpResponse`, with most handlers and utilities
  exported from `msw`;
- v3 moves handlers and utilities to designated entrypoints, makes GraphQL link-first, and renames
  unhandled-request configuration.

**Complete when:** the exact package contract and every affected runtime are known.

### 2. Trace ownership

Identify the real outgoing request, method, resolved URL, body, headers, and GraphQL operation. Name
which layer owns each concern:

- MSW owns interception, matching, mocked network outcomes, request-contract simulation, and
  interception diagnostics;
- `test` owns behavioral scope and the observation boundary;
- the runner owns hooks, environments, timers, and concurrency syntax;
- the consuming data library owns retries, deduplication, cache lifetime, and cache isolation;
- the UI-testing library owns waiting for visible asynchronous outcomes.

**Complete when:** the request can be described independently of the client that sent it, and no
neighboring owner's configuration is being smuggled into the MSW change.

### 3. Load the relevant branch

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Adding or changing Node/browser setup, lifecycle hooks, worker script handling, unhandled-request policy, or concurrent-test isolation | `references/setup-and-lifecycle.md` |
| 1 — Required | Adding or changing HTTP handlers, matching, precedence, request parsing, `HttpResponse`, errors, streaming, passthrough, or bypass behavior | `references/http-handlers-and-responses.md` |
| 1 — Required | Adding or changing GraphQL operation matching, variables, errors, links, or batched queries | `references/graphql.md` |
| 1 — Required | Typing HTTP params/body/responses, GraphQL variables/results, or reusable handler/resolver factories | `references/typescript.md` |
| 1 — Required | Requests are not intercepted, the wrong handler wins, an unhandled warning appears, or lifecycle evidence is needed | `references/debugging.md` |
| 1 — Required | Upgrading MSW, mixed-major syntax exists, or Node/TypeScript/module requirements may change | `references/migration.md` |

**Complete when:** every active branch has loaded its reference and the examples match the installed
major.

### 4. Implement the smallest network description

Keep reusable happy-path handlers as the baseline. Add scenario-specific runtime overrides at the
closest test or development boundary. Match the protocol contract precisely and return the outcome
the consumer must observe. When request validity matters, parse the real request and return the
same class of response the service would produce for invalid input; do not turn the resolver into a
spy assertion.

Use real application requests as evidence. Keep mock data and state only as faithful as the tested
contract requires; do not recreate application business logic in handlers. Add abstraction only
after handlers share meaningful response policy, not merely similar syntax.

**Complete when:** the intended request matches one known handler and produces one observable
network outcome.

### 5. Verify

Run the narrowest request or test that proves interception, then the affected test suite and
repository checks. For browser setup, verify worker registration, scope, and startup ordering. For
Node setup, verify process lifecycle and handler cleanup. Use lifecycle events or strict unhandled
configuration when matching is uncertain.

Compose with `test` when tests are added or changed. Invoke the consuming data-library owner for
cache, retry, stale-data, or request-deduplication behavior instead of prescribing cache clearing.

**Complete when:** setup, handler selection, response behavior, and cleanup are proven in each
affected runtime.

## Guardrails

- Add delay only when latency, loading, cancellation, or race behavior is the scenario under test.
- Choose the runner environment from the behavior and installed stack; MSW does not require JSDOM.
- Use real timers by default. Configure fake timers only for a runner-specific test that needs them.
- Choose relative, absolute, wildcard, regular-expression, or custom URL predicates from the actual
  request origin and matching contract; absolute URLs are not a universal requirement.
- Reset runtime handlers after isolated tests. Reset client caches only when the owning data library
  requires it for the behavior being tested.
- Prefer observable application outcomes over assertions that merely record that a request occurred;
  use lifecycle events only when a one-way request has no consumer-visible effect.

## Handoff

Report the detected MSW version, Node/browser boundary, handlers and lifecycle changed, unhandled
request policy, focused and broader verification, official documentation consulted, and any behavior
left to the runner or consuming data library.
