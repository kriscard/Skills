> **Read this when:** working on collection pipelines, reducers, iterator helpers,
> conditional object construction, argument design, symbol naming, spacing, or
> syntactic TypeScript code-quality policies.

# TypeScript Code Quality

## Current skill guidance

Judge demonstrated semantics, cost, and ownership rather than turning a lint catalog into
universal prohibitions or requiring a plugin installation. Readable filter/map pipelines
and conditional spreads are valid. Combine passes only for a demonstrated traversal or
allocation concern while keeping clarity. Preserve callback ordering/index semantics and
actual runtime support; declarations alone do not provide iterator helpers.

Named argument objects are useful when the API benefits, not universally mandatory or
universally wasteful. Broad `object` parameter types and domain-specific options objects
are different. Keep intentional raw dictionaries/`unknown` at boundaries; do not hide them
in meaningless aliases. Ordinary narrowing is valid; a one-off primitive check does not
require a schema dependency.

Dynamic mechanisms and module mocking remain decisions for their owning adapter/testing
boundary, not syntax defects by themselves. Do not flag a name solely for containing
`shape`; preserve precise domain vocabulary. Formatting belongs to the installed tools,
not a competing prose layout policy. Stricter policy alternatives appear below.

## Collected practices

**Adoption: Pending for practices 30–33 and 37–38.** Full policy alternatives remain available
for selection in the [catalog](practice-catalog.md), not enforced by their inclusion here.

## Practice 30 — Avoid adjacent array filter/map passes

Reject adjacent array `filter().map()` and `map().filter()` passes in favor of
supported lazy iterator helpers or a single transformation. It recognizes local array
receivers; arbitrary custom collections and already-lazy pipelines are not assumed to be
arrays just because their methods have those names.

```typescript
// This policy rejects consecutive eager passes:
const labels = items.filter(isVisible).map(labelFor);

// Possible replacement when callbacks are independent and semantics match:
const labels = items.flatMap((item) => isVisible(item) ? [labelFor(item)] : []);
```

For runtimes supporting iterator helpers, another option is
`items.values().filter(isVisible).map(labelFor).toArray()`. Match runtime/polyfill support,
not just TypeScript `lib` declarations. `flatMap` is eager and may allocate per item; it
is not automatically faster.

**Semantic limits:** eager filter-then-map runs all filters before any mapper; interleaving
can change side effects. Mapping after filtering receives filtered indexes, not original
indexes; callback third arguments differ too. Map-then-filter predicates receive mapped
values. Preserve these facts or retain the original pipeline.

**Conflict:** current guidance allows readable pipelines without a measured/established
need to combine them. This syntactic prohibition is pending, not an automatic
performance finding.

## Practice 31 — Avoid copying growing reducer accumulators

Repeatedly copying everything accumulated so far can cause quadratic work as input grows.
Check `Object.assign({}, acc, ...)`, `Array.from(acc)`, and array copy methods
such as `concat`, `slice`, `toSpliced`, `toSorted`, `toReversed`, and `with` when receiver
and accumulator evidence match. Follow stable local aliases and respect shadowed
globals. Include spread copies in the check rather than only non-spread copy APIs.

```typescript
// Each iteration copies the growing dictionary.
const byId = items.reduce<Record<string, Item>>(
  (acc, item) => ({ ...acc, [item.id]: item }),
  {},
);

// A fresh, locally owned Map avoids copying and accepts arbitrary string keys.
const byIdMap = new Map<string, Item>();
for (const item of items) byIdMap.set(item.id, item);
```

`Map` is an alternative API, not a drop-in object replacement: preserve serialization,
lookup, insertion-order, and duplicate-key requirements when choosing it. If the output
must remain an object and runtime support permits it, an alternative is:

```typescript
const byIdObject = Object.fromEntries(items.map((item) => [item.id, item]));
```

For arbitrary string IDs, do not blindly replace computed-property spread with
`acc[item.id] = item` on `{}`: the key `__proto__` invokes the inherited setter rather than
creating the original own property. Use a deliberately safe dictionary strategy. Open
record typing also does not establish that every lookup exists.

