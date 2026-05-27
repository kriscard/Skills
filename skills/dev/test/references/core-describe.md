> **Read this when:** grouping tests with describe/suite, using nested suites, describe modifiers (skip, only, concurrent, shuffle), or parameterized suites with describe.each/describe.for.

# Describe API

Group related tests into suites for organization and shared setup.

## Basic Usage

```ts
import { describe, expect, test } from 'vitest'

describe('Math', () => {
  test('adds numbers', () => {
    expect(1 + 1).toBe(2)
  })

  test('subtracts numbers', () => {
    expect(3 - 1).toBe(2)
  })
})

// Alias: suite
suite('equivalent to describe', () => {})
```

## Nested Suites

```ts
describe('User', () => {
  describe('when logged in', () => {
    test('shows dashboard', () => {})
    test('can update profile', () => {})
  })

  describe('when logged out', () => {
    test('shows login page', () => {})
  })
})
```

## Suite Options

```ts
describe('slow tests', { timeout: 30_000 }, () => {
  test('test 1', () => {}) // inherits 30s timeout
})
```

## Suite Modifiers

```ts
describe.skip('skipped suite', () => {})
describe.skipIf(process.env.CI)('not in CI', () => {})
describe.only('only this suite runs', () => {})
describe.todo('implement later')

describe.concurrent('parallel tests', () => {
  test('test 1', async ({ expect }) => {})
  test('test 2', async ({ expect }) => {})
})

describe.shuffle('random order', () => {
  test('test 1', () => {})
  test('test 2', () => {})
})
```

## Sequential in Concurrent

```ts
describe.concurrent('mostly parallel', () => {
  test('parallel 1', async () => {})

  describe.sequential('must be sequential', () => {
    test('step 1', async () => {})
    test('step 2', async () => {})
  })
})
```

## Parameterized Suites

```ts
describe.each([
  { name: 'Chrome', version: 100 },
  { name: 'Firefox', version: 90 },
])('$name browser', ({ name, version }) => {
  test('has version', () => {
    expect(version).toBeGreaterThan(0)
  })
})

// describe.for — preferred
describe.for([
  ['Chrome', 100],
  ['Firefox', 90],
])('%s browser', ([name, version]) => {
  test('has version', () => {
    expect(version).toBeGreaterThan(0)
  })
})
```

## Hooks in Suites

```ts
describe('Database', () => {
  let db

  beforeAll(async () => { db = await createDb() })
  afterAll(async () => { await db.close() })
  beforeEach(async () => { await db.clear() })

  test('insert works', async () => {
    await db.insert({ name: 'test' })
    expect(await db.count()).toBe(1)
  })
})
```

## Key Points

- Top-level tests belong to an implicit file suite
- Nested suites inherit parent's options (timeout, retry, etc.)
- Hooks are scoped to their suite and nested suites
- Use `describe.concurrent` with context's `expect` for snapshots
- Shuffle order depends on `sequence.seed` config
- Modifiers can be chained: `describe.skip.concurrent(...)`, `describe.only.shuffle(...)`
