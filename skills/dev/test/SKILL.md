---
name: test
description: >-
  Writes and fixes tests at the right layer (unit, integration, E2E) for any
  framework. Use when the user says "write tests", "add tests", "TDD", "test
  coverage", "this test is failing", or mentions Jest/Vitest/pytest/RSpec/
  Playwright/Cypress. Also use proactively when the user implements a feature
  without tests — good coverage is part of the work, not an afterthought.
---

# Test

## Pick the Right Layer First

Writing tests at the wrong layer is the most common testing mistake. A unit test that mocks everything doesn't catch integration bugs; an E2E test for a pure function is slow and fragile.

| Layer | What it tests | Speed | When to use |
|-------|--------------|-------|-------------|
| **Unit** | Pure functions, isolated logic | ~ms | Business logic, utilities, transformations |
| **Integration** | Service boundaries, DB queries, API contracts | ~seconds | Repository layer, HTTP handlers, queue consumers |
| **E2E** | User flows in a real browser | ~minutes | Critical paths only (checkout, auth, onboarding) |

The pyramid holds: many units, fewer integrations, minimal E2E.

## Detect the Framework

Check before choosing:

```bash
cat package.json | grep -E '"jest"|"vitest"|"mocha"|"jasmine"'
cat pyproject.toml | grep -E 'pytest|unittest'
cat Gemfile | grep rspec
```

Don't assume Jest. Vitest is increasingly common in Vite/Next.js projects. Mixing test runners in a project is rarely intentional.

## Universal Quality Checks

- [ ] Tests cover error paths and edge cases, not just the happy path
- [ ] Tests verify behavior, not implementation — if you rename a private method, tests shouldn't break
- [ ] Mocks are used sparingly — over-mocking makes tests pass while real code breaks
- [ ] Test names read like specs: `should return 404 when user is not found` beats `test user endpoint`
- [ ] AAA pattern: Arrange → Act → Assert, with a blank line between sections

## TDD Flow (when requested)

1. **Red** — write a failing test that describes the desired behavior
2. **Green** — write the minimal code to make it pass
3. **Refactor** — clean up while keeping tests green

The discipline is writing the test first. It forces you to think about the interface before the implementation.

## Integration Test Methodology

