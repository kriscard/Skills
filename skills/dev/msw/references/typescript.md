> **Read this when:** typing MSW HTTP path parameters, request/response bodies, GraphQL variables/results, or reusable handler and resolver factories.

# Preserve the MSW type contract

## Check declarations before copying examples

The examples below target **MSW 3.0.3**, checked with TypeScript 5.9.3. Use `msw/http` and
`msw/graphql` for v3; v2 exports these APIs from `msw`. For v1, use its installed declarations
instead of transplanting these Fetch-based signatures.

The [official TypeScript guide](https://mswjs.io/guides/best-practices/typescript) describes four
HTTP generic arguments, including `Path`, and shows parameterized `HttpRequestHandler<...>`.
The shipped 3.0.3 contract differs: HTTP methods accept **three** optional type arguments,
`<Params, RequestBodyType, ResponseBodyType>`. `HttpRequestHandler` is itself a generic call
signature, not a type alias that accepts those arguments. Read the installed declaration when
another release differs; do not add a fourth argument or cast around a compiler error.

## HTTP parameters, request JSON, and response JSON

```ts
import { http, HttpResponse } from "msw/http"

type CommentParams = { postId: string }
type CommentInput = { text: string }
type CommentResult = { commentUrl: string }

export const addComment = http.post<CommentParams, CommentInput, CommentResult>(
  "https://api.example.com/posts/:postId/comments",
  async ({ params, request }) => {
    const input = await request.json()
    return HttpResponse.json({
      commentUrl: `/posts/${params.postId}/comments/${input.text.length}`,
    })
  },
)
```

- Position 1 narrows `params`; it does not check that the predicate actually contains `:postId`.
  Optional or repeated path captures need optional/string-array shapes matching the real predicate.
- Position 2 narrows `request.json()` to `Promise<CommentInput>`; it does not type `formData()` or
  validate JSON at runtime.
- Position 3 checks the typed response body: replacing `commentUrl` with `url`, or returning a
  number there, must fail compilation. `HttpResponse.json<CommentResult>(...)` can also check a
  response at construction when no handler-level response generic is needed.

All three positions have defaults. Omit them when inference is sufficient. To specify a later
position, supply the earlier ones: e.g. `http.get<never, never, CommentResult>(...)` for a route
without captures or a request body. `never` documents an unused position; it does not reject a
runtime body. The general defaults are `PathParams`, `DefaultBodyType`, and `undefined` respectively;
leaving the response generic at `undefined` permits ordinary Fetch `Response` values. An explicit
response type checks typed `HttpResponse` bodies, but native `Response` is not a schema validator.
Include success/error body variants in the response union when both are part of the contract.

### Static annotations are not validation

A caller can still send `{ "text": 42 }` or malformed JSON. For request-contract tests, parse into
`unknown`, validate with the project's existing decoder or a complete local guard, and return the
service's appropriate 4xx response. Handle JSON parse failure too when it is part of the scenario.
Do not assert a parsed value into `CommentInput` and call it validated. See
[request-contract behavior](http-handlers-and-responses.md#validate-requests-through-network-behavior)
for MSW's role; leave general schema/type design to the TypeScript owner.

## Reusable factories without erasing types

Use a fixed resolver contract when several scenarios share one endpoint and payload shape:

```ts
import { http, HttpResponse, type HttpResponseResolver } from "msw/http"

type SdkInput = { transactionId: string }
type SdkResult = { transactionId: string; data: { ok: boolean } }

export function handleSdkRequest(
  resolver: HttpResponseResolver<never, SdkInput, SdkResult>,
) {
  return http.post<never, SdkInput, SdkResult>(
    "https://sdk.example.com/internal/request",
    resolver,
  )
}

export const sdkHandler = handleSdkRequest(async ({ request }) => {
  const input = await request.json()
  return HttpResponse.json({
    transactionId: input.transactionId,
    data: { ok: true },
  })
})
```

`request.json()` remains `Promise<SdkInput>` inside every caller's resolver, and an incorrect
`SdkResult` response fails compilation. The factory infers the concrete `HttpHandler` return type;
keep that inference instead of widening to a base `RequestHandler` or asserting the result. Payload
generics check the resolver, not a payload type parameter on the returned handler instance.

For an adapter with the **same polymorphic call signature** as an HTTP method, use the library's
callable type directly, preserving all three generic positions and the optional handler options:

```ts
import { http, HttpResponse, type HttpRequestHandler } from "msw/http"

export const get: HttpRequestHandler = (predicate, resolver, options) =>
  http.get(predicate, resolver, options)

export const healthHandler = get<never, never, { ok: boolean }>(
  "https://api.example.com/health",
  () => HttpResponse.json({ ok: true }),
  { once: true },
)
```

This minimal delegation illustrates the signature, not a reason to wrap every method. Extract a
factory only for genuinely shared endpoint or response policy. If wrapping a resolver rather than a
handler, use `HttpResponseResolver<Params, RequestBody, ResponseBody>` and carry those same generic
parameters through the wrapper's input and output; a bare default resolver type loses the caller's
payload relationship. Check the installed `PathParams` and `DefaultBodyType` constraints before
writing a generic wrapper.

## GraphQL variables and operation data

```ts
import { graphql } from "msw/graphql"
import { HttpResponse } from "msw/http"

type GetUserData = { user: { id: string; name: string } }
type GetUserVariables = { id: string }

const api = graphql.link("https://api.example.com/graphql")
export const userHandler = api.query<GetUserData, GetUserVariables>(
  "GetUser",
  ({ variables }) =>
    HttpResponse.json({
      data: { user: { id: variables.id, name: "Ada" } },
    }),
)
```

The first generic describes the operation's **data**, not the outer `{ data, errors }` envelope;
the second describes variables. Prefer existing generated operation types or typed documents when
available. For a fixed reusable resolver use `GraphQLResponseResolver<Data, Variables>` from
`msw/graphql`; a method-shaped adapter uses the unparameterized `GraphQLRequestHandler` callable
type in 3.0.3. GraphQL annotations likewise do not validate incoming variables at runtime.

## Version-matched evidence and checks

- [HTTP signatures, v3.0.3](https://github.com/mswjs/msw/blob/v3.0.3/src/http/http.ts)
- [StrictRequest and HttpResponse, v3.0.3](https://github.com/mswjs/msw/blob/v3.0.3/src/http/http-response.ts)
- [PathParams, v3.0.3](https://github.com/mswjs/msw/blob/v3.0.3/src/core/utils/matching/match-request-url.ts)
- [GraphQL signatures, v3.0.3](https://github.com/mswjs/msw/blob/v3.0.3/src/graphql/graphql.ts)

Compile the actual examples under the project's module resolution. Add expected-negative checks
for wrong parameter access, request-body use, and response shapes, including through factories.
Then send a real request through MSW to prove matching and response serialization: TypeScript
alone cannot prove interception, lifecycle, or runtime validation.
