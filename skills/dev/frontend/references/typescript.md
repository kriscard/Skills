> **Read this when:** designing or auditing frontend TypeScript contracts, component
> props, state models, generics, wrapper types, assertions, or compiler settings.

# Frontend TypeScript

Use TypeScript to make invalid states hard to express and public contracts hard to
misread. Inspect the installed TypeScript version and project configuration before
applying version-sensitive syntax or compiler advice.

## Public contracts

- Name exported contracts and keep them smaller than their implementations.
- Model mutually exclusive states with discriminated unions rather than optional
  fields that allow impossible combinations.
- Use exhaustive handling when every variant must be considered.
- Derive wrapper props from the wrapped element or component so native behavior does
  not drift from the wrapper API.
- Expose a ref only when consumers need direct DOM access or an imperative contract.
- Preserve repository conventions for `type` versus `interface`. Prefer unions and
  mapped composition with `type`; prefer `interface` when declaration merging or an
  explicitly extensible library surface is intended.

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };
```

## Trust and narrowing

- Start unknown external values as `unknown`.
- Narrow with control flow, predicates, or boundary schemas.
- Treat `as` as a claim requiring evidence, not a conversion.
- Prefer `satisfies` when a value should be checked without widening its inferred
  shape.
- Use `@ts-expect-error` only for an intentional, explained incompatibility; it should
  fail once the incompatibility disappears.

Load `runtime-validation.md` when the value crosses a runtime trust boundary.

## Component APIs

- Keep required and optional behavior visible in the prop model.
- Replace interacting boolean modes with explicit variants or a discriminated union.
- Derive native wrapper props with `ComponentPropsWithoutRef`, `ComponentPropsWithRef`,
  or `ComponentProps` according to whether the public API exposes a ref.
- Keep event types specific to the element and behavior being wrapped.
- Type `children` according to what the component actually accepts; do not add it to
  components that cannot render arbitrary children.

## Generics

A generic should preserve a relationship the caller cares about. Remove generics that
only rename `unknown`, require assertions in the implementation, or expose internal
machinery. Prefer inference from arguments and discriminants over explicit generic
arguments at every call site.

## Compiler configuration

Read the repository's `tsconfig` and framework-generated defaults first. Prefer strict
checking and enable additional checks when the codebase can satisfy them without broad
suppression. Evaluate options such as exact optional properties and unchecked indexed
access against existing contracts before enabling them globally.

## Verification

A TypeScript change is complete when:

- public states cannot represent known-invalid combinations;
- unknown values are narrowed before use;
- wrappers preserve the intended native or component contract;
- assertions and suppressions are justified at their exact location;
- the project's typecheck passes without broadening types to silence errors.
