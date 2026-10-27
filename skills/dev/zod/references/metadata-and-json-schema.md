> **Read this when:** The task attaches metadata, uses registries, converts Zod to/from JSON Schema, generates structured-output schemas, or evaluates schema-driven documentation/code generation.

# Metadata, registries, and JSON Schema

## Keep metadata separate from validation

Metadata describes a schema for documentation and tooling; it does not add runtime validation.
Use `.meta({...})` for the global registry's standard fields or a typed `z.registry<Meta>()` when a
separate consumer owns a different metadata contract.

Metadata propagation through derived schemas is version-sensitive. Current web docs describe
metadata as instance-specific, but verified `zod@4.6.7` registry lookup inherits non-`id` metadata from
a parent schema and JSON Schema conversion can still reference the parent's ID. Attach metadata to the
final exported schema and assert the generated artifact instead of assuming clone behavior.
`.register(registry, metadata)` is unusual because it returns the original schema.

Treat registry `id` values as unique and enforce that in application tooling. Current web docs say
duplicate IDs throw, but verified `zod@4.6.7` registries overwrite the ID lookup without throwing, so
do not use runtime rejection as the uniqueness check.

Do not add metadata or a global registry merely because a generator might exist later. Name the
consumer, required fields, registry lifetime, and whether global state is acceptable first.

## Convert in the intended direction and dialect

In compatible v4 entrypoints, `z.toJSONSchema(Schema)` converts the schema's **output** contract by
default. Use `{ io: "input" }` when the artifact describes accepted wire input instead. This choice is
observable for defaults, coercion, pipes, codecs, and transforms.

Select the target expected by the consumer. Verified `zod@4.6.7` defaults to JSON Schema Draft
2020-12 and also supports Draft 7, Draft 4, and an OpenAPI 3.0 target. Do not label one dialect as another or
assume an OpenAPI document generator accepts every JSON Schema keyword unchanged.

Some runtime contracts have no sound JSON Schema representation. Verified `zod@4.6.7` conversion
throws by default for unrepresentable schemas such as transforms. Prefer changing the artifact boundary or
supplying an explicitly reviewed representation; `{ unrepresentable: "any" }` emits permissive
schemas and can silently erase constraints, so it is not a general fallback.

```ts
// Verified with zod@4.6.7, import { z } from "zod/v4".
const Count = z.codec(z.string().regex(/^\d+$/), z.number().int(), {
  decode: Number,
  encode: String,
});
const acceptedInput = z.toJSONSchema(Count, { io: "input" }); // string contract
const producedOutput = z.toJSONSchema(Count); // integer contract
```

Metadata from the selected registry is copied into generated JSON Schema. Registered IDs may cause
the schema to be extracted into `$defs` and referenced with `$ref`. Treat titles, descriptions,
examples, and IDs as published contract data; reject collisions in your own checks and avoid
embedding secrets or internal-only details.

## Treat reverse conversion and generators as separate contracts

`z.fromJSONSchema()` is experimental in the current Classic API and absent from the current Mini
entrypoint. Gate it on installed declarations, pin behavior with representative parse cases, and do
not build a stable public API around assumed conversion completeness.

Native `z.toJSONSchema()` is a good first check for Zod 4 schema conversion, but it is not a blanket
replacement for OpenAPI route/document generators, client generators, or framework adapters. Inspect
the installed tool's supported Zod major, dialect, input/output direction, metadata conventions, and
runtime-validation guarantees. When an external OpenAPI document is authoritative, avoid creating a
second hand-maintained contract without an explicit synchronization owner.

## Verify the artifact

- typecheck the exact entrypoint and converter options;
- assert representative generated nodes, required keys, unknown-key behavior, metadata, and refs;
- test at least one runtime value against the Zod schema as well as the downstream artifact consumer;
- snapshot only stable external structure, not incidental key ordering;
- document whether the artifact describes accepted input, parsed output, or both.

## Official sources

- [Metadata and registries](https://zod.dev/metadata)
- [Versioned 4.6.7 registry implementation](https://github.com/colinhacks/zod/blob/b500a2ee95134f81d74da7911d7378dd2853d042/packages/zod/src/v4/core/registries.ts)
- [JSON Schema conversion, direction, dialects, and unrepresentable types](https://zod.dev/json-schema)
- [Zod 4.6: `fromJSONSchema()` changes](https://zod.dev/blog/zod-4-6)
- [Library-author and adapter compatibility](https://zod.dev/library-authors)
