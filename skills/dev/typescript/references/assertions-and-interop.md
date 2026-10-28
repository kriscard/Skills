> **Read this when:** changing assertions, inference, narrowing, safety comments,
> satisfies expressions, typeof checks, reflection, suppressions, declaration gaps,
> compiler options, or interoperability with untyped code.

# Assertions and Interoperability

## Current skill guidance

Assertions change what the compiler accepts; they neither inspect nor convert runtime
values. Diagnose missing discriminants, widened inference, unparsed boundaries, and
stale/version-mismatched declarations before asserting. Fix the earliest false contract.

Preserve known evidence instead of widening it and asserting it back. `as const` preserves
literal/readonly inference, not domain validity. A local brand assertion after actual
proof or a narrow interop assertion backed by runtime/external guarantees can be justified.
Require nearby explanation when the invariant is non-obvious, externally guaranteed, or
easy to invalidate, not a comment on every self-evident assertion.

Keep dynamic mechanisms (reflection, proxies, instrumentation, untyped libraries) behind
typed adapters that own them. Validate entering values, expose the smallest stable typed
surface, and test the invariant justifying any assertion. Prefer typed calls/access in
ordinary code; current policy does not blanket-ban dynamic mechanisms at their real owner.

### Suppressions describe a real contract

Use `@ts-expect-error` for an intentional incompatibility that should fail when no diagnostic
remains. Keep it on the exact line and explain the repository/upstream contract when not
obvious. It checks that some diagnostic exists, not that a specific diagnostic code exists.
Prefer a declaration fix or local augmentation when that is the durable owner. Avoid
broad disables and `@ts-ignore` when an expected failure can be expressed. Never weaken a
public contract, add `any`, or widen merely to silence checks.

### Compiler contracts

Read the full `tsconfig` extension chain and generated defaults. Compiler flags are
repository migrations, not local style toggles. Evaluate effects on public contracts,
generated/test code, and runtime assumptions through the normal migration/check process.
Match installed TypeScript and runtime versions: `lib` declarations and type packages do
not polyfill features. Keep existing `type`/`interface`/`enum` conventions unless actual
interoperability or extension semantics require change.

## Collected practices

**Adoption: Pending for practices 20–29.** Source policies below do not override current
guidance until selected. See the [catalog](practice-catalog.md) for conflicts and provenance.

## Practice 20 — Preserve established evidence

**Source:** [anti-slop: no-known-value-widening][known-widening].

Keep inference, use a compatibility check, or introduce a named owner contract instead
of flowing syntactically established values into explicitly broad/anonymous target types
that erase useful information. The source analyzes more than assertions: annotated
bindings, returns, and supported local function argument flows can lose evidence.

```typescript
const commands = { start: () => {}, stop: () => {} };
// Evidence discarded:
const loose: Record<string, unknown> = commands;
// Concrete members remain visible:
const checked = commands satisfies Record<string, () => void>;
```

The rule classifies `unknown`, `object`, open dictionaries, supported generic containers,
and anonymous object targets. Its local syntax analysis is not the full TypeScript type
checker. A deliberate public abstraction can be correct under current guidance; do not
remove an abstraction solely because it exposes less than its implementation.

## Practice 21 — Avoid widen-then-assert flows

**Source:** [anti-slop: no-widen-then-assert][widen-assert].

Reject local const flows that first broaden known data and later assert the broad binding
to a narrower type. The intermediate broad type does not establish a new fact; it destroys
information and the assertion invents it again. Preserve the original type or parse real
boundary input once.

```typescript
const source = { id: 'acct_123', active: true };
const widened: unknown = source;
// Bad: no runtime proof has been added.
const account = widened as { id: string; active: boolean };

const checked = source satisfies { id: string; active: boolean };
```

Unlike #20, this practice specifically requires a later assertion; unlike #23, assertions
need not be adjacent. An actual validating transformation changes the evidence; another
annotation or alias does not. Source coverage is local/const-based, not arbitrary whole-
program dataflow.

