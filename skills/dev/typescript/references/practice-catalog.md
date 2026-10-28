> **Read this when:** applying a numbered practice as policy, selecting practices,
> changing adoption decisions, comparing policy alternatives, or auditing coverage of
> the 47 collected practices.

# TypeScript Practice Catalog

## Selection contract

This catalog accounts for **47 of 47** collected practices. Each row links to one full
canonical section with its policy, rationale, examples where useful, exceptions, and
conflicts. The catalog is an index, not a replacement for those sections.

**Pending means documented, not enforced.** The **Decision** column below is the single
persistent adoption record for each practice; topical references do not duplicate it.
Some practices overlap the skill's existing guidance; that guidance remains active independently.
Approval to document all practices did not adopt every ban, naming convention, or tooling
requirement. Numbered sections describe policy alternatives; unnumbered **Current skill
guidance** sections retain the previous defaults and useful generics, compiler,
suppression, and ownership guidance outside the numbered collection.

Use these decisions when the user selects policies:

- **Adopt:** apply the practice with its documented scope.
- **Adopt with conditions:** record the decision here and the exact exceptions/configuration
  in its canonical section, distinguishing the documented alternative from the chosen policy.
- **Exclude:** preserve the documentation and rationale for excluding it.
- **Pending:** preserve the option without activating it.

Update the practice's **Decision** cell here when its persistent adoption changes. Edit
its canonical section only when the chosen conditions or guidance actually change; do not
add a second adoption-status field there. A restriction must not be softened, omitted, or
activated silently. Resolve contradictory selections with the user, and update conflicting
current guidance only as explicitly authorized.
A task-specific choice applies to that task without silently becoming a durable global
policy. Do not install tools/dependencies merely to adopt prose guidance.

## Inventory scope

The 47 IDs are a stable selection inventory. Distinct concerns such as persisted JSON and
wire compatibility have separate entries; overlapping evidence-preservation ideas retain
distinct IDs when their detection or policy differs. Practices 39–47 describe static-analysis
implementation patterns, not additional application-code restrictions. Correctness caveats
are labeled explicitly rather than presented as unconditional TypeScript guarantees.

## Complete coverage and decisions

