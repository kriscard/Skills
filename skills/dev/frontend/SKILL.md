---
name: frontend
description: >-
  Frontend engineering audit for TypeScript, UI accessibility, Next.js
  boundaries, Tailwind/component patterns, and browser security. Use when
  reviewing .ts/.tsx/.jsx frontend code, designing UI components, checking
  type/runtime boundaries, handling XSS/CSP/token storage, or deciding frontend
  file structure. For React runtime/rendering pitfalls, use the react skill.
---

# Frontend Engineering

TypeScript + Next.js + UI/UX + frontend security. The philosophy: write
**inevitable code** — type-safe enough that wrong usage won't compile, obvious
enough that the next reader doesn't need comments, effortless to compose.
Measure before optimizing. Accessibility from day one, not a retrofit.

## Core Philosophy

- **Composition over inheritance** — hooks and small focused components beat
  HOCs and class hierarchies when React is involved
- **Types are documentation that never lies** — if the types are right, the
  logic is constrained; if the logic is wrong, the types will tell you
- **Runtime boundaries matter** — TypeScript types disappear at runtime. Zod /
  Valibot / ArkType at every external boundary (API responses, form inputs, URL
  params)
- **Measure before optimizing** — premature memoization adds noise without
  benefit; the Profiler tells you what's actually slow
- **Accessibility is correctness** — semantic HTML, keyboard nav, and ARIA are
  not polish; they are correctness constraints like type safety

## Universal Checks

These checks take seconds to scan and catch the most common frontend mistakes.
Inspect project files first; ask the user only when project state cannot answer
the question.

1. **`any` without justification** — `any` disables type checking for the
   entire expression tree below it. Prefer `unknown` and narrow explicitly.
   Legitimate uses: third-party lib without types, `catch (e)` (use
   `e instanceof Error`), genuine escape hatch with a comment explaining why.

2. **No runtime validation at external boundaries** — TypeScript types exist
   only at compile time. Add Zod/Valibot/ArkType at every network call, form
   submit, URL param parse, and `localStorage` read.

3. **Unsafe type assertions at trust boundaries** — `as SomeApiResponse` or
   `JSON.parse(...) as T` turns untrusted data into trusted state. Replace casts
   with schema validation or explicit narrowing.

4. **Client/server boundary drift** — Next.js Server Components should stay
   server-only unless they need event handlers, state, effects, or browser APIs.
   Keep `'use client'` boundaries narrow.

5. **Accessibility at the call site** — semantic HTML (`<button>` not
   `<div onClick>`), keyboard nav for custom controls, ARIA only when native
   HTML semantics are insufficient.

6. **Browser security footguns** — flag `dangerouslySetInnerHTML`, unsanitized
   URL construction, missing CSP considerations, and auth tokens in
   `localStorage` unless justified by the threat model.

## Ownership Boundary with React

Frontend owns TypeScript, runtime boundaries, browser security, accessibility,
Next.js boundaries, Tailwind/component API patterns, and file structure. The
`react` skill owns React runtime/rendering issues: `useEffect`, re-renders,
Context provider values, keys, Server Actions, React 19 APIs, hydration, and
waterfalls.

## References — Priority Table

Load the reference that matches the issue. Security and type correctness issues
are CRITICAL (silent bugs at runtime); UI and optimization issues are lower.

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — Critical | XSS, `dangerouslySetInnerHTML`, CSP headers, input sanitization, `localStorage` security, auth token storage, CORS, third-party scripts | `references/security.md` |
| 2 — High | TypeScript types, generics, branded types, discriminated unions, `DistributiveOmit`, Zod/Valibot/ArkType, `tsconfig`, TypeScript 6.x/7.0 | `references/type-system.md` |
| 3 — High | Next.js App Router, RSC vs Client Components, Server Actions, hydration mismatch, rendering model choice (SSR/SSG/ISR/CSR/RSC) | `references/nextjs.md` |
| 4 — Medium | Component composition, compound components, `asChild`, CVA variants, Tailwind patterns, animation, `prefers-reduced-motion`, accessibility deep-dive, design tokens, dark mode, forms | `references/ui-patterns.md` |
| 5 — Medium | Project structure, feature folders, "where should this file go", cross-feature imports, barrel files causing pain, scaling the codebase | `references/feature-architecture.md` |

### When to load a reference

- Load the **highest-priority matching reference first** — security issues before
  optimization issues
- If multiple references match, load in priority order; they don't repeat each other
- The body above (universal checks) is always active — references add depth, load
  only when the checklist surface is insufficient
