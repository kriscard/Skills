> **Read this when:** The task parses transport data, feeds TanStack Query, separates wire/domain/form values, converts raw strings, uses transforms/defaults/codecs, or contains async validation.

# Types and parsing

## Pattern: transport to trusted Query data

**Use when:** a query function receives JSON or another untyped payload. Parse in the fetcher so a
successful query resolves only trusted output; TanStack Query requires failures to throw or reject.

```ts
import { z } from "zod";

const SubscriptionWire = z.strictObject({
  id: z.uuid(),
  plan: z.enum(["essential", "scale", "elite"]),
  priceCents: z.number().int().nonnegative(),
  renewsAt: z.iso.datetime(),
});

const SubscriptionSchema = SubscriptionWire.transform((wire) => ({
  id: wire.id,
  plan: wire.plan,
  priceCents: wire.priceCents,
  renewsAt: new Date(wire.renewsAt),
}));

type Subscription = z.output<typeof SubscriptionSchema>;

export async function getSubscription(id: string): Promise<Subscription> {
  const response = await fetch(`/api/subscriptions/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`Subscription request failed: ${response.status}`);

  const payload: unknown = await response.json();
  return SubscriptionSchema.parse(payload);
}
```

**Observable result:** HTTP failure and contract failure both reject the query function; success puts
`Subscription`, including a real `Date`, into the cache. Components do not parse it again.

**Alternative:** use `safeParse` when this caller can recover locally. If Query still needs an error
state, inspect the structured issues and throw a boundary-specific error rather than returning an
invalid success value. Keep `SubscriptionWire` and a separate mapper when the wire schema must also
publish JSON Schema, when mapping has domain dependencies, or when domain construction deserves its
own tests.

**Failure check:** test a non-2xx response, malformed JSON shape, extra key under the chosen strict
policy, invalid timestamp, and valid output. Query retry/cache/rendering behavior remains Query-owned.

## Pattern: precise raw order to trusted command

**Use when:** a wire field is string-encoded but the domain needs a number. Validate the raw grammar
before conversion so JavaScript coercion cannot turn blanks or whitespace into zero.

```ts
import { z } from "zod";

export const OrderInput = z.strictObject({
  id: z.string().min(1),
  quantity: z
    .string()
    .regex(/^[1-9]\d*$/, { error: "Quantity must be positive decimal digits" })
    .transform(Number)
    .pipe(z.number().int().positive().max(Number.MAX_SAFE_INTEGER)),
  note: z.string().optional(),
});

export type RawOrder = z.input<typeof OrderInput>;
export type ParsedOrder = z.output<typeof OrderInput>;

type OrderParseResult =
  | { success: true; data: ParsedOrder }
  | { success: false; issues: Array<{ code: string; path: PropertyKey[] }> };

export function parseOrder(input: unknown): OrderParseResult {
  const result = OrderInput.safeParse(input);
  if (result.success) return result;
  return {
    success: false,
    issues: result.error.issues.map(({ code, path }) => ({ code, path })),
  };
}

function priceOrder(order: ParsedOrder): number {
  return order.quantity * 250;
}

declare const payload: unknown;
const parsed = parseOrder(payload);
if (parsed.success) {
  priceOrder(parsed.data); // trusted output; no second parse
}
```

**Observable result:** `{ id: "o1", quantity: "12" }` produces quantity `12`. Missing quantity and
`""`, whitespace, `"0"`, `"-1"`, and `"1.5"` fail at path `quantity`; no payload is copied into the
projected issue shape.

Representative runtime assertions:

```ts
import assert from "node:assert/strict";

assert.equal(parseOrder({ id: "o1", quantity: "12" }).success, true);
for (const quantity of ["", "   ", "0", "-1", "1.5"]) {
  const result = parseOrder({ id: "o1", quantity });
  assert.equal(result.success, false);
  if (!result.success) assert.deepEqual(result.issues[0]?.path, ["quantity"]);
}
assert.equal(parseOrder({ id: "o1" }).success, false);
```

**Alternative:** accept a native number with `z.number().int().positive()` when the producer can send
one. Use coercion only if JavaScript's conversion table is the intended wire policy.

## Preserve wire, form, and domain representations

`z.infer<typeof Schema>` is the parsed output. Name both sides when they differ:

```ts
type RawSubscription = z.input<typeof SubscriptionSchema>;
type Subscription = z.output<typeof SubscriptionSchema>;
```

The schema input type describes values accepted by the schema; the actual external value remains
`unknown` until `parse` succeeds. Infer contract types instead of maintaining a duplicate interface.
An independent domain type is appropriate when its representation or invariants intentionally differ.

A form often has string-valued intermediate state even when submission needs numbers:

```ts
const QuantityForm = z
  .strictObject({
    quantity: z.string().trim().regex(/^[1-9]\d*$/, { error: "Enter a whole number" }),
  })
  .transform(({ quantity }) => ({ quantity: Number(quantity) }))
  .pipe(z.strictObject({ quantity: z.number().int().min(1).max(999) }));

