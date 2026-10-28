> **Read this when:** implementing lint rules, TypeScript AST tooling, codemods,
> lexical scope resolution, alias/generic analysis, receiver classification,
> recursive analysis, or program-level analysis caches.

# Static Analysis Engineering

## Current skill guidance

Match the installed parser's AST, visitor keys, scope API, and declarations. Distinguish
local syntax evidence from full compiler type evidence. Keep dynamic AST traversal with
its adapter owner, test the supported node forms, and avoid inferring semantics from an
identifier's spelling alone. This reference is conditional tooling material, not required
reading for ordinary typed application edits.

## Collected implementation patterns

Practices 39–47 are implementation patterns for static analysis, **not application-code
lint restrictions**. The examples and limits describe analyzer design, not a mandate to
add a parser or implement this machinery in every project. Before applying a numbered
pattern as policy, read its adoption decision in the [catalog](practice-catalog.md), the
sole persistent adoption record.

## Practice 39 — Resolve lexical bindings

Resolve an identifier to its actual binding by asking the scope manager for the use site's
scope, checking its variable map, then walking `upper` scopes. A spelling shared with a
reducer parameter or imported function is not proof of identity.

```typescript
items.reduce((acc, item) => {
  function copy(acc: Item[]) {
    return acc.slice();
  }
  // The nested acc is not the reducer's acc.
  return acc;
}, []);
```

Return the resolved `Variable` or `null`, letting rules compare identities
and distinguish unresolved/global references. Test nested scopes, parameter shadowing,
imports, and local reassignments. Parser scope objects are the boundary: do not reconstruct
lexical identity with a global name-to-node map.

## Practice 40 — Respect shadowed built-ins

Check that a recognized name really refers to the built-in before applying built-in
semantics. A local `Reflect`, `Record`, or other competing declaration must not be treated
as the global mechanism merely because the spelling matches.

```typescript
function invoke(Reflect: CustomDispatcher) {
  return Reflect.apply(); // Not necessarily global Reflect.apply.
}

type Record<Key, Value> = CustomContainer<Key, Value>;
// This declaration changes what Record means in this scope.
```

A reflection helper uses the scope API/global-reference evidence. Dictionary
classification consults visible type bindings before recognizing built-in wrappers.
Value and type namespaces need their respective lookup rules; test imports, classes,
interfaces, and generic parameters as shadowing cases. These are illustrative snippets
with project-owned custom types, not declarations to add to an application.

## Practice 41 — Resolve aliases and generic substitutions

Follow the nearest visible type alias and substitute supplied type arguments or defaults
before classifying the result. Otherwise a direct type and its equivalent alias receive
different treatment, and a generic wrapper hides the underlying contract.

```typescript
type Identity<T> = T;
type Envelope<T = unknown> = Identity<T>;
type Raw = Envelope;       // Defaults resolve to unknown.
type Named = Envelope<User>; // Resolves to User instead.
```

The analysis environment records competing lexical type bindings and visible aliases;
substitution records retain the environment needed to interpret explicit arguments versus
defaults. A missing argument with no default or an ambiguous/non-alias binding is not a
license to invent a result. Resolution is local syntactic analysis, not imported-declaration
or arbitrary conditional-type evaluation. Use the actual compiler API when the required
claim exceeds this evidence.

## Practice 42 — Respect type-parameter scope

A generic parameter, mapped-type key, or inferred conditional-type parameter can shadow
an outer alias. Collect binders at the use site rather than resolving every type name
through a module-level alias map.

```typescript
type Value = unknown;
type Identity<Value> = Value; // The parameter, not the outer alias.

type Mapped<Input> = { [Key in keyof Input]: Key };
type Unpacked<Input> = Input extends Promise<infer Item> ? Item : never;
```

Collect generic parameters while walking ancestors, mapped keys in the
appropriate mapped-type portions, and `infer` names in the conditional's true branch.
An inferred name does not automatically bind the false branch. Test both branches and
nested/shadowed generics; a binder's syntactic existence is not enough to prove visibility
everywhere in the parent node.

## Practice 43 — Normalize syntax wrappers

Unwrap syntax that does not change the underlying expression being inspected: parentheses,
chain wrappers, type/const assertions, non-null assertions, and `satisfies` where supported.
For type classification, unwrap applicable parenthesized/readonly wrappers. Centralize
this so each rule does not inconsistently miss equivalent forms.