### Modeling — 6 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 1 | [Discriminated unions](type-modeling.md#practice-1--discriminated-unions) | Pending |
| 2 | [Exhaustive handling with never](type-modeling.md#practice-2--exhaustive-handling-with-never) | Pending |
| 3 | [Constructive modeling](type-modeling.md#practice-3--constructive-modeling) | Pending |
| 4 | [Simplest total types](type-modeling.md#practice-4--simplest-total-types) | Pending |
| 5 | [Validated branded primitives](type-modeling.md#practice-5--validated-branded-primitives) | Pending |
| 6 | [Derive contracts before duplicating](type-modeling.md#practice-6--derive-contracts-before-duplicating) | Pending |

### Runtime boundaries — 13 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 7 | [External data as unknown, not any](runtime-boundaries.md#practice-7--external-data-as-unknown-not-any) | Pending |
| 8 | [Schemas before structural guards](runtime-boundaries.md#practice-8--schemas-before-structural-guards) | Pending |
| 9 | [Honest type guards](runtime-boundaries.md#practice-9--honest-type-guards) | Pending |
| 10 | [Schema compatibility with an existing type](runtime-boundaries.md#practice-10--schema-compatibility-with-an-existing-type) | Pending |
| 11 | [Parse once at the trust boundary](runtime-boundaries.md#practice-11--parse-once-at-the-trust-boundary) | Pending |
| 12 | [Explicit expected-validation failure paths](runtime-boundaries.md#practice-12--explicit-expected-validation-failure-paths) | Pending |
| 13 | [Forward-compatible wire decoding](runtime-boundaries.md#practice-13--forward-compatible-wire-decoding) | Pending |
| 14 | [Versioned persisted JSON](runtime-boundaries.md#practice-14--versioned-persisted-json) | Pending |
| 15 | [Restrict explicit unknown parameters](runtime-boundaries.md#practice-15--restrict-explicit-unknown-parameters) | Pending |
| 16 | [Restrict unknown return contracts](runtime-boundaries.md#practice-16--restrict-unknown-return-contracts) | Pending |
| 17 | [Keep unknown visible instead of aliasing it](runtime-boundaries.md#practice-17--keep-unknown-visible-instead-of-aliasing-it) | Pending |
| 18 | [Restrict unsafe dictionary value types](runtime-boundaries.md#practice-18--restrict-unsafe-dictionary-value-types) | Pending |
| 19 | [Restrict broad object parameters](runtime-boundaries.md#practice-19--restrict-broad-object-parameters) | Pending |

### Assertions and interop — 10 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 20 | [Preserve established evidence](assertions-and-interop.md#practice-20--preserve-established-evidence) | Pending |
| 21 | [Avoid widen-then-assert flows](assertions-and-interop.md#practice-21--avoid-widen-then-assert-flows) | Pending |
| 22 | [Restrict as assertions](assertions-and-interop.md#practice-22--restrict-as-assertions) | Pending |
| 23 | [Prohibit chained assertions](assertions-and-interop.md#practice-23--prohibit-chained-assertions) | Pending |
| 24 | [Satisfies for compatibility](assertions-and-interop.md#practice-24--satisfies-for-compatibility) | Pending |
| 25 | [Assertion safety comments](assertions-and-interop.md#practice-25--assertion-safety-comments) | Pending |
| 26 | [Narrowing hierarchy](assertions-and-interop.md#practice-26--narrowing-hierarchy) | Pending |
| 27 | [Restrict runtime typeof](assertions-and-interop.md#practice-27--restrict-runtime-typeof) | Pending |
| 28 | [Restrict Reflect.get](assertions-and-interop.md#practice-28--restrict-reflectget) | Pending |
| 29 | [Restrict Reflect.apply](assertions-and-interop.md#practice-29--restrict-reflectapply) | Pending |

### Collections, naming, and formatting — 6 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 30 | [Avoid adjacent array filter/map passes](code-quality.md#practice-30--avoid-adjacent-array-filtermap-passes) | Pending |
| 31 | [Avoid copying growing reducer accumulators](code-quality.md#practice-31--avoid-copying-growing-reducer-accumulators) | Pending |
| 32 | [Explicit conditional object construction](code-quality.md#practice-32--explicit-conditional-object-construction) | Pending |
| 33 | [Named object arguments](code-quality.md#practice-33--named-object-arguments) | Pending |
| 37 | [Domain naming instead of shape](code-quality.md#practice-37--domain-naming-instead-of-shape) | Pending |
| 38 | [Structural blank-line grouping](code-quality.md#practice-38--structural-blank-line-grouping) | Pending |

### Testing and diagnostics — 3 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 34 | [No module mocking](testing-and-diagnostics.md#practice-34--no-module-mocking) | Pending |
| 35 | [Prefer real execution in tests](testing-and-diagnostics.md#practice-35--prefer-real-execution-in-tests) | Pending |
| 36 | [Structured telemetry](testing-and-diagnostics.md#practice-36--structured-telemetry) | Pending |

### Static-analysis implementation patterns — 9 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 39 | [Resolve lexical bindings](static-analysis.md#practice-39--resolve-lexical-bindings) | Pending |
| 40 | [Respect shadowed built-ins](static-analysis.md#practice-40--respect-shadowed-built-ins) | Pending |
| 41 | [Resolve aliases and generic substitutions](static-analysis.md#practice-41--resolve-aliases-and-generic-substitutions) | Pending |
| 42 | [Respect type-parameter scope](static-analysis.md#practice-42--respect-type-parameter-scope) | Pending |
| 43 | [Normalize syntax wrappers](static-analysis.md#practice-43--normalize-syntax-wrappers) | Pending |
| 44 | [Require receiver evidence](static-analysis.md#practice-44--require-receiver-evidence) | Pending |
| 45 | [Guard recursive analysis](static-analysis.md#practice-45--guard-recursive-analysis) | Pending |
| 46 | [Cache per-program analysis](static-analysis.md#practice-46--cache-per-program-analysis) | Pending |
| 47 | [Normalize parameter forms](static-analysis.md#practice-47--normalize-parameter-forms) | Pending |

## Conflicts to resolve when selecting

| Practices | Decision that must stay explicit |
|---|---|
| 5, 22 versus current brand construction | Exact `__brand` spelling and guard-only construction versus existing unique-symbol brands and checked-constructor assertions. |
| 7–8, 11 versus 15–19 | Honest unknown/raw-object decoding boundaries versus strict broad-contract bans; define parser/adapter exceptions rather than fabricating domain evidence. |
| 20 versus deliberate public abstraction | Inference preservation is not a reason to expose every implementation detail. |
| 22–23, 25 versus current interop guidance | Blanket cast/chain restrictions and every-assertion comments versus justified narrow seams and non-obvious-case explanations. |
| 26 versus 27 | Normal primitive narrowing versus the runtime typeof ban; choose the intended scope/options. |
| 28–29 versus dynamic owners | Blanket reflection bans versus proxy/instrumentation/adapters whose job is dynamic behavior. |
| 30–32 versus readable idioms | Syntactic pipeline/spread/copy bans versus semantics- and cost-based findings. |
| 33 versus existing API contracts | Object-argument preference does not authorize a breaking signature migration. |
| 34–35 versus testing owners | Module-mechanism bans and real-test preference differ; neither authorizes running unsafe external effects. |
| 36 versus output contracts | Structured telemetry versus legitimate CLI stdout; use the actual logger/redaction owner. |
| 37–38 versus repository convention | Shape-substring and spacing bans can conflict with precise domain vocabulary and installed formatters. |

## Coverage maintenance gate

Before changing this collection, verify:

- IDs 1–47 appear exactly once as canonical practice headings and exactly once as catalog rows.
- Every row's file and heading anchor exist; all six topical references are routed by SKILL.md.
- Every canonical section retains its policy, meaningful detail, examples where useful,
  exceptions, and conflicts rather than merely a title.
- Every practice has one adoption decision in this catalog; topical sections do not duplicate
  adoption status, and pending or excluded rules do not introduce new default findings.
- Useful pre-existing guidance outside these IDs remains reachable.
- Routing evals cover the relevant branches and distinguish collected documentation from adoption.
