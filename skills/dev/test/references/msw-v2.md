> **Read this when:** setting up MSW, writing request handlers, migrating from MSW v1, or needing the correct `http.*` / `HttpResponse` API.

# MSW v2 — Handler Syntax and Test Setup

MSW v2 is a breaking change from v1. The `rest.*` namespace is removed. Use `http.*` and `HttpResponse`.

## Installation

```bash
pnpm add -D msw
```

## Handler syntax (v2)

```ts
import { http, HttpResponse } from 'msw'

const handlers = [
  // GET with JSON response
  http.get('/api/user/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Chris' })
  }),

  // POST with body parsing
  http.post('/api/login', async ({ request }) => {
    const body = await request.json()
    if (body.password !== 'correct') {
      return new HttpResponse(null, { status: 401 })
    }
    return HttpResponse.json({ token: 'abc123' })
  }),

  // Network error simulation
  http.get('/api/flaky', () => HttpResponse.error()),
]
```

## Node.js test setup (Vitest / Jest)

```ts
// src/test/setup.ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' })) // fail on unmocked requests
afterEach(() => server.resetHandlers())                         // reset per-test overrides
afterAll(() => server.close())
```

`onUnhandledRequest: 'error'` is the right default for tests — any request not in your handlers
is a test bug, not a silent pass.

## Per-test handler overrides

```ts
it('handles server error', () => {
  server.use(
    http.get('/api/user', () => new HttpResponse(null, { status: 500 }))
  )
  render(<UserProfile />)
  expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
})
```

`server.use()` adds a one-time override; `server.resetHandlers()` in `afterEach` removes it.

## Browser setup (Storybook / dev)

```bash
npx msw init public/ --save
```

```ts
// src/main.tsx (dev only)
if (import.meta.env.DEV) {
  const { worker } = await import('./test/browser-handlers')
  await worker.start({ onUnhandledRequest: 'bypass' })
}
```

## MSW v1 → v2 migration cheatsheet

| v1 | v2 |
|----|----|
| `import { rest } from 'msw'` | `import { http, HttpResponse } from 'msw'` |
| `rest.get(url, (req, res, ctx) => res(ctx.json(...)))` | `http.get(url, () => HttpResponse.json(...))` |
| `res(ctx.status(404))` | `new HttpResponse(null, { status: 404 })` |
| `res(ctx.text('hello'))` | `HttpResponse.text('hello')` |
| `res.networkError('...')` | `HttpResponse.error()` |
| `req.body` | `await request.json()` / `await request.text()` |
