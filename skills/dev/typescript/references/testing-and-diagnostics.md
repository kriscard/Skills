> **Read this when:** selecting or examining TypeScript module-mocking policy,
> dependency-injection test seams, real dependency tests, disposal/leak checks,
> running-UI verification, structured logging, or console diagnostics.

# Testing and Diagnostics

## Current skill guidance

Testing architecture, framework test APIs, UI verification, and logging infrastructure
remain with their established owners. This reference preserves the three collected
practices in full; it does not turn their presence into a mandate to refactor tests,
install a logger, start an app, access production data, or alter telemetry.

Use the repository's actual test/logging conventions and installed APIs. Distinguish
static contract tests from observed integration behavior. Match changes to the user's
scope and report unavailable checks instead of claiming a mocked test exercised a real
boundary. Diagnose TypeScript-specific problems here; delegate broader test architecture
and platform mechanics to the applicable testing/frontend/framework skill.

## Collected practices

**Adoption: Pending for practices 34–36.** Select them through the
[catalog](practice-catalog.md); the policy alternatives below are not current default bans.

## Practice 34 — No module mocking

Prohibit Jest/Vitest module mocking and replace dependencies
through a real interface, dependency injection, a service layer, or a faithful test
implementation. Replace a dependency the subject actually owns rather than patching the
module loader and bypassing its public contract.

```typescript
type AccountReader = {
  find(id: string): Promise<{ id: string; active: boolean } | undefined>;
};

async function isActive(reader: AccountReader, id: string): Promise<boolean> {
  return (await reader.find(id))?.active ?? false;
}

const fakeReader: AccountReader = {
  async find(id) {
    return id === 'acct_123' ? { id, active: true } : undefined;
  },
};
// A test calls isActive(fakeReader, 'acct_123') without replacing its module.
```

The rule recognizes supported Jest/Vitest objects and import aliases for `mock`, `doMock`,
and `unstable_mockModule`, including computed literal method access. It respects shadowed
bindings. This restriction does not flag `unmock`, `doUnmock`, or `deepUnmock`;
nor does it prohibit every spy or function stub by name or prove that an accepted fake
preserves real dependency behavior.

**Limits:** adding a service/interface solely to avoid one test statement can create
unnecessary production indirection. Current guidance evaluates test boundaries rather than
banning syntax; if this stricter rule is selected, keep replacement at the narrow real
seam. Test the fake's relevant contract against the real implementation when drift matters.

## Practice 35 — Prefer real execution in tests

Do not mock what can run: use framework real-test primitives, leak/disposable
checks, and running-build UI verification. Mock only dependencies that cannot run locally.
This asks for evidence through the real boundary, not merely a type-compatible simulation.

For an applicable change:

1. Identify the behavior and the real surface that can demonstrate it.
2. Use the installed framework's supported test/lifecycle primitives; close servers,
   connections, timers, subscriptions, and other disposables.
3. Run a real local dependency or a representative test instance when available.
4. For UI behavior, observe the running build, including the relevant failure/state paths.
5. Record the command, environment, revision, observed outcome, and anything still mocked.

For example, an HTTP adapter test should send a request to a real local test server when
that boundary is the acceptance target, rather than mocking the adapter's own request
function and declaring its wiring verified. A UI build succeeding is not evidence that
a keyboard interaction works.

**Limits:** a preference for locally runnable dependencies is not a universal unit-test
ban. Safety, credentials, cost, nondeterminism, and unavailable services may require a
faithful substitute. Do not use production accounts or perform destructive/external effects
without authority. Select framework/browser tooling through its owner and state the
remaining evidence gap. #34 prohibits particular module mechanisms; #35 asks for real
behavioral evidence and is not satisfied merely by swapping module mocks for injected fakes.

## Practice 36 — Structured telemetry

Prefer structured logger diagnostics with enough context to debug from an ID and prohibit
`console.log` in shipped code under this policy. Reuse the project's logger and stable contextual
fields rather than assembling unsearchable narrative strings.

```typescript
// With the repository's real logger API:
logger.error(
  { accountId, operation: 'load-account', err: cause },
  'Account load failed',
);
```

This is illustrative: logger argument order/error serialization differs by library.
Use the installed API, preserve useful causes, and include a request/correlation ID when
available. Avoid logging raw secrets, tokens, personal payloads, or unbounded input merely
to add context; follow the owner's redaction and retention policy.

**Limits:** this policy does not define a logger implementation, levels, sampling, or
schema. Do not invent those policies or install dependencies as a side effect. CLI stdout
may be a user-facing output contract rather than telemetry; explicitly decide that case
before applying a shipped-console ban. Current TypeScript guidance does not itself impose
a logging migration.
