---
name: vitest
description: >
  Vitest 3 configuration, browser mode, and testing patterns for React and TypeScript projects.
  Use when setting up Vitest, configuring browser mode, writing component tests, handling MSW v2
  API mocking, or migrating from Jest. Make sure to use this skill whenever the user mentions
  Vitest config, browser mode, vitest.config, or asks about testing environment setup.
user-invocable: false
---

Vitest is the standard testing framework for Vite-based projects. This skill covers Vitest 3.x
patterns — configuration, browser mode, mocking, coverage, and integration with React Testing
Library and MSW v2.

**Key 2026 shifts:**
- Vitest 3 Browser Mode runs tests in real browsers (Chromium/Firefox/Safari) via Playwright — no jsdom simulation
- MSW v2 replaced `rest.*` with `http.*` and `HttpResponse` — all v1 handler code is broken
- React Testing Library v16 moved `@testing-library/dom` and `@types/react-dom` to peer dependencies
- `userEvent.setup()` is required before `render()` for correct pointer/keyboard state simulation
- `test.for` is preferred over `test.each` — doesn't spread arrays
- `aroundEach`/`aroundAll` are new Vitest 3 hooks that wrap tests with setup/teardown in one function

## Routing table

### Core

| Topic | When to load | Reference |
|-------|-------------|-----------|
| Configuration | `vitest.config.ts`, `defineConfig`, `mergeConfig`, pool options, global options | [core-config](references/core-config.md) |
| CLI | Commands, options, sharding, watch mode shortcuts, package.json scripts | [core-cli](references/core-cli.md) |
| Test API | `test`/`it`, modifiers (skip, only, concurrent), `test.each`/`test.for`, test context | [core-test-api](references/core-test-api.md) |
| Describe API | `describe`/`suite`, nested suites, `describe.concurrent`, `describe.each`/`describe.for` | [core-describe](references/core-describe.md) |
| Expect API | Matchers, asymmetric matchers, soft assertions, poll, spy assertions, custom matchers | [core-expect](references/core-expect.md) |
| Hooks | `beforeEach`/`afterEach`/`beforeAll`/`afterAll`, `aroundEach`/`aroundAll`, `onTestFinished` | [core-hooks](references/core-hooks.md) |

### Features

| Topic | When to load | Reference |
|-------|-------------|-----------|
| Mocking | `vi.mock`, `vi.spyOn`, `vi.hoisted`, module mocking, partial mocks, `{ spy: true }` | [features-mocking](references/features-mocking.md) |
| Snapshots | `toMatchSnapshot`, inline snapshots, file snapshots, updating, custom serializers | [features-snapshots](references/features-snapshots.md) |
| Coverage | V8 vs Istanbul, thresholds, reporters, ignore comments, sharding with coverage | [features-coverage](references/features-coverage.md) |
| Test Context & Fixtures | `test.extend`, fixture scopes, auto fixtures, injected fixtures, composing | [features-context](references/features-context.md) |
| Concurrency | `test.concurrent`, file parallelism, sharding, sequence/shuffle, pool options | [features-concurrency](references/features-concurrency.md) |
| Filtering | CLI filters, `--changed`, tags, include/exclude patterns, `test.only`/`test.skip` | [features-filtering](references/features-filtering.md) |

### Advanced

| Topic | When to load | Reference |
|-------|-------------|-----------|
| Vi Utilities | `vi.mock`, `vi.spyOn`, `vi.hoisted`, fake timers, `vi.waitFor`, `vi.mocked` | [advanced-vi](references/advanced-vi.md) |
| Environments | `jsdom` vs `happy-dom` vs `node`, per-file override, custom environments, CSS handling | [advanced-environments](references/advanced-environments.md) |
| Browser Mode | Real browser testing via Playwright, setup, workspace config, per-file override | [browser-mode](references/browser-mode.md) |
| Type Testing | `expectTypeOf`, `assertType`, `.test-d.ts`, `vitest typecheck` | [advanced-type-testing](references/advanced-type-testing.md) |
| Projects | Multi-project monorepos, different environments per project, `provide`/`inject` | [advanced-projects](references/advanced-projects.md) |
| MSW v2 | `http.*`/`HttpResponse` handler syntax, Node setup, v1→v2 migration | [msw-v2](references/msw-v2.md) |

## Universal patterns

### Minimal vitest.config.ts (React/Vite project)

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // prefer over jsdom for speed
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
```

### RTL + userEvent v14 session pattern

```ts
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('submits form', async () => {
  const user = userEvent.setup() // must be before render
  render(<LoginForm />)
  await user.type(screen.getByLabelText('Email'), 'a@b.com')
  await user.click(screen.getByRole('button', { name: 'Submit' }))
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

### Required peer deps (RTL v16+)

```bash
pnpm add -D @testing-library/react @testing-library/user-event \
  @testing-library/dom @types/react-dom
```

## When to use which environment

| Need | Environment |
|------|------------|
| Pure logic, hooks, RTL component tests | `happy-dom` (default) |
| Component needs clipboard, geolocation, sessionStorage, web workers | Vitest Browser Mode → [browser-mode](references/browser-mode.md) |
| Multi-page user journey, form submission across routes | Playwright E2E |
| API route / server-side logic | `node` |
