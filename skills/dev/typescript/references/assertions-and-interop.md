> **Read this when:** reviewing type assertions, brands, suppressions, declaration
> gaps, generated types, compiler options, or interoperability with untyped code.

# Assertions and Interoperability

A type assertion changes what the compiler accepts; it does not inspect or convert the
runtime value. Treat it as a local evidence claim and prefer designs that let control
flow carry the evidence directly.

## Diagnose before asserting

When TypeScript cannot prove a needed fact, check for:

1. a missing discriminant or incomplete union;
2. a known value widened by an annotation or intermediate binding;
3. an unparsed runtime boundary;
4. stale, incomplete, or version-mismatched declarations;
5. a genuinely inexpressible invariant at an interop seam.

Fix the earliest false contract. An assertion at the final use site often hides the
actual boundary problem.

```typescript
// Bad: evidence is deliberately discarded and then recreated.
const source = { id: 'acct_123', active: true };
const widened: unknown = source;
const account = widened as unknown as { id: string; active: boolean };

// Good: preserve the known value and check the intended contract without widening.
const account = {
  id: 'acct_123',
  active: true,
} satisfies { id: string; active: boolean };
```

Chained assertions such as `value as unknown as T` are evidence laundering. A wider
intermediate type does not establish the narrower claim. An actual validation step
between the two values changes the situation; a second assertion does not.

## Distinguish useful assertion forms

- `as const` preserves literal and readonly inference; it is not a claim that an
  untrusted payload has a domain shape.
- A brand assertion immediately after validating the brand invariant can be the local
  implementation detail of a constructor.
- An interop assertion can be justified when runtime checks, external guarantees, or
  a documented API establish an invariant that declarations cannot express.
- An assertion of external data directly to a domain type is not validation.

Do not impose a blanket `as` ban or require a comment on every assertion. Require a
nearby explanation when the invariant is non-obvious, externally guaranteed, or easy
to invalidate during maintenance. Self-evident const assertions and local, checked
construction should stay readable.

## Keep interop seams narrow

For untyped libraries, reflection, proxies, instrumentation, and metaprogramming:

- isolate dynamic behavior behind a typed adapter;
- validate values entering the typed domain;
- expose the smallest stable typed surface to ordinary application code;
- prefer direct typed property access and function calls outside the dynamic layer;
- test the invariant that justifies any assertion.

Typed access is a default for application code, not a ban on `Reflect.get`,
`Reflect.apply`, indexed access, or proxy internals whose responsibility is dynamic
behavior.

## Suppressions describe a real contract

Use `@ts-expect-error` for an intentional incompatibility that should become an error
when the compiler no longer reports it. Keep the directive on the exact line and state
the repository or upstream contract when it is not obvious. Prefer fixing declarations
or contributing a local augmentation when that is the durable owner.

Avoid broad file-level disables and `@ts-ignore` when the expected diagnostic can be
named. Never widen a type, add `any`, or weaken a public contract solely to silence a
check.

## Compiler contracts

Read the complete `tsconfig` extension chain and framework-generated defaults before
advising on flags. Compiler options are repository migrations, not local style toggles.
Evaluate stricter options against existing public contracts, generated code, test code,
and runtime assumptions, then use the project's normal migration and verification
process.

Match the installed TypeScript version. Syntax such as `satisfies`, library declarations,
and emitted behavior may differ by version. A declaration in `lib` or an installed type
package does not polyfill the runtime feature it describes.

## Review questions

- What concrete evidence makes this assertion true at runtime?
- Could a discriminant, narrower source type, schema, or declaration fix carry that
  evidence instead?
- Did the code widen a value before narrowing it by assertion?
- Is the dynamic operation isolated to an adapter that owns it?
- Will a suppression fail when its expected diagnostic disappears?
- Does the compiler recommendation match the installed version and full config chain?
