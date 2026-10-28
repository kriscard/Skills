---
name: typescript
description: >-
  Language-wide TypeScript guidance for full-stack frameworks, backend services,
  libraries, scripts, and frontend code. Use when modeling domain states,
  narrowing values, designing useful generics, validating runtime boundaries,
  reviewing assertions or suppressions, matching compiler contracts, or improving
  TypeScript-specific code quality, TypeScript AST tooling, or selecting the
  collected TypeScript practices. Component/native wrapper props and
  browser-specific storage, URL, postMessage, and form behavior are outside its
  language-wide scope.
---

# TypeScript Engineering

Use TypeScript to preserve evidence: model the states the program can really reach,
retain relationships through inference and generics, and establish runtime facts before
trusted use. Match the requested work; a small typed edit does not require a language-wide
audit.

## Workflow

### 1. Read the environment

Scope discovery to the changed contract. Inspect the relevant manifest, lockfile,
TypeScript version, runtime versions, `tsconfig` chain, framework-generated configuration,
declarations, generated clients, schema libraries, and established typecheck/test/format
scripts. Inspect runtime support for runtime features, schema APIs for decoding work, and
generated contracts when they own the changed shape; skip unrelated or absent artifacts.
Read nearby code for public `type`, `interface`, and `enum` conventions before recommending
a different form.

Treat installed declarations and runtime support as the compatibility boundary. Do not
enable flags, add dependencies, or start migrations automatically.

**Complete when:** version-sensitive advice and available checks match the actual project.

### 2. Frame the type contract

Name the public inputs and outputs, valid states, invariants, untrusted entry points,
failure paths, and interoperability constraints. Distinguish static knowledge from facts
that require runtime evidence.

**Complete when:** every changed type describes a real program state and every untrusted
value has a named trust boundary.

### 3. Preserve useful evidence

Prefer the simplest total model: strengthen a type when doing so removes a demonstrated
partial operation, assertion, or impossible state—not by reflex. Preserve literal and
relational information through inference, discriminants, and useful generics. Derive from
schemas, generated contracts, and existing APIs before duplicating shapes.

### 4. Establish runtime facts

Keep untrusted values `unknown` until control-flow narrowing, a complete guard, the
project's existing schema convention, or a documented validating SDK establishes the
needed fact. Parse once at the boundary; trusted internal values normally continue as
the validated type without repeated decoding.

### 5. Make local evidence claims

Treat assertions and suppressions as local claims about evidence, not conversions. First
diagnose missing discriminants, widened inference, incomplete declarations, or an
untested boundary. Use an assertion only when the invariant is real and TypeScript cannot
express it directly; keep the explanation scoped to non-obvious cases.

### 6. Verify the contract

Run the repository's focused formatter, typecheck, tests, and build checks that exercise
the changed contract. Do not broaden types or weaken validation merely to make checks
green. State what was verified and what remains runtime-dependent.

## Collected practices are not automatic policy

The references document 47 collected practices; documenting a practice does not activate it.
Use the **Current skill guidance** sections as the existing default. Collected sections
preserve policy alternatives, examples, exceptions, and conflicts for selection.
The **Decision** column in `references/practice-catalog.md` is the single authority for
persistent adoption status. Before applying a collected practice as policy, read its catalog
entry and full section; pending or excluded entries do not introduce new review findings.
A task-specific request can select a practice for that task without changing persistent
status. Durable changes update the catalog decision and, only when needed, the affected
conditions or conflicting guidance—not a second copy of the adoption status.

Automation notes in collected sections describe optional enforcement designs, not installed
checker capabilities. Verify the target project's actual tooling before configuring options;
collecting or selecting a practice does not authorize a tooling installation.

## References

Read every reference whose trigger matches the task, not the entire collection. Each
collected practice has one canonical section; the catalog is an index, not a substitute.

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | Domain states, discriminated unions, exhaustiveness, constructive models, brands, schema/generated type derivation, inference, or generics | `references/type-modeling.md` |
| 1 — Critical | External payloads, parsers, guards, schemas, validation failures, wire formats, persisted JSON, SDK results, files, IPC, environment data, database rows, or broad boundary contracts | `references/runtime-boundaries.md` |
| 1 — High | Assertions, chained casts, safety comments, narrowing, `typeof`, `satisfies`, reflection, suppressions, declaration gaps, interop, or compiler flags | `references/assertions-and-interop.md` |
| 2 — Conditional | Collection pipelines, reducers, iterator helpers, object construction, argument design, symbol naming, spacing, or syntactic code-quality findings | `references/code-quality.md` |
| 2 — Conditional | TypeScript module mocks, dependency-injection test seams, real dependency tests, disposal/leak checks, running-UI evidence, structured logging, or console diagnostics | `references/testing-and-diagnostics.md` |
| 2 — Conditional | Implementing lint rules, TypeScript AST tooling, codemods, alias/type analysis, scope resolution, or program-analysis caches | `references/static-analysis.md` |
| 1 — Policy check | Before applying a collected practice as policy; selecting practices, changing adoption status, comparing policy alternatives, or auditing coverage of all 47 practices | `references/practice-catalog.md` |

## Ownership Boundary

- `typescript` owns language-wide modeling, narrowing, generics, runtime type evidence,
  assertions, compiler contracts, and TypeScript-specific code quality.
- Browser component props, native wrapper contracts, DOM events, browser storage, URL
  state, `postMessage`, and form feedback remain frontend concerns.
- Framework behavior, testing architecture, formatting policy, and performance findings
  remain with their established owners unless the TypeScript contract itself is the issue.
  The testing/diagnostics reference preserves collected practices in full for selection;
  it does not override those owners or authorize app runs, telemetry changes, or new tools.

## Completion Gate

Before finishing:

- guidance matches the installed TypeScript, runtime, libraries, and repository conventions;
- public models exclude known-invalid states without needless strengthening;
- untrusted structured input gains runtime evidence before trusted use;
- generics preserve a caller-visible relationship rather than hiding `unknown`;
- assertions and suppressions are local, justified, and do not launder evidence;
- checks use established scripts, and unverified runtime behavior is explicit;
- collected policy decisions follow the catalog or explicit task selection, and conflicting
  policy alternatives are reported rather than silently combined.
