---
name: frontend
description: >-
  Frontend engineering for browser-facing applications: TypeScript trust
  boundaries, semantic accessibility, UI systems, responsive browser behavior,
  security, resilient user states, and feature ownership. Use when building or
  auditing frontend contracts, styling infrastructure, browser integrations, or
  file organization. Use react for React composition, state, effects, Suspense,
  and rendering; use nextjs-app-architecture for Next.js-specific mechanics.
---

# Frontend Engineering

Build browser-facing code that is trustworthy at its boundaries, coherent at its
surface, and easy to locate by product ownership. Match the user's request: build,
recommend, or audit. A focused implementation does not require a full audit.

## Workflow

### 1. Read the environment

Inspect the package manifest, configuration, directory structure, and nearby code.
Identify the framework, installed libraries, relevant versions, design-system
conventions, validation library, and existing feature boundaries before proposing a
pattern.

Honor a sound installed stack. Recommend a new dependency only when a demonstrated
capability gap justifies it.

**Complete when:** the active stack and local conventions are known, or the missing
facts that block the work have been requested.

### 2. Frame the frontend contract

Name the user-visible behavior, untrusted inputs, browser APIs, semantic controls,
responsive constraints, and owning feature. For audits, trace every claim to a file,
line, rendered state, or browser observation.

**Complete when:** expected behavior, trust boundaries, ownership, and verification
surface are explicit.

### 3. Apply the universal checks

1. **Trust once:** untrusted data is validated when it enters a trusted domain;
   internal code consumes the validated type.
2. **Type honest:** public types describe runtime reality; assertions do not promote
   unknown data into trusted state.
3. **Semantic surface:** controls use native semantics, labels, keyboard behavior,
   and visible focus. ARIA supplements native HTML.
4. **Complete states:** loading, empty, error, pending, disabled, success, and recovery
   behavior exist where the workflow can reach them.
5. **System coherence:** components use the project's tokens, variants, responsive
   rules, and installed primitives rather than parallel styling conventions.
6. **Local ownership:** feature code stays with its owner; shared code is promoted only
   after demonstrated reuse.
7. **Browser proof:** the target flow works at relevant widths and input modes without
   console errors, accidental overflow, inaccessible controls, or unsafe storage.

**Complete when:** every applicable check is satisfied or recorded as an evidence-backed
finding.

### 4. Load only the matching reference

Use the routing table below. Load multiple references only when the task crosses real
branches. Version-sensitive mechanics come from the project's installed documentation
or current primary documentation after the version is known.

React component behavior, state ownership, Effects, Suspense, and rendering belong to
the `react` skill. Next.js route, cache, Server Action, and App Router architecture
belong to `nextjs-app-architecture`.

### 5. Implement or report

- **Build:** make the smallest coherent change and follow repository validation.
- **Recommend:** compare viable choices against the current stack and demonstrated
  constraints; state a preferred path.
- **Audit:** report only evidence-backed findings, ordered by user impact and risk.

For browser-visible work, invoke the installed `agent-browser` skill to exercise the
flow and capture relevant semantic state, console/page errors, screenshots, or traces.
The frontend skill defines the expected behavior; `agent-browser` performs the browser
interaction.

**Complete when:** the requested artifact exists, applicable checks pass, and any
unverified behavior or residual risk is explicit.

## References

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | XSS, unsafe HTML or URLs, auth storage, CSP, CORS, third-party scripts, browser trust concerns | `references/security.md` |
| 1 — High | TypeScript component contracts, unions, generics, assertions, wrapper props, compiler configuration | `references/typescript.md` |
| 1 — High | External API data, forms, URL/search input, storage, schemas, parsing at trust boundaries | `references/runtime-validation.md` |
| 2 — High | Semantic HTML, labels, keyboard/focus behavior, announcements, basic accessibility verification | `references/accessibility.md` |
| 2 — Medium | Tokens, variants, styling contracts, responsive layout, theming, installed UI primitives | `references/ui-systems.md` |
| 2 — Medium | Loading/error/empty states, touch and keyboard input, reduced motion, browser APIs, compatibility | `references/browser-resilience.md` |
| 2 — Medium | Feature folders, ownership, imports, colocating code, promoting shared code, scaling structure | `references/feature-architecture.md` |

## Completion Gate

Before finishing:

- the implementation follows the detected stack rather than an assumed one;
- trust boundaries and public types agree with runtime behavior;
- the primary workflow has complete and operable user states;
- ownership and placement follow repository evidence;
- static checks and available browser verification have run;
- the response distinguishes verified behavior from remaining uncertainty.
