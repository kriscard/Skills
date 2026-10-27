> **Read this when:** Observing or routing network traffic, mocking responses, replaying HAR, managing browser contexts, or diagnosing cross-test state leakage.

# Network and isolation

## Observe before intercepting

Use request/response events or a predicate-based wait when the test only needs evidence.
Add routing when the test must control a request: `continue`/`fallback` to reach the
network, `fulfill` to answer it, and `abort` to fail it. Match the narrowest stable URL,
method, resource, or payload contract so unrelated traffic remains real.

Register event waits and routes before the triggering action. Keep route lifetime scoped
to the test or fixture that owns it, and remove persistent handlers when their scope
outlives one test. Review ordering when multiple routes can match; broad handlers can
shadow narrower ones.

## Choose the real boundary

Network routing changes the system under test. Use it when the intended boundary is the
browser/client behavior under a controlled HTTP response, failure, or edge case. Keep
real backend/deployed integration when the requirement depends on actual server wiring,
auth, persistence, caching, or protocol behavior. The `test` skill owns that boundary
decision; this reference owns Playwright's interception mechanics.

When modifying a real response, preserve the status, headers, and body fields relevant
to browser behavior. Make synthetic errors deliberate and assert the user-visible
recovery path.

## Service workers, WebSockets, and HAR

If routes or network events appear missing, inspect service-worker ownership before
rewriting selectors or adding sleeps. Current Playwright docs describe service-worker
limitations and version-specific behavior; `serviceWorkers: 'block'` may be appropriate
when Playwright routing must own the request. Do not combine Playwright routing and an
application mocking service worker without deciding which layer owns interception.

Use HAR replay for a justified recorded protocol surface, not as an opaque replacement
for understanding handlers. Keep recorded data free of secrets and refresh it when the
contract changes. WebSocket routing and other newer APIs require explicit installed
version/type confirmation.

## Isolation model

Each Playwright Test test normally receives a fresh browser context. Preserve that
model:

- create required state in the test or fixtures rather than depending on another test;
- keep mutable module globals out of test correctness;
- avoid reusing a page/context across tests to save startup time;
- isolate backend data with unique identities or cleanup;
- make cleanup idempotent and safe after partial failures;
- test multi-user scenarios with separate contexts in the same test when simultaneous
  sessions are the behavior.

Browser-context isolation does not reset databases, queues, caches, files, emails, or
third-party sandboxes. Trace external state whenever failures correlate with order,
parallelism, retries, or shards.

## Failure signals

- A route never fires: verify URL pattern, registration order, service worker, popup/new
  context ownership, and installed-version support.
- A mocked test passes while production fails: reassess whether routing replaced the
  contract that needed proof.
- Tests pass alone but fail together: inspect backend identifiers, accounts, ports,
  module globals, and cleanup before reducing workers.
- Tests fail only after retry: remember that Playwright discards failed workers and
  reruns setup; locate state that survived outside the worker.

## Official sources

- [Network](https://playwright.dev/docs/network)
- [Isolation](https://playwright.dev/docs/browser-contexts)
- [Authentication](https://playwright.dev/docs/auth)
- [Parallelism](https://playwright.dev/docs/test-parallel)
