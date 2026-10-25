> **Read this when:** unknown data enters from a network, file, IPC/RPC call,
> environment, database, SDK, deserialization step, or other runtime boundary.

# Runtime Boundaries

TypeScript checks the program, not arbitrary runtime data. Establish evidence once when
an untrusted value enters a trusted domain, then let internal code consume the validated
type.

## Classify the source

Treat a value as untrusted when its shape can change independently of this compilation:
external payloads, decoded JSON, files, environment variables, plugin messages,
unvalidated database results, and loosely typed SDK output. `unknown` is the honest
starting type for these values.

Already-parsed internal values do not need ceremonial revalidation at every call. A
documented SDK or generated decoder may establish runtime evidence; generated type
declarations alone do not.

## Choose evidence proportional to the value

- Use ordinary control-flow narrowing for primitives and small local distinctions:
  `typeof`, `instanceof`, equality, discriminants, and property-presence checks.
- Use a complete type guard when its full claim is small, stable, and tested.
- For structured external payloads, reuse the repository's schema/decoder convention
  and infer its output type when supported.
- Do not add a schema dependency for a one-off primitive guard.

```typescript
function parsePort(input: unknown): number {
  if (typeof input !== 'string' || !/^\d+$/.test(input)) {
    throw new Error('PORT must be a decimal string');
  }

  const port = Number(input);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new Error('PORT is outside the valid range');
  }

  return port;
}
```

For a structured value, use the installed decoder's real API and declarations. Keep one
source of truth rather than maintaining a schema, duplicate interface, and partial guard
that can drift.

## Keep success and failure honest

A decoder's success path returns only the validated value. Its failure path returns or
throws the repository's real error contract; it never returns the raw input typed as the
target.

```typescript
type DecodeResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: readonly string[] };

type Decoder<T> = (input: unknown) => DecodeResult<T>;

function requireDecoded<T>(decoder: Decoder<T>, input: unknown): T {
  const result = decoder(input);
  if (!result.ok) {
    throw new Error(result.issues.join('; '));
  }
  return result.value;
}
```

```typescript
// Bad: failure launders the original value into trusted T.
function unsafeDecode<T>(input: unknown): T {
  return input as T;
}
```

Map library-specific validation errors to a stable domain or caller-facing error when
callers should not depend on schema internals. Preserve original input only where the
product needs it for correction; do not confuse that display value with validated data.

## Brands require construction evidence

A brand prevents accidental mixing after construction; it does not validate its
underlying primitive. Create branded values through a parser, guard, constructor, or
validated SDK result that checks the invariant.

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

The final assertion is justified by the immediately preceding runtime proof. Writing
`input as AccountId` without that proof is not brand construction.

## Boundary placement

Parse at the point where ownership changes, then pass the trusted result inward. Keep
raw dictionaries such as `Record<string, unknown>` at the boundary rather than banning
them or allowing them to spread through the domain.

Avoid double validation. Re-parse only when data crosses another real trust boundary,
the invariant has changed, or the original evidence is no longer reliable.

## Completion criterion

Runtime-boundary work is complete when every applicable untrusted path gains evidence
before trusted use, successful decoding yields one stable internal type, failure has an
honest outcome, and internal consumers do not repeatedly validate the same value.
