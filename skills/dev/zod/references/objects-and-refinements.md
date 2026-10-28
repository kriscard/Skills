> **Read this when:** The task chooses unknown-key behavior, composes objects, creates PATCH schemas, or validates cross-field relationships.

# Objects and refinements

## Make unknown-key behavior part of the contract

- `z.object({...})` strips unrecognized keys from parsed output.
- `z.strictObject({...})` rejects unrecognized keys.
- `z.looseObject({...})` preserves them.
- `.catchall(ValueSchema)` validates every unrecognized value.

Choose from consumer needs. Strip supports additive producers while returning a stable internal shape;
strict detects misspellings and closed command payloads; loose/catchall supports extension data. Strict
is not automatically more secure—rejecting, stripping, and validating extensions are different API
contracts.

**Failure check:** parse an input with one extra key and assert both acceptance and the exact parsed
output. Composition must not change this policy accidentally.

## Pattern: PATCH validity is not merged-entity validity

**Use when:** a complete object has a cross-field rule but PATCH carries only changed fields. Separate
field-level wire checks from the invariant that requires the complete entity.

```ts
import { z } from "zod";

const BookingFields = z.strictObject({
  startsOn: z.iso.date(),
  endsOn: z.iso.date(),
});

export const Booking = BookingFields.refine(
  ({ startsOn, endsOn }) => endsOn >= startsOn,
  { path: ["endsOn"], error: "End must not precede start" },
);

export const BookingPatch = BookingFields.partial().refine(
  (patch) => Object.keys(patch).length > 0,
  { error: "Provide at least one field" },
);

type Booking = z.output<typeof Booking>;

export function applyBookingPatch(current: Booking, input: unknown): Booking {
  const patch = BookingPatch.parse(input); // wire shape and non-empty subset
  return Booking.parse({ ...current, ...patch }); // complete invariant after merge
}
```

**Observable result:** `{ startsOn: "2026-03-01" }` can be a valid wire PATCH yet fail after merging
with an entity whose `endsOn` is `2026-02-01`. The final error remains attributable to `endsOn`.
Empty and unknown-key patches fail before merge. Building PATCH from `BookingFields` is deliberate:
mechanically calling `.partial()` on a refined complete object has varied across Zod 4 minors, and a
partial value cannot prove an invariant whose sibling field may be absent.

```ts
const current = Booking.parse({ startsOn: "2026-01-01", endsOn: "2026-02-01" });
BookingPatch.parse({ startsOn: "2026-03-01" }); // valid partial wire input

const merged = Booking.safeParse({ ...current, startsOn: "2026-03-01" });
if (!merged.success) console.assert(merged.error.issues[0]?.path[0] === "endsOn");
```

**Alternative:** define PATCH fields separately when omission, `null`, and a value mean different
operations, or update rules differ from create rules. Reuse field schemas only where the runtime
contracts are actually identical.

**Failure check:** cover empty object, one valid field, explicit `undefined`/`null` if they can arrive,
unknown keys, invalid present values, a partial that breaks the merged entity, and one that preserves
it. Persist only the output of the complete `Booking.parse`.

## Compose objects without losing policy or refinements

Use shape spread when combining several unrefined field shapes or making the resulting constructor
policy visible:

```ts
const PersistedBookingFields = z.strictObject({
  id: z.uuid(),
  ...BookingFields.shape,
  createdAt: z.iso.datetime(),
});
```

Use `.extend()` for a small extension where overwrites are deliberate. Use `.safeExtend()` when field
assignability must be preserved or the base object carries refinements:

```ts
const NamedBooking = Booking.safeExtend({ name: z.string().min(1) });
```

`NamedBooking` retains the date-order rule. Reconstructing from `Booking.shape` produces only fields;
it does not carry the refinement. This is useful for deliberately building `BookingPatch` from field
checks, but not for a stronger complete entity. Avoid intersections as an object-merging shortcut:
they return an intersection schema rather than an object schema with useful object operations.

**Failure check:** test overwrite order, unknown keys, and the original refinement after composition.
For large compositions, run the project typecheck; explicit shape spread can avoid the cost of long
`.extend()` chains.

## Pattern: cross-field validation with actionable paths

**Use when:** validity depends on multiple fields and belongs to the boundary itself, such as password
confirmation or a date range.

```ts
const PasswordChange = z
  .strictObject({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(12),
    confirmPassword: z.string(),
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match",
  });
```

The `path` makes the issue project naturally to the confirmation field. Use a built-in check first,
`.refine()` for one predicate/issue, and lower-level `.check()` only when multiple issues or measured
control requires it. Refinements report failure; they should not throw.

**Alternative:** keep authorization, database uniqueness, inventory, and other service-owned rules in
the service layer when they need batching, cancellation, transactions, or authoritative server state.
If a boundary check is asynchronous, use async parsing through every caller.

**Failure check:** assert the issue path as well as failure. Cover wrong base types, each independent
field failure, and the cross-field failure. When scheduling an advanced conditional refinement with
an installed `when` capability, validate a separate prerequisite schema containing every field the
refinement reads; do not return true unconditionally.

## Official sources

- [Objects, extension, intersections, partials, and refinements](https://zod.dev/api)
