> **Read this when:** adding or changing GraphQL handlers, operation matching, variables, response errors, endpoint links, subscriptions, or query batching.

# Mock GraphQL at the operation boundary

Prefer named operations. Match by operation type and operation name, then use resolver `variables`
to drive the response. Return the GraphQL envelope the client expects, including root-level `data`
and/or `errors`; an HTTP 200 response can still represent GraphQL execution errors.

For field errors, include the relevant `message`, `path`, and `locations` when the client behavior
depends on partial data. Include `extensions` only when it is part of the tested contract. Keep
transport errors separate from GraphQL errors.

## Version boundary

### v1

Use the installed `graphql.query`, `graphql.mutation`, or link APIs with `(req, res, ctx)` response
composition. Read variables from the v1 request object and construct data/errors through its GraphQL
context helpers.

### v2

Import `graphql` and `HttpResponse` from `msw`. Match named operations with
`graphql.query(...)`/`graphql.mutation(...)` or scope an endpoint with `graphql.link(...)`. Resolver
information includes parsed `variables`, `operationName`, the query, cookies, and the request.

### v3

Import `graphql` from `msw/graphql` and `HttpResponse` from `msw/http`. GraphQL is link-first:
create `graphql.link(endpoint)` and define `.query()`, `.mutation()`, `.operation()`, or supported
subscription handlers on that link. Root `graphql.query()` and `graphql.mutation()` were removed.
The `graphql` package is an optional peer dependency, so confirm it is installed when GraphQL
interception is used.

```ts
import { graphql } from "msw/graphql"
import { HttpResponse } from "msw/http"

const api = graphql.link("/graphql")

export const handlers = [
  api.query("GetUser", ({ variables }) =>
    HttpResponse.json({
      data: { user: { id: variables.id, name: "Ada" } },
    }),
  ),
]
```

Choose a relative or absolute link URL from the real endpoint contract. Different services may use
the same operation name, so link scoping prevents accidental cross-service matches.

## Batched operations

GraphQL query batching is client-specific and is not a GraphQL-over-HTTP standard. First verify that
the consuming client actually sends a batch and inspect its envelope. MSW does not provide one
universal built-in batch handler. Add an adapter that:

1. matches the batch transport request;
2. parses each operation without consuming the original body unexpectedly;
3. resolves operations against the intended GraphQL handlers or explicit fallback policy;
4. returns responses in the order and shape required by that client.

Keep this adapter local to the batching format. Do not impose it on ordinary single-operation
requests.

## Official references

- [Intercept GraphQL operations](https://mswjs.io/docs/graphql/intercepting-operations/)
- [Mock GraphQL responses](https://mswjs.io/docs/graphql/mocking-responses/)
- [GraphQL errors](https://mswjs.io/docs/graphql/mocking-responses/errors/)
- [GraphQL query batching](https://mswjs.io/docs/graphql/mocking-responses/query-batching/)
- [GraphQL API](https://mswjs.io/api/graphql)
