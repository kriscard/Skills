> **Read this when:** The task parses tagged variants, overlapping alternatives, enum values, exhaustive enum-keyed records, or sparse enum maps.

# Unions, records, and enums

## Pattern: tagged transport variants

**Use when:** object variants share a stable discriminator. `z.discriminatedUnion()` selects by that
key and produces focused failures for unknown tags or an invalid selected branch.

```ts
import { z } from "zod";

const PaymentResult = z.discriminatedUnion("status", [
  z.strictObject({
    status: z.literal("paid"),
    receiptId: z.string().min(1),
  }),
  z.strictObject({
    status: z.literal("declined"),
    reason: z.enum(["insufficient_funds", "expired_card", "blocked"]),
  }),
]);

type PaymentResult = z.output<typeof PaymentResult>;
```

**Observable result:** TypeScript narrows `receiptId` and `reason` from `status`, while runtime parsing
rejects missing/unknown tags and branch-specific malformed data.

**Alternative:** use `z.union()` when no reliable discriminator exists. Ordinary unions try options
in order and return the first successful parsed result; order is observable when branches overlap or
transform values. Prefer plain literal/enum discriminators unless the installed Zod 4 declarations and
runtime confirm a richer discriminator contract is necessary.

**Failure check:** test every tag, missing/unknown tags, invalid payload inside each selected branch,
and ambiguous ordinary-union inputs if order matters.

## Pattern: complete versus sparse enum maps

**Use when:** a record's legal keys are a finite enum. Choose whether every key is required.

```ts
const Channel = z.enum(["email", "sms"]);

const CompletePreferences = z.record(Channel, z.boolean());
const PreferencePatch = z.partialRecord(Channel, z.boolean());

CompletePreferences.parse({ email: true, sms: false });
PreferencePatch.parse({ sms: true });
```

A Zod 4 enum-keyed `z.record()` requires every enum key. `z.partialRecord()` makes those keys optional
while continuing to reject keys outside the enum.

**Alternative:** use `z.strictObject()` when fields have different value schemas or field-specific
metadata. Use `z.record(z.string(), Value)` when keys are genuinely open-ended.

**Failure check:** cover missing keys, unexpected keys, and invalid present values. Assert inferred
optionality together with runtime acceptance.

## Preserve literal inference

For literal enums, pass an inline tuple or an `as const` array:

```ts
const plans = ["essential", "scale", "elite"] as const;
const Plan = z.enum(plans);
```

A widened `string[]` loses the finite literal union. `z.enum(enumLike)` can also consume supported
enum-like objects, but a plain const object/tuple is often clearer for a transport contract.

## Official sources

- [Discriminated unions, ordinary unions, enums, and records](https://zod.dev/api)
- [Zod 4 discriminated-union capabilities](https://zod.dev/v4#upgraded-zdiscriminatedunion)
