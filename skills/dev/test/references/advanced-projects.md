> **Read this when:** setting up multi-project configs, monorepo testing, different environments per project, providing values to tests via inject, or running specific projects in CI.

# Projects

Run different test configurations in the same Vitest process.

## Basic Projects Setup

```ts
defineConfig({
  test: {
    projects: [
      'packages/*',  // glob for config files
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

## Monorepo Pattern

```ts
defineConfig({
  test: {
    projects: [
      'packages/core',
      'packages/cli',
      'packages/utils',
    ],
  },
})
```

Each package has its own config:

```ts
// packages/core/vitest.config.ts
export default defineConfig({
  test: {
    name: 'core',
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
```

## Browser + Node Projects

```ts
defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'browser',
          include: ['tests/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            name: 'chromium',
            provider: 'playwright',
          },
        },
      },
    ],
  },
})
```

## Shared Configuration

```ts
// vitest.shared.ts
export const sharedConfig = {
  testTimeout: 10000,
  setupFiles: ['./tests/setup.ts'],
}

// vitest.config.ts
import { sharedConfig } from './vitest.shared'

defineConfig({
  test: {
    projects: [
      { test: { ...sharedConfig, name: 'unit', include: ['tests/unit/**'] } },
      { test: { ...sharedConfig, name: 'e2e', include: ['tests/e2e/**'] } },
    ],
  },
})
```

## Running Specific Projects

```bash
vitest --project unit
vitest --project integration --project e2e
vitest --project.ignore browser
```

## Providing Values to Projects

Inject config values into tests from project config:

```ts
// vitest.config.ts
defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'staging',
          provide: { apiUrl: 'https://staging.api.com', debug: true },
        },
      },
      {
        test: {
          name: 'production',
          provide: { apiUrl: 'https://api.com', debug: false },
        },
      },
    ],
  },
})
```

```ts
// In tests
import { inject } from 'vitest'

test('uses correct api', () => {
  const url = inject('apiUrl')
  expect(url).toContain('api.com')
})
```

## With Fixtures (injected)

```ts
const test = base.extend({
  apiUrl: ['/default', { injected: true }],
})

test('uses injected url', ({ apiUrl }) => {
  // apiUrl comes from project's provide config
})
```

## Project Isolation

```ts
defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'isolated',
          isolate: true,
          pool: 'forks',
        },
      },
    ],
  },
})
```

## Global Setup per Project

```ts
defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'with-db',
          globalSetup: ['./tests/db-setup.ts'],
        },
      },
    ],
  },
})
```

## Key Points

- Projects run in the same Vitest process but isolated thread pools
- Each project can have a different environment, config, and setup files
- Use glob patterns for monorepo packages
- Use `provide` + `inject` to pass runtime config into tests
- Projects inherit from root config unless overridden