Mutation is appropriate only for a fresh locally owned accumulator; immutable state
semantics may forbid it. Permit mutation such as `acc.push(item)` and do not flag a copy
of the current item just because it appears inside a reducer. Under current
guidance, a small bounded immutable reduction can be reasonable; establish scale/impact
before calling it a performance bug.

## Practice 32 — Explicit conditional object construction

Prohibit conditional spreads with an empty-object branch because property
omission is hidden inside an expression. Build the object and add the property only when
present instead.

```typescript
// This policy rejects this form:
const options = { id, ...(enabled ? { timeoutMs } : {}) };

type RequestOptions = { id: string; timeoutMs?: number };
const options: RequestOptions = { id };
if (enabled) options.timeoutMs = timeoutMs;
```

These are alternative snippets, not consecutive declarations. Preserve evaluation order,
computed-key/prototype behavior, ownership, and actual omission. Assigning `undefined`
is not equivalent to omission for JSON/object inspection, some APIs, or
`exactOptionalPropertyTypes`. If explicit mutation is unsuitable, a conditional producing
the whole object can be clearer.

**Conflict:** current guidance permits conditional spreads when readable and semantically
correct. This pending restriction is not proof the original form is unsafe.

## Practice 33 — Named object arguments

Prefer one named options object over positional arguments to make argument order
self-documenting and permit API evolution. Exempt allocation-sensitive
hot paths such as per-frame rendering, tokenizers, and parsers.

```typescript
// Position-sensitive call:
openSelection(uri, 10, 1, 20, 1);

// Named fields communicate meaning:
openSelection({
  uri,
  startLine: 10,
  startColumn: 1,
  endLine: 20,
  endColumn: 1,
});
```

These show alternative APIs; changing the signature requires updating real callers and
preserving the public contract. Current guidance chooses from API meaning and convention
rather than universally requiring objects. This is independent of #19's broad `object`
annotation restriction; named owner-provided options types satisfy that restriction.

## Practice 37 — Domain naming instead of shape

Prohibit the case-insensitive substring `shape` in owned JS/TS/private/JSX
symbol names because it describes structure rather than domain responsibility. Rename
`PayloadShape` to a name describing what that payload means.

```typescript
// Rejected under this policy:
type AccountShape = { id: string };
// Domain name:
type AccountSummary = { id: string };
```

The rule allows borrowed member access such as `schema.shape.id`; it does not require
renaming external library properties. Its substring policy can also reject legitimate
geometry vocabulary or names containing the same letters. **Conflict:** current guidance
allows precise domain names and does not treat substring presence as a defect. Select the
strict policy explicitly rather than silently replacing it with a vague naming preference.

## Practice 38 — Structural blank-line grouping

Apply a padding-line policy with whitespace-only fixes:

- Separate imports from subsequent non-import statements; imports may stay grouped.
- Separate top-level non-import statements, subject to the grouping exceptions below.
- Separate function, class, interface, and type declarations from surrounding statements.
- Separate multiline `const`, `let`, `var`, and `using` bindings from surrounding statements.
- Insert blank lines before `return`, `if`, `switch`, `try`, `for`, `while`, and `do` groups,
  and after block-like statements.
- Permit consecutive single-line bindings to stay grouped at any scope, including module
  scope. A binding with its own leading comment starts a new group; a trailing comment on
  the previous line is not treated as that leading comment.
- Keep overload signatures and their implementation grouped.

```typescript
const minimum = 1;
const maximum = 10;

// A documented binding starts a separate group.
const fallback = 5;

if (value < minimum) {
  return fallback;
}

return Math.min(value, maximum);
```

This is a function-body fragment. Apply via the repository's formatter/linter if selected;
do not manually impose a second contradictory formatting system. Current guidance delegates
spacing to installed tools, so adopting this policy may require a separate approved tooling
change. Collecting it here does not install the plugin or change formatting configuration.

## Review threshold

Under current guidance, raise a finding only for lost/fabricated evidence, a misleading
contract, dynamic behavior leaking beyond its owner, a demonstrated complexity/runtime
support problem, or duplicated type ownership likely to drift. Pending syntactic restrictions
alone are not findings. Preserve readable local idioms unless an adopted rule says otherwise.
