> **Read this when:** using test context, test.extend for custom fixtures, fixture scopes (file/worker), auto fixtures, injected fixtures, or composing fixtures across test files.

# Test Context & Fixtures

## Built-in Context

Every test receives context as first argument:

```ts
test('context', ({ task, expect, skip }) => {
  console.log(task.name)  // test name
  expect(1).toBe(1)       // context-bound expect (required for concurrent)
  skip()                  // skip dynamically
})
```

Context properties: `task`, `expect`, `skip(condition?, message?)`, `onTestFinished(fn)`, `onTestFailed(fn)`

## Custom Fixtures with test.extend

```ts
import { test as base } from 'vitest'

interface Fixtures {
  db: Database
  user: User
}

export const test = base.extend<Fixtures>({
  db: async ({}, use) => {
    const db = await createDatabase()
    await use(db)           // provide to test
    await db.close()        // cleanup after test
  },

  // fixture depending on another fixture
  user: async ({ db }, use) => {
    const user = await db.createUser({ name: 'Test' })
    await use(user)
    await db.deleteUser(user.id)
  },
})

test('query user', async ({ db, user }) => {
  const found = await db.findUser(user.id)
  expect(found).toEqual(user)
})
```

## Fixture Initialization

Fixtures only initialize when accessed — lazy by default:

```ts
const test = base.extend({
  expensive: async ({}, use) => {
    console.log('initializing') // only runs if test uses it
    await use('value')
  },
})

test('no fixture', () => {})            // expensive not called
test('uses fixture', ({ expensive }) => {}) // expensive called
```

## Auto Fixtures

Run for every test regardless of whether it's in the signature:

```ts
const test = base.extend({
  setup: [
    async ({}, use) => {
      await globalSetup()
      await use()
      await globalTeardown()
    },
    { auto: true },
  ],
})
```

## Scoped Fixtures

### File Scope (initialize once per file)

```ts
const test = base.extend({
  connection: [
    async ({}, use) => {
      const conn = await connect()
      await use(conn)
      await conn.close()
    },
    { scope: 'file' },
  ],
})
```

### Worker Scope (initialize once per worker)

```ts
const test = base.extend({
  sharedResource: [
    async ({}, use) => { await use(globalResource) },
    { scope: 'worker' },
  ],
})
```

## Injected Fixtures (from Config)

Override fixtures per project:

```ts
// test file
const test = base.extend({
  apiUrl: ['/default', { injected: true }],
})

// vitest.config.ts
defineConfig({
  test: {
    projects: [
      { test: { name: 'prod', provide: { apiUrl: 'https://api.prod.com' } } },
    ],
  },
})
```

## Scoped Values per Suite

```ts
const test = base.extend({ environment: 'development' })

describe('production tests', () => {
  test.scoped({ environment: 'production' })

  test('uses production', ({ environment }) => {
    expect(environment).toBe('production')
  })
})

test('uses default', ({ environment }) => {
  expect(environment).toBe('development')
})
```

## Extended Test Hooks

Hooks receive fixtures when using extended test:

```ts
test.beforeEach(({ db }) => { db.seed() })
test.afterEach(({ db }) => { db.clear() })
```

## Composing Fixtures

```ts
// base-test.ts
export const test = base.extend<{ db: Database }>({
  db: async ({}, use) => { /* ... */ },
})

// admin-test.ts
import { test as dbTest } from './base-test'

export const test = dbTest.extend<{ admin: User }>({
  admin: async ({ db }, use) => {
    const admin = await db.createAdmin()
    await use(admin)
  },
})
```

## Key Points

- Fixtures are lazy — only initialize when accessed
- Return cleanup function or `await use()` then cleanup
- `{ auto: true }` runs for every test
- `{ scope: 'file' }` for expensive shared resources
- Fixtures compose — extend from already-extended tests
