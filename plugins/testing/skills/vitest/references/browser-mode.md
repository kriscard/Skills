> **Read this when:** setting up Vitest Browser Mode, configuring Playwright provider, writing component tests that need real browser APIs, or deciding between jsdom and browser mode.

# Vitest 3 Browser Mode

Browser Mode runs test files in a real browser instance (Chromium, Firefox, or WebKit) via Playwright
or WebdriverIO. All tests share a single browser instance (shared contexts), making it ~30% faster
than spinning up a Playwright E2E suite for component-level tests.

## When to use

- Component uses `navigator.clipboard`, `navigator.geolocation`, `sessionStorage`, `localStorage`
- Component uses Web Workers, Service Workers, or Broadcast Channel
- Test needs `window.matchMedia`, `IntersectionObserver`, or `ResizeObserver`
- You want real CSS cascade behavior (`:focus-visible`, scroll, viewport)

Do NOT use for: pure logic, custom hooks without DOM dependencies, server-side code.

## Setup

```bash
pnpm add -D @vitest/browser playwright
npx playwright install chromium
```

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',      // or 'firefox' | 'webkit'
      headless: true,
    },
  },
})
```

## Per-file override (mixed environments)

Use workspace config to run some tests in jsdom and others in browser:

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: { name: 'unit', environment: 'happy-dom', include: ['**/*.unit.test.ts'] },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'browser',
      include: ['**/*.browser.test.ts'],
      browser: { enabled: true, provider: 'playwright', name: 'chromium' },
    },
  },
])
```

Or per-file docblock:

```ts
// @vitest-environment browser
import { render } from '@testing-library/react'
```

## Interactions in browser mode

Browser mode exposes `page` from `@vitest/browser/context` for low-level Playwright access,
but prefer `@testing-library/react` + `userEvent` for component interactions — they work
identically in browser mode and jsdom.

```ts
import { page } from '@vitest/browser/context'

it('uses real clipboard', async () => {
  render(<CopyButton />)
  await userEvent.click(screen.getByRole('button'))
  const text = await page.evaluate(() => navigator.clipboard.readText())
  expect(text).toBe('copied!')
})
```

## Performance notes

- All browser-mode tests share a single Chromium instance (contexts are reused)
- First run is slower (browser launch); subsequent runs are faster due to context reuse
- Use `--reporter=verbose` to see per-test browser console output
- Trace files: set `browser.testerScripts` or use `page.context().tracing.start()`