## Practice 22 — Cursor's restriction on as

**Source:** [Cursor: No as casts][cursor-patterns].

Cursor describes every `as` as a potential runtime crash and permits casting only after
validation. Its preferred repairs are adding discriminants, fixing wide source types,
parsing an untyped boundary, and considering branded types or `satisfies`.

```typescript
// Bad: an annotation is substituted for decoding.
const user = input as User;

// Evidence comes from the real decoder instead.
const user = parseUser(input);
```

`User` and `parseUser` denote the existing domain type and validating parser. A cast alone
has no runtime effect, and `as const` does not assert an external payload's validity.
Neither a brand nor `satisfies` can prove an arbitrary runtime invariant just because the
compiler cannot express it.

**Conflict:** current policy permits justified interop assertions, including checked brand
construction. Keep Cursor's stronger wording visible as a pending policy choice; do not
silently turn it into a ban or rewrite existing APIs to satisfy it.

## Practice 23 — Prohibit chained assertions

**Source:** [anti-slop: no-chained-type-assertions][chained].

Reject adjacent `as` and angle-bracket assertion chains, including parenthesized/mixed
chains. A broader middle type does not prove the final type.

```typescript
// Rejected:
const user = input as unknown as User;
// Rejected even with parentheses:
const again = (input as unknown) as User;
```

The source permits chains consisting entirely of const assertions, but rejects a mixed
chain such as `({ id: 1 } as const) as User`. Angle-bracket syntax is also checked even
though it is unavailable in TSX. In a genuinely inexpressible interop seam, current policy
requires independently established evidence; a chain itself never supplies that proof.

## Practice 24 — Satisfies for compatibility

**Sources:** [Cursor: satisfies over as][cursor-patterns];
[anti-slop: no-known-value-widening][known-widening].

Use `satisfies` when a concrete expression should be checked against a contract without
replacing its useful inferred shape with the target type. An assertion asks the compiler
to accept a claim instead of checking that assignment relationship.

```typescript
type RetryPolicy = { strategy: 'fixed' | 'exponential'; attempts: number };

const retryPolicy = {
  strategy: 'exponential',
  attempts: 3,
} satisfies RetryPolicy;

const fixedPolicy = {
  strategy: 'fixed',
  attempts: 3,
} as const satisfies RetryPolicy;
```

`retryPolicy.strategy` retains the contextual literal; `attempts` need not become literal
`3`. `as const` adds literal/readonly inference when intended. `satisfies` is a static
check, not a parser, runtime validator, or universal literal-freezing operator. An explicit
annotation remains correct when the wider type is the public abstraction. Requires a
compatible TypeScript version (introduced in 4.9).

## Practice 25 — Assertion safety comments

**Source:** [anti-slop: require-safety-comment-for-type-assertion][safety].

Require a nearby justification for every non-const TypeScript assertion. Default marker:
`SAFETY:`; the rule accepts a non-empty configurable `markers` array. The comment must
state the invariant, not merely repeat the target type.

```typescript
// SAFETY: the preceding decoder validated every required User field.
const user = validatedValue as User;
```

This illustrates the comment format, not a reason to add an unnecessary cast after a
decoder that already returns `User`. The source recognizes comments immediately before
the assertion or its containing statement and related surrounding forms; const assertions
are exempt. Its implementation checks marker placement, not whether the explanation is true.

**Conflict:** current policy requires explanations for non-obvious assertions, not every
assertion. Selection of this practice chooses a stricter comment requirement; it does not
make a well-commented but false assertion safe.

## Practice 26 — Cursor's narrowing hierarchy

**Source:** [Cursor: Narrowing hierarchy][cursor-patterns].

Cursor orders approaches as: discriminant switch/if, property-presence `in`, primitive
`typeof`/class `instanceof`, a custom guard, then `as` only after validation. Prefer evidence
already carried in a model instead of introducing a manually maintained predicate.