Integration tests validate service boundaries — not business logic (that's unit tests)
and not full user flows (that's E2E).

**What to test at this layer:**
- API endpoints: request/response structure, auth, error codes
- Database queries: ORM behavior, transactions, constraint violations
- Service-to-service contracts (Pact consumer-driven contract tests)
- Message queue consumers and event handlers

**Data isolation — non-negotiable:**
- Wrap each test in a transaction and roll back, or reset the test DB between runs
- Tests that share state cause order-dependent failures — the hardest class of flakiness to debug
- Use test containers (Docker) or in-memory DBs for fast, isolated test environments

**MSW v2 for API mocking in Node:**
```typescript
// v1 syntax is gone — use http.* and HttpResponse
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/user', () => HttpResponse.json({ id: 1 }))
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Mock only what's external to your system.** In integration tests, mock third-party
APIs (Stripe, SendGrid), not your own services — that defeats the purpose.

## E2E Test Methodology

E2E tests are expensive. Use them only for critical paths: checkout, auth, onboarding,
file upload. Cover edge cases in unit/integration tests, not E2E.

**Playwright patterns:**
```typescript
// Prefer accessible selectors — layout-independent and documents intent
await page.getByRole('button', { name: 'Submit order' }).click();
// Not: page.click('.btn-primary:nth-child(2)')  ← breaks on any layout change

// Page Object Model — separates test logic from page structure
class CheckoutPage {
  constructor(private page: Page) {}
  async submitOrder() { await this.page.getByRole('button', { name: 'Submit order' }).click(); }
}

// Smart waits — never sleep()
await page.waitForLoadState('networkidle');
await expect(page.getByRole('status')).toHaveText('Order confirmed');
```

**Data isolation in E2E:**
- Use unique identifiers (UUID, timestamp) for test data so tests don't collide
- Clean up via API teardown calls or DB resets, not manual state management
- Never use production data or real payment credentials

**Vitest 3 Browser Mode** — for components that need real browser APIs (clipboard,
`sessionStorage`, geolocation) but don't need full user-journey orchestration. Runs in
real Chromium via Playwright provider, ~30% faster than full E2E for component-level:
```typescript
// vitest.config.ts
export default { test: { browser: { enabled: true, provider: 'playwright', name: 'chromium' } } }
// Per-file: // @vitest-environment browser
```

## Common Pitfalls

**Testing the mock, not the code**
If your test only asserts that a mock was called, it's not testing behavior. Ask: "would this test catch a bug in the real implementation?"

**RTL `userEvent` without a session**
```typescript
// ❌ No session — stateless clicks, no pointer/keyboard state tracking
await userEvent.click(btn);

// ✅ Setup first — maintains pointer and keyboard state across chained interactions
const user = userEvent.setup();
await user.click(btn);
```

**Fragile selectors in E2E**
`page.click('.btn-primary:nth-child(2)')` breaks on any layout change. Use accessible roles or `data-testid` attributes: `page.getByRole('button', { name: 'Submit' })`.

**No cleanup in integration tests**
Tests that leave data in a shared DB cause order-dependent failures. Wrap each test in a transaction and roll back, or use a test database that resets between runs.

**Snapshot tests as a crutch**
Snapshot tests catch *something* changed but don't tell you if the change was correct. Use them for stable, serializable outputs (CLI output, generated SQL). Avoid for React component trees — they fail on every styling change.

## References

| Priority | Category | Load when | Reference |
|----------|----------|-----------|-----------|
| 1 — High | Core API | Writing test blocks, `test.each`, modifiers (skip/only/concurrent) | `references/core-test-api.md` |
| 1 — High | Assertions | Specific `expect` matchers, soft assertions, spy assertions, custom matchers | `references/core-expect.md` |
| 1 — High | Mocking | `vi.mock`, `vi.spyOn`, `vi.hoisted`, module mocking, partial mocks | `references/features-mocking.md` |
| 2 — High | Config | `vitest.config.ts`, `defineConfig`, pool options, environments, globals | `references/core-config.md` |
| 2 — High | Hooks | `beforeEach`/`afterEach`/`beforeAll`/`afterAll`, `aroundEach`, `onTestFinished` | `references/core-hooks.md` |
| 3 — Medium | Coverage | V8 vs Istanbul, thresholds, reporters, ignore comments | `references/features-coverage.md` |
| 3 — Medium | Browser Mode | Real browser testing via Playwright provider, per-file override | `references/browser-mode.md` |
| 3 — Medium | Snapshots | `toMatchSnapshot`, inline snapshots, custom serializers, updating | `references/features-snapshots.md` |
| 3 — Medium | Filtering | CLI filters, `--changed`, tags, `test.only`/`test.skip` | `references/features-filtering.md` |
| 4 — Low | Describe API | Nested suites, `describe.concurrent`, `describe.each` | `references/core-describe.md` |
| 4 — Low | CLI | Watch mode, sharding, package.json scripts | `references/core-cli.md` |
| 4 — Low | Concurrency | `test.concurrent`, file parallelism, sequence/shuffle | `references/features-concurrency.md` |
| 4 — Low | Context/Fixtures | `test.extend`, fixture scopes, auto fixtures | `references/features-context.md` |
| 4 — Low | Environments | `jsdom` vs `happy-dom` vs `node`, custom environments, CSS handling | `references/advanced-environments.md` |
| 4 — Low | Type Testing | `expectTypeOf`, `assertType`, `.test-d.ts`, `vitest typecheck` | `references/advanced-type-testing.md` |
| 4 — Low | Vi Utilities | Fake timers, `vi.waitFor`, `vi.mocked` deep dive | `references/advanced-vi.md` |
| 4 — Low | Multi-project | Monorepo setups, different environments per project | `references/advanced-projects.md` |
| 4 — Low | MSW v2 | `http.*`/`HttpResponse` handlers, Node setup, v1→v2 migration | `references/msw-v2.md` |
