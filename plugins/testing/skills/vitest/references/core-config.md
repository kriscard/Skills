> **Read this when:** configuring vitest.config.ts, setting up options, merging with vite.config, configuring coverage, timeout, pool, or global options.

# Configuration

Vitest reads configuration from `vitest.config.ts` or `vite.config.ts`. It shares the same config format as Vite.

## Basic Setup

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // test options
  },
})
```

## Using with Existing Vite Config

```ts
// vite.config.ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

## Merging Configs

```ts
// vitest.config.ts
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
  },
}))
```

## Common Options

```ts
defineConfig({
  test: {
    globals: true,
    environment: 'node',          // 'node' | 'jsdom' | 'happy-dom' | 'browser'
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 5000,
    hookTimeout: 10000,
    coverage: {
      provider: 'v8',             // 'v8' (faster) | 'istanbul' (more accurate)
      reporter: ['text', 'html'],
      include: ['src/**/*.ts'],
    },
    isolate: true,
    pool: 'threads',              // 'threads' | 'forks' | 'vmThreads'
    poolOptions: {
      threads: { maxThreads: 4, minThreads: 1 },
    },
    clearMocks: true,
    restoreMocks: true,
    retry: 0,
    bail: 0,
  },
})
```

## Conditional Configuration

```ts
export default defineConfig(({ mode }) => ({
  plugins: mode === 'test' ? [] : [myPlugin()],
  test: { /* test options */ },
}))
```

## Projects (Monorepos)

```ts
defineConfig({
  test: {
    projects: [
      'packages/*',
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
```

## Vitest 3 Additions

```ts
// aroundEach: wrap each test with setup/teardown in one function
aroundEach(async (runTest) => {
  await db.beginTransaction()
  await runTest()
  await db.rollback()
})

// vi.hoisted: hoist variables before module evaluation (required for mocking
// modules that run code at import time)
const mockFn = vi.hoisted(() => vi.fn())
vi.mock('./module', () => ({ getData: mockFn }))

// test.extend fixtures: type-safe setup/teardown
const test = base.extend<{ db: Database }>({
  db: async ({}, use) => {
    const db = await createTestDb()
    await use(db)
    await db.close()
  },
})
```

## Key Points

- Vitest uses Vite's transformation pipeline — same `resolve.alias`, plugins work
- `vitest.config.ts` takes priority over `vite.config.ts`
- Use `--config` flag to specify a custom config path
- `process.env.VITEST` is `true` when running tests
- Test config uses `test` property, rest is Vite config
