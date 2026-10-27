> **Read this when:** The task involves input/output types, parsing, form-string conversion, pipes, transforms, codecs, default/prefault/catch/readonly wrappers, coercion, or async schemas.

# Types and parsing

## Preserve both sides of a schema

`z.infer<typeof Schema>` is the parsed output type. Use `z.output<typeof Schema>` when naming that
side improves clarity, and use `z.input<typeof Schema>` for the accepted pre-parse value. These can
differ after coercion, preprocessing, transforms, pipes, defaults, or codecs.

Derive types from the schema instead of separately declaring matching shapes. In generic helpers,
preserve the concrete schema relationship rather than accepting a broad schema and returning
`unknown` or laundering the result with an assertion. Let `typescript` own general generic design;
this reference owns the Zod input/output relationship. Derive the runtime contract type, then map to
an independently owned domain type when its representation or invariants intentionally differ;
schema inference is not a requirement to make the domain model identical to the wire contract.

For React Hook Form, the form's editable value normally follows the schema input while a transformed
submission follows the output. Confirm the installed resolver's generic contract instead of copying
a version-specific signature. Current compatible resolvers support
`useForm<z.input<typeof Schema>, Context, z.output<typeof Schema>>` with `zodResolver(Schema)`;
verify the installed overloads, including whether `raw: true` returns input instead of parsed output.
Defaults, reset behavior, dirty state, and server-error lifecycle
remain owned by `react-hook-form`.

## Choose the parse result intentionally

- Use `parse` when invalid input should throw at that boundary.
- Use `safeParse` when failure is an expected branch and the caller should inspect the discriminated
  result.
- Use `parseAsync` or `safeParseAsync` when any nested refinement or transform is asynchronous.
  Async behavior is transitive through composed schemas; a synchronous top-level call is not safe
  merely because its own code is synchronous.

Keep the original input `unknown` until parsing succeeds. Parse once at an ownership boundary and
pass the typed result inward unless a new untrusted boundary is crossed.

## Coercion is conversion, not intent

Primitive coercion follows JavaScript conversion semantics. Test ambiguous values explicitly:
empty strings, whitespace, `null`, booleans, invalid numeric strings, and strings such as `"false"`
whose JavaScript truthiness may surprise users.

Prefer the narrowest honest contract:

1. use a native schema when the producer can send the right type;
2. validate an allowed raw representation, then transform or pipe it;
3. use `z.coerce.*` when JavaScript conversion is the desired policy.

In Zod 4, coercion inputs are `unknown` by default and can be narrowed with the supported generic
when the producer is known. Do not annotate a narrower input merely to hide values that still arrive
at runtime.

For string-valued form/query inputs, decide blank, whitespace, missing, and invalid policies before
conversion. `z.coerce.number()` turns `""` and `"   "` into `0`; `z.coerce.boolean()` turns `"false"`
into `true`. A required decimal field can validate its raw string before conversion:

```ts
// Verified with zod@4.6.7, import { z } from "zod/v4".
const Amount = z.string().trim().regex(/^\d+(?:\.\d+)?$/)
  .transform(Number).pipe(z.number().finite());
```

This deliberately rejects blanks, missing values, signs, and exponent notation; choose a different
raw grammar when the product needs them. Where installed, v4 `z.stringbool()` parses explicit
boolean-string vocabularies (including `"false"` → `false`) and rejects unknown tokens. Its default
vocabulary is case-insensitive and broader than `true`/`false`; set `truthy`/`falsy` and `case` to the
producer contract. Native checkboxes already producing booleans need `z.boolean()`, not stringbool.
Form extraction and empty-field lifecycle remain form-owned.

## Transforms, preprocessing, and defaults

Validate before transforming when possible. Transform and preprocessing functions should not throw;
represent expected invalid data through schema validation. Keep side effects and remote I/O out of
ordinary transforms unless the boundary is deliberately asynchronous and tested as such.

### Pipes, one-way transforms, and reversible codecs

Match each API to installed declarations, not merely a v4 package label. A pipe sends the first
schema's output into the next schema; it does not itself make conversion reversible. A transform
is one-way: validate its input first, then convert. Encoding a graph containing a one-way transform
throws a regular runtime error, even through a safe encoding API.

When both directions are required, compatible v4 releases expose `z.codec(inputSchema, outputSchema,
{ decode, encode })`. Forward `parse`/`decode` validates input then output; backward `encode` validates
output then input. Callbacks must implement the intended round trip; Zod cannot prove invertibility.

```ts
// Verified with zod@4.6.7, import { z } from "zod/v4".
const Instant = z.codec(z.iso.datetime(), z.date(), {
  decode: (iso) => new Date(iso),
  encode: (date) => date.toISOString(),
});
const date = z.decode(Instant, "2026-01-01T00:00:00.000Z");
const wire = z.encode(Instant, date);
```

`parse` accepts unknown; typed `decode` accepts the schema input and `encode` accepts its output.
Use `decodeAsync`/`encodeAsync` for async callbacks and the installed `safeDecode`/`safeEncode` and
`safeDecodeAsync`/`safeEncodeAsync` variants for recoverable validation failures. These do not catch
arbitrary exceptions thrown by application callbacks. Prefer a transform or boundary mapper when
reverse encoding is not needed.

### Fallbacks and readonly wrappers

The following describes the verified v4 full API; inspect declarations before using it on Mini or
an older release.

| Wrapper | Forward parsing | Reverse encoding |
|---|---|---|
| `.default(value)` | On `undefined`, returns an output-compatible value without parsing it | Default is not applied |
| `.prefault(value)` | On `undefined`, parses the input-compatible replacement normally | Prefault is not applied |
| `.catch(value)` | Returns the fallback on validation failure | Does not recover encoding failures |
| `.readonly()` | Parses normally, marks output statically readonly, then `Object.freeze()`s that result | Not a conversion or deep-freeze guarantee |

For `z.string().trim().toUpperCase()`, `.default(" tuna ")` returns `" tuna "`, while
`.prefault(" tuna ")` returns `"TUNA"`. Catch is appropriate only when fallback is part of the
boundary contract; silently replacing a broken backend response can hide a contract violation.
Readonly freezes only the wrapped result, not nested objects; freezing a Map/Set also does not
prevent its mutating methods from changing internal entries. Wrap nested schemas deliberately if
needed rather than claiming deep immutability.

In v3, defaults are parsed as input. In v4, field defaults also apply inside optional fields, so
an absent key may appear in parsed output. Verify both differences during migration.

## Official sources

- [Defining schemas: parsing, coercion, transforms, and input/output](https://zod.dev/api)
- [Codecs: directions, fallbacks, and async/safe APIs](https://zod.dev/codecs)
- [Resolver input/output generics](https://github.com/react-hook-form/resolvers)
- [Zod 4 migration guide: coercion and defaults](https://zod.dev/v4/changelog)
- [Official Zod v3 documentation source](https://github.com/colinhacks/zod/tree/main/packages/docs-v3)
