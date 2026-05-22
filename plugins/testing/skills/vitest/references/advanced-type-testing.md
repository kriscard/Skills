> **Read this when:** testing TypeScript types with expectTypeOf or assertType, type-level test files (.test-d.ts), or running vitest typecheck.

# Type Testing

Test TypeScript types without runtime execution.

## Setup

Type tests use `.test-d.ts` extension:

```ts
// math.test-d.ts
import { expectTypeOf } from 'vitest'
import { add } from './math'

test('add returns number', () => {
  expectTypeOf(add).returns.toBeNumber()
})
```

## Configuration

```ts
defineConfig({
  test: {
    typecheck: {
      enabled: true,
      only: false,        // set true to only run type tests
      checker: 'tsc',     // 'tsc' | 'vue-tsc'
      include: ['**/*.test-d.ts'],
      tsconfig: './tsconfig.json',
    },
  },
})
```

## expectTypeOf API

```ts
import { expectTypeOf } from 'vitest'

expectTypeOf<string>().toBeString()
expectTypeOf<number>().toBeNumber()
expectTypeOf<boolean>().toBeBoolean()
expectTypeOf<null>().toBeNull()
expectTypeOf<undefined>().toBeUndefined()
expectTypeOf<void>().toBeVoid()
expectTypeOf<never>().toBeNever()
expectTypeOf<any>().toBeAny()
expectTypeOf<unknown>().toBeUnknown()
expectTypeOf<object>().toBeObject()
expectTypeOf<Function>().toBeFunction()
expectTypeOf<[]>().toBeArray()
```

## Value Type Checking

```ts
const value = 'hello'
expectTypeOf(value).toBeString()

const obj = { name: 'test', count: 42 }
expectTypeOf(obj).toMatchTypeOf<{ name: string }>()
expectTypeOf(obj).toHaveProperty('name')
```

## Function Types

```ts
function greet(name: string): string {
  return `Hello, ${name}`
}

expectTypeOf(greet).toBeFunction()
expectTypeOf(greet).parameters.toEqualTypeOf<[string]>()
expectTypeOf(greet).returns.toBeString()
expectTypeOf(greet).parameter(0).toBeString()
```

## Equality vs Matching

```ts
interface A { x: number }
interface B { x: number; y: string }

expectTypeOf<B>().toMatchTypeOf<A>()         // B extends A (subset OK)
expectTypeOf<A>().not.toEqualTypeOf<B>()     // not exact
expectTypeOf<A>().toEqualTypeOf<{ x: number }>() // exact match
```

## Branded Types

```ts
type UserId = number & { __brand: 'UserId' }
type PostId = number & { __brand: 'PostId' }

expectTypeOf<UserId>().not.toEqualTypeOf<PostId>()
expectTypeOf<UserId>().not.toEqualTypeOf<number>()
```

## Nullable Types

```ts
type MaybeString = string | null | undefined

expectTypeOf<MaybeString>().toBeNullable()
expectTypeOf<string>().not.toBeNullable()
```

## assertType

Assert a value matches a type (no runtime check):

```ts
import { assertType } from 'vitest'

function getUser(): User | null {
  return { id: 1, name: 'test' }
}

test('returns user', () => {
  const result = getUser()

  // @ts-expect-error - should fail type check
  assertType<string>(result)

  assertType<User | null>(result) // correct
})
```

## Using @ts-expect-error

Test that code produces a type error:

```ts
test('rejects wrong types', () => {
  function requireString(s: string) {}

  // @ts-expect-error - number not assignable to string
  requireString(123)
})
```

## Running Type Tests

```bash
vitest typecheck                    # run type tests
vitest --typecheck                  # run alongside unit tests
vitest --typecheck.only             # type tests only
```

## Mixed Test Files

```ts
// user.test.ts — combines runtime + type tests
import { describe, expect, expectTypeOf, test } from 'vitest'
import { createUser } from './user'

describe('createUser', () => {
  test('runtime: creates user', () => {
    expect(createUser('John').name).toBe('John')
  })

  test('types: returns User type', () => {
    expectTypeOf(createUser).returns.toMatchTypeOf<{ name: string }>()
  })
})
```

## Key Points

- Use `.test-d.ts` for type-only tests
- `toMatchTypeOf` for subset matching; `toEqualTypeOf` for exact match
- Use `@ts-expect-error` to test that code produces type errors
- Run with `vitest typecheck` or `--typecheck` flag
