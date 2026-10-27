> **Read this when:** The task parses tagged variants, ordinary unions, enum values, exhaustive enum-keyed records, or sparse enum maps.

# Unions, records, and enums

## Choose a runtime variant contract

Use `z.discriminatedUnion(key, options)` when object variants share a stable discriminator. It
selects by that key; test unknown/missing tags and invalid payloads within each selected branch.
Use `z.union()` when no such tag exists. Ordinary unions try options in order and return the first
successful parsed result, so overlapping alternatives and transformations can make order observable.
General domain-state and exhaustiveness design belongs to `typescript`.

Current v4 supports union and pipe discriminator schemas and nested discriminated-union
composition. This is not a v3 promise or a license to use an arbitrary transform as a discriminator:
confirm literal extraction in the installed declarations/runtime, including every accepted raw tag.
Prefer plain literals/enums unless richer tags serve the actual contract.

```ts
// Verified with zod@4.6.7, import { z } from "zod/v4".
const Failure = z.discriminatedUnion("code", [
  z.object({ status: z.literal("failed"), code: z.literal("missing") }),
  z.object({ status: z.literal("failed"), code: z.literal("invalid"), reason: z.string() }),
]);
const Result = z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), data: z.string() }),
  Failure,
]);
```

V3 supports simpler object alternatives; flatten branches or use an ordinary union when its
installed discriminator contract cannot compose the required graph. Do not migrate solely for syntax.

## Decide whether enum keys are required

In v4, `z.enum(enumLike)` accepts supported enum-like objects/TypeScript enums and replaces
`z.nativeEnum()`. For literal lists, preserve literal inference (an inline array or `as const`).
V3 uses `z.enum()` for string literal tuples and `z.nativeEnum()` for supported enum-like values.

```ts
// Verified with zod@4.6.7, import { z } from "zod/v4".
const Key = z.enum(["name", "email"]);
const Complete = z.record(Key, z.string());
const Sparse = z.partialRecord(Key, z.string());
Complete.safeParse({ name: "Ada" }); // failure: email is required
Sparse.parse({ name: "Ada" }); // success
```

A v4 enum-keyed record requires every enum key and validates each value; `z.partialRecord()` makes
those keys optional but still rejects keys outside the enum. Test missing keys, unexpected keys,
and invalid present values. V3 enum-keyed records are partial rather than exhaustive, and v4's
`partialRecord` is not a v3 API. Recheck inferred optionality and runtime acceptance together during
migration. Do not use object strictness as a substitute for choosing the record's key contract.

## Official sources

- [Discriminated unions, enums, and records](https://zod.dev/api)
- [V4 upgraded discriminated unions](https://zod.dev/v4#upgraded-zdiscriminatedunion)
- [V3-to-v4 enum and record changes](https://zod.dev/v4/changelog)
