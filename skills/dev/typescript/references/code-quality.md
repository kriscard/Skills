> **Read this when:** a TypeScript review concerns collection pipelines, reducers,
> dynamic access or calls, iterator helpers, broad object types, or syntactic rules
> presented as general code quality.

# TypeScript Code Quality

Judge the demonstrated semantics, cost, and ownership. Do not turn a lint catalog into
a language-wide prohibition list or require a plugin installation.

## Preserve readable ordinary code

Readable `filter().map()` and `map().filter()` pipelines are valid. Combine passes only
when measurement, allocation pressure, or a hot path makes the extra traversal matter
and the replacement remains clearer. Iterator helpers are an option only when the
actual runtime supports them or the project provides a compatible polyfill; TypeScript
library declarations alone do not add runtime methods.

Conditional object spread can be a clear way to omit a property. Raise a concern when
omission versus `undefined` changes API semantics or the expression obscures control
flow, not because an empty object appears in one branch.

Named argument objects can improve evolvability and call-site clarity. A rule concerned
with a parameter typed as broad `object` is not a ban on domain-specific options objects.
Choose positional or object parameters from the API's meaning, call frequency, and
repository convention rather than a universal allocation claim.

## Report demonstrated costs

Copying a growing accumulator on every reducer iteration can produce quadratic work:

```typescript
// Risk: each iteration copies everything accumulated so far.
const byId = items.reduce<Record<string, Item>>(
  (acc, item) => ({ ...acc, [item.id]: item }),
  {},
);

// Better when the accumulator is fresh and locally owned.
const byId = items.reduce<Record<string, Item>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
```

Treat this as a demonstrated algorithmic cost, not a universal ban on immutable reducers.
A small bounded reduction or code governed by immutable-state semantics may reasonably
prefer copying. State the input scale or measured impact before calling it a performance
bug.

## Keep dynamic mechanisms with their owner

Prefer typed property access and direct calls in application code because they preserve
compiler help. Allow `Reflect.get`, `Reflect.apply`, proxies, instrumentation,
compatibility shims, and metaprogramming where dynamic dispatch is the module's actual
responsibility. Hide that mechanism behind a typed interface when ordinary callers do
not need to know it.

Module mocking is a testing-boundary decision, not a TypeScript syntax defect. Evaluate
whether a test replaces the subject or crosses an owned boundary using the repository's
testing guidance.

## Keep honest escape hatches visible

`unknown` is correct for untrusted inputs, low-level adapters that intentionally force
callers to parse, error causes, guards, and generic containers. `Record<string, unknown>`
is useful at an untrusted object boundary. The concern is letting these broad types leak
through trusted domain APIs or hiding them behind aliases with no added meaning.

Primitive `typeof`, `instanceof`, discriminants, and control-flow narrowing are ordinary
TypeScript evidence. Structured external objects may need a schema, but a one-off
primitive check does not.

Do not flag a symbol merely because its name contains `shape`; domain vocabulary should
remain precise. Do not ban conditional spreads, dictionary types, or unknown parameters
without a concrete contract problem.

## Separate formatting from semantics

Spacing and blank-line layout belong to the installed formatter and repository lint
configuration. Use those tools rather than prose rules that compete with automated
formatting.

## Review threshold

Raise a TypeScript code-quality finding only when it identifies at least one of:

- lost or fabricated type evidence;
- an invalid or misleading public contract;
- dynamic behavior leaking beyond its owner;
- a demonstrated complexity or runtime-support problem;
- duplicated type ownership likely to drift.

Otherwise preserve the readable local idiom and repository convention.
