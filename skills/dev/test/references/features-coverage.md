> **Read this when:** setting up code coverage, choosing between V8 and Istanbul, configuring thresholds, ignoring code, sharding with coverage, or integrating with CI.

# Code Coverage

## Setup

```bash
vitest run --coverage
```

Install the provider:

```bash
pnpm add -D @vitest/coverage-v8       # V8 (default, faster)
pnpm add -D @vitest/coverage-istanbul  # Istanbul (more accurate)
```

## Configuration

```ts
defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['node_modules/', 'tests/', '**/*.d.ts', '**/*.test.ts'],
      all: true, // report uncovered files
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

## Providers

| Provider | Speed | Compatibility | Use when |
|----------|-------|---------------|----------|
| V8 | Faster | Node only | Most projects (default) |
| Istanbul | Slower | Any JS runtime | Legacy setups or cross-runtime |

## Reporters

```ts
coverage: {
  reporter: [
    'text',           // terminal output
    'text-summary',   // summary only
    'json',           // JSON file
    'html',           // HTML report (open in browser)
    'lcov',           // for CI tools (Codecov, Coveralls)
    'cobertura',      // XML format
  ],
  reportsDirectory: './coverage',
}
```

## Thresholds

```ts
coverage: {
  thresholds: {
    lines: 80,
    functions: 75,
    branches: 70,
    statements: 80,
    perFile: true,   // enforce per-file
    autoUpdate: true, // auto-update on improvement
  },
}
```

## Ignoring Code

### V8

```ts
/* v8 ignore next -- @preserve */
function ignored() { return 'not covered' }

/* v8 ignore start -- @preserve */
// all code here ignored
/* v8 ignore stop -- @preserve */
```

### Istanbul

```ts
/* istanbul ignore next -- @preserve */
function ignored() {}

/* istanbul ignore if -- @preserve */
if (condition) { /* ignored */ }
```

`@preserve` keeps comments through esbuild.

## Package.json Scripts

```json
{
  "scripts": {
    "test:coverage": "vitest run --coverage",
    "test:coverage:watch": "vitest --coverage"
  }
}
```

## CI Integration

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Coverage with Sharding

```bash
vitest run --shard=1/3 --coverage --reporter=blob
vitest run --shard=2/3 --coverage --reporter=blob
vitest run --shard=3/3 --coverage --reporter=blob

vitest --merge-reports --coverage --reporter=json
```

## Key Points

- V8 is faster; Istanbul is more portable
- Use `all: true` to expose uncovered files
- Set thresholds to enforce minimum coverage
- Use `@preserve` comment to keep ignore hints through build tools
