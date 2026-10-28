> **Read this when:** applying a collected practice as policy, selecting practices,
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
requirement. Collected sections describe policy alternatives; **Current skill guidance**
sections retain the previous defaults and useful generics, compiler, suppression, and
ownership guidance outside the collected policy alternatives.

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

The 47 IDs are stable selection identifiers used only in this catalog. Reference headings
and cross-references use descriptive titles instead. Distinct concerns such as persisted JSON and
wire compatibility have separate entries; overlapping evidence-preservation ideas retain
distinct IDs when their detection or policy differs. Practices 39–47 describe static-analysis
implementation patterns, not additional application-code restrictions. Correctness caveats
are labeled explicitly rather than presented as unconditional TypeScript guarantees.

## Complete coverage and decisions

### Modeling — 6 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 1 | [Discriminated unions](type-modeling.md#discriminated-unions) | Pending |
| 2 | [Exhaustive handling with never](type-modeling.md#exhaustive-handling-with-never) | Pending |
| 3 | [Constructive modeling](type-modeling.md#constructive-modeling) | Pending |
| 4 | [Simplest total types](type-modeling.md#simplest-total-types) | Pending |
| 5 | [Validated branded primitives](type-modeling.md#validated-branded-primitives) | Pending |
| 6 | [Derive contracts before duplicating](type-modeling.md#derive-contracts-before-duplicating) | Pending |

### Runtime boundaries — 13 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 7 | [External data as unknown, not any](runtime-boundaries.md#external-data-as-unknown-not-any) | Pending |
| 8 | [Schemas before structural guards](runtime-boundaries.md#schemas-before-structural-guards) | Pending |
| 9 | [Honest type guards](runtime-boundaries.md#honest-type-guards) | Pending |
| 10 | [Schema compatibility with an existing type](runtime-boundaries.md#schema-compatibility-with-an-existing-type) | Pending |
| 11 | [Parse once at the trust boundary](runtime-boundaries.md#parse-once-at-the-trust-boundary) | Pending |
| 12 | [Explicit expected-validation failure paths](runtime-boundaries.md#explicit-expected-validation-failure-paths) | Pending |
| 13 | [Forward-compatible wire decoding](runtime-boundaries.md#forward-compatible-wire-decoding) | Pending |
| 14 | [Versioned persisted JSON](runtime-boundaries.md#versioned-persisted-json) | Pending |
| 15 | [Restrict explicit unknown parameters](runtime-boundaries.md#restrict-explicit-unknown-parameters) | Pending |
| 16 | [Restrict unknown return contracts](runtime-boundaries.md#restrict-unknown-return-contracts) | Pending |
| 17 | [Keep unknown visible instead of aliasing it](runtime-boundaries.md#keep-unknown-visible-instead-of-aliasing-it) | Pending |
| 18 | [Restrict unsafe dictionary value types](runtime-boundaries.md#restrict-unsafe-dictionary-value-types) | Pending |
| 19 | [Restrict broad object parameters](runtime-boundaries.md#restrict-broad-object-parameters) | Pending |

### Assertions and interop — 10 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 20 | [Preserve established evidence](assertions-and-interop.md#preserve-established-evidence) | Pending |
| 21 | [Avoid widen-then-assert flows](assertions-and-interop.md#avoid-widen-then-assert-flows) | Pending |
| 22 | [Restrict as assertions](assertions-and-interop.md#restrict-as-assertions) | Pending |
| 23 | [Prohibit chained assertions](assertions-and-interop.md#prohibit-chained-assertions) | Pending |
| 24 | [Satisfies for compatibility](assertions-and-interop.md#satisfies-for-compatibility) | Pending |
| 25 | [Assertion safety comments](assertions-and-interop.md#assertion-safety-comments) | Pending |
| 26 | [Narrowing hierarchy](assertions-and-interop.md#narrowing-hierarchy) | Pending |
| 27 | [Restrict runtime typeof](assertions-and-interop.md#restrict-runtime-typeof) | Pending |
| 28 | [Restrict Reflect.get](assertions-and-interop.md#restrict-reflectget) | Pending |
| 29 | [Restrict Reflect.apply](assertions-and-interop.md#restrict-reflectapply) | Pending |

### Collections, naming, and formatting — 6 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 30 | [Avoid adjacent array filter/map passes](code-quality.md#avoid-adjacent-array-filtermap-passes) | Pending |
| 31 | [Avoid copying growing reducer accumulators](code-quality.md#avoid-copying-growing-reducer-accumulators) | Pending |
| 32 | [Explicit conditional object construction](code-quality.md#explicit-conditional-object-construction) | Pending |
| 33 | [Named object arguments](code-quality.md#named-object-arguments) | Pending |
| 37 | [Domain naming instead of shape](code-quality.md#domain-naming-instead-of-shape) | Pending |
| 38 | [Structural blank-line grouping](code-quality.md#structural-blank-line-grouping) | Pending |

### Testing and diagnostics — 3 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 34 | [No module mocking](testing-and-diagnostics.md#no-module-mocking) | Pending |
| 35 | [Prefer real execution in tests](testing-and-diagnostics.md#prefer-real-execution-in-tests) | Pending |
| 36 | [Structured telemetry](testing-and-diagnostics.md#structured-telemetry) | Pending |

### Static-analysis implementation patterns — 9 practices

| ID | Practice and canonical section | Decision |
|---|---|---|
| 39 | [Resolve lexical bindings](static-analysis.md#resolve-lexical-bindings) | Pending |
| 40 | [Respect shadowed built-ins](static-analysis.md#respect-shadowed-built-ins) | Pending |
| 41 | [Resolve aliases and generic substitutions](static-analysis.md#resolve-aliases-and-generic-substitutions) | Pending |
| 42 | [Respect type-parameter scope](static-analysis.md#respect-type-parameter-scope) | Pending |
| 43 | [Normalize syntax wrappers](static-analysis.md#normalize-syntax-wrappers) | Pending |
| 44 | [Require receiver evidence](static-analysis.md#require-receiver-evidence) | Pending |
| 45 | [Guard recursive analysis](static-analysis.md#guard-recursive-analysis) | Pending |
| 46 | [Cache per-program analysis](static-analysis.md#cache-per-program-analysis) | Pending |
| 47 | [Normalize parameter forms](static-analysis.md#normalize-parameter-forms) | Pending |

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

- IDs 1–47 appear exactly once as catalog rows, each linking to its unique descriptive
  section heading. Tracking IDs stay in this catalog, not in reference headings or prose.
- Every row's file and heading anchor exist; all six topical references are routed by SKILL.md.
- Every canonical section retains its policy, meaningful detail, examples where useful,
  exceptions, and conflicts rather than merely a title.
- Every practice has one adoption decision in this catalog; topical sections do not duplicate
  adoption status, and pending or excluded rules do not introduce new default findings.
- Useful pre-existing guidance outside these IDs remains reachable.
- Routing evals cover the relevant branches and distinguish collected documentation from adoption.
