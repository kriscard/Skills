---
name: zod
description: >-
  Zod 4 schema implementation, review, and debugging. Use for runtime parsing,
  coercion, transforms, codecs, object composition, refinements, structured
  errors, metadata, JSON Schema, Zod Mini, or measured validation performance.
  Inspect the installed Zod 4 entrypoint and capabilities before using
  minor-sensitive APIs. Compose with typescript for domain modeling, frontend
  for browser feedback, react-hook-form for form lifecycle, and query owners for
  cache and retry behavior.
---

# Zod 4

Make untrusted values earn a trusted type once. A schema owns the runtime boundary and its parsed
value; neighboring libraries own transport, caching, UI state, and business workflows.

## Workflow

### 1. Establish the effective contract

Inspect the resolved `zod` version, actual import path, TypeScript configuration, and affected
adapter declarations. This skill targets Zod 4. Use the package root or `zod/v4` for Classic and a
Mini entrypoint only when the code intentionally uses Mini's functional API. Capability-check APIs
introduced during Zod 4 instead of treating the major as a promise that every minor exposes them.

**Complete when:** the exact Zod 4 version, entrypoint, TypeScript version, and adapter versions are
known, and every proposed API exists in those installed declarations.

### 2. Write the boundary contract

Before code, record:

- the untrusted producer and raw representation;
- the parsed output and whether it is still a wire model or a domain value;
- strip, reject, preserve, or catchall behavior for unknown object keys;
- synchronous or asynchronous parsing;
- whether invalid input throws, branches locally, or becomes an adapter error;
- whether reverse encoding or a published JSON Schema artifact is required.

Use `unknown` at external boundaries. Parse once, then pass the parsed output inward until another
trust boundary is crossed. Keep independent domain rules outside schemas unless they are part of the
boundary's validity.

**Complete when:** input, output, object policy, failure consumer, and artifact direction are explicit.

### 3. Load the matching reference

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | Imports, package capabilities, adapters, Standard Schema, or optional/newer Zod 4 APIs | `references/imports-and-capabilities.md` |
| 1 — Critical | Boundary parsing, Query fetchers, input/output types, form conversion, coercion, transforms, defaults, codecs, or async schemas | `references/types-and-parsing.md` |
| 1 — High | Object policy, composition, PATCH schemas, refinements, or cross-field rules | `references/objects-and-refinements.md` |
| 1 — High | Custom messages, issues, error formatting, localization, logging, or API/form projections | `references/errors.md` |
| 1 — High | Tagged unions, ordinary unions, enums, exhaustive records, or sparse enum maps | `references/unions-records-and-enums.md` |
| 2 — Conditional | Metadata, registries, JSON Schema, structured outputs, documentation, or code generation | `references/metadata-and-json-schema.md` |
| 2 — Conditional | Classic versus Mini, bundle size, compiler/validate APIs, CSP, or parse performance | `references/mini-and-performance.md` |

### 4. Implement the smallest complete pattern

Prefer a schema and a caller that make the success value and failure path observable. Preserve
`z.input` and `z.output` when conversion changes representation. Give adapters the schema contract
they support; do not assume validation also supplies transformed output, async parsing, or the error
shape the consumer expects.

For React Hook Form, show the Zod input/output handoff but leave defaults, dirty state, and submission
lifecycle to that owner. For TanStack Query, make HTTP and parse failures reject the query function,
but leave retry, cache, and rendering policy to Query/frontend owners.

**Complete when:** the requested integration receives parsed output or structured failure without a
second parse or an unchecked assertion.

### 5. Verify observable behavior

Run exact-entrypoint cases for valid and invalid input, then the affected typecheck and tests. Cover
missing/null values, extra keys, ambiguous raw strings, transformed output, and issue paths as
applicable. Use async parsing end to end when any nested effect is async.

For artifacts, assert direction, dialect, required keys, object policy, metadata, and refs. For Mini
or performance changes, compare production bundles or representative throughput while preserving the
same outputs and failures.

**Complete when:** runtime results, inferred input/output types, failure projection, and generated
artifacts have executable evidence.

## Completion gate

- installed Zod 4 imports and declarations support every API used;
- untrusted input is parsed once before entering trusted domain or query-cache data;
- coercion and fallback behavior is tested with ambiguous inputs;
- object composition preserves explicit key policy and refinements;
- errors retain `code` and `path` until the consumer projection and exclude sensitive input;
- codecs are reserved for real round trips and report recoverable conversion failures as issues;
- JSON Schema states whether it describes accepted input or parsed output;
- Classic, Mini, compile, or validate choices follow measured needs rather than novelty.
