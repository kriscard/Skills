> **Read this when:** selecting practices, changing adoption decisions, comparing source
> policies, checking provenance, or auditing coverage of the 47 collected practices.

# TypeScript Practice Catalog

## Selection contract

This catalog accounts for **47 of 47** collected practices. Each row links to one full
canonical section with its source position, rationale, examples where useful, exceptions,
and conflicts. The catalog is an index, not a replacement for those sections.

**Pending means documented, not enforced.** All 47 source-policy decisions are pending.
Some overlap the skill's existing guidance; that guidance remains active independently.
Approval to document all practices did not adopt every upstream ban, naming convention,
or tooling requirement. Numbered sections describe source positions; unnumbered
**Current skill guidance** sections retain the previous defaults and useful generics,
compiler, suppression, and ownership guidance outside the numbered collection.

Use these decisions when the user selects policies:

- **Adopt:** apply the practice with its documented scope.
- **Adopt with conditions:** record the exact exceptions/configuration in its canonical
  section, keeping the original source position distinguishable from the chosen policy.
- **Exclude:** preserve the documentation and rationale for excluding it.
- **Pending:** preserve the option without activating it.

Update a row and its canonical section's adoption metadata together. A source restriction
must not be softened, omitted, or activated silently. Resolve contradictory selections
with the user, and update conflicting current guidance only as explicitly authorized.
A task-specific choice applies to that task without silently becoming a durable global
policy. Do not install upstream tools/dependencies merely to adopt prose guidance.

## Pinned sources

- **C — Cursor policy and examples:** [SKILL.md][cursor-skill] and
  [references/patterns.md][cursor-patterns] at
  `c742dd61706fbacc1b95f1a20b7b988cf096ce6c`.
- **A — anti-slop rule policies:** [src/rules][anti-rules] at
  `13909c9e07590f5a85d93c62712259fe14a883f7`. All 18 rule implementations are represented;
  their test fixtures inform exceptions and semantic limits. Direct rule links live in
  the canonical sections.
- **S — extracted anti-slop implementation patterns:** [src/shared][anti-shared] at the
  same anti-slop revision. All seven shared files are represented across practices 39–47.
  These nine patterns are our thematic extraction, not nine upstream published rules.

The 47 IDs are a stable selection inventory, not an upstream rule count. Cursor's listed
rules are split where their examples introduce distinct concerns (such as persisted JSON
and wire compatibility); overlapping evidence-preservation ideas retain distinct IDs when
their detection or policy differs. Source caveats are explicitly labeled rather than
presented as endorsed TypeScript facts. Review upstream changes against these pinned
revisions before updating provenance.

## Complete coverage and decisions

