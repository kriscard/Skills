> **Read this when:** using beforeEach, afterEach, beforeAll, afterAll, aroundEach, aroundAll, onTestFinished, or configuring hook execution order.

# Lifecycle Hooks

## Basic Hooks

```ts
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

beforeAll(async () => { await setupDatabase() })
afterAll(async () => { await teardownDatabase() })
beforeEach(async () => { await clearTestData() })
afterEach(async () => { await cleanupMocks() })
```

## Cleanup Return Pattern

Return a cleanup function from `before*` hooks to avoid `after*` duplication:

```ts
beforeAll(async () => {
  const server = await startServer()
  return async () => { await server.close() } // runs as afterAll
})

beforeEach(async () => {
  const connection = await connect()
  return () => connection.close() // runs as afterEach
})
```

## Scoped Hooks

Hooks apply to current suite and nested suites:

```ts
describe('outer', () => {
  beforeEach(() => console.log('outer before'))

  test('test 1', () => {}) // outer before → test

  describe('inner', () => {
    beforeEach(() => console.log('inner before'))
    test('test 2', () => {}) // outer before → inner before → test
  })
})
```

## Hook Timeout

```ts
beforeAll(async () => { await slowSetup() }, 30_000)
```

## Around Hooks (Vitest 3)

Wrap tests with setup/teardown context — both sides in one function:

```ts
import { aroundEach } from 'vitest'

aroundEach(async (runTest) => {
  await db.beginTransaction()
  await runTest() // must be called
  await db.rollback()
})

test('insert user', async () => {
  await db.insert({ name: 'Alice' })
  // automatically rolled back after test
})
```

### aroundAll

```ts
import { aroundAll } from 'vitest'

aroundAll(async (runSuite) => {
  console.log('before all tests')
  await runSuite() // must be called
  console.log('after all tests')
})
```

### Multiple Around Hooks (onion layers)

```ts
aroundEach(async (runTest) => {
  console.log('outer before')
  await runTest()
  console.log('outer after')
})

aroundEach(async (runTest) => {
  console.log('inner before')
  await runTest()
  console.log('inner after')
})
// Order: outer before → inner before → test → inner after → outer after
```

## Test Hooks

Inside test body:

```ts
import { onTestFailed, onTestFinished } from 'vitest'

test('with cleanup', () => {
  const db = connect()
  onTestFinished(() => db.close())    // always runs (pass or fail)
  onTestFailed(({ task }) => {
    console.log('Failed:', task.result?.errors)
  })
})
```

### Reusable Cleanup Pattern

```ts
function useTestDb() {
  const db = connect()
  onTestFinished(() => db.close())
  return db
}

test('query users', () => {
  const db = useTestDb() // fresh connection, auto-closed
  expect(db.query('SELECT * FROM users')).toBeDefined()
})
```

## Hook Execution Order

Default stack order:
1. `beforeAll` (in order)
2. `beforeEach` (in order)
3. Test
4. `afterEach` (reverse order)
5. `afterAll` (reverse order)

Configure with `sequence.hooks`:

```ts
defineConfig({
  test: {
    sequence: {
      hooks: 'list', // 'stack' (default) | 'list' | 'parallel'
    },
  },
})
```

## Key Points

- Return cleanup function from `before*` hooks to avoid `after*` duplication
- `aroundEach`/`aroundAll` must call `runTest()`/`runSuite()`
- `onTestFinished` always runs even if test fails
- Use context hooks for concurrent tests
- Hooks are not called during type checking
