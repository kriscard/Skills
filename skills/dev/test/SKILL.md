---
name: test
description: >-
  Applies test-pyramid, red-green-refactor, and behavioral testing practices for
  common JS/Python/Ruby stacks and other projects after detecting the runner.
  Use when the user says "write tests", "add tests", "TDD", "test coverage",
  "this test is failing", or mentions Jest/Vitest/pytest/RSpec/Playwright/
  Cypress. Also use when a feature is implemented without tests.
---

# Test

## Pick the Right Layer First

Writing tests at the wrong layer is the most common testing mistake. A unit test that mocks everything doesn't catch integration bugs; an E2E test for a pure function is slow and fragile.

| Layer | What it tests | Speed | When to use |
|-------|--------------|-------|-------------|
| **Unit** | Pure functions, isolated logic | ~ms | Business logic, utilities, transformations |
| **Integration** | Service boundaries, DB queries, API contracts | ~seconds | Repository layer, HTTP handlers, queue consumers |
| **E2E** | User flows in a real browser | ~minutes | Critical paths only (checkout, auth, onboarding) |

The pyramid holds: many units, fewer integrations, minimal E2E. Done only when
the selected layer is named and justified.

## Detect the Framework

Check before choosing:

```bash
cat package.json | grep -E '"jest"|"vitest"|"mocha"|"jasmine"'
cat pyproject.toml | grep -E 'pytest|unittest'
cat Gemfile | grep rspec
```

Don't assume Jest. Vitest is increasingly common in Vite/Next.js projects.
Mixing test runners in a project is rarely intentional. For unfamiliar stacks,
inspect project config and docs before writing tests.

## Universal Quality Checks

- [ ] Tests cover error paths and edge cases, not just the happy path
- [ ] Tests verify behavior, not implementation — if you rename a private method, tests shouldn't break
- [ ] Mocks are used sparingly — over-mocking makes tests pass while real code breaks
- [ ] Test names read like specs: `should return 404 when user is not found` beats `test user endpoint`
- [ ] AAA pattern: Arrange → Act → Assert, with a blank line between sections

## Red-Green-Refactor Flow (when requested)

1. **Red** — write a failing behavioral test that describes the desired behavior;
   done only when the relevant test command fails for the expected reason
2. **Green** — write the minimal code to make it pass; done only when the same
   command passes
3. **Refactor** — clean up while keeping tests green; done only when the command
   still passes after cleanup

## Integration Test Methodology

Integration tests validate service boundaries — not business logic (that's unit
tests) and not full user flows (that's E2E).

**What to test at this layer:**
- API endpoints: request/response structure, auth, error codes
- Database queries: ORM behavior, transactions, constraint violations
- Service-to-service contracts (Pact consumer-driven contract tests)
- Message queue consumers and event handlers

**Data isolation — non-negotiable:**
- Wrap each test in a transaction and roll back, or reset the test DB between runs
- Tests that share state cause order-dependent failures — the hardest class of flakiness to debug
- Mock third-party APIs, not your own services

Load references for runner-specific APIs, mocks, environments, MSW, Browser
Mode, snapshots, type testing, coverage, and configuration.

## E2E Test Methodology

E2E tests are expensive. Use them only for critical paths: checkout, auth,
onboarding, file upload. Prefer accessible selectors, smart waits, unique test
data, and cleanup via API or DB reset. Cover edge cases in unit/integration
tests, not E2E.

## Common Pitfalls

- **Testing the mock, not the code** — if the test only asserts a mock was called, it may not test behavior
- **Fragile E2E selectors** — use roles or stable test IDs instead of layout selectors
- **No cleanup in integration tests** — shared DB state causes order-dependent failures
- **Snapshot tests as a crutch** — use snapshots only for stable, serializable outputs

## Completion Gate

Complete test work only after:

- the selected layer is named
- the relevant test command has been run
- failures are either fixed or reported with evidence
- new tests would fail against the old behavior when that can be checked
- red/green command output is reported for TDD work

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Writing Vitest test blocks, `test.each`, or test modifiers | `references/core-test-api.md` |
| 1 — High | Writing Vitest assertions, spies, soft assertions, or custom matchers | `references/core-expect.md` |
| 1 — High | Mocking modules, timers, globals, or partial implementations in Vitest | `references/features-mocking.md` |
| 2 — High | Configuring Vitest projects, pools, environments, globals, or `defineConfig` | `references/core-config.md` |
| 2 — High | Using Vitest hooks such as `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, `aroundEach`, or `onTestFinished` | `references/core-hooks.md` |
| 3 — Medium | Coverage providers, thresholds, reporters, or ignore comments | `references/features-coverage.md` |
| 3 — Medium | Real browser testing via Vitest Browser Mode / Playwright provider | `references/browser-mode.md` |
| 3 — Medium | Snapshots, inline snapshots, custom serializers, or updating snapshots | `references/features-snapshots.md` |
| 3 — Medium | CLI filtering, `--changed`, tags, `test.only`, or `test.skip` | `references/features-filtering.md` |
| 4 — Low | Nested suites, `describe.concurrent`, or `describe.each` | `references/core-describe.md` |
| 4 — Low | Vitest CLI watch mode, sharding, or package.json scripts | `references/core-cli.md` |
| 4 — Low | `test.concurrent`, file parallelism, sequence, or shuffle | `references/features-concurrency.md` |
| 4 — Low | `test.extend`, fixture scopes, or auto fixtures | `references/features-context.md` |
| 4 — Low | `jsdom` vs `happy-dom` vs `node`, custom environments, or CSS handling | `references/advanced-environments.md` |
| 4 — Low | `expectTypeOf`, `assertType`, `.test-d.ts`, or `vitest typecheck` | `references/advanced-type-testing.md` |
| 4 — Low | Fake timers, `vi.waitFor`, or `vi.mocked` deep dive | `references/advanced-vi.md` |
| 4 — Low | Monorepo or multi-project Vitest setups | `references/advanced-projects.md` |
| 4 — Low | MSW v2 `http.*`/`HttpResponse` handlers, Node setup, or v1→v2 migration | `references/msw-v2.md` |
