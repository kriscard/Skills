> **Read this when:** handling external payloads, schemas, guards, validation failures,
> wire formats, persisted JSON, SDK results, files, IPC, environment data, database rows,
> or broad input/output contracts at runtime trust boundaries.

# Runtime Boundaries

## Current skill guidance

TypeScript checks the program, not arbitrary runtime data. Treat values whose shape can
change independently of this compilation as untrusted: external payloads, JSON, files,
environment variables, plugin messages, unvalidated database results, and loosely typed
SDK output. Keep them `unknown` until evidence establishes the required facts.

Use ordinary control-flow narrowing for primitives and small local distinctions; use a
complete, tested guard for a small stable claim; reuse the installed schema/decoder for
structured external input. Do not add a schema dependency for one primitive check.
Parse at the ownership change and pass the validated result inward. Re-parse only at a
new trust boundary, when invariants change, or when prior evidence is no longer reliable.
A documented validating SDK may establish evidence; generated declarations alone do not.

For example, primitive narrowing plus semantic checks can establish a port without a
schema dependency:

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

A success path returns only the validated result. Failures return/throw the real error
contract, never the original input asserted as the target. Map schema-library errors to
stable caller/domain errors when callers should not depend on decoder internals. Preserve
raw input for correction only when required; it is not the validated value.

```typescript
type DecodeResult<T> =
  | { ok: true; value: T }
  | { ok: false; issues: readonly string[] };

type Decoder<T> = (input: unknown) => DecodeResult<T>;

function requireDecoded<T>(decoder: Decoder<T>, input: unknown): T {
  const result = decoder(input);
  if (!result.ok) throw new Error(result.issues.join('; '));
  return result.value;
}
```

