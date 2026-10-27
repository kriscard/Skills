> **Read this when:** The task considers Zod Mini, bundle reduction, boolean-only validation, compilation, schema construction, caching, or parse throughput.

# Classic, Mini, and measured performance

## Choose from a measured constraint

Use Classic by default. Choose Mini when a production browser bundle has an unusually strict size
budget and the measured reduction justifies a less discoverable functional API. Backend code and
ordinary applications rarely benefit from changing APIs for a generic “smaller is faster” claim.

Measure the signal that motivated the work:

- production chunk bytes and target network/device conditions for Mini;
- representative valid and invalid payload throughput for parser work;
- TypeScript diagnostics for typechecking cost;
- CSP/no-eval behavior and startup cost for compilation.

## Pattern: translate Classic to Mini deliberately

Classic and Mini provide the same validation purpose through different authoring styles:

```ts
// Classic
import { z } from "zod";

const ClassicName = z.string().trim().min(1).max(80);
```

```ts
// Mini
import * as z from "zod/mini";

const MiniName = z.string().check(z.trim(), z.minLength(1), z.maxLength(80));
```

Mini keeps parsing methods, while most modifiers become wrappers or checks:

```ts
const MaybeName = z.nullable(z.optional(MiniName));
const AdultAge = z.number().check(z.refine((age) => age >= 18, { error: "Adult only" }));
```

Use `Schema.check(z.refine(...))` for a custom predicate and `Schema.check(z.check(...))` for
lower-level multiple-issue control. Mini schemas do not offer Classic `.refine()` or `.superRefine()`
methods. Confirm adapter compatibility before passing Mini schemas to an ecosystem library.

Mini does not load the English locale by default, so issue messages may be `"Invalid input"`. Load a
locale or provide stable custom errors when messages reach users or logs.

**Failure check:** typecheck the exact Mini import, execute equivalent Classic/Mini valid and invalid
fixtures, compare parsed output and issue paths, and compare production bundles with the project's
actual bundler. A source-import change alone is not evidence of savings.

## Pattern: compose Mini transform stages

Mini's `z.pipe(input, output)` is binary. Compose additional stages with named intermediate schemas:
first establish the wire grammar, then transform, then validate the normalized output.

```ts
import assert from "node:assert/strict";
import * as z from "zod/mini";

const RawCount = z.string().check(z.regex(/^[1-9]\d*$/));
const ParsedCount = z.pipe(RawCount, z.transform(Number));
const Count = z.pipe(ParsedCount, z.int().check(z.positive()));

assert.equal(z.parse(Count, "12"), 12);
assert.equal(z.safeParse(Count, "").success, false);
assert.equal(z.safeParse(Count, "4.5").success, false);
assert.equal(z.safeParse(Count, "9".repeat(400)).success, false);
```

**Observable result:** the consumer receives a positive safe integer, not the raw string. Lexical
failures stop before conversion; numeric overflow fails the output schema. Typecheck every stage
against the exact Mini import. Use a codec instead only when the caller needs a real reverse mapping.

## Pattern: Mini custom check plus input artifact

**Use when:** a bundle-sensitive library consumer needs Mini runtime validation and a JSON Schema for
its accepted input. Keep representable checks visible and test what the artifact cannot express.

```ts
import assert from "node:assert/strict";
import * as z from "zod/mini";

const ProductInput = z
  .strictObject({
    code: z.string().check(
      z.minLength(1),
      z.refine((value) => value !== "RESERVED", { error: "Reserved code" }),
    ),
    quantity: z.string().check(z.regex(/^[1-9]\d*$/)),
  })
  .check(z.meta({ title: "Product input" }));

const rejected = z.safeParse(ProductInput, { code: "RESERVED", quantity: "2" });
assert.equal(rejected.success, false);
if (!rejected.success) assert.deepEqual(rejected.error.issues[0]?.path, ["code"]);

const artifact = z.toJSONSchema(ProductInput, { io: "input" });
assert.equal(artifact.title, "Product input");
assert.equal(artifact.additionalProperties, false);
const quantityArtifact = artifact.properties?.quantity;
assert.ok(quantityArtifact && typeof quantityArtifact === "object");
if (quantityArtifact && typeof quantityArtifact === "object" && "pattern" in quantityArtifact) {
  assert.equal(quantityArtifact.pattern, "^[1-9]\\d*$");
}
assert.equal(JSON.stringify(artifact).includes("RESERVED"), false);
```

