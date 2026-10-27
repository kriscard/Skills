> **Read this when:** The task changes object unknown-key behavior, composition, extension, intersections, refinements, or cross-field validation.

# Objects and refinements

## Make unknown-key policy visible

Plain `z.object()` strips unrecognized keys by default. Choose a different policy only from the
boundary contract:

- **v4:** `z.strictObject()` rejects unknown keys; `z.looseObject()` preserves them; `.catchall()`
  validates unknown values.
- **v3:** `.strict()`, `.passthrough()`, the default strip behavior, and `.catchall()` are the
  corresponding supported contracts.

At security-sensitive boundaries, strictness is not automatically safer: rejecting unknown keys,
stripping them, or validating a controlled extension map are different API decisions. State which
one the consumer requires and test the parsed output, not only acceptance.

## Compose objects as objects

For v4 object composition:

- use shape spread when multiple shapes are combined or strictness should be visually explicit;
- use `.extend()` for a small deliberate extension when overwrites are acceptable;
- use `.safeExtend()` when assignability must be preserved or the base object has refinements;
- avoid legacy `.merge()` and avoid `z.intersection()` as an object-merging shortcut.

Shape spread makes overwrite order and the resulting `z.object`, `z.strictObject`, or
`z.looseObject` policy explicit and is usually the best TypeScript contract for large composed
schemas. `.extend()` can overwrite fields and chained calls can impose avoidable typechecking cost.

For v3, use its documented object APIs and verify the inherited unknown-key/catchall policy when
using `.merge()`. Prefer object composition over intersections because intersections return a less
useful intersection schema without object methods such as `pick` and `omit`.

Never replace a refined base object with a shape-only reconstruction without deciding whether its
refinements must survive.

## Prefer built-in checks, then refinements

Use a built-in schema or check when it expresses the rule. In Classic, use `.refine()` for one custom
issue and cross-field predicates; attach a deliberate `path` when a specific field should own the
feedback. Mini expresses the same custom predicate as `Schema.check(z.refine(...))`; see the Mini
reference before translating any method chain. Refinement functions return success/failure and should
not throw.

When multiple issues or lower-level control are required, match the installed contract:

- v3 commonly uses `.superRefine()` with `ctx.addIssue()`;
- v4 supports its current check/refinement APIs, with `.check()` as the lower-level and potentially
  faster mechanism. Do not choose it for ordinary validation without a control or measured
  performance need.

If a refinement is async, every caller must use async parsing. Keep database/network checks out of a
schema when batching, cancellation, authorization, transaction ownership, or failure recovery
belongs to a service layer rather than validation.

In compatible v4 releases, checks normally continue after continuable issues, collecting multiple
failures. A failing refinement with `abort: true` is non-continuable and prevents later dependent
checks; a wrong base type also prevents refinements from receiving an unsafe value. Async behavior
is transitive through nested schemas and requires async parsing end to end.

Use v4 `when` only when an independent check is incorrectly skipped because an unrelated field
failed. Its predicate controls scheduling, not validity: safe-parse a separate prerequisite schema
containing every field that the refinement reads, for example
`when(payload) { return Prerequisites.safeParse(payload.value).success; }`.
Keep prerequisites free of the refinement itself to avoid recursion, and test invalid prerequisite
values as well as unrelated-field failures. `when` can override normal scheduling safeguards;
returning true unconditionally can expose unsafe values or uncaught exceptions.

## Official sources

- [Defining schemas: objects, extension, intersections, and refinements](https://zod.dev/api)
- [Zod 4 migration guide: object and refinement changes](https://zod.dev/v4/changelog)
- [Official Zod v3 documentation source](https://github.com/colinhacks/zod/tree/main/packages/docs-v3)
