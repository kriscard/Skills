> **Read this when:** adding or changing HTTP matching, resolver logic, response construction, scenario overrides, passthrough, bypass, uploads, or streaming.

# Describe HTTP behavior precisely

## Match the request that exists

Match the HTTP method explicitly and choose the narrowest useful URL predicate. Relative paths are
appropriate when the request shares the application's origin; absolute URLs distinguish origins;
wildcards, regular expressions, and custom predicates cover broader contracts. Inspect the resolved
request URL before changing a predicate.

Keep query parameters out of path predicates. Read them from `new URL(request.url).searchParams`.
Use path parameters from the resolver's `params` value. With Fetch API resolvers, parse the body
explicitly using `request.json()`, `request.text()`, `request.formData()`, or another standard
`Request` method. Clone a request before reading its body when another consumer still needs it.

Use `cookies` for parsed request cookies and inspect headers for authentication contracts. For file
uploads, parse `request.formData()` and assert the fields or `File` metadata relevant to the
scenario. Availability still depends on the detected runtime's web-platform APIs.

## Respect precedence

Handlers are order-sensitive. MSW evaluates runtime handlers added by `.use()` before initial
handlers, and otherwise proceeds left to right. Put more specific predicates before permissive
fallbacks. A resolver that returns no instruction falls through to later matching handlers; a
mocked response or passthrough handles the request and stops the search.

Keep stable happy paths in the initial handler list. Add errors, empty states, authorization cases,
and sequential outcomes as local runtime overrides. Group handlers by service or domain when it
improves discovery, but preserve order across overlapping predicates. Extract a shared resolver only
when multiple handlers truly share response policy.

## Construct responses for the installed major

### v2

Import `http` and `HttpResponse` from `msw`. Resolvers receive one object argument:

```ts
import { http, HttpResponse } from "msw"

http.post("/users", async ({ request }) => {
  const input = await request.json()
  return HttpResponse.json({ id: "user-1", ...input }, { status: 201 })
})
```

### v3

Import HTTP APIs from `msw/http`; resolver and `HttpResponse` concepts remain Fetch-based:

```ts
import { http, HttpResponse } from "msw/http"
```

### v1

Use the installed v1 `rest` namespace and `(req, res, ctx)` response-composition contract. Do not
mix `HttpResponse`, `http`, or Fetch-body parsing into a v1 codebase unless the task is a migration.

Use `HttpResponse.json()`, `.text()`, `.html()`, `.arrayBuffer()`, `.formData()`, `.error()`, or the
constructor according to the desired wire response. Set status and headers in the response init.
Model HTTP errors as HTTP responses; use `HttpResponse.error()` only when the scenario is a network
failure.

One-time behavior uses the handler option `{ once: true }` in v2/v3. Restore exhausted one-time
handlers only when repeating that scenario is intentional. In v1, use the installed response
composition API such as `res.once(...)`.

A streaming response can use a `ReadableStream` body when both the installed MSW release and runtime
support it. Test the consumer-visible stream behavior; do not add streaming merely to imitate
production internals.

## Passthrough and bypass

These operations are different:

- `passthrough()` handles the currently intercepted request by performing it as-is. No later handler
  gets a chance to respond.
- `bypass(input, init?)` marks an additional fetch so it skips interception. Use it for response
  patching or a secondary real request from inside a resolver; passing the current request prevents
  recursive interception.
- returning nothing falls through to the next matching handler and is not passthrough.

In v2, utilities are generally imported from `msw`. In v3, use their designated paths such as
`msw/utils/passthrough` and `msw/utils/bypass`. Confirm exports against the installed package before
editing.

## Timing and client state

Add `delay()` only for behavior whose contract includes time: loading UI, cancellation, timeout, or
a race. Baseline handlers should answer without an artificial wait. Let the consuming client own
retries and cache state; use MSW to return the network sequence that drives those behaviors.

## Official references

- [Intercept HTTP requests](https://mswjs.io/docs/http/intercepting-requests/)
- [Handle HTTP requests](https://mswjs.io/docs/http/handling-requests/)
- [HTTP API](https://mswjs.io/api/http)
- [HttpResponse API](https://mswjs.io/api/http-response)
- [Network behavior overrides](https://mswjs.io/guides/best-practices/network-behavior-overrides)
- [passthrough](https://mswjs.io/api/passthrough)
- [bypass](https://mswjs.io/api/bypass)
- [Streaming responses](https://mswjs.io/docs/http/mocking-responses/streaming/)
