---
name: frontend
description: >-
  Expert TypeScript + React + Next.js + UI/UX + frontend security audit in one
  skill. Covers TypeScript 6.x/7.0 strict mode, React 18/19 patterns, Next.js
  App Router, Tailwind, accessibility, and XSS/CSP prevention. Make sure to use
  this skill whenever you open or review a .ts, .tsx, or .jsx file, write
  TypeScript types/generics/branded types, work with Next.js App Router or
  Server Components, build UI components, set up Tailwind, handle accessibility,
  prevent XSS/CSP/token storage issues, or ask anything about frontend
  architecture — even casually.
---

# Frontend Engineering

Merged skill: TypeScript + React + Next.js + UI/UX + Frontend Security. One
entry point, thematic references. The philosophy: write **inevitable code** —
type-safe enough that wrong usage won't compile, obvious enough that the next
reader doesn't need comments, effortless to compose. Measure before optimizing.
Accessibility from day one, not a retrofit.

## Core Philosophy

- **Composition over inheritance** — hooks and small focused components beat
  HOCs and class hierarchies every time
- **Types are documentation that never lies** — if the types are right, the
  logic is constrained; if the logic is wrong, the types will tell you
- **Runtime boundaries matter** — TypeScript types disappear at runtime. Zod /
  Valibot / ArkType at every external boundary (API responses, form inputs, URL
  params)
- **Measure before optimizing** — premature memoization adds noise without
  benefit; the Profiler tells you what's actually slow
- **Accessibility is correctness** — semantic HTML, keyboard nav, and ARIA are
  not polish; they are correctness constraints like type safety

## Current Platform State (confirm with user if unsure)

**TypeScript 6.x defaults (breaking changes from 5.x):**
- `strict: true` — now default; no longer optional
- `module: esnext` — default
- `target: es2025` — default
- `types: []` — default (breaks ambient type packages like `@types/node` unless
  listed explicitly)
- `rootDir` — defaults to the directory containing `tsconfig.json`

**TypeScript 7.0 Beta:** Go-based rewrite, ~10× faster type-checking, largely
behavior-compatible. Not production-ready yet but migration path is smooth.

**React versions — always confirm which version the project uses:**
- React 18: Suspense, `useTransition`, `useDeferredValue`, `useId`,
  auto-batching
- React 19: Actions, `useActionState`, `useOptimistic`, `use()` hook,
  ref-as-prop (no more `forwardRef`)
- React Compiler 1.0 (GA Oct 2025): automates `useMemo`/`useCallback`/
  `React.memo`. With Compiler enabled, manual memoization is usually
  unnecessary unless you have measured proof or effect-dependency constraints.

## Universal Checks (run on every frontend file, no exceptions)

These five take seconds to scan and catch the most common mistakes. Do not skip
them even on quick reviews.

1. **`any` without justification** — `any` disables type checking for the
   entire expression tree below it. Prefer `unknown` and narrow explicitly.
   Legitimate uses: third-party lib without types, `catch (e)` (use
   `e instanceof Error`), genuine escape hatch with a comment explaining why.

2. **No runtime validation at external boundaries** — TypeScript types exist
   only at compile time. An API response that doesn't match your type silently
   becomes corrupted state. Add Zod/Valibot/ArkType at every network call, form
   submit, URL param parse, and `localStorage` read.

3. **Components defined inside other components** — they are re-created on
   every render, losing all memoization and accumulated state. Extract them to
   module scope.

4. **Inheritance or HOC chains where hooks would do** — a custom hook
   composing `useState` + `useEffect` + `useCallback` is simpler, more
   testable, and more composable than a class or HOC. Prefer composition.

5. **Accessibility at the call site** — semantic HTML (`<button>` not
   `<div onClick>`), keyboard nav (`onKeyDown` for custom controls), ARIA only
   when native HTML semantics are insufficient. Screen readers and keyboard
   users hit bugs that sighted mouse users never see.

6. **`React.FC` / `React.FunctionComponent`** — deprecated. Implies an implicit
   `children` prop (wrong in React 18+), forces a return type, and adds noise.
   Use plain function declarations: `function Button({ label }: ButtonProps)`.
   Flag any new code using `React.FC` and suggest the plain function pattern.

## References — Priority Table

Load the reference that matches the issue. Security and type correctness issues
are CRITICAL (silent bugs at runtime); UI and optimization issues are lower.

| Priority | Impact | Load when | Reference |
|----------|--------|-----------|-----------|
| 1 | **CRITICAL** | XSS, `dangerouslySetInnerHTML`, CSP headers, input sanitization, `localStorage` security, auth token storage, CORS, third-party scripts | `references/security.md` |
| 2 | **HIGH** | TypeScript types, generics, branded types, discriminated unions, `DistributiveOmit`, `React.FC`, `defaultProps`, Zod/Valibot/ArkType, `tsconfig`, TypeScript 6.x/7.0 | `references/type-system.md` |
| 3 | **HIGH** | Next.js App Router, RSC vs Client Components, Server Actions, hydration mismatch, rendering model choice (SSR/SSG/ISR/CSR/RSC) | `references/nextjs.md` |
| 4 | **MEDIUM** | Component composition, compound components, `asChild`, CVA variants, Tailwind patterns, animation, `prefers-reduced-motion`, accessibility deep-dive, design tokens, dark mode, forms | `references/ui-patterns.md` |
| 5 | **MEDIUM** | Project structure, feature folders, "where should this file go", cross-feature imports, barrel files causing pain, scaling the codebase | `references/feature-architecture.md` |

### When to load a reference

- Load the **highest-priority matching reference first** — security issues before
  optimization issues
- If multiple references match, load in priority order; they don't repeat each other
- The body above (universal checks) is always active — references add depth, load
  only when the checklist surface is insufficient