type QuantityFields = z.input<typeof QuantityForm>; // { quantity: string }
type QuantityCommand = z.output<typeof QuantityForm>; // { quantity: number }
```

**Observable result:** `{ quantity: "12" }` becomes `{ quantity: 12 }`; blanks, decimals, zero, and
values over 999 fail. A compatible React Hook Form resolver can hand the input type to editable fields
and the output type to submission. The form owner still decides defaults, reset/dirty behavior, when
to validate, and how to display errors.

**Alternative:** use the form library's native numeric extraction when its blank/invalid semantics
match the product, then validate with `z.number()`. Keep separate form and API schemas when their
intermediate states or messages differ; share small field schemas only where the runtime contract is
actually identical.

## Choose parse behavior from the caller

- `parse`: invalid input should throw at this boundary, as in a Query fetcher or request handler with
  an error boundary.
- `safeParse`: failure is an expected local branch and the caller needs `error.issues`.
- `parseAsync` / `safeParseAsync`: any nested refinement, transform, codec callback, or adapter parse
  is asynchronous.
- `validate`: only when the installed version exposes it and the caller needs a boolean about input,
  not parsed output or issues. It is not a replacement for parsing transformed data.

Async behavior is transitive through composed schemas. Test the top-level caller; a synchronous call
is invalid even when only a deeply nested check is async.

## Convert raw strings deliberately

Primitive coercion follows JavaScript conversion semantics. `z.coerce.number()` maps `""` and
whitespace to `0`; `z.coerce.boolean()` maps the non-empty string `"false"` to `true`. Test missing,
blank, whitespace, `null`, booleans, invalid numeric text, and overflow.

Choose the narrowest honest contract:

1. native schema when the producer can send the correct primitive;
2. raw grammar followed by transform/pipe when tokens have product meaning;
3. `z.coerce.*` only when JavaScript conversion is the intended policy.

For common formats, prefer installed Zod 4 schemas such as `z.email()`, `z.uuid()`, `z.url()`,
`z.httpUrl()`, and `z.iso.datetime()` over a copied regex. These validate a format, not every product
policy; add a documented refinement when the producer's grammar is narrower.

## Pattern: reversible codec with recoverable failure

**Use when:** the application must both decode a wire representation and encode the domain value.
Capability-check `z.codec` and safe encode/decode in the installed entrypoint.

```ts
const Profile = z.strictObject({ name: z.string().min(1), age: z.number().int().min(0) });

const ProfileJson = z.codec(z.string(), Profile, {
  decode: (text, ctx) => {
    try {
      return JSON.parse(text);
    } catch {
      ctx.issues.push({
        code: "invalid_format",
        format: "json",
        input: text,
        message: "Invalid JSON",
      });
      return z.NEVER;
    }
  },
  encode: (profile) => JSON.stringify(profile),
});

const decoded = z.safeDecode(ProfileJson, incomingText);
if (!decoded.success) {
  // Recover using decoded.error.issues; no exception is required for expected bad JSON.
}
```

Forward decode validates the input string, callback result, and output schema. Reverse encode validates
the output value and produced input. Callback round trips are application logic; Zod cannot prove
invertibility.

**Alternative:** use a transform or mapper when only inbound conversion is needed. A one-way transform
inside a graph cannot be made reversible by calling an encode helper.

**Failure check:** test valid round trip, malformed JSON, syntactically valid JSON with the wrong
shape, and encode input outside the output schema. Put expected callback failures into `ctx.issues`
and return `z.NEVER`; safe APIs do not catch arbitrary exceptions thrown by application callbacks.

## Defaults and fallbacks have different contracts

| Wrapper | Parsing behavior | Appropriate when |
|---|---|---|
| `.default(value)` | `undefined` returns an output-compatible value without parsing it | The default is already normalized |
| `.prefault(value)` | `undefined` substitutes an input-compatible value and parses normally | The replacement must run through trim/transform/checks |
| `.catch(value)` | Any validation failure returns a fallback | Invalid input is explicitly recoverable, not a contract violation to surface |
| `.readonly()` | Parses, marks output readonly, and freezes that result | Shallow runtime freezing is useful |

For `z.string().trim().toUpperCase()`, `.default(" tuna ")` yields `" tuna "`, while
`.prefault(" tuna ")` yields `"TUNA"`. Do not use `.catch()` to turn a broken backend contract into a
successful query unless fallback is the documented product behavior and separately observable.
`readonly()` is shallow; nested objects and Map/Set internals need their own policy.

## Official sources

- [Basic usage and inferred types](https://zod.dev/basics)
- [Schemas, coercion, transforms, formats, defaults, and refinements](https://zod.dev/api)
- [Codecs and safe direction APIs](https://zod.dev/codecs)
- [TanStack Query functions and thrown errors](https://tanstack.com/query/latest/docs/framework/react/guides/query-functions)
- [React Hook Form resolvers](https://github.com/react-hook-form/resolvers)
