---
name: react-hook-form
description: >-
  Build and modify React Hook Form forms. Use when React Hook Form is mentioned,
  imported, installed, or established by project conventions, including controlled
  widget integration, schema validation, fetched edit forms, conditional fields,
  multi-step wizards, field arrays, submission errors, and dirty-state handling.
  Use the react-hook-form-audit skill when the job is review rather than implementation.
---

# React Hook Form

Build around four decisions: **ownership**, **schema tree**, **adapter**, and **baseline**.
RHF evidence is the invocation boundary; an ordinary React form request does not itself justify
introducing the library.

## Process

### 1. Establish the form contract

Inspect the installed RHF, React, resolver, schema, data-fetching, and UI-library versions before
writing code. Identify:

- create or edit form;
- submitted value shape and API payload shape;
- client snapshot or live server-data ownership;
- native input contracts versus controlled adapters;
- conditional, array, or wizard branches;
- stable v7 APIs versus installed v8 APIs.

Completion: the value owner, form type, installed versions, and required branches are explicit.

### 2. Define the schema tree and defaults

Create one canonical form-value model. Compose section or wizard schemas into the full schema;
when parsing transforms values, distinguish schema input from output types. Supply a complete
non-`undefined` default for every tracked field and transform API values at the boundary.

Completion: every registered path exists in the typed model and has a valid default; the full
submission schema can validate the complete form.

### 3. Build the field boundary

Use `register` when a component preserves the native input contract. Use `Controller` or
`useController` when a widget exposes a controlled or non-native value/change contract. Apply the
accessible field contract to every control.

Completion: every field has one registration path, correct value/event/ref wiring, and an
associated label, description when present, and error message.

### 4. Implement lifecycle and branches

Load the relevant reference before implementing a branch:

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Fetched edit data, background refresh, mutation, reset, dirty baseline | `references/server-data-and-lifecycle.md` |
| 2 — High | UI-library or custom controlled components, accessibility wiring | `references/adapters-and-accessibility.md` |
| 3 — High | Wizard, step validation, cross-step rule, conditional or hidden field | `references/wizards-and-conditionals.md` |
| 4 — High | Dynamic or nested rows with `useFieldArray` | `references/field-arrays.md` |
| 5 — Medium | Installed project uses or is migrating to RHF v8 | `references/version-8.md` |
| 6 — Medium | React 19 action or Next.js Server Action appears in the same flow | `references/actions-boundary.md` |
| 7 — Medium | Tests requested, existing tests affected, or behavior is non-trivial | `references/testing.md` |

Completion: every detected branch has loaded and applied its reference; no branch is handled from
memory alone.

### 5. Verify

Run the project's TypeScript typecheck. Fix every error caused by the change. Tests are optional:
run focused existing tests when present and add tests when requested or when a complex behavior
would otherwise remain unverified. Exercise the form manually when runtime tooling is available.

Completion: typecheck passes, or unrelated pre-existing failures are named with evidence; modified
paths, submission mapping, and failure behavior have all been checked.

## Universal rules

1. **Uncontrolled first.** Native contract means `register`; design-system component does not
   automatically mean `Controller`.
2. **One registration path.** A controlled field is never also registered.
3. **Complete defaults.** Avoid `undefined`; defaults are the dirty-state comparison baseline.
4. **Validation is a UX choice.** Select `mode` and `reValidateMode` from interaction cost and
   feedback needs rather than prescribing one mode globally.
5. **Narrow observation.** Use `useWatch` for local reactive UI, `useFormState` for local form
   state, `getValues` for snapshots, and `subscribe` for non-render effects.
6. **Visible and semantic errors.** Connect labels and descriptions, put `aria-invalid` on the
   interactive element, and render an associated message. Use `root.*` for form-wide failures.
7. **Caught submission.** Catch transport failures, preserve edits on failure, and prevent duplicate
   submissions while work is pending.
8. **Serialization is a boundary.** Hidden-field policy, disabled-field omission, coercion, and
   dirty-only PATCH behavior are explicit domain decisions.
9. **Server validation remains authoritative.** Client validation improves interaction; it never
   replaces server validation, authorization, or conflict handling.

## Handoff

Report the ownership model, schema/default strategy, adapter choices, lifecycle behavior, version
gates, changed files, typecheck command and result, tests run or skipped, and remaining risks.
