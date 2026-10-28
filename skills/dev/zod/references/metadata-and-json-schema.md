> **Read this when:** A Zod 4 schema drives JSON Schema, structured outputs, documentation, registries, code generation, or an OpenAPI-related artifact.

# Metadata and JSON Schema artifacts

## Start from artifact ownership

Metadata does not add runtime validation. Add it only when a named consumer needs titles,
descriptions, examples, IDs, or custom fields. Use `.meta({...})` for global-registry metadata and a
typed `z.registry<Meta>()` when a separate tool owns a distinct metadata contract.

Attach metadata to the final exported schema rather than an intermediate shape. Treat IDs as published,
unique contract identifiers and enforce uniqueness in artifact tests or registry-building code. Avoid
secrets and internal-only instructions in metadata that may be published.

## Pattern: publish the intended direction

**Use when:** tooling consumes a JSON Schema generated from a Zod-owned contract. Capability-check
`z.toJSONSchema` in the installed entrypoint, then choose whether the artifact describes accepted
input or parsed output.

```ts
import { z } from "zod";

const Count = z.codec(z.string().regex(/^\d+$/), z.number().int().nonnegative(), {
  decode: Number,
  encode: String,
});

const acceptedInput = z.toJSONSchema(Count, { io: "input" });
const parsedOutput = z.toJSONSchema(Count);
```

**Observable result:** `acceptedInput` is a string schema with the digit pattern; `parsedOutput` is a
nonnegative integer schema. The default direction is output, which is wrong for a wire-input artifact
when coercion, transforms, defaults, pipes, or codecs change representation.

Select the dialect required by the consumer. Current implementations can target JSON Schema drafts
and OpenAPI 3.0, but an OpenAPI document generator remains a separate integration: it also owns routes,
parameters, responses, components, and dialect-specific constraints.

**Alternative:** publish the pre-transform wire schema directly when conversion is one-way or the
output uses runtime-only values. If an external OpenAPI document is authoritative, generate/consume
from that source with a synchronization owner rather than maintaining two independent contracts.

**Failure check:** assert direction and representative nodes, then validate a real value with Zod and
with the downstream consumer. Do not stop at “conversion did not throw.”

## Pattern: test the artifact with its consumer

**Use when:** JSON Schema is delivered to another validator, generator, structured-output service, or
documentation pipeline. Inspecting nodes catches direction/metadata mistakes; compiling and exercising
the artifact with the selected consumer proves that accepted and rejected values behave as claimed.

```ts
import assert from "node:assert/strict";
import { Ajv2020 } from "ajv/dist/2020.js";

const OrderWire = z
  .strictObject({
    id: z.string().min(1),
    quantity: z.number().int().positive(),
  })
  .meta({ title: "Order payload" });

const artifact = z.toJSONSchema(OrderWire, {
  io: "input",
  target: "draft-2020-12",
});

assert.deepEqual(artifact.required, ["id", "quantity"]);
assert.equal(artifact.additionalProperties, false);

const validateArtifact = new Ajv2020({ allErrors: true }).compile(artifact);
assert.equal(validateArtifact({ id: "o1", quantity: 2 }), true);
assert.equal(validateArtifact({ id: "o1", quantity: 0 }), false);
assert.equal(validateArtifact({ id: "o1", quantity: 2, extra: true }), false);
assert.ok(validateArtifact.errors);
```

**Observable result:** the external validator accepts the same representative input and rejects the
same positive-integer and strict-object violations. Ajv is an example consumer, not a required Zod
dependency; use the project's actual JSON Schema/OpenAPI/structured-output consumer in its fixture.

**Alternative:** when a route/OpenAPI generator owns the final document, run that generator and inspect
or validate the emitted request/response component rather than testing only the intermediate Zod JSON
Schema. When an external specification is authoritative, test generated Zod schemas against accepted
and malformed fixtures instead.

**Failure check:** assert selected metadata and `$ref`/`$defs` behavior when published, then exercise at
least one accepted and one invalid value through both Zod and the artifact consumer. Snapshot only
stable external structure, not incidental key ordering.

## Handle unrepresentable schemas explicitly

Some runtime contracts have no sound JSON Schema representation, including ordinary transforms and
runtime-only values. Conversion throws by default. Prefer moving the artifact boundary to a
representable wire schema or supplying a narrowly reviewed representation. A blanket
`{ unrepresentable: "any" }` emits permissive `{}` nodes and can silently erase constraints.

Native conversion is the first option for Zod-owned JSON Schema. Route/OpenAPI libraries, client
code generators, database adapters, and AI structured-output consumers still need exact-version tests
for dialect, metadata, input/output direction, and runtime-validation guarantees.

`z.fromJSONSchema()` is experimental in current Classic documentation and is not a stable inverse of
every generated artifact. Gate it on installed declarations and pin representative parse behavior
before putting it behind a public API.

## Specific version caveat

Current documentation describes metadata as instance-specific and duplicate registry IDs as errors.
Exact `zod@4.6.7` probes observed inherited parent metadata during lookup/conversion and duplicate-ID
lookup replacement instead of a throw. This is a patch-specific receipt, not a general Zod 4 rule:
attach metadata to final schemas, enforce ID uniqueness yourself, and test the installed version's
artifact.

## Official sources

- [Metadata and registries](https://zod.dev/metadata)
- [JSON Schema direction, dialects, and unrepresentable types](https://zod.dev/json-schema)
- [Codecs](https://zod.dev/codecs)
- [Library and adapter compatibility](https://zod.dev/library-authors)
- [Ajv JSON Schema validator](https://ajv.js.org/)
- [Zod to OpenAPI](https://github.com/asteasolutions/zod-to-openapi)
