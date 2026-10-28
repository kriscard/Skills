> **Read this when:** The task selects a Zod 4 import, uses an ecosystem adapter, relies on Standard Schema, or proposes an API that may depend on the installed Zod 4 minor.

# Imports and capabilities

## Select one effective entrypoint

Use the import already established by the application unless the task measures and approves a change:

| Import | Effective Zod 4 contract |
|---|---|
| `zod` | Classic API exported by the resolved package root |
| `zod/v4` | Explicit Classic API |
| `zod/mini`, `zod/v4/mini`, `zod/v4-mini` | Mini's functional API |
| `@zod/mini` | Standalone package re-exporting its peer `zod/mini`; inspect both resolved versions |

A package label is not enough. Inspect the source import, package-manager resolution, package
`exports`, and the declarations reached by that exact import. Keep one entrypoint within a schema
graph so schema and adapter types come from the same contract. Application code should use Classic or
Mini, not `zod/v4/core`; Core is the substrate for library authors implementing against both APIs.

**Failure check:** typecheck a schema created by the chosen entrypoint through every adapter boundary.
Duplicate installations or an adapter compiled against another schema type often surface there first.

## Classify current capabilities accurately

Native `z.toJSONSchema()` is part of the Zod 4.0 surface. Treat it as a Zod 4 capability while still
checking the selected entrypoint and downstream dialect. Capability-check APIs added later, including
codecs, reverse JSON Schema conversion, standalone `@zod/mini`, compilation, and boolean-only
validation. `z.fromJSONSchema()` is explicitly experimental in current documentation, and adapter
support can lag the Zod package even when a schema typechecks.

A capability check is concrete: search the resolved `.d.ts`, compile a minimal import, and execute one
success and one failure case. Do not infer availability from a blog date or from `^4` in a manifest.
Pin exact versions only in test receipts or a caveat tied to that version; keep general guidance about
the stable behavior being chosen.

## Pattern: consume the Standard Schema contract

**Use when:** a library-facing adapter should accept Zod and other Standard Schema implementations
without discarding transformed output, async validation, or structured issues. The spec's `validate`
may return a result synchronously or through a Promise, so an async integration boundary can safely
normalize both with `await`.

```ts
import type { StandardSchemaV1 } from "@standard-schema/spec";

export type AdapterResult<S extends StandardSchemaV1> =
  | { success: true; data: StandardSchemaV1.InferOutput<S> }
  | { success: false; issues: ReadonlyArray<StandardSchemaV1.Issue> };

export async function validateStandard<S extends StandardSchemaV1>(
  schema: S,
  input: unknown,
): Promise<AdapterResult<S>> {
  const result = await schema["~standard"].validate(input);
  if (result.issues) return { success: false, issues: result.issues };
  return { success: true, data: result.value };
}
```

With a transforming Zod schema, `data` is its output rather than the raw input:

```ts
import { z } from "zod";

const Quantity = z.strictObject({
  quantity: z.string().regex(/^[1-9]\d*$/).transform(Number),
});

type QuantityInput = StandardSchemaV1.InferInput<typeof Quantity>; // { quantity: string }
type QuantityOutput = StandardSchemaV1.InferOutput<typeof Quantity>; // { quantity: number }

const raw: QuantityInput = { quantity: "12" };
const result = await validateStandard(Quantity, raw);
if (result.success) {
  const output: QuantityOutput = result.data;
  const quantity: number = output.quantity;
}
```

**Observable result:** the underlying Standard Schema call can return synchronously, while this async
adapter normalizes both forms; async refinements/transforms are awaited, successful transforms retain
their output type, and failures preserve the Standard Schema message/path objects. The portable issue
contract does not promise Zod-specific
issue codes. A consumer such as a form library may intentionally use only issues and keep raw values;
verify that installed consumer rather than assuming it stores the returned output.

**Alternative:** a Zod-specific adapter may call `safeParseAsync` and expose full `ZodIssue` metadata
when vendor-neutral interoperability is not a requirement. If a caller must preserve a synchronous
return instead of normalizing to Promise, return `schema["~standard"].validate(input)` unchanged and
handle its result-or-Promise union explicitly.

**Failure check:** execute one transformed success, one field failure with its path, and one async
schema. Assert whether the actual integration consumes `value` or issues only.

## Pattern: prove generated and adapter-owned boundaries

Generated Zod schemas, database-derived schemas, middleware validators, RPC inputs, and generated
clients share one Zod-facing seam: verify the schema produced for the exact operation, then exercise
accepted and rejected runtime values before trusting generated TypeScript.

```ts
import assert from "node:assert/strict";
import { z } from "zod";

export async function assertSchemaBoundary<S extends z.ZodType>(
  schema: S,
  accepted: unknown,
  rejected: unknown,
): Promise<z.output<S>> {
  const valid = await schema.safeParseAsync(accepted);
  if (!valid.success) throw valid.error;

  const invalid = await schema.safeParseAsync(rejected);
  assert.equal(invalid.success, false);
  return valid.data;
}
```

Await this helper for both synchronous and asynchronous schemas, including nested async effects.

Use an insert/update schema for writes and a select/response schema for reads; they are not
interchangeable merely because one tool generated both. For a generated client, assign the transport
result to `unknown` at the trust boundary and parse with the generated response schema before domain
or Query-cache use. For middleware/RPC adapters, assert async behavior and the projected issue/status
contract in addition to schema acceptance.

**Failure check:** use a production-shaped accepted fixture and a deliberately malformed fixture that
exercises missing, null, format, or extra-key drift. If both pass, the generated boundary is not
enforcing the claimed contract.

For React Hook Form resolvers that expose the current three-generic contract, transformed schemas can
use:

```ts
useForm<z.input<typeof FormSchema>, unknown, z.output<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
});
```

Check the installed overloads and `raw` option. Zod owns the two representations; React Hook Form owns
default values, field registration, reset/dirty state, and submission lifecycle. Native
`z.toJSONSchema()` is the first option for publishing a Zod-owned JSON Schema; route/OpenAPI tools
remain separate contracts with route, parameter, response, dialect, and metadata responsibilities.

## Official sources

- [Zod packages and versioning](https://zod.dev/v4/versioning)
- [Zod Mini](https://zod.dev/packages/mini)
- [For library authors](https://zod.dev/library-authors)
- [Standard Schema](https://standardschema.dev/)
- [TanStack Form Standard Schema behavior](https://tanstack.com/form/latest/docs/framework/react/guides/validation)
- [React Hook Form resolvers](https://github.com/react-hook-form/resolvers)
- [Hono Zod validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator)
- [Drizzle Zod generated read/write schemas](https://orm.drizzle.team/docs/zod)
- [Zod ecosystem](https://zod.dev/ecosystem)