### Modeling — 6 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 1 | [Discriminated unions](type-modeling.md#practice-1--discriminated-unions) | C | Pending |
| 2 | [Exhaustive handling with never](type-modeling.md#practice-2--exhaustive-handling-with-never) | C | Pending |
| 3 | [Constructive modeling](type-modeling.md#practice-3--constructive-modeling) | C | Pending |
| 4 | [Simplest total types](type-modeling.md#practice-4--simplest-total-types) | C | Pending |
| 5 | [Validated branded primitives](type-modeling.md#practice-5--validated-branded-primitives) | C | Pending |
| 6 | [Derive contracts before duplicating](type-modeling.md#practice-6--derive-contracts-before-duplicating) | C | Pending |

### Runtime boundaries — 13 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 7 | [External data as unknown, not any](runtime-boundaries.md#practice-7--external-data-as-unknown-not-any) | C | Pending |
| 8 | [Schemas before structural guards](runtime-boundaries.md#practice-8--schemas-before-structural-guards) | C | Pending |
| 9 | [Honest type guards](runtime-boundaries.md#practice-9--honest-type-guards) | C | Pending |
| 10 | [Schema compatibility with an existing type](runtime-boundaries.md#practice-10--schema-compatibility-with-an-existing-type) | C | Pending |
| 11 | [Parse once at the trust boundary](runtime-boundaries.md#practice-11--parse-once-at-the-trust-boundary) | C | Pending |
| 12 | [Explicit expected-validation failure paths](runtime-boundaries.md#practice-12--explicit-expected-validation-failure-paths) | C | Pending |
| 13 | [Forward-compatible wire decoding](runtime-boundaries.md#practice-13--forward-compatible-wire-decoding) | C | Pending |
| 14 | [Versioned persisted JSON](runtime-boundaries.md#practice-14--versioned-persisted-json) | C | Pending |
| 15 | [Restrict explicit unknown parameters](runtime-boundaries.md#practice-15--restrict-explicit-unknown-parameters) | A | Pending |
| 16 | [Restrict unknown return contracts](runtime-boundaries.md#practice-16--restrict-unknown-return-contracts) | A | Pending |
| 17 | [Keep unknown visible instead of aliasing it](runtime-boundaries.md#practice-17--keep-unknown-visible-instead-of-aliasing-it) | A | Pending |
| 18 | [Restrict unsafe dictionary value types](runtime-boundaries.md#practice-18--restrict-unsafe-dictionary-value-types) | A | Pending |
| 19 | [Restrict broad object parameters](runtime-boundaries.md#practice-19--restrict-broad-object-parameters) | A | Pending |

### Assertions and interop — 10 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 20 | [Preserve established evidence](assertions-and-interop.md#practice-20--preserve-established-evidence) | A | Pending |
| 21 | [Avoid widen-then-assert flows](assertions-and-interop.md#practice-21--avoid-widen-then-assert-flows) | A | Pending |
| 22 | [Cursor's restriction on as](assertions-and-interop.md#practice-22--cursors-restriction-on-as) | C | Pending |
| 23 | [Prohibit chained assertions](assertions-and-interop.md#practice-23--prohibit-chained-assertions) | A | Pending |
| 24 | [Satisfies for compatibility](assertions-and-interop.md#practice-24--satisfies-for-compatibility) | A, C | Pending |
| 25 | [Assertion safety comments](assertions-and-interop.md#practice-25--assertion-safety-comments) | A | Pending |
| 26 | [Cursor's narrowing hierarchy](assertions-and-interop.md#practice-26--cursors-narrowing-hierarchy) | C | Pending |
| 27 | [anti-slop's runtime typeof restriction](assertions-and-interop.md#practice-27--anti-slops-runtime-typeof-restriction) | A | Pending |
| 28 | [Restrict Reflect.get](assertions-and-interop.md#practice-28--restrict-reflectget) | A | Pending |
| 29 | [Restrict Reflect.apply](assertions-and-interop.md#practice-29--restrict-reflectapply) | A | Pending |

### Collections, naming, and formatting — 6 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 30 | [Avoid adjacent array filter/map passes](code-quality.md#practice-30--avoid-adjacent-array-filtermap-passes) | A | Pending |
| 31 | [Avoid copying growing reducer accumulators](code-quality.md#practice-31--avoid-copying-growing-reducer-accumulators) | A | Pending |
| 32 | [Explicit conditional object construction](code-quality.md#practice-32--explicit-conditional-object-construction) | A | Pending |
| 33 | [Named object arguments](code-quality.md#practice-33--named-object-arguments) | C | Pending |
| 37 | [Domain naming instead of shape](code-quality.md#practice-37--domain-naming-instead-of-shape) | A | Pending |
| 38 | [Structural blank-line grouping](code-quality.md#practice-38--structural-blank-line-grouping) | A | Pending |

### Testing and diagnostics — 3 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 34 | [No module mocking](testing-and-diagnostics.md#practice-34--no-module-mocking) | A | Pending |
| 35 | [Prefer real execution in tests](testing-and-diagnostics.md#practice-35--prefer-real-execution-in-tests) | C | Pending |
| 36 | [Structured telemetry](testing-and-diagnostics.md#practice-36--structured-telemetry) | C | Pending |

### Static-analysis implementation patterns — 9 practices

| ID | Practice and canonical section | Source | Decision |
|---|---|---|---|
| 39 | [Resolve lexical bindings](static-analysis.md#practice-39--resolve-lexical-bindings) | S | Pending |
| 40 | [Respect shadowed built-ins](static-analysis.md#practice-40--respect-shadowed-built-ins) | S | Pending |
| 41 | [Resolve aliases and generic substitutions](static-analysis.md#practice-41--resolve-aliases-and-generic-substitutions) | S | Pending |
| 42 | [Respect type-parameter scope](static-analysis.md#practice-42--respect-type-parameter-scope) | S | Pending |
| 43 | [Normalize syntax wrappers](static-analysis.md#practice-43--normalize-syntax-wrappers) | S | Pending |
| 44 | [Require receiver evidence](static-analysis.md#practice-44--require-receiver-evidence) | S | Pending |
| 45 | [Guard recursive analysis](static-analysis.md#practice-45--guard-recursive-analysis) | S | Pending |
| 46 | [Cache per-program analysis](static-analysis.md#practice-46--cache-per-program-analysis) | S | Pending |
| 47 | [Normalize parameter forms](static-analysis.md#practice-47--normalize-parameter-forms) | S | Pending |

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
- Every canonical section names its source and retains meaningful detail, not merely a title.
- All 18 anti-slop rule files and seven shared files remain represented by pinned source links.
- The catalog and canonical adoption metadata agree; pending rules do not become default findings.
- Useful pre-existing guidance outside these IDs remains reachable.
- Routing evals cover the new branches and distinguish collected documentation from adoption.

[cursor-skill]: https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/typescript-best-practices/SKILL.md
[cursor-patterns]: https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/typescript-best-practices/references/patterns.md
[anti-rules]: https://github.com/dmmulroy/anti-slop/tree/13909c9e07590f5a85d93c62712259fe14a883f7/src/rules
[anti-shared]: https://github.com/dmmulroy/anti-slop/tree/13909c9e07590f5a85d93c62712259fe14a883f7/src/shared
