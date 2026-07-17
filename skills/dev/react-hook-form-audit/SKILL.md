---
name: react-hook-form-audit
description: >-
  Audit existing React Hook Form code for correctness, accessibility, validation,
  data ownership, submission, dirty-state, field-array, wizard, controlled-widget,
  and performance problems. Use when reviewing RHF forms, investigating form bugs
  or rerenders, or checking an RHF-heavy change. Read-only; use react-hook-form for implementation.
---

# React Hook Form Audit

Audit evidence, not syntax in isolation. A pattern becomes a finding only when its consequence is
visible from the code, installed version, or verified runtime behavior.

## Process

### 1. Establish scope and versions

Read project guidance and detect installed RHF, React, resolver, schema, UI-library, data-fetching,
and framework versions. Inventory every file that imports RHF directly and follow its form
components, schemas, defaults, serializers, mutations, and tests.

Completion: every form in scope has an entry point and its supporting files accounted for.

### 2. Reconstruct each form contract

For each form, identify:

- form and payload types;
- create/edit and server-data ownership model;
- default-values and dirty baseline;
- native versus controlled adapters;
- validation and error paths;
- conditional, wizard, and field-array behavior;
- submission, success, failure, and reset lifecycle.

Completion: each submitted value can be traced from initialization through serialization.

### 3. Run the checks

Read `references/checks.md` completely. Load the build skill's branch reference when the audited
form uses that branch:

- `../react-hook-form/references/server-data-and-lifecycle.md`
- `../react-hook-form/references/adapters-and-accessibility.md`
- `../react-hook-form/references/wizards-and-conditionals.md`
- `../react-hook-form/references/field-arrays.md`
- `../react-hook-form/references/version-8.md`
- `../react-hook-form/references/actions-boundary.md`

Completion: every applicable check and branch rule was evaluated against every in-scope form.

### 4. Validate findings

Use source and types to distinguish a defect from a heuristic smell. Run the project's TypeScript
typecheck; do not modify source to make it pass. Tests are optional—run focused existing tests when
they can prove or disprove a suspected behavior. Prefer silence over speculative findings.

Completion: each reported finding has a concrete consequence, file and line, smallest safe
direction, and confidence; unrelated typecheck failures are separated.

### 5. Report

Order findings by user impact:

- **Critical:** data loss, invalid submission, inaccessible completion, or broken production flow.
- **High:** likely correctness/reliability failure in a common path.
- **Medium:** demonstrated performance, maintainability, or UX cost.
- **Low:** verified local issue with limited impact.

Use:

```text
[Severity] Short title
File: path:line
Evidence: what the code does and the scenario that exposes it
Impact: concrete user or engineering consequence
Direction: smallest safe correction
Confidence: high | medium
```

Then list forms reviewed, typecheck command/result, tests run or skipped, and residual risks. If no
findings survive validation, say so directly.

## Hard boundaries

- Remain read-only; report files are allowed only when the user requests one.
- Do not label `watch`, `Controller`, `useFormContext`, missing defaults, `onChange`, or
  `useActionState` as defects without contextual evidence.
- Do not claim performance impact without identifying the subscription and rerender boundary or
  measuring it when measurement is feasible.
- Do not infer App Router client-boundary requirements in Pages Router or non-Next projects.
