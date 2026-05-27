> **Read this when:** mocking modules with vi.mock, spying on objects, mocking timers or dates, stubbing globals/env vars, auto-mock with spy: true, or vi.hoisted for mock factories.

# Mocking

## Mock Functions

```ts
import { vi } from 'vitest'

const fn = vi.fn()
fn('hello')

expect(fn).toHaveBeenCalledWith('hello')

const add = vi.fn((a, b) => a + b)
expect(add(1, 2)).toBe(3)

fn.mockReturnValue(42)
fn.mockReturnValueOnce(1).mockReturnValueOnce(2)
fn.mockResolvedValue({ data: true })
fn.mockRejectedValue(new Error('fail'))
fn.mockImplementation((x) => x * 2)
fn.mockImplementationOnce(() => 'first call')
```

## Spying on Objects

```ts
const cart = { getTotal: () => 100 }

const spy = vi.spyOn(cart, 'getTotal')
cart.getTotal()

expect(spy).toHaveBeenCalled()
spy.mockReturnValue(200)
spy.mockRestore() // restore original
```

## Module Mocking

```ts
// vi.mock is hoisted to top of file
vi.mock('./api', () => ({
  fetchUser: vi.fn(() => ({ id: 1, name: 'Mock' })),
}))

import { fetchUser } from './api'

test('mocked module', () => {
  expect(fetchUser()).toEqual({ id: 1, name: 'Mock' })
})
```

### Partial Mock

```ts
vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    specificFunction: vi.fn(),
  }
})
```

### Auto-mock with Spy (keep real implementation)

```ts
vi.mock('./calculator', { spy: true })

import { add } from './calculator'

test('spy on module', () => {
  const result = add(1, 2) // real implementation
  expect(result).toBe(3)
  expect(add).toHaveBeenCalledWith(1, 2)
})
```

### Manual Mocks (`__mocks__`)

```
src/
  __mocks__/
    axios.ts        # mocks 'axios'
  api/
    __mocks__/
      client.ts     # mocks './client'
    client.ts
```

```ts
vi.mock('axios')     // uses __mocks__/axios.ts
vi.mock('./api/client')
```

## Dynamic Mocking (vi.doMock)

Not hoisted — use for dynamic imports:

```ts
test('dynamic mock', async () => {
  vi.doMock('./config', () => ({ apiUrl: 'http://test.local' }))
  const { apiUrl } = await import('./config')
  expect(apiUrl).toBe('http://test.local')
  vi.doUnmock('./config')
})
```

## Hoisted Variables for Mocks

Use when you need to reference a variable inside a mock factory (before imports are evaluated):

```ts
const mockFn = vi.hoisted(() => vi.fn())

vi.mock('./module', () => ({
  getData: mockFn,
}))

import { getData } from './module'

test('hoisted mock', () => {
  mockFn.mockReturnValue('test')
  expect(getData()).toBe('test')
})
```

## Mock Timers

```ts
beforeEach(() => { vi.useFakeTimers() })
afterEach(() => { vi.useRealTimers() })

test('timers', () => {
  const fn = vi.fn()
  setTimeout(fn, 1000)

  expect(fn).not.toHaveBeenCalled()
  vi.advanceTimersByTime(1000)
  expect(fn).toHaveBeenCalled()
})

// Other timer methods
vi.runAllTimers()
vi.runOnlyPendingTimers()
vi.advanceTimersToNextTimer()
await vi.advanceTimersByTimeAsync(100) // for async callbacks
```

## Mock Dates

```ts
vi.setSystemTime(new Date('2024-01-01'))
expect(new Date().getFullYear()).toBe(2024)
vi.useRealTimers() // restore
```

## Mock Globals

```ts
vi.stubGlobal('fetch', vi.fn(() =>
  Promise.resolve({ json: () => ({ data: 'mock' }) })
))
vi.unstubAllGlobals()
```

## Mock Environment Variables

```ts
vi.stubEnv('API_KEY', 'test-key')
expect(import.meta.env.API_KEY).toBe('test-key')
vi.unstubAllEnvs()
```

## Clearing Mocks

```ts
fn.mockClear()       // clear call history
fn.mockReset()       // clear history + implementation
fn.mockRestore()     // restore original (for spies)

vi.clearAllMocks()
vi.resetAllMocks()
vi.restoreAllMocks()
```

## Config Auto-Reset

```ts
defineConfig({
  test: {
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
  },
})
```

## Key Points

- `vi.mock` is hoisted — called before imports
- Use `vi.doMock` for dynamic, non-hoisted mocking
- `vi.hoisted` lets you reference variables in mock factories
- `{ spy: true }` keeps real implementation but tracks calls
- Always restore mocks to avoid test pollution