**Observable result:** Mini enforces the custom reserved-code predicate at runtime; the input artifact
preserves object policy, metadata, minimum length, and regex, but not the arbitrary predicate. A
successful conversion is not proof that every runtime refinement survived.

**Alternative:** if the external consumer must enforce the same condition, express it with a
representable schema construct (for example enum or regex) when honest, or publish a separately owned
artifact rule and test it against the same fixtures. Do not silently label the weaker artifact as the
complete runtime contract.

**Failure check:** validate the positive and negative runtime cases, assert the final artifact's
dialect/direction/metadata and key constraints, and inspect omissions. Conversion of an unrepresentable
transform may throw; keep that as an artifact-build failure or move generation to a representable wire
schema instead of using a permissive fallback.

## Parse and validate answer different questions

Parsing returns normalized output or structured failure. Newer Zod 4 minors may also expose boolean
validation; capability-check the installed declarations.

- Classic may expose `Schema.validate(input)` and `z.validate(Schema, input)`.
- Mini uses functional `z.validate(Schema, input)`; Mini instances do not expose `.validate()`.
- Async schemas require the installed async validation form.

`validate` answers whether the **input** is valid. It does not return transformed output or issues.
It may still execute refinements/transforms, so effects must remain pure. Do not validate and then
parse by default; that repeats work and callbacks.

**Use parse/safeParse when:** a consumer needs normalized data, issue details, or a Query/request
failure. **Use validate when:** a measured hot path genuinely needs only a boolean and no output.

## Compile only a demonstrated hot path

Compilation is a newer optional Zod 4 capability. Inspect the effective entrypoint, keep the returned
compiled schema, and benchmark it against the ordinary schema:

```ts
const CompiledOrder = z.compile(OrderSchema);
const order = CompiledOrder.parse(payload);
```

Runtime compilation uses dynamic code generation. Strict CSP/no-eval can prevent acceleration;
unsupported or async constructs can cause partial or whole-schema fallback. A non-throwing compile
call does not prove the fast path was installed. Use strict compiler options where available when the
task must surface refusal.

Benchmark realistic valid and invalid traffic. Invalid inputs may fall back to the regular parser for
detailed issues, and effects on a failed fast path can execute again during fallback. Keep refinements
and transforms pure and verify parsed output, issue paths, and async behavior—not throughput alone.
Compiler code also adds bundle bytes, so Mini plus compiler can defeat a bundle-size goal.

## Optimize simpler costs first

- Prefer explicit object shape spread over long `.extend()` chains when TypeScript diagnostics show a
  composition cost.
- Reuse module-level schemas; ordinary reuse needs no cache layer.
- Add parsed-result caches only with repeated-cost evidence, a correct key, bounded lifetime, and
  invalidation rules. Locale, error customization, async dependencies, and mutable input can make
  speculative caches incorrect.
- Use lower-level `.check()` only when it clarifies multiple issues or a profile demonstrates the
  need; preserve the same output and failures.

## Specific version caveat

Compile/validate details above were executable in exact `zod@4.6.7`, including Classic instance
validation and Mini functional validation. They are capability-qualified because earlier Zod 4 minors
do not expose every API. Test the installed declaration and runtime instead of generalizing a patch
receipt to all Zod 4.

## Official sources

- [Zod Mini](https://zod.dev/packages/mini)
- [Compilation and CSP/fallback behavior](https://zod.dev/compile)
- [Zod 4.6 boolean validation](https://zod.dev/blog/zod-4-6)
- [Schema checks and object composition](https://zod.dev/api)