Current policy permits `unknown` and raw dictionaries at real boundaries, including
parsers, low-level adapters, generic containers, and error causes. Restrictions 15–19
are policy alternatives subject to catalog selection, not reasons to disguise untrusted data in a named
alias. Brand construction is documented in [type modeling](type-modeling.md#practice-5--validated-branded-primitives).

## Collected practices

Practices 7–19 preserve policy alternatives and their limits. Before applying one as
policy, read its adoption decision in the [catalog](practice-catalog.md), the sole persistent
adoption record. Numbered sections do not replace current guidance merely by being documented.
Schema examples assume an already installed, compatible Zod API; adapt to the repository's
real decoder rather than adding Zod.

## Practice 7 — External data as unknown, not any

Start untrusted input as `unknown`, forcing evidence before property access. This includes
RPC payloads, JSON parsing, IPC, files, environment data, database results, and browser
messages. Framework-specific entry-point behavior remains with its owner.

```typescript
// Bad: arbitrary nesting compiles without proof.
function unsafeHandle(input: any) {
  return input.foo.bar;
}

function hasId(input: unknown): input is { id: string } {
  return typeof input === 'object' && input !== null &&
    'id' in input && typeof input.id === 'string';
}
```

Assign an `any`-returning deserializer result to `unknown` immediately. This contains
static unsafety but does not itself validate anything. Contrast practice 15's stricter
parameter policy; do not reconcile them by casting unknown input to a domain type.

## Practice 8 — Schemas before structural guards

Before hand-checking an external object property by property, look for the repository's
schema library and existing schemas. Let one schema own validation and infer its output;
avoid a schema, duplicate interface, and partial guard that can diverge.

```typescript
import { z } from 'zod';

const UserSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

Reuse the installed decoder's inference helper and actual versioned API. This is not a
requirement to introduce a schema dependency for one guard or to revalidate trusted values.
Primitive/local checks remain ordinary evidence under current guidance and #26;
#27 proposes a stricter restriction.

## Practice 9 — Honest type guards

A predicate must verify every fact it claims. A guard checking only `id` cannot honestly
claim a user with required `name`, and mere property presence does not prove its type.
Name predicates `isX` or `hasX`; prefer automatic discriminant narrowing where available.

```typescript
type User = { id: string; name: string };

// Bad: claims both required string fields but proves neither field type.
function isUser(input: unknown): input is User {
  return typeof input === 'object' && input !== null && 'id' in input;
}
```

Use the full schema from #8 or check both fields. Test malformed, missing, null, and
wrong-type cases. Predicate signatures are trusted by the compiler; naming a function
`isUser` does not make its claim sound. A guard over an already closed union may only
need its discriminant, because the rest of the facts are already established.

## Practice 10 — Schema compatibility with an existing type

When a type already owns the contract, give the schema a compatible schema-type annotation.
The compiler should reject a validator that omits required fields instead of requiring an
assertion after parsing.

```typescript
import { z } from 'zod';

type User = { id: string; name: string };
const UserSchema: z.ZodType<User> = z.object({
  id: z.string(),
  name: z.string(),
});
```

When the schema owns the contract, infer from it instead (#8). Match the installed
schema API: transforms/defaults can distinguish input and output types. Static schema
compatibility checks output assignability; it is not a proof of all semantic invariants.

## Practice 11 — Parse once at the trust boundary

Decode when data crosses into an owned domain, producing a named trusted type. Raw
`Record<string, unknown>` dictionaries stop at that parse instead of spreading through
business APIs. Internal callers consume the parsed type without repeated decoding.

```typescript
const raw: unknown = JSON.parse(text);
const user = parseUser(raw);
// Internal operations accept User, not raw or a fresh asserted copy.
storeUser(user);
```

The example assumes the real parser and domain operation. Validate at another boundary
when needed; do not treat a once-valid mutable object as permanently valid after arbitrary
mutation. A typed generated SDK counts only if its runtime decoding establishes the claim.

## Practice 12 — Explicit expected-validation failure paths

Use `safeParse` or the decoder's result-style equivalent when rejection is expected rather
than exceptional. Keep successful output and failure information separate.

```typescript
const result = UserSchema.safeParse(input);
if (!result.success) {
  return { ok: false, issues: result.error.issues };
}
return { ok: true, value: result.data };
```

This is a function-body fragment using the schema from #8. Map decoder issues to the
public error contract when necessary; preserve useful causes without exposing secrets.
Throwing parse APIs remain appropriate where invalid input really is exceptional. Never
fall back to `return input as User` on failure.

## Practice 13 — Forward-compatible wire decoding

Allow unknown wire fields so new producer fields do not break older consumers; use
`ignoreUnknownFields` in decoders that support it. Keep validation of known required fields
even when allowing additional fields.

**Compatibility caveat:** this is decoder/protocol-specific, not an option on `JSON.parse`
and not a universal Zod setting. Use the installed API's actual equivalent. A security
boundary, signed payload, command whitelist, or deliberately closed protocol may require
rejecting extras. Record that policy rather than silently weakening it for compatibility.

## Practice 14 — Versioned persisted JSON

Persist an explicit format version and handle parse failures. After deserialization,
validate the envelope and version-specific payload, then migrate or reject unsupported
versions through the repository's real recovery policy.

```typescript
let raw: unknown;
try {
  raw = JSON.parse(text);
} catch (cause) {
  // Route syntax failure into the existing recovery contract.
  throw new Error('Invalid persisted JSON', { cause });
}
// Decode the versioned envelope before reading fields from raw.
```

Match `Error` cause support to the runtime. A try/catch around JSON parsing handles syntax
errors, not malformed domain values, unknown versions, or migrations. Browser storage
mechanics and persistence migrations still belong to their platform/data owners.

## Practice 15 — Restrict explicit unknown parameters

The rule rejects explicitly `unknown` parameters (including unions containing direct
`unknown`) and asks callers to parse at I/O boundaries before invoking a named domain API.
It checks function/method/signature parameter forms, including rest/default wrappers.
Its exceptions are a binding named `cause` and the subject of a type predicate.

```typescript
// Rejected by this policy:
function process(input: unknown): void {}

// Allowed domain API:
function processUser(input: User): void {}

// Explicit policy exception:
function reportFailure(cause: unknown): void {}
```

**Conflict:** a general decoder naturally accepts `unknown` (#7–8). The current skill
permits that. If selecting this stricter policy, explicitly determine where decoding
functions are allowed; do not make a lying guard or hide `unknown` merely to evade lint.
The rule is syntactic and is not a proof that accepted named types have been parsed.

## Practice 16 — Restrict unknown return contracts

The rule rejects explicit `unknown`, unions containing it, and `Promise<unknown>` or
`PromiseLike<unknown>` return contracts, including resolved visible aliases handled by its
analysis. Parse before returning a domain value
instead of transferring the decoding obligation to ordinary callers.

```typescript
// Rejected:
function readPayload(): unknown { return input; }

// Intended replacement after real decoding:
function readUser(): User { return parseUser(input); }
```

Here `input` denotes existing external input. Low-level raw readers and generic adapters
can intentionally return untrusted values under current policy. This syntactic rule allows
inferred returns and nested `unknown` fields in some contracts; passing lint does not
establish runtime safety. Decide adapter exceptions before adoption.

## Practice 17 — Keep unknown visible instead of aliasing it

Reject aliases whose resolved type is `unknown`; a domain-looking name must not hide that
no evidence exists. The implementation follows visible aliases and generic substitutions,
not every textual occurrence of `unknown` inside a larger useful container.

```typescript
// Rejected by this policy:
type Payload = unknown;

// Keep boundary uncertainty visible:
const raw: unknown = JSON.parse(text);
```

`{ cause: unknown }` and a useful generic container are different from renaming the top
type. Current guidance also discourages aliases without meaning but permits intentional
low-level abstractions. Do not replace the alias with an asserted domain type.

## Practice 18 — Restrict unsafe dictionary value types

Reject dictionary contracts whose direct values resolve to `unknown`, `any`, `object`,
`{}`, or a union containing these escape hatches. If automating this policy, inspect index
signatures, mapped types, aliases, and wrappers (`Readonly`, `Partial`, `Required`,
`NonNullable`, `Pick`, `Omit`), while respecting shadowed built-ins.

```typescript
// Rejected by this policy:
type LooseUsers = Record<string, unknown>;

// Concrete domain values after validation:
type UsersById = Record<string, User>;
```

This changes value specificity, not key existence. An open record can still have a missing
key; choose optional lookup semantics, `noUncheckedIndexedAccess`, or `Map` as appropriate.
Finite-key records differ from open dictionaries. For syntactic enforcement, exempt generic
constraint positions and avoid reporting the same alias at every consumer. These are
implementation considerations, not claims that a particular checker is installed.

**Conflict:** the current skill permits raw dictionaries at an untrusted object boundary.
Selecting a blanket ban requires a boundary exception or a different honest representation,
not merely hiding the same contract behind a mapped type or alias.

## Practice 19 — Restrict broad object parameters

Reject function parameters explicitly typed as broad `object`, including supported local
aliases. Accept a named owner type and establish boundary evidence before calling it.
`object` says little beyond excluding primitives; it does not describe an API's needs.

```typescript
// Rejected:
function consume(value: object): void {}

// Named options are not prohibited:
type SaveOptions = { user: User; overwrite: boolean };
function save(options: SaveOptions): void {}
```

The rule permits generic constraints such as `<T extends object>`; it is not a ban on
object-valued arguments or named argument objects (#33). A type annotation alone
still does not prove that external input was decoded.

## Completion criterion

Every untrusted path gains evidence before trusted use, successful decoding yields the
intended internal type, failure remains honest, and consumers do not repeatedly validate
the same value. Pending broad-contract bans are not applied without selection.
