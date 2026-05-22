---
description: Full-team PR review — spawns a parallel agent team covering architecture, React, design, and code quality, then reconciles findings by priority
argument-hint: [PR number or branch name — omit for current branch vs main]
---

# /pr-review

Spawn a parallel team of specialist agents and skills to audit the PR, then reconcile all findings into a single scored report. Contradictions are surfaced to the user via `AskUserQuestion` before finalizing.

---

## Step 1 — Acquire context

Run these in parallel:

```bash
# If PR number provided:
gh pr view <number> --json title,body,files,baseRefName
gh pr diff <number>

# If branch provided:
git diff main..<branch>
git log main..<branch> --oneline

# Otherwise (current branch):
git diff main..HEAD
git log main..HEAD --oneline
```

Determine the PR profile before spawning agents — it controls which phases run:
- `HAS_REACT` — diff contains `.tsx`, `.jsx`, `use*.ts`, or `/components/`
- `HAS_ARCH` — diff touches `services/`, `schemas/`, `api/`, `routes/`, DB migrations
- `HAS_UI` — diff contains CSS or styled components, design tokens, layout components, or Tailwind classes

---

## Step 2 — Spawn agent team (parallel via Task tool)

Spawn all agents simultaneously using the `Task` tool. Pass each agent the full diff and the PR description as context.

### Phase 1 — Blocking correctness (spawn first, others can start in parallel)

**Agent: `developer-tools:code-reviewer`**
Prompt: "Review this diff for security vulnerabilities, correctness bugs, TypeScript type safety, broken error handling, and data loss risks. Flag anything that should block merge. Output findings as a flat list: `file:line | severity | description | fix`."

### Phase 2 — Domain specialists (spawn in parallel)

**Agent: `architecture:senior-architect` skill** _(skip if not `HAS_ARCH`)_
Prompt: "Review this diff for architectural concerns: coupling, boundary violations, data flow issues, schema design, service layer violations. Output findings as a flat list: `file:line | severity | description | fix`."

**Skill: `vercel-react-best-practices`** _(skip if not `HAS_REACT`)_
Prompt: "Audit this diff for React and Next.js best practices: App Router patterns, RSC vs client component boundaries, server actions, data fetching patterns, React 18/19 APIs. Output findings as a flat list: `file:line | severity | description | fix`."

**Skill: `vercel-composition-patterns`** _(skip if not `HAS_REACT`)_
Prompt: "Audit this diff for component composition issues: prop drilling, boolean prop proliferation, compound component misuse, over-abstraction, render prop vs hooks trade-offs. Output findings as a flat list: `file:line | severity | description | fix`."

**Agent: `developer-tools:frontend-developer`** _(skip if not `HAS_REACT`)_
Prompt: "Review this diff for frontend implementation quality: component structure, state management patterns, performance, type safety, hook design. Flag issues a senior frontend engineer would catch in review. Read-only — output findings only, do not edit files. Output: `file:line | severity | description | fix`."

### Phase 3 — Design and UX (spawn in parallel, skip if not `HAS_UI`)

**Skill: `web-design-guidelines`** _(skip if not `HAS_UI`)_
Prompt: "Review this diff against web interface guidelines: accessibility, spacing, typography, color contrast, interactive states, responsive design. Output findings as a flat list: `file:line | severity | description | fix`."

**Skill: `emil-design-engineering`** _(skip if not `HAS_UI`)_
Prompt: "Review this diff for design engineering quality: animation, micro-interactions, design token usage, visual consistency, polish. Output findings as a flat list: `file:line | severity | description | fix`."

**Agent: `developer-tools:ui-ux-designer`** _(skip if not `HAS_UI`)_
Prompt: "Review this diff for UX concerns: user flows, interaction patterns, error states, loading states, empty states, accessibility. Read-only — output findings only. Output: `file:line | severity | description | fix`."

### Phase 4 — Refactoring proposals (spawn last, after all other agents complete)

**Agent: `developer-tools:code-refactoring-specialist`**
Prompt: "Given this diff and the findings from the other reviewers, identify refactoring opportunities that would reduce complexity or improve maintainability. Read-only — propose changes only, do not edit files. Output: `file:line | severity | description | proposed refactor`."

---

## Step 3 — Reconcile findings

Once all agents complete:

### 3a — Deduplicate
Group findings by `file:line`. If multiple agents flagged the same location, keep the most specific description and note which agents agreed (e.g. `[code-reviewer, frontend-developer]`).

### 3b — Score every finding P0–P4

| Score | Meaning | Merge action |
|-------|---------|--------------|
| P0 | Security hole, data loss, production outage | Block |
| P1 | Correctness bug, broken feature, type unsafety | Block |
| P2 | Architecture violation, React anti-pattern, convention breach, perf regression | Request changes |
| P3 | Code quality, design polish, maintainability, missing tests | Comment |
| P4 | Nitpick, naming, optional refactor | Optional |

### 3c — Resolve contradictions
If two agents make **conflicting recommendations** on the same `file:line` (e.g. "extract this into a hook" vs "this should be a pure function"), do NOT pick one silently. Use `AskUserQuestion` to present both options:

> "Two reviewers disagree on `path/to/file.tsx:42`:
> - `vercel-composition-patterns`: extract this into a custom hook for reusability
> - `developer-tools:frontend-developer`: this has no React dependency — keep it as a pure utility function
>
> Which direction do you prefer?"

Wait for the user's answer before including that finding in the final report.

---

## Step 4 — Output

```
## PR Review — <title or branch>
<one-sentence overall assessment>
Issues found: N P0 · N P1 · N P2 · N P3 · N P4

---

## P0 — Block merge
- `file:line` [source agent(s)]
  **Issue:** ...
  **Fix:** ...

## P1 — Block merge
...

## P2 — Request changes
...

## P3 — Comments
...

## P4 — Optional
...

---

## Verdict
[Approve | Request changes | Block]
<one-line rationale>
```

---

## Skip conditions

| Condition | Skip |
|-----------|------|
| Trivial diff (typo, single config line) | All phases — answer directly |
| No React/TS files | Phase 2 React agents, Phase 3 entirely |
| No UI changes | Phase 3 entirely |
| No service/schema/route changes | `architecture:senior-architect` |