```typescript
const result = (items as readonly Item[]).filter(isVisible).map(labelFor);
// Receiver inspection should still reach the items binding.
```

Unwrapping an assertion does not establish that its claim is true. Likewise, ignoring a
chain wrapper for recognition is not permission for a codemod to remove optional-chaining
runtime behavior. Normalize only the evidence needed by the rule and preserve original
nodes/locations for diagnostics and edits. Different helpers intentionally unwrap different
sets of wrappers; do not assume one universal list fits every analysis.

## Practice 44 — Require receiver evidence

Establish a known array receiver before flagging an array-specific pipeline or copy. The
helper recognizes array literals, supported array annotations/tuples, selected array-
producing method chains, and stable const initializers. It rejects unknown receivers,
reassigned bindings, and already-lazy pipelines when array evidence is absent.

```typescript
const values = [1, 2, 3];
values.filter(isPositive).map(double); // Known local array evidence.

customCollection.filter(isPositive).map(double); // Method names alone are insufficient.
```

This avoids treating every `map` or `filter` as the native eager array operation. It is
still a local heuristic: an asserted annotation is not runtime validation, and this helper
is not a full semantic checker of every possible alias/shadowing form. Test positive and
negative receivers rather than extrapolating method names to universal semantics.

## Practice 45 — Guard recursive analysis

Track visited bindings/aliases so recursive aliases and cyclic initializer/reference flows
do not recurse forever. Use binding/declaration identity where available and keep the
visited set scoped to the resolution branch.

```typescript
type Left = Right;
type Right = Left;
// An analyzer must terminate rather than repeatedly expand Left -> Right -> Left.
```

This intentionally pathological input illustrates analyzer robustness, not valid application
modeling. Pass visited sets through resolution and clone branch state where needed. Stopping on a cycle means evidence is unresolved; it does not mean the target is
safe. Avoid a global visited set that causes one path to suppress another unrelated match.

## Practice 46 — Cache per-program analysis

Collect lexical aliases/bindings once for a program AST and reuse that environment. Store
environments in a `WeakMap<Program, TypeAliasEnvironment>` keyed by program identity,
avoiding repeated tree walks and retaining no separate strong key reference.

```typescript
const environments = new WeakMap<Program, TypeAliasEnvironment>();

function environmentFor(program: Program): TypeAliasEnvironment {
  const cached = environments.get(program);
  if (cached !== undefined) return cached;
  const environment = collectEnvironment(program);
  environments.set(program, environment);
  return environment;
}
```

This is pseudocode using parser-specific types and a collector. A cache is valid only for
the AST and assumptions used to build it. If a tool mutates the AST or changes relevant
configuration/visitor keys, invalidate or rebuild. `WeakMap` permits collection when the
program is unreachable; it does not magically repair stale analysis or bound a live AST's
memory usage. Prefer caching expensive reusable evidence over caching trivial lookups.

## Practice 47 — Normalize parameter forms

Read annotations and local binding names consistently across ordinary parameters,
TypeScript parameter properties, rest elements, and default/assignment patterns. Annotation
location can vary with the wrapper; diagnostics should target the actual annotation and
not mistake default expressions for binding names.

```typescript
function consume(value: unknown = fallback) {}
function gather(...values: unknown[]) {}
class Example {
  constructor(public value: unknown) {}
}
```

These demonstrate AST forms, not a claim that every form violates the same rule. The helper
unwraps wrappers when locating names/annotations and trims annotation text for destructured
binding labels. Its `containsUnknownType` recognizes direct `unknown`, parentheses, and
unions containing it; `unknown[]` is not identical to the direct top type. Alias expansion
is a separate responsibility. Test destructuring, defaults, rest, and constructor forms
instead of checking only `Identifier` parameters.

## Completion criterion

The analyzer distinguishes syntax evidence from semantic proof, respects supported lexical
bindings, terminates on cycles, and has fixtures for wrappers/shadowing/parameter variants.
Cached results are bound to the correct AST. Apply numbered patterns as policy only per
the catalog or explicit task selection; ordinary TypeScript edits do not require implementing
this analysis machinery.
