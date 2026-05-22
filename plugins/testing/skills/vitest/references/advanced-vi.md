> **Read this when:** using vi.mock, vi.spyOn, vi.hoisted, vi.waitFor, vi.waitUntil, vi.mockObject, fake timers, or the vi.mocked TypeScript helper.

# Vi Utilities

The `vi` helper provides all mocking and utility functions.

```ts
import { vi } from 'vitest'
```

## Mock Functions

```ts
const fn = vi.fn()
const fnWithImpl = vi.fn((x) => x * 2)

vi.isMockFunction(fn) // true

fn.mockReturnValue(42)
fn.mockReturnValueOnce(1)
fn.mockResolvedValue(data)
fn.mockRejectedValue(error)
fn.mockImplementation(() => 'result')
fn.mockImplementationOnce(() => 'once')

fn.mockClear()    // clear call history
fn.mockReset()    // clear history + implementation
fn.mockRestore()  // restore original (spies only)
```

## Spying

```ts
const obj = { method: () => 'original' }

const spy = vi.spyOn(obj, 'method')
obj.method()

expect(spy).toHaveBeenCalled()
spy.mockReturnValue('mocked')

// Spy on getter/setter
vi.spyOn(obj, 'prop', 'get').mockReturnValue('value')
```

## Module Mocking

```ts
vi.mock('./module', () => ({ fn: vi.fn() }))

// Partial mock
vi.mock('./module', async (importOriginal) => ({
  ...(await importOriginal()),
  specificFn: vi.fn(),
}))

// Spy mode — keep implementation, track calls
vi.mock('./module', { spy: true })

// Import actual / import as mock
const actual = await vi.importActual('./module')
const mocked = await vi.importMock('./module')
```

## Dynamic Mocking (non-hoisted)

```ts
test('dynamic mock', async () => {
  vi.doMock('./config', () => ({ key: 'value' }))
  const config = await import('./config')
  expect(config.key).toBe('value')
  vi.doUnmock('./config')
})

vi.unmock('./module') // hoisted unmock
vi.resetModules()     // clear module cache
await vi.dynamicImportSettled()
```

## Hoisted Code

Run code before module evaluation — required when mock factory references a variable:

```ts
const mock = vi.hoisted(() => vi.fn())

vi.mock('./module', () => ({
  fn: mock, // can reference hoisted variable
}))
```

## Fake Timers

```ts
vi.useFakeTimers()

setTimeout(() => console.log('done'), 1000)

vi.advanceTimersByTime(1000)
await vi.advanceTimersByTimeAsync(100) // for async callbacks
vi.advanceTimersToNextTimer()
vi.advanceTimersToNextFrame()          // requestAnimationFrame
vi.runAllTimers()
vi.runAllTimersAsync()
vi.runOnlyPendingTimers()
vi.clearAllTimers()
vi.getTimerCount()
vi.isFakeTimers()
vi.useRealTimers()
```

## Mock Date/Time

```ts
vi.setSystemTime(new Date('2024-01-01'))
expect(new Date().getFullYear()).toBe(2024)
vi.getMockedSystemTime()
vi.getRealSystemTime()  // real time in ms
```

## Global/Env Mocking

```ts
vi.stubGlobal('fetch', vi.fn())
vi.unstubAllGlobals()

vi.stubEnv('API_KEY', 'test')
vi.unstubAllEnvs()
```

## Waiting Utilities

```ts
// Retry until assertion passes
await vi.waitFor(async () => {
  const el = document.querySelector('.loaded')
  expect(el).toBeTruthy()
}, { timeout: 5000, interval: 100 })

// Wait for truthy value
const element = await vi.waitUntil(
  () => document.querySelector('.loaded'),
  { timeout: 5000 }
)
```

## Mock Object

```ts
const mocked = vi.mockObject(original)        // mock all methods
const spied = vi.mockObject(original, { spy: true }) // spy mode
```

## Test Configuration

```ts
vi.setConfig({ testTimeout: 10_000, hookTimeout: 10_000 })
vi.resetConfig()
```

## Global Mock Management

```ts
vi.clearAllMocks()   // clear all call history
vi.resetAllMocks()   // reset + clear implementation
vi.restoreAllMocks() // restore originals (spies)
```

## vi.mocked TypeScript Helper

```ts
import { myFn } from './module'
vi.mock('./module')

vi.mocked(myFn).mockReturnValue('typed')
vi.mocked(myModule, { deep: true })
vi.mocked(fn, { partial: true }).mockResolvedValue({ ok: true })
```

## Key Points

- `vi.mock` is hoisted — use `vi.doMock` for dynamic mocking
- `vi.hoisted` lets you reference variables in mock factories before imports run
- Use `vi.spyOn` to spy on existing methods without replacing them
- Fake timers require explicit setup and teardown
- `vi.waitFor` retries until assertion passes (not a sleep)
