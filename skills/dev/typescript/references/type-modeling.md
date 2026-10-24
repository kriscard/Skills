> **Read this when:** modeling domain states, choosing unions or constructive types,
> deriving types from existing contracts, preserving inference, or designing generics.

# Type Modeling

Model the smallest set of values the program can use correctly. A stronger type earns
its cost when it removes a real partial operation, assertion, repeated check, or
impossible state.

## Start from valid states

Use a discriminated union when variants carry different data or behavior. Keep one
stable discriminant and handle every variant when the operation is meant to be total.

```typescript
// Bad: contradictory and incomplete states compile.
type LoadState<T> = {
  loading: boolean;
  data?: T;
  error?: Error;
};

// Good: each value describes one reachable state.
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'failed'; error: Error };

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

Prefer a representation whose parts are independently valid. Examples include pairs
instead of an even-length flat array, or a non-empty tuple when emptiness would force
`!`, a cast, or a supposedly unreachable throw.

Do not strengthen automatically. `T[]` is the simplest useful type when empty input has
a defined result. If the operation can legitimately return no value, `T | undefined`
may be more honest than requiring a non-empty input.

## Derive before duplicating

Look for an owner before declaring a parallel interface:

1. an existing runtime schema and its supported inference helper;
2. generated OpenAPI, GraphQL, protocol, database, or SDK types;
3. an existing function or value through `Parameters`, `ReturnType`, `Awaited`,
   `typeof`, `Pick`, or `Omit`;
4. a new public contract when none of those expresses the responsibility.

Derivation should preserve ownership, not expose an entire generated transport type to
callers that need only a stable subset.

```typescript
import type { GeneratedAccount } from './generated/account';

type AccountSummary = Pick<GeneratedAccount, 'id' | 'displayName'>;
```

A generated TypeScript annotation describes a static shape. It is runtime evidence only
when the generator or SDK documents that the value was decoded or validated before it
reached the program.

## Preserve inference

Let precise values infer when no wider public contract is required. Use `satisfies` to
check compatibility while retaining the expression's inferred literals and properties.
Annotate when the annotation is itself the intended abstraction or public surface.

```typescript
type RetryPolicy = {
  strategy: 'fixed' | 'exponential';
  attempts: number;
};

const retryPolicy = {
  strategy: 'exponential',
  attempts: 3,
} satisfies RetryPolicy;
```

Avoid widening a known value to `unknown`, `object`, or a broad record and later
asserting it back to a narrower type. That discards evidence and then fabricates it.

Respect repository conventions for `type`, `interface`, and `enum`. Use the construct
whose interoperability and extension behavior match the existing public API; do not
rewrite a sound convention for style alone.

## Make generics carry a relationship

A type parameter should connect facts the caller cares about: input to output, key to
value, variant to handler, or schema to decoded result.

```typescript
// Bad: T cannot be inferred from an input and the implementation must invent evidence.
function decode<T>(input: unknown): T {
  return input as T;
}

// Good: the decoder supplies runtime evidence and preserves its output relationship.
type Decoder<T> = (input: unknown) => T;

function decodeWith<T>(decoder: Decoder<T>, input: unknown): T {
  return decoder(input);
}
```

Prefer inference from arguments and discriminants. Remove a generic that only renames
`unknown`, requires assertions throughout the implementation, or exposes machinery no
caller uses. Add constraints only for operations the implementation actually performs.

## Review questions

- Which invalid state or partial operation does this stronger model remove?
- Does every union variant carry exactly the data its branch needs?
- Is exhaustive handling required here, or is an extensible/default branch deliberate?
- Is a schema, generated contract, function, or value already the source of truth?
- Does each generic preserve a visible relationship?
- Did an annotation erase useful literal or structural information without buying a
  real abstraction?
