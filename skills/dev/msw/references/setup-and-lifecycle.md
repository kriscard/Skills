> **Read this when:** adding or changing MSW setup, Node/browser lifecycle, worker delivery, unhandled-request policy, or concurrent-test isolation.

# Set up the active runtime

## Browser

Use the browser entrypoint supported by the installed major. In v2 and v3, create the worker with
`setupWorker` from `msw/browser`. Start interception before application code can issue dependent
requests and await `worker.start()`; worker registration is asynchronous.

For file-based setup, generate the worker with the installed package's
`msw init <public-directory> --save` command. The `--save` flag records `msw.workerDirectory` in the
root `package.json` so dependency changes can regenerate the worker; it also supports an array of
public directories in a monorepo. Commit `mockServiceWorker.js` so a checkout works immediately, or
make generation an explicit automated setup step. Regenerate it when the installed package reports
an integrity mismatch. In v3 with Vite, the official `msw/vite` integration can serve the worker
instead; follow the project's existing integration rather than introducing both paths.

Check worker scope against the requested URLs. A worker served from a nested path cannot intercept
requests outside its allowed scope unless the server grants a broader service-worker scope.

## Node

Use `setupServer` from `msw/node`. One shared server per test process is the common baseline:

```ts
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

The option above is v2 syntax. In v3, use `onUnhandledFrame`. In v1, confirm the available
`onUnhandledRequest` callback shape against that installed release. Adapt the hook names to the
runner, but preserve the lifecycle: enable before requests, remove per-test runtime overrides after
each isolated test, and close interception after the process suite.

`resetHandlers()` removes handlers added with `.use()` and restores the initial network description.
Passing handlers to `resetHandlers(...)` replaces the initial description too; avoid that in normal
test cleanup because it makes the baseline order-dependent. `restoreHandlers()` only re-enables
exhausted one-time handlers and cannot restore runtime handlers that were reset.

None of these APIs clear mutable fixture data, a query client, SWR cache, Apollo cache, application
store, cookies, or local storage. Reset each state owner through its own lifecycle when the behavior
requires isolation.

## Unhandled traffic

Choose the policy deliberately:

- use `"error"` in bounded tests when unexpected real traffic must fail;
- use `"warn"` while introducing or diagnosing coverage;
- use `"bypass"` only when silent real traffic is intentional;
- use a custom callback for a narrow allowlist, such as known assets or a specific external origin.

In v3, the policy applies to network frames and the option is `onUnhandledFrame`; custom callbacks
receive `{ frame, defaults }`. In v1/v2 it is request-oriented and named `onUnhandledRequest`.

## Concurrent Node tests

Runtime handlers are shared state when concurrent tests use the same `setupServer` instance. MSW
v2.2+ provides `server.boundary()` to isolate handler overrides to an async scope. Use it when tests
run concurrently and mutate handlers. It is Node-only; browser runtimes already isolate state per
client runtime. For older MSW versions, avoid concurrent mutation or isolate tests by process. File
parallelism is usually safe when the runner gives files separate workers; verify runner isolation
before sharing a server or mutable mock data across files.

## Vitest

Vitest's ordinary Node tests need no special MSW adapter: load `setupServer()` from a Vitest setup
file and use `beforeAll`/`afterEach`/`afterAll` for listen, reset, and close. A simulated DOM does not
change that process boundary.

Vitest Browser Mode runs in a real browser and therefore uses `setupWorker()`. Prefer an automatic
`test.extend` fixture that awaits `worker.start()` before yielding and calls
`worker.resetHandlers()` after each test. Mark the fixture `{ auto: true }` so interception also
starts for tests that do not request the worker from test context. Page contexts provide client
isolation, so the official integration recommends not calling `worker.stop()` after every browser
test.

Regardless of mode, concurrent tests that mutate one server or worker still need isolated boundaries
or sequential ownership. Keep Vitest concurrency syntax, environment selection, and fake timers in
the Vitest skill; MSW only determines which interceptor and lifecycle are required.

## Runner and environment boundaries

- Use the runner's own setup-file and hook conventions.
- Select Node, DOM, or real-browser execution from the behavior under test. Do not add JSDOM solely
  because MSW is present.
- Browser-mode runners still require browser interception and startup ordering; Node-mode runners
  use `setupServer` even when component rendering uses a simulated DOM. In Vitest Browser Mode,
  initialize the browser worker in the browser project instead of substituting a Node server.
- Check the compiler's module resolution and web-platform types against the installed MSW exports.
  Add TypeScript libraries or runtime types only when the owning environment requires them; avoid a
  blanket DOM configuration for Node-only projects.
- Keep fake timers out of baseline setup. If a test deliberately uses delayed responses, follow the
  detected runner and MSW version's timer behavior.
- Read the installed package metadata for Node and TypeScript compatibility. Major-version summaries
  are migration clues, not a replacement for the exact `engines` and peer declarations.

## Official references

- [setupServer](https://mswjs.io/api/setup-server/)
- [setupWorker](https://mswjs.io/api/setup-worker/)
- [Start browser interception](https://mswjs.io/api/setup-worker/start)
- [Listen in Node](https://mswjs.io/api/setup-server/listen)
- [Reset handlers](https://mswjs.io/api/setup-server/reset-handlers)
- [Server boundary](https://mswjs.io/api/setup-server/boundary)
- [Managing the worker](https://mswjs.io/guides/best-practices/managing-the-worker)
- [Vitest integration](https://mswjs.io/guides/integrations/vitest)
- [Vite integration](https://mswjs.io/guides/integrations/vite)
