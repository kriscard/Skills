---
name: typescript
description: >-
  Language-wide TypeScript guidance for full-stack frameworks, backend services,
  libraries, scripts, and frontend code. Use when modeling domain states,
  narrowing values, designing useful generics, validating runtime boundaries,
  reviewing assertions or suppressions, matching compiler contracts, or improving
  TypeScript-specific code quality. Component/native wrapper props and
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

Inspect the manifest, lockfile, TypeScript version, runtime versions, `tsconfig` chain,
framework-generated configuration, declarations, generated clients, schema libraries,
and established typecheck/test/format scripts. Read nearby code for public `type`,
`interface`, and `enum` conventions before recommending a different form.

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

## References

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | Domain states, discriminated unions, exhaustiveness, constructive models, schema/generated type derivation, inference, or generics | `references/type-modeling.md` |
| 1 — Critical | External payloads, parsers, decoders, SDK results, files, IPC, environment data, database rows, or other runtime trust boundaries | `references/runtime-boundaries.md` |
| 1 — High | `as`, chained assertions, brands, suppressions, declaration gaps, interop, compiler flags, or generated declarations | `references/assertions-and-interop.md` |
| 2 — Conditional | TypeScript-specific readability, collection pipelines, reducers, dynamic access/calls, iterator helpers, or syntactic code-quality findings | `references/code-quality.md` |

## Ownership Boundary

- `typescript` owns language-wide modeling, narrowing, generics, runtime type evidence,
  assertions, compiler contracts, and TypeScript-specific code quality.
- Browser component props, native wrapper contracts, DOM events, browser storage, URL
  state, `postMessage`, and form feedback remain frontend concerns.
- Framework behavior, testing architecture, formatting policy, and performance findings
  remain with their established owners unless the TypeScript contract itself is the issue.

## Completion Gate

Before finishing:

- guidance matches the installed TypeScript, runtime, libraries, and repository conventions;
- public models exclude known-invalid states without needless strengthening;
- untrusted structured input gains runtime evidence before trusted use;
- generics preserve a caller-visible relationship rather than hiding `unknown`;
- assertions and suppressions are local, justified, and do not launder evidence;
- checks use established scripts, and unverified runtime behavior is explicit.
