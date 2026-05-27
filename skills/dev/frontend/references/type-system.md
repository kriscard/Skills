> **Priority: HIGH** — Type errors caught at compile time cost nothing. Type
> errors that reach runtime (wrong `as` cast, missing runtime validation at API
> boundary, `React.FC` implying children that don't exist) corrupt state silently.
> Fix type correctness before UI pattern or accessibility issues.
>
> **Read this when:** the user mentions TypeScript types, generics, branded
> types, discriminated unions, `satisfies`, `using`, `NoInfer`, Zod, Valibot,
> ArkType, runtime validation, `tsconfig` options, TypeScript 6.x, TypeScript
> 7.0 beta, or asks anything about type-level programming.
>
> **Not the right file?** Rendering model or Next.js-specific types →
> `nextjs.md`. Component prop types and accessibility → `ui-patterns.md`.

# TypeScript Type System — Deep Dive

## TypeScript 6.x Features

### `const` type parameters (TS 5.0+, widely used in 6.x)

Infers the narrowest literal type instead of widening to `string[]`:

```typescript
// Without const: T inferred as string[]
function identity<T>(value: T): T { return value; }
identity(['a', 'b']); // string[]

// With const: T inferred as readonly ["a", "b"]
function identity<const T>(value: T): T { return value; }
identity(['a', 'b']); // readonly ["a", "b"]
```

Use when you want callers to get back the precise literal type they passed in —
route definitions, config objects, enum-like tuples.

### `satisfies` operator

Validates a value against a type without widening it:

```typescript
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

// palette.red is number[], not string | number[] — type is preserved
palette.red.map(v => v * 2); // ✅ works
```

Use instead of `as const` when you want both literal inference AND type
checking.

### `using` declarations (ES2025 / TS 5.2+)

Deterministic cleanup via the `Symbol.dispose` protocol:

```typescript
{
  using handle = getFileHandle();
  // handle[Symbol.dispose]() called automatically at block exit
  // — even if an exception is thrown
}

// For async: `await using`
await using conn = await openConnection();
```

Prefer over `try/finally` cleanup in Node.js / Bun / Deno code.

### `NoInfer<T>`

Prevents TypeScript from using a type parameter as an inference site:

```typescript
// Without NoInfer: TypeScript infers T from BOTH arg and default
function createState<T>(initial: T, fallback: T): T { ... }
createState(0, ""); // error — good, but only by accident

// With NoInfer: T is only inferred from `initial`; `fallback` must match
function createState<T>(initial: T, fallback: NoInfer<T>): T { ... }
```

Use when a function has a "primary" inference site and secondary parameters
that should be checked against it, not used to widen it.

### Template literal types

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickHandler = EventName<'click'>; // "onClick"

type DeepKeyOf<T, Prefix extends string = ''> =
  T extends object
    ? { [K in keyof T]: K extends string
        ? DeepKeyOf<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
        : never }[keyof T]
    : Prefix extends `${string}.` ? never : Prefix;
```

### Variadic tuple types

```typescript
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
type Pair = Concat<[string], [number]>; // [string, number]

function curry<T extends unknown[], R>(
  fn: (...args: T) => R
): T extends [infer Head, ...infer Tail]
  ? (head: Head) => (...rest: Tail) => R
  : () => R { ... }
```

### Recursive conditional types

```typescript
type DeepReadonly<T> =
  T extends (infer U)[]
    ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

type DeepPartial<T> =
  T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;
```

---

## Branded Types

Prevent mixing semantically distinct primitives that share the same underlying
type:

```typescript
// Declaration (the _brand field never exists at runtime — purely nominal)
type UserId = string & { readonly _brand: 'UserId' };
type ProductId = string & { readonly _brand: 'ProductId' };

// Constructor (validates + brands)
function UserId(raw: string): UserId {
  if (!raw.startsWith('usr_')) throw new Error(`Invalid UserId: ${raw}`);
  return raw as UserId;
}

// Usage: TypeScript now prevents passing a ProductId where a UserId is expected
function getUser(id: UserId): Promise<User> { ... }
getUser(ProductId('prod_123')); // ❌ compile error
getUser(UserId('usr_123'));     // ✅
```

Common candidates for branding: IDs (user, product, order), currency amounts
(dollars vs cents), sanitized strings (`SafeHtml`), validated emails.

---

## Discriminated Unions

The correct way to model "this can be one of N shapes":

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// Exhaustive handling — TypeScript narrows automatically
function handle<T>(result: Result<T>): T {
  if (result.ok) return result.value; // result.value: T
  throw result.error;                  // result.error: Error
}

// With never for exhaustiveness
type Shape = Circle | Square | Triangle;
function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.side ** 2;
    case 'triangle': return 0.5 * s.base * s.height;
    default: {
      const _: never = s; // compile error if a case is unhandled
      return _;
    }
  }
}
```

---

## Type Predicates & Assertion Functions

```typescript
// Type predicate
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'email' in value
  );
}

// Assertion function (throws instead of returning boolean)
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) throw new TypeError(`Expected User, got ${typeof value}`);
}
```

---

## Runtime Validation: Zod vs Valibot vs ArkType

### When to add runtime validation

Every boundary where TypeScript types can't protect you:
- Network responses (API calls, webhooks)
- Form inputs
- URL search params
- `localStorage` / `sessionStorage` reads
- `postMessage` / `BroadcastChannel` messages
- `JSON.parse` results

### Zod

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().brand('UserId'),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['admin', 'user', 'guest']),
  createdAt: z.coerce.date(),
});

