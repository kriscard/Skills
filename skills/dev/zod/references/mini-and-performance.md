> **Read this when:** The task proposes Zod Mini, Zod Core, caching, schema-construction changes, bundle optimization, or parse-performance work.

# Zod Mini and performance

## Start with evidence

Name the constrained surface and measure the relevant signal before changing APIs:

- client bundle contribution and network conditions for bundle work;
- parse throughput and representative data for runtime work;
- TypeScript diagnostics for typechecking cost;
- schema construction frequency only when profiles show it matters.

Use regular Zod by default. The official guidance recommends Zod Mini mainly for unusually strict
front-end bundle constraints; its functional API trades discoverability and chaining ergonomics for
better tree-shaking. Do not migrate backend code or an ordinary application to Mini from a generic
claim that smaller is faster.

## Use Mini as a deliberate v4 contract

`zod/mini` is Zod 4's functional, tree-shakable API. Parsing methods remain available, while most
schema operations use top-level functions and `.check()`. Confirm adapter compatibility before
passing Mini schemas to ecosystem libraries.

Zod Mini does not load the English locale by default, so issue messages may be `"Invalid input"`
until a locale or custom errors are configured. Include that behavior in tests when messages reach
users or logs.

Do not import `zod/v4/core` in application code for performance. Core is a low-level substrate for
library authors building on both Zod and Zod Mini, and its internal definitions are not a stable
shortcut for ordinary validation.

## Optimize the demonstrated cost

- For TypeScript cost, prefer explicit object shape spread over long chained `.extend()` calls.
- For parse cost, simplify the schema or use lower-level `.check()` only after profiling the real
  path and preserving equivalent failures.
- For bundle cost, compare production bundles with regular Zod and Mini using the project's bundler.
- Reuse module-level schema definitions naturally, but do not add memoization or parsed-result
  caches without repeated-cost evidence, a correct cache key, bounded lifetime, and invalidation
  rules. Parsed input, locale, error customization, and async dependencies can make speculative
  caches incorrect as well as unnecessary.

Verify with the same metric that justified the change and retain behavioral parse cases. A smaller
bundle or faster benchmark does not excuse changed input/output types, issue paths, unknown-key
behavior, or refinement execution.

## Official sources

- [Zod Mini](https://zod.dev/packages/mini)
- [Zod Core](https://zod.dev/packages/core)
- [Zod 4 release notes and benchmarks](https://zod.dev/v4)
- [Defining schemas: object extension and checks](https://zod.dev/api)
