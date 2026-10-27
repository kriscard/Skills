> **Read this when:** upgrading MSW, repairing mixed-major syntax, or deciding whether runtime, TypeScript, module, or generated-worker changes are required.

# Migrate from evidence

Record the current and target versions before editing. Read both package manifests, the installed
package metadata, release notes, and the official migration guide. Treat the target package's
`engines`, peers, and exports as authoritative; published major-level minimums can become stricter in
later minors or patches.

Run the smallest existing MSW-backed test before migration. Migrate setup, handlers, response syntax,
utilities, GraphQL, and debugging configuration as one coherent network contract, then regenerate or
replace the worker delivery mechanism only if the target integration requires it.

## v1 to v2

Check every affected branch:

- browser APIs move to `msw/browser`; Node setup remains in `msw/node`;
- `rest` becomes `http`;
- `(req, res, ctx)` becomes one resolver-info object plus Fetch API `Request`/`Response` behavior;
- request bodies use async standard methods such as `request.json()`;
- response composition becomes `HttpResponse`, native `Response`, and utility functions;
- one-time responses move from `res.once()` to handler option `{ once: true }`;
- handler inspection changes from `printHandlers()` to `listHandlers()`;
- lifecycle listener argument shapes change;
- Node and TypeScript floors rise, so inspect the exact target release metadata;
- browser worker imports and generated worker compatibility must be checked.

Do not paper over missing Fetch globals with a mandatory environment recipe. First compare the
runner environment, Node release, and target package requirements; choose the environment or
polyfill strategy owned by that stack.

## v2 to v3

Check every affected branch:

- v3 is ESM-only and requires a newer Node/TypeScript baseline; use the exact target package
  metadata, not only the initial v3 announcement;
- import `http`/`HttpResponse` from `msw/http`, GraphQL from `msw/graphql`, and utilities from their
  `msw/utils/*` entrypoints;
- `setupWorker` remains in `msw/browser` and `setupServer` remains in `msw/node`;
- GraphQL becomes link-first and `graphql` becomes an optional peer dependency;
- `onUnhandledRequest` becomes `onUnhandledFrame`, including a new custom callback shape;
- `worker.stop()` becomes asynchronous;
- lifecycle event types split by network protocol and WebSocket event names change;
- the Vite plugin can replace a copied worker asset, but migration should preserve the project's
  chosen delivery path unless adopting the plugin is part of scope;
- cookie and fake-timer behavior changed; validate the scenario instead of adding global timer or
  environment workarounds.

## Verification sequence

1. Check imports resolve under the target package exports.
2. Typecheck resolver arguments, request parsing, and response construction.
3. Run one Node interception path and one browser path when both are owned by the project.
4. Exercise one unmatched request under the configured policy.
5. Exercise HTTP success/error and GraphQL branches that changed.
6. Run affected suites and repository validation.
7. Search for old-major symbols and explain any intentional compatibility code left behind.

Codemods can perform mechanical rewrites, but review every changed handler against its emitted
request and observable response.

## Official references

- [MSW 1.x to 2.x migration](https://mswjs.io/docs/migrations/1.x-to-2.x)
- [MSW 2.x to 3.x migration](https://mswjs.io/docs/migrations/2.x-to-3.x)
- [MSW releases](https://github.com/mswjs/msw/releases)
