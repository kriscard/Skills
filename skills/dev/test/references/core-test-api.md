> **Read this when:** writing tests with test/it, using modifiers (skip, only, concurrent, todo, fails), parameterized tests with test.each/test.for, or test context/fixtures.

# Test API

## Basic Test

```ts
import { expect, test } from 'vitest'

test('adds numbers', () => {
  expect(1 + 1).toBe(2)
})

// Alias: it
it('works the same', () => {
  expect(true).toBe(true)
})
```

## Async Tests

```ts
test('async test', async () => {
  const result = await fetchData()
  expect(result).toBeDefined()
})
```

## Test Options

```ts
test('slow test', async () => { /* ... */ }, 10_000)

test('with options', { timeout: 10_000, retry: 2 }, async () => { /* ... */ })
```

## Test Modifiers

```ts
test.skip('skipped test', () => {})
test.skipIf(process.env.CI)('not in CI', () => {})
test.runIf(process.env.CI)('only in CI', () => {})

// Dynamic skip
test('dynamic skip', ({ skip }) => {
  skip(someCondition, 'reason')
})

test.only('only this runs', () => {})  // throws in CI unless allowOnly: true
test.todo('implement later')
test.fails('expected to fail', () => {
  expect(1).toBe(2) // passes because assertion fails
})
```

## Concurrent Tests

```ts
test.concurrent('test 1', async ({ expect }) => {
  expect(await fetch1()).toBe('result')
})

test.concurrent('test 2', async ({ expect }) => {
  expect(await fetch2()).toBe('result')
})

test.sequential('must run alone', async () => {})
```

## Parameterized Tests

```ts
// test.each — spreads arrays
test.each([
  [1, 1, 2],
  [1, 2, 3],
])('add(%i, %i) = %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})

// test.for — preferred, doesn't spread arrays
test.for([
  [1, 1, 2],
  [1, 2, 3],
])('add(%i, %i) = %i', ([a, b, expected], { expect }) => {
  expect(a + b).toBe(expected)
})

// With objects
test.each([
  { a: 1, b: 1, expected: 2 },
])('add($a, $b) = $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})
```

## Test Context

```ts
test('with context', ({ expect, skip, task }) => {
  console.log(task.name)
  skip(someCondition)
  expect(1).toBe(1)
})
```

## Custom Test with Fixtures

```ts
import { test as base } from 'vitest'

const test = base.extend({
  db: async ({}, use) => {
    const db = await createDb()
    await use(db)
    await db.close()
  },
})

test('query', async ({ db }) => {
  const users = await db.query('SELECT * FROM users')
  expect(users).toBeDefined()
})
```

## Tags

```ts
test('database test', { tags: ['db', 'slow'] }, async () => {})
// Run with: vitest --tags db
```

## Key Points

- Tests with no body are marked as `todo`
- `test.only` throws in CI unless `allowOnly: true`
- Use context's `expect` for concurrent tests and snapshots
- `test.for` is preferred over `test.each` — doesn't spread arrays
