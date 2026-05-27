> **Read this when:** choosing between jsdom, happy-dom, and node environments, per-file environment overrides, configuring environmentOptions, custom environments, or CSS handling in tests.

# Test Environments

## Available Environments

| Environment | DOM APIs | Speed | Use when |
|-------------|----------|-------|----------|
| `node` | None (default) | Fastest | Server logic, pure functions |
| `happy-dom` | Partial | Fast | Most component tests |
| `jsdom` | Full | Slower | Full browser simulation needed |
| `browser` | Real | See browser-mode ref | Real browser APIs required |

## Configuration

```ts
defineConfig({
  test: {
    environment: 'happy-dom',  // default for React projects
    environmentOptions: {
      jsdom: {
        url: 'http://localhost',
      },
    },
  },
})
```

## Installing Environment Packages

```bash
pnpm add -D jsdom       # full simulation
pnpm add -D happy-dom   # faster, fewer APIs
```

## Per-File Environment

Use a magic comment at the top of the file:

```ts
// @vitest-environment jsdom

test('DOM test', () => {
  const div = document.createElement('div')
  expect(div).toBeInstanceOf(HTMLDivElement)
})
```

## jsdom Environment

```ts
// @vitest-environment jsdom

test('DOM manipulation', () => {
  document.body.innerHTML = '<div id="app"></div>'
  const app = document.getElementById('app')
  app.textContent = 'Hello'
  expect(app.textContent).toBe('Hello')
})
```

### jsdom Options

```ts
defineConfig({
  test: {
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000',
        html: '<!DOCTYPE html><html><body></body></html>',
        userAgent: 'custom-agent',
        resources: 'usable',
      },
    },
  },
})
```

## happy-dom Environment

Faster than jsdom but missing some APIs (MutationObserver, full CSS cascade, some storage APIs):

```ts
// @vitest-environment happy-dom

test('basic DOM', () => {
  const el = document.createElement('div')
  el.className = 'test'
  expect(el.className).toBe('test')
})
```

## Multiple Environments via Projects

```ts
defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', include: ['tests/unit/**'], environment: 'node' } },
      { test: { name: 'dom', include: ['tests/dom/**'], environment: 'jsdom' } },
      {
        test: {
          name: 'browser',
          include: ['tests/browser/**'],
          browser: { enabled: true, name: 'chromium', provider: 'playwright' },
        },
      },
    ],
  },
})
```

## Custom Environment

```ts
// vitest-environment-custom/index.ts
import type { Environment } from 'vitest/runtime'

export default <Environment>{
  name: 'custom',
  viteEnvironment: 'ssr',

  setup() {
    globalThis.myGlobal = 'value'
    return {
      teardown() {
        delete globalThis.myGlobal
      },
    }
  },
}
```

## CSS and Assets

```ts
defineConfig({
  test: {
    css: true, // process CSS

    // or with options
    css: {
      include: /\.module\.css$/,
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
  },
})
```

## Fixing External Dependency Issues

If an external package fails with CSS or asset errors:

```ts
defineConfig({
  test: {
    server: {
      deps: {
        inline: ['problematic-package'],
      },
    },
  },
})
```

## Browser Mode vs Environments

**Environments** (`jsdom`, `happy-dom`) simulate a browser in Node.js — fast but not all APIs work.

**Browser Mode** (`browser: { enabled: true }`) runs tests in a real browser — all web APIs work,
but slower startup. Use it when the component needs `navigator.clipboard`, `geolocation`,
`sessionStorage`, web workers, or real CSS cascade. See [browser-mode](browser-mode.md).

## Key Points

- `happy-dom` is the recommended default for React component tests — faster than `jsdom`
- Use `// @vitest-environment` comment for per-file overrides
- Use projects config for multi-environment setups
- Default is `node` — no browser APIs available