type User = z.infer<typeof UserSchema>;

// At a fetch boundary:
const user = UserSchema.parse(await res.json()); // throws on invalid
const result = UserSchema.safeParse(await res.json()); // returns { success, data/error }
```

**Zod trade-offs:** Mature ecosystem, best DX, large bundle (~13 KB min+gz).
Default for most projects.

### Valibot

```typescript
import * as v from 'valibot';

const UserSchema = v.object({
  id: v.pipe(v.string(), v.brand('UserId')),
  email: v.pipe(v.string(), v.email()),
  role: v.picklist(['admin', 'user', 'guest']),
});

type User = v.InferOutput<typeof UserSchema>;
```

**Valibot trade-offs:** Tree-shakeable — only pays for what you use (~600 B for
simple schemas). API is more verbose. Choose when bundle size is the
constraint.

### ArkType

```typescript
import { type } from 'arktype';

const User = type({
  id: 'string',
  email: 'string.email',
  age: 'number.integer >= 0',
  role: '"admin" | "user" | "guest"',
});

type User = typeof User.infer;
```

**ArkType trade-offs:** String-based syntax enables cyclic types and
exceptional performance (~3–5× faster than Zod at runtime). Learning curve for
the string DSL. Choose for performance-critical validation or deeply recursive
schemas.

---

## tsconfig Best Practices

### Baseline (TypeScript 6.x defaults already include `strict: true`)

```json
{
  "compilerOptions": {
    "target": "es2025",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "types": ["node"],
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

### Key options explained

**`exactOptionalPropertyTypes`** — distinguishes `{ x?: string }` (property
may be absent) from `{ x: string | undefined }` (property present but
undefined). Prevents `obj.x = undefined` from satisfying `x?: string`.

**`noUncheckedIndexedAccess`** — `arr[0]` returns `T | undefined` instead of
`T`. Catches array out-of-bounds bugs. Requires null checks that you should
probably be writing anyway.

**`verbatimModuleSyntax`** — enforces `import type` for type-only imports.
Required for correctness with bundlers that do single-file transforms (esbuild,
SWC). Prevents runtime errors from importing types as values.

**`types: []`** — TypeScript 6.x default. Ambient types (like
`@types/node`) are NOT auto-included. List them explicitly:
`"types": ["node", "jest"]`. This is a breaking change from 5.x.

---

## React + TypeScript Patterns

Patterns from react-typescript-cheatsheet.netlify.app and tkdodo.eu — things
TypeScript alone doesn't warn about but consistently cause bugs or confusion
in React codebases.

### Never use `React.FC` — use plain function declarations

```typescript
// ❌ React.FC — deprecated (explicitly called out in react-typescript-cheatsheet)
// Implies implicit children prop, forces return type, more verbose, no benefit
const Button: React.FC<ButtonProps> = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

// ✅ Plain function declaration — the standard
function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### `defaultProps` is broken in React 19 for function components

```typescript
// ❌ React 19: defaultProps on function components is silently ignored
function Card({ title }: CardProps) { ... }
Card.defaultProps = { title: 'Untitled' }; // does nothing!

// ✅ Destructuring defaults — works in all React versions
function Card({ title = 'Untitled' }: CardProps) { ... }
```

### `DistributiveOmit` — `Omit` on discriminated unions is not distributive

From tkdodo's TypeScript series — `Omit` on a union collapses it:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

// ❌ Omit on a union — applies to the entire union, not each member
type WithoutKind = Omit<Shape, 'kind'>;
// Result: { radius?: number; side?: number } — wrong, loses discriminant

// ✅ DistributiveOmit — applies Omit to each union member
type DistributiveOmit<T, K extends keyof any> = T extends T ? Omit<T, K> : never;
type WithoutKind = DistributiveOmit<Shape, 'kind'>;
// Result: { radius: number } | { side: number } — correct
```

### `Array<T>` vs `T[]` — avoid the union operator precedence trap

```typescript
// ❌ Operator precedence trap: this means (string) | (number[])
const items: string | number[] = []; // not (string | number)[]!

// ✅ Array<T> — unambiguous, especially for union element types
const items: Array<string | number> = []; // clearly (string | number)[]
```

Prefer `Array<T>` over `T[]` any time the element type is a union or complex type.

### `as const` vs `as Type` — fundamentally different operations

```typescript
// as const — infers the narrowest literal type (widening prevention)
const config = {
  endpoint: '/api/users',
  method: 'GET',
} as const;
// config.method is 'GET' — not string

// as Type — type assertion (tells TypeScript "trust me, this is Type")
// Does NOT validate — it is a lie that TypeScript accepts
const user = response.data as User; // ❌ no runtime validation

// The key difference: as const is safe (affects inference), as Type is unsafe (bypasses checking)
```

### Optional `foo?` vs `foo: T | undefined` — they behave differently

```typescript
interface WithOptional { foo?: string }     // foo may be absent OR undefined
interface WithExplicit { foo: string | undefined } // foo MUST be present (as undefined)

// With exactOptionalPropertyTypes: true (recommended in tsconfig):
const a: WithOptional = {};              // ✅ foo can be absent
const b: WithExplicit = {};             // ❌ foo must be provided (even as undefined)
const c: WithExplicit = { foo: undefined }; // ✅

// Implication: use `foo: T | undefined` when you want callers to explicitly
// acknowledge the undefined case rather than silently omitting the prop.
// Useful when removing a field — optional `foo?` won't catch all callers.
```

### Component prop types — prefer explicit interfaces over inline types

```typescript
// ❌ Inline type — no reuse, harder to extend
function Button({ label, onClick }: { label: string; onClick: () => void }) { ... }

// ✅ Named interface — reusable, extensible, shows up in editor hover
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) { ... }
```

### Event handler types

```typescript
// Input / change events
onChange: React.ChangeEventHandler<HTMLInputElement>  // or
onChange: (e: React.ChangeEvent<HTMLInputElement>) => void

// Form submit — React 19: use useActionState; React 18:
onSubmit: React.FormEventHandler<HTMLFormElement>

// Click — generic or specific
onClick: React.MouseEventHandler<HTMLButtonElement>
onClick: (e: React.MouseEvent<HTMLButtonElement>) => void

// Keyboard
onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
```

---

## Anti-Patterns

### `as` casting — silences the type checker without fixing the type

```typescript
// ❌ Lying to TypeScript
const user = response.data as User;

// ✅ Validate before asserting
const user = UserSchema.parse(response.data);
```

### `!` non-null assertion — promises TypeScript something that may be false

```typescript
// ❌ Explodes at runtime if someMap.get() returns undefined
const value = someMap.get(key)!;

// ✅ Handle the undefined case
const value = someMap.get(key) ?? defaultValue;
// or
const value = someMap.get(key);
if (!value) throw new Error(`Missing key: ${key}`);
```

### `any` — opts entire subtrees out of type checking

```typescript
// ❌ any silences all errors below it
function processData(data: any) {
  return data.user.name.toUpperCase(); // no error even if all of this is wrong
}

// ✅ unknown forces you to narrow before use
function processData(data: unknown) {
  const parsed = DataSchema.parse(data);
  return parsed.user.name.toUpperCase();
}
```

### Circular types — can cause TS performance degradation

```typescript
// ❌ Circular type aliases can cause the type checker to loop
type A = { b: B };
type B = { a: A };

// ✅ Use interfaces for circular references — they're lazily evaluated
interface A { b: B }
interface B { a: A }
```

### `// @ts-ignore` without a comment

```typescript
// ❌ Silent suppression — future readers have no idea why
// @ts-ignore
doSomethingBroken();

// ✅ Prefer ts-expect-error (fails if the error goes away)
// @ts-expect-error — third-party lib type is wrong, tracked in issue #123
doSomethingBroken();
```

---

## Further Reading

- [TypeScript 6.0 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [Zod docs](https://zod.dev)
- [Valibot docs](https://valibot.dev)
- [ArkType docs](https://arktype.io)
- [Matt Pocock — Total TypeScript](https://www.totaltypescript.com)