```typescript
type Geometry = { radius: number } | { width: number; height: number };

function area(value: Geometry): number {
  if ('radius' in value) return Math.PI * value.radius ** 2;
  return value.width * value.height;
}
```

The union is already trusted. On arbitrary input, `in` proves presence, not the property's
value type. Choose narrowing that proves the needed fact; `instanceof` also has cross-realm
and custom-instance semantics. This source preference is not a theorem that one operator
is always safer than another.

**Conflict:** anti-slop #27 generally prohibits runtime `typeof`, including checks that
Cursor treats as normal narrowing. Do not activate both unchanged.

## Practice 27 — anti-slop's runtime typeof restriction

**Source:** [anti-slop: no-runtime-typeof][runtime-typeof].

Decode external values into meaningful domain types at I/O boundaries rather than branching
on representation in downstream code. The rule rejects runtime unary `typeof` by default,
including inside custom type guards.

```typescript
// Rejected under the default source policy:
if (typeof input === 'string') consumeText(input);

// Allowed existence probe:
if (typeof optionalGlobal !== 'undefined') useOptionalGlobal();
```

The source exempts comparisons with the literal `'undefined'` using `===`, `!==`, `==`, or
`!=`. Configuration `{ allowInTypeGuards: true }` additionally permits checks inside a
function whose return annotation is a type predicate. Type-position `typeof` is not the
runtime unary operator and is not prohibited by this rule.

**Conflict:** current guidance and #26 allow honest primitive narrowing. If selected,
decide guard/parser exemptions explicitly; do not replace `typeof` with assertions or
an incomplete schema merely to evade a syntactic check.

## Practice 28 — Restrict Reflect.get

**Source:** [anti-slop: no-reflect-get][reflect-get].

Use typed property access for domain values and decode dynamic input before reading it.
The source checks calls to the global `Reflect.get`, including a computed literal method
name; a shadowed local `Reflect` binding is not the same built-in.

```typescript
// Rejected by this policy:
const name = Reflect.get(user, 'name');
// Typed domain access:
const name = user.name;
```

For a truly dynamic key, model the key/value relationship rather than asserting a result.
**Conflict:** current policy permits reflection inside the adapter/proxy/instrumentation
owner. Selecting a blanket ban requires deciding those exceptions rather than pushing
the same dynamic behavior into ordinary callers.

## Practice 29 — Restrict Reflect.apply

**Source:** [anti-slop: no-reflect-apply][reflect-apply].

Prefer direct typed calls or a named interface for dynamic dispatch. The rule checks the
global `Reflect.apply` (including computed literal access) and respects local shadowing.

```typescript
// Rejected by this policy:
const result = Reflect.apply(handler, receiver, args);
// Ordinary typed call when receiver semantics match:
const result = handler(...args);
```

The replacement must preserve `this`, argument, and exception semantics; removing a
receiver blindly changes behavior. Dynamic invocation can belong to a proxy/adapter under
current policy. Isolate it and test the contract rather than claiming direct calls are
always equivalent. This distinction remains pending alongside #28.

## Review questions

- What evidence justifies the assertion, and could the model/decoder carry it instead?
- Is a widened type a deliberate public abstraction or an accidental loss of evidence?
- Does the dynamic behavior remain with its actual owner?
- Will a suppression become unused when diagnostics disappear?
- Do compiler and runtime recommendations match the full installed configuration?
- Is an upstream prohibition pending, selected, or in conflict with another selected rule?

[cursor-patterns]: https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/typescript-best-practices/references/patterns.md
[known-widening]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-known-value-widening.ts
[widen-assert]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-widen-then-assert.ts
[chained]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-chained-type-assertions.ts
[safety]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/require-safety-comment-for-type-assertion.ts
[runtime-typeof]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-runtime-typeof.ts
[reflect-get]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-reflect-get.ts
[reflect-apply]: https://github.com/dmmulroy/anti-slop/blob/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules/no-reflect-apply.ts
