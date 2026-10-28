> **Read this when:** modeling domain states, choosing unions or constructive types,
> constructing brands, deriving contracts, preserving inference, or designing generics.

# Type Modeling

## Current skill guidance

Model the smallest set of values the program can use correctly. Strengthen a type when
it removes a real partial operation, assertion, repeated check, or impossible state,
not by reflex. Use stable discriminants for variants and exhaustive handling when the
operation is meant to be total; deliberate extensible/default branches remain valid.

Derive from an existing schema, generated contract, function, or value before duplicating
its shape. Expose a stable subset rather than leaking an entire generated transport API.
Generated declarations are runtime evidence only when the generator/SDK actually decodes
or validates values. Preserve inference unless a wider annotation is the intended public
abstraction. Respect repository `type`, `interface`, and `enum` conventions.

A brand requires construction evidence, not a particular spelling. A parser, complete
guard, checked constructor, or validating SDK can provide it. A local assertion after
proof is currently permitted; a stricter alternative is documented in practice 5.

```typescript
declare const accountIdBrand: unique symbol;
type AccountId = string & { readonly [accountIdBrand]: true };

function parseAccountId(input: unknown): AccountId {
  if (typeof input !== 'string' || !/^acct_[a-z0-9]+$/.test(input)) {
    throw new Error('Invalid account id');
  }
  return input as AccountId;
}
```

This current-policy constructor's assertion is backed by the immediately preceding check.
Writing `input as AccountId` without that check does not validate or construct evidence.

### Make generics carry a relationship

Connect caller-visible facts: input to output, key to value, variant to handler, or schema
to decoded result. Constrain only operations the implementation actually performs.

```typescript
// Bad: T is invented rather than established.
function decode<T>(input: unknown): T {
  return input as T;
}

type Decoder<T> = (input: unknown) => T;

function decodeWith<T>(decoder: Decoder<T>, input: unknown): T {
  return decoder(input);
}
```

Remove a generic that only renames `unknown`, requires assertions throughout, or exposes
machinery no caller uses. Preserve literal/relational information rather than widening
and reconstructing it. Compatibility-check details live in
[practice 24](assertions-and-interop.md#practice-24--satisfies-for-compatibility).

## Collected practices

**Adoption: Pending for practices 1–6.** These are collected policy alternatives, not new
default policy. See the [catalog](practice-catalog.md) for selection.

## Practice 1 — Discriminated unions

Represent variants with a shared literal field and a distinct value per variant. Put
required data on the variant that owns it, rather than allowing contradictory boolean
flags and optional-field bags. Keep the discriminant name consistent in the local API;
Use `kind`, `type`, or `tag` as appropriate, not one mandatory global spelling.

```typescript
// Bad: ready-without-data and simultaneous data/error compile.
type LooseState<T> = { loading: boolean; data?: T; error?: Error };

type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'failed'; error: Error };
```

Use when variants have different data or behavior. Independent optional properties are
not automatically variants; establish the actual state invariant before replacing them.

## Practice 2 — Exhaustive handling with never

For a closed union, assign the remaining whole value to a `never` local in the default
arm. A new variant then fails compilation at handlers that have not been updated.

```typescript
function message<T>(state: LoadState<T>): string {
  switch (state.status) {
    case 'idle':
      return 'Not started';
    case 'loading':
      return 'Loading';
    case 'ready':
      return 'Ready';
    case 'failed':
      return state.error.message;
    default: {
      const exhaustive: never = state;
      return exhaustive;
    }
  }
}
```

In a void switch, use `const exhaustive: never = state; void exhaustive;` instead of
returning a value. This is static coverage, not runtime validation of external input;
validate before treating arbitrary data as the union. Keep deliberate fallback behavior
for open protocols distinct from exhaustive closed-domain handling.

## Practice 3 — Constructive modeling

Choose parts whose arrangement encodes the invariant instead of relying on comments or
repeated checks: `[T, ...T[]]` for a non-empty collection and `[T, T][]` for pairs instead
of an even-length flat array. Establish the property once where ordinary input arrives.

```typescript
type NonEmpty<T> = [T, ...T[]];
type Pairs<T> = [T, T][];

function isNonEmpty<T>(items: T[]): items is NonEmpty<T> {
  return items.length > 0;
}

function first<T>(items: NonEmpty<T>): T {
  return items[0];
}
```

Expose derived readings when needed, such as flattening pairs. Mutable aliases can still
invalidate collection invariants; a type is not a runtime freeze. A non-empty tuple proves
index zero exists, not that arbitrary numeric indexing is safe under
`noUncheckedIndexedAccess`.

**Modeling caveat:** representing a range as `start: Date` plus `durationMs: number` does
not prohibit negative/NaN durations or invalid dates. Use that representation only with
explicit validation or a documented weaker invariant; do not claim plain `number` makes
negative ranges unconstructable.

## Practice 4 — Simplest total types

Keep `T[]` while every operation has a defined result for `[]`. Strengthen only when the
looser input forces `!`, `arr[0] as T`, or a supposedly unreachable throw. Returning
`T | undefined` is another honest total signature, not a failure to model strongly.

```typescript
const sum = (items: number[]) => items.reduce((total, n) => total + n, 0);

function firstOrMissing<T>(items: T[]): T | undefined {
  return items.at(0);
}

function requiredFirst<T>(items: [T, ...T[]]): T {
  return items[0];
}
```

Choose based on the caller's real contract. Match `.at()` to runtime support. Do not
require non-empty input for a sum that already defines its empty result.

## Practice 5 — Validated branded primitives

Prevent accidental interchange of equal-representation values, such as two ID types.
This stricter alternative requires `& { readonly __brand: 'X' }`, construction through a
guard, and no brand-producing `as`. The parser checks once and downstream consumers trust
the brand.

```typescript
type AccountId = string & { readonly __brand: 'AccountId' };

function isAccountId(input: string): input is AccountId {
  return /^acct_[a-z0-9]+$/.test(input);
}

function parseAccountId(input: string): AccountId {
  if (!isAccountId(input)) throw new Error('Invalid account id');
  return input;
}
```

The predicate body still bears the proof obligation; TypeScript does not establish that
its implementation justifies the brand. Branding alone never validates the primitive.
Use brands for demonstrated interchange risks, not every number/string by reflex.

**Conflict with current guidance:** the current skill permits unique-symbol brands and
checked-constructor assertions. The exact brand spelling and guard-only restriction
remain pending choices, not an instruction to migrate existing brands.

## Practice 6 — Derive contracts before duplicating

Use the schema or generated owner of a shape. Prefer supported schema inference, then
`Pick`, `Omit`, `Parameters`, `ReturnType`, `Awaited`, or `typeof` where these preserve the
required relationship. Hand-maintained parallel interfaces drift when owners change.

```typescript
import type { GeneratedAccount } from './generated/account';

type AccountSummary = Pick<GeneratedAccount, 'id' | 'displayName'>;
type LoadedAccount = Awaited<ReturnType<typeof loadAccount>>;
```

The second example assumes an existing `loadAccount` API; derive from the real declaration.
Define a new domain interface when that domain owns an independent stable contract rather
than forcing utility types to couple unrelated APIs. A generated annotation does not prove
that network/DB values were validated; see [runtime boundaries](runtime-boundaries.md).

## Review questions

- Which invalid state or partial operation does the stronger model remove?
- Does each variant carry the data its branch needs?
- Is exhaustive handling required, or is a default deliberate?
- Which schema, generated contract, function, or value owns the shape?
- Does each generic preserve a caller-visible relationship?
- Is a pending restriction being mistaken for adopted policy?
