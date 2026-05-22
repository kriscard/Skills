---
description: Comprehensive PR review covering correctness, React patterns, and codebase conventions
argument-hint: [PR number, branch name, or omit for current branch]
---

# /pr-review

Multi-pass PR audit: security/correctness, React patterns, and codebase-specific conventions — synthesized into a single scored report.

## Workflow

### Step 1 — Get the diff

- PR number given: `gh pr view <number> --json title,body,files` then `gh pr diff <number>`
- Branch given: `git diff main..<branch>`
- Otherwise: `git diff main..HEAD` (or staged + unstaged if no diverging commits)

Identify changed file types before running any audit:
- **Has React/TS files** (`.tsx`, `.jsx`, hooks, `use*.ts`): run Pass 2
- **Touches `services/`, `schemas/`, `api/`, routing layer**: run Pass 4

### Step 2 — Run audits in parallel

**Pass 1 — Correctness & security** (all changed files)
Spawn the `code-reviewer` agent. Focus: bugs, security vulnerabilities, TypeScript type correctness, broken error handling, data loss risks.

**Pass 2 — React patterns** (React/TS files only)
Invoke the `react-patterns` skill. Focus: useEffect anti-patterns, unnecessary re-renders, memoization misuse, Suspense, React 18/19 patterns.

**Pass 3 — Codebase conventions** (all changed files)
Audit against these specific rules:
- No barrel exports — direct imports only (`import Foo from './Foo'`, not `import { Foo } from '.'`)
- Validation only at system boundaries (API responses, form submissions) — not inside pure functions or hooks
- Hooks are escape hatches — flag hooks that could be a pure function or a plain object
- Compound components only when the API genuinely requires shared implicit state — flag when a prop would suffice
- Feature slice structure: schema at slice root, `validations/` folder for validators, `utils/` for pure functions, hooks only for React-coupled logic
- TypeScript: no `any`, no non-null assertions (`!`) without a comment explaining why

**Pass 4 — Architecture** (conditional — only when diff touches `services/`, `schemas/`, `api/` routes, or DB migrations)
Invoke the `architecture:senior-architect` skill. Focus: coupling, data flow, boundary violations, schema design.

### Step 3 — Synthesize

Merge all findings. Deduplicate overlapping issues across passes (keep the most specific description). Score every finding:

| Score | Meaning | Action |
|-------|---------|--------|
| P0 | Security hole, data loss, production outage risk | Block merge |
| P1 | Correctness bug, broken feature, type unsafety | Block merge |
| P2 | React anti-pattern, convention violation, perf regression | Request changes |
| P3 | Code quality, maintainability, missing tests | Comment — author decides |
| P4 | Nitpick, style, naming | Optional |

If two passes produce **conflicting recommendations** on the same code, surface both with their rationale and ask the user which to apply before proceeding.

### Step 4 — Output

```
## Summary
[One sentence verdict] — X issues: N P0, N P1, N P2, N P3, N P4

## P0 — Block
- file:line | [pass that flagged it] | description
  Fix: ...

## P1 — Block
...

## P2 — Request changes
...

## P3 — Comment
...

## P4 — Optional
...

## Verdict
[Approve | Request changes | Block] + one-line rationale
```

## When to skip passes

- Trivial diff (typo, single config value): answer directly, skip all passes
- No React files: skip Pass 2
- No service/schema/route changes: skip Pass 4
- Pure backend diff: run Pass 1 + Pass 3 only
