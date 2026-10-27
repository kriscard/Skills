> **Read this when:** a request is not intercepted, the wrong handler responds, unhandled traffic appears, or lifecycle evidence is needed.

# Debug from the outgoing request

Follow the request through these checks in order.

## 1. Prove interception is active

In a browser, await worker startup and confirm the service worker is registered, active, served from
the expected path, and controls the application page (`navigator.serviceWorker.controller`). Compare
registration scope with the client document URL, not the API destination: controlled pages can issue
intercepted fetches to other paths or origins. Check for another service worker or stale public asset
only after registration evidence points there; do not prescribe blanket browser-cache clearing.

In Node, confirm the test setup file runs in the same process before the request and that the server
has not already closed. Confirm the request uses a protocol/API supported by the installed MSW
release and runtime.

## 2. Capture the real request

Record method, fully resolved URL, query string, headers, body, and, for GraphQL, endpoint,
operation type, operation name, and variables. Compare those values with the handler predicate. Do
not edit the handler based only on the source-code URL string; base URLs and client adapters may
change the emitted request.

Common mismatches include:

- wrong method;
- origin or base-path differences;
- an application document outside the worker's scope, or not yet controlled;
- query parameters embedded in a path predicate;
- a broader handler placed before a specific handler;
- anonymous or differently named GraphQL operations;
- mixed v1/v2/v3 imports or resolver signatures;
- runtime handlers leaking from another test.

## 3. Make unhandled traffic visible

Use strict unhandled behavior in the smallest reproduction. The option is `onUnhandledRequest` in
v1/v2 and `onUnhandledFrame` in v3. Start with warnings if the suite contains intentional real
traffic, then narrow an allowlist instead of silencing all requests.

Inspect current handlers with the API available in the installed version. v2 replaced v1's
`printHandlers()` with `listHandlers()`; current releases expose list data that you can log or
inspect. Confirm order as well as presence.

## 4. Observe lifecycle events

Subscribe temporarily through `worker.events` or `server.events`:

- `request:start` proves the interceptor saw the request;
- `request:match` proves a handler matched;
- `request:unhandled` identifies missing matches;
- `response:mocked` and `response:bypass` distinguish the outcome.

Event payloads contain Fetch API request/response objects in modern versions. Clone before reading a
body. Life-cycle events are read-only diagnostics; change network behavior through handlers and
setup options. Check the installed types because v1 listener arguments differ, and v3 changes event
map types and WebSocket event names.

Remove broad logging after diagnosis or keep a narrowly useful helper that does not consume bodies,
leak secrets, or flood normal test output.

## 5. Separate MSW from its consumer

Once MSW returns the intended response, move outward:

- runner failures and hook ordering belong to the runner;
- UI waiting belongs to the UI test library;
- retries, deduplication, stale data, and cache invalidation belong to the data client;
- application parsing and error mapping belong to application code.

A request count may be useful diagnostic evidence, but prefer asserting the user- or caller-visible
outcome unless the number of requests is itself the contract.

## Official references

- [Life-cycle events](https://mswjs.io/api/life-cycle-events)
- [Default matching behavior](https://mswjs.io/docs/defaults/)
- [FAQ](https://mswjs.io/docs/faq/)
- [Start browser interception](https://mswjs.io/api/setup-worker/start)
- [Listen in Node](https://mswjs.io/api/setup-server/listen)
