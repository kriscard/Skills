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

`zod/mini` is Zod 4's functional, tree-shakable API. The same Mini contract is exported from
`zod/v4/mini` and the compatibility path `zod/v4-mini`. The standalone `@zod/mini` package
re-exports its peer `zod/mini` and is versioned in lockstep since 4.5; verify both installed versions
and peer ranges. Parsing methods remain available, while most schema operations use top-level
functions and `.check()`. Confirm adapter compatibility before passing Mini schemas to ecosystem
libraries.

Do not copy Classic method syntax blindly. For custom Mini predicates use
`Schema.check(z.refine(predicate, params))`; for lower-level or multiple-issue control use
`Schema.check(z.check((ctx) => { ... }))`. Mini schemas do not expose `.refine()` or
`.superRefine()` methods.

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
- Ordinary module-level schema reuse is not a cache proposal and needs no speculative machinery.
  Do not add memoization or parsed-result
  caches without repeated-cost evidence, a correct cache key, bounded lifetime, and invalidation
  rules. Parsed input, locale, error customization, and async dependencies can make speculative
  caches incorrect as well as unnecessary.

Verify with the same metric that justified the change and retain behavioral parse cases. A smaller
bundle or faster benchmark does not excuse changed input/output types, issue paths, unknown-key
behavior, or refinement execution.

## Compile or validate only a measured hot path

The following contracts were verified against `zod@4.6.7` full API declarations/source. Inspect the
effective entrypoint before using these newer APIs; Mini uses functional equivalents where exposed.
A v4 label alone is insufficient.

- `z.compile(Schema)` returns a compiled clone when supported; keep the returned schema. Its forward
  synchronous fast path falls back to the regular parser on invalid input for detailed issues.
  Benchmark realistic valid **and invalid** traffic, parsed outputs, and issue paths.
- Runtime compilation uses `new Function`; strict CSP/no-eval prevents that acceleration. Default
  compilation can return the original schema unchanged, so do not claim success from a non-throwing
  call. `{ strict: true }` surfaces refusal. Keep the standard parser under these constraints;
  an externally generated parser is a separate, explicitly reviewed implementation, not an automatic
  recommendation to bypass CSP.
- Async schemas cannot be compiled: default compilation falls back, strict mode throws. Async parse
  calls and reverse encoding use the standard parser. Unsupported constructs (including coercion,
  custom `when`, recursion, and callback catches) can cause partial or whole-schema fallback; inspect
  the installed support rules and verify the actual path rather than promising acceleration.
- Effects executed on an invalid fast path may execute **twice** when runtime fallback repeats them.
  Keep refinements/transforms pure; compilation is not safe evidence of exactly-once side effects.
- Compiler code adds bundle bytes. Compare production bundle output; Mini plus compiler may lose the
  size benefit that motivated Mini. No universal bundle or throughput number applies to a project.
- In Classic, `Schema.validate(input)` and `z.validate(Schema, input)` are equivalent entry forms.
  Mini exposes only the functional `z.validate(Schema, input)` form; Mini schema instances do not
  have `.validate()` or `.validateAsync()`. The synchronous call returns a boolean guard on the
  **input** type, not parsed output. It can short-circuit on the first issue and supplies neither
  transformed data nor detailed errors. This is not a guarantee that later refinement callbacks
  never run: in the verified uncompiled chained-refinement probe, both callbacks ran despite the
  first failing. Use `Schema.validateAsync(input)` in Classic or `z.validateAsync(Schema, input)` in
  Mini for async schemas; the promise cannot narrow a value. Use parse/safeParse when consumers need
  normalized output or issues; do not validate and then parse by default, which repeats work and
  effects. Validation may still run effects, so test their behavior.

## Official sources

- [Compilation: fallbacks, CSP, bundle cost, and effects](https://zod.dev/compile)
- [Zod 4.6: validate and standalone Mini](https://zod.dev/blog/zod-4-6)
- [Zod Mini](https://zod.dev/packages/mini)
- [Zod Core](https://zod.dev/packages/core)
- [Zod 4 release notes and benchmarks](https://zod.dev/v4)
- [Defining schemas: object extension and checks](https://zod.dev/api)
