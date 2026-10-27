---
name: zod
description: >-
  Version-aware Zod implementation, migration, review, and debugging. Use for
  requested work on Zod schemas, parsing, coercion, transforms, refinements, error
  formatting, object composition, Zod Mini, codecs, discriminated unions, enum
  records, measured compile/validate work, or a Zod v3-to-v4 migration. Existing
  Zod usage or a nearby parse failure alone does not make unrelated UI or
  authorization work a schema task. Detect the effective v3/v4 import contract
  before giving syntax. Compose with typescript for language-wide modeling and
  trust boundaries, frontend for browser validation and feedback, and
  react-hook-form for form ownership and lifecycle. Do not invoke for a generic
  TypeScript trust boundary or form task that has no Zod-specific work.
---

# Zod

Treat the installed package, import path, and declarations as the contract. Zod validates and
transforms values; it does not own the surrounding domain model, browser workflow, or form
lifecycle.

## Workflow

### 1. Detect the effective Zod contract

First identify the Zod contract the requested work changes, diagnoses, or verifies. If only a
neighboring concern is in scope, keep that work with its owner; report a separate schema issue
without starting an unrequested diagnosis.

Inspect manifests, lockfiles, package-manager output, Zod imports, TypeScript configuration, and
`node_modules/zod/package.json` when available. Record both the resolved package version and the
entrypoint used by affected code:

- `zod/v3` is explicitly Zod 3;
- `zod/v4` is the explicit Zod 4 Classic API;
- `zod/v4/mini`, `zod/v4-mini`, and `zod/mini` are explicit Zod 4 Mini APIs;
- standalone `@zod/mini` re-exports its peer `zod/mini`; inspect both resolved versions;
- a package-root `zod` import follows the resolved package's exported root;
- Zod 3.25 can expose both v3 and v4 subpaths, so the package major alone may not identify the API.

Inspect installed declarations when an ecosystem adapter or library constrains accepted schema
types. If Zod is not installed, state the target version before supplying code.

**Complete when:** the exact package version, import contract, TypeScript version, and affected
adapter versions are known.

### 2. Frame the schema boundary

Name the untrusted input, parsed output, transformations, failure consumer, unknown-key policy, and
whether parsing can be asynchronous. Keep input `unknown` at an external boundary until parsing
succeeds; do not repeatedly parse values already validated within the same ownership boundary.

Compose with the owning skill instead of expanding Zod's scope:

- `typescript` owns domain-state modeling, generic relationships, and trust-boundary placement;
- `frontend` owns browser inputs, accessible feedback, and authoritative server boundaries;
- `react-hook-form` owns form values, defaults, adapters, dirty state, and submission lifecycle;
- `react` owns component state, rendering, and Effects.

**Complete when:** input, output, failure, async behavior, and neighboring owners are explicit.

### 3. Load only the matching reference

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | Detecting v3/v4, upgrading, reviewing mixed imports, or changing ecosystem/library compatibility | `references/version-and-migration.md` |
| 1 — Critical | Input/output types, parsing, pipes, transforms, codecs, default/prefault/catch/readonly wrappers, form-string conversion, coercion, or async schemas | `references/types-and-parsing.md` |
| 1 — High | Object strictness, unknown keys, extension, merging, intersections, refinements, or cross-field rules | `references/objects-and-refinements.md` |
| 1 — High | Tagged/discriminated or ordinary unions, enums, exhaustive records, or sparse enum maps | `references/unions-records-and-enums.md` |
| 1 — High | Custom messages, `ZodError`, issue handling, error formatting, localization, or form/API error projection | `references/errors.md` |
| 2 — Conditional | Metadata, registries, JSON Schema conversion, structured-output schemas, or schema-driven documentation/code generation | `references/metadata-and-json-schema.md` |
| 2 — Conditional | Bundle size, parse speed, compile/validate APIs, CSP/no-eval, Zod Mini, Zod Core, schema construction cost, caching, or performance claims | `references/mini-and-performance.md` |

Use v3 documentation and installed declarations for v3 code. Do not translate a v4 API backward
unless migration is the requested task.

### 4. Implement or report

- **Implement:** make the smallest schema change that establishes the required runtime fact and
  preserves distinct input/output types.
- **Migrate:** inventory affected APIs first, change imports and semantics deliberately, then verify
  parsed values and failure shapes—not only compilation.
- **Review:** report version mismatches, unsafe coercion, lost input/output distinctions, async parse
  mistakes, object-policy ambiguity, refinement failures, and error-projection problems with file
  evidence.
- **Debug:** reproduce with the smallest schema and input, inspect `issues`, then trace transforms,
  refinements, object policy, and adapter behavior in parse order.

**Complete when:** the schema's success value and failure path are verified against the installed
contract.

### 5. Verify

Run the narrowest executable parse cases for valid and invalid input, then the affected typecheck,
tests, and repository checks. Cover null/missing, extra keys, ambiguous raw values, transformed output,
and issue paths/projections as applicable; include async cases when any nested effect is async. For a
migration, compare representative parsed outputs and issue paths before and after the change.

When Zod integrates with React Hook Form, verify the form's input model, transformed submission
output, resolver version, and error projection while leaving defaults and lifecycle decisions to
`react-hook-form`.

**Complete when:** sync/async behavior, inferred input/output types, object policy, and error
consumption have evidence.

## Completion gate

Before finishing:

- guidance matches the effective v3/v4 entrypoint, not a guessed package major;
- coercion semantics are intentional and tested with ambiguous inputs;
- async refinements or transforms use async parsing end to end;
- object composition preserves explicit unknown-key and refinement behavior;
- v4 code uses current error, object, and composition contracts instead of legacy equivalents;
- JSON Schema generation selects input/output direction, target dialect, and unrepresentable-type policy intentionally;
- Zod Mini or low-level performance APIs are chosen only from measured constraints;
- generic TypeScript, frontend, React, and form-lifecycle concerns remain with their owners;
- version-sensitive claims link to official Zod documentation.
