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

The following practices are policy alternatives, not automatic overrides of current guidance.
Before applying one as policy, read its adoption decision in the [catalog](practice-catalog.md),
the sole persistent adoption record. Keep the documented conflicts explicit.

## Preserve established evidence

Keep inference, use a compatibility check, or introduce a named owner contract instead
of flowing syntactically established values into explicitly broad/anonymous target types
that erase useful information. This policy covers more than assertions: annotated
bindings, returns, and supported local function argument flows can lose evidence.

```typescript
const commands = { start: () => {}, stop: () => {} };
// Evidence discarded:
const loose: Record<string, unknown> = commands;
// Concrete members remain visible:
const checked = commands satisfies Record<string, () => void>;
```

An automated check can classify `unknown`, `object`, open dictionaries, supported generic
containers, and anonymous object targets. Local syntax analysis is not the full TypeScript
type checker. A deliberate public abstraction can be correct under current guidance; do not
remove an abstraction solely because it exposes less than its implementation.

## Avoid widen-then-assert flows

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

Unlike [Preserve established evidence](#preserve-established-evidence), this practice
specifically requires a later assertion; unlike [Prohibit chained assertions](#prohibit-chained-assertions),
assertions need not be adjacent. An actual validating transformation changes the evidence; another
annotation or alias does not. A local const-based lint check does not establish arbitrary
whole-program dataflow.

## Restrict as assertions

Treat every `as` as a potential runtime crash and permit casting only after validation
under this stricter alternative. Prefer adding discriminants, fixing wide source types,
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
construction. Keep this stronger restriction visible as a selectable policy alternative; do not
silently turn it into a ban or rewrite existing APIs to satisfy it.

## Prohibit chained assertions

Reject adjacent `as` and angle-bracket assertion chains, including parenthesized/mixed
chains. A broader middle type does not prove the final type.

```typescript
// Rejected:
const user = input as unknown as User;
// Rejected even with parentheses:
const again = (input as unknown) as User;
```

This policy permits chains consisting entirely of const assertions, but rejects a mixed
chain such as `({ id: 1 } as const) as User`. Angle-bracket syntax is also checked even
though it is unavailable in TSX. In a genuinely inexpressible interop seam, current policy
requires independently established evidence; a chain itself never supplies that proof.

## Satisfies for compatibility

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

## Assertion safety comments

Require a nearby justification for every non-const TypeScript assertion. Use `SAFETY:` as
the default marker; the comment must state the invariant, not merely repeat the target type.
If automating this policy, a non-empty configurable `markers` array can allow alternative
markers. This describes an enforcement option, not existing project configuration.

```typescript
// SAFETY: the preceding decoder validated every required User field.
const user = validatedValue as User;
```

This illustrates the comment format, not a reason to add an unnecessary cast after a
decoder that already returns `User`. Accept comments immediately before the assertion or
its containing statement and related surrounding forms; const assertions are exempt.
Checking marker placement does not establish whether the explanation is true.

**Conflict:** current policy requires explanations for non-obvious assertions, not every
assertion. Selection of this practice chooses a stricter comment requirement; it does not
make a well-commented but false assertion safe.

## Narrowing hierarchy

Order approaches as: discriminant switch/if, property-presence `in`, primitive
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
and custom-instance semantics. This preference is not a theorem that one operator
is always safer than another.

**Conflict:** [Restrict runtime typeof](#restrict-runtime-typeof) generally prohibits runtime
`typeof`, including checks treated here as
normal narrowing. Do not activate both unchanged.

## Restrict runtime typeof

Decode external values into meaningful domain types at I/O boundaries rather than branching
on representation in downstream code. The rule rejects runtime unary `typeof` by default,
including inside custom type guards.

```typescript
// Rejected under this strict policy:
if (typeof input === 'string') consumeText(input);

// Allowed existence probe:
if (typeof optionalGlobal !== 'undefined') useOptionalGlobal();
```

This policy exempts comparisons with the literal `'undefined'` using `===`, `!==`, `==`, or
`!=`. An optional policy exception permits checks inside a function whose return annotation
is a type predicate. An automated implementation can expose this as
`{ allowInTypeGuards: true }`; that option is not assumed to exist in the target project.
Type-position `typeof` is not the runtime unary operator and is not prohibited by this rule.

**Conflict:** current guidance and the [Narrowing hierarchy](#narrowing-hierarchy) allow
honest primitive narrowing. If selected,
decide guard/parser exemptions explicitly; do not replace `typeof` with assertions or
an incomplete schema merely to evade a syntactic check.

## Restrict Reflect.get

Use typed property access for domain values and decode dynamic input before reading it.
The restriction covers calls to the global `Reflect.get`, including a computed literal method
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

## Restrict Reflect.apply

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
always equivalent. Consult the catalog for adoption of this policy and
[Restrict Reflect.get](#restrict-reflectget).

## Review questions

- What evidence justifies the assertion, and could the model/decoder carry it instead?
- Is a widened type a deliberate public abstraction or an accidental loss of evidence?
- Does the dynamic behavior remain with its actual owner?
- Will a suppression become unused when diagnostics disappear?
- Do compiler and runtime recommendations match the full installed configuration?
- Is a prohibition pending, selected, or in conflict with another selected rule?
