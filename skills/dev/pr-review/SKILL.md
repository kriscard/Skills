---
name: pr-review
description: >-
  Reviews pull requests and diffs with specialist analysis for security,
  correctness, architecture, React patterns, and accessibility. Use when the
  user says "review this PR", "review my changes", "review the diff", or
  mentions a PR number.
user-invocable: true
argument-hint: "[PR number or branch — omit for current branch vs PR/default base]"
---

# PR Review

## Step 1 — Acquire Context (run in parallel)

```bash
# If PR number given:
gh pr view <number> --json title,body,files,baseRefName,headRefName,commits
gh pr diff <number>

# If reviewing current branch, determine base first:
git status -sb
git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null || true
git merge-base HEAD origin/<base-branch>
git diff "$(git merge-base HEAD origin/<base-branch>)"..HEAD
git log "$(git merge-base HEAD origin/<base-branch>)"..HEAD --oneline
```

Use the PR's `baseRefName` when available. Do not assume `main` if the PR or
repository reports a different base branch.

Done only when you have: base branch, head branch, file list, full diff, commit
list, and PR description. If any item is unavailable, state why before review.

## Step 2 — Profile the Diff

Check what the diff touches to decide which specialist passes to run:

- `HAS_REACT` — diff contains `.tsx`, `.jsx`, `use*.ts`, `components/`, or similar
- `HAS_ARCH` — diff touches `services/`, `schemas/`, `api/`, `routes/`, `migrations/`, `prisma/`
- `HAS_UI` — diff contains CSS, Tailwind classes, styled-components, or design tokens

## Step 3 — Run Specialist Passes

Run in parallel via Task tool when available. If agents are unavailable, run the
same specialist passes sequentially yourself.

**Always run:**
- Security + correctness: auth flows, SQL injection, data loss paths, type safety gaps, unhandled errors

**If HAS_ARCH:**
- Architecture concerns: coupling, boundary violations, schema design, backward compatibility

**If HAS_REACT:**
- React patterns: hook dependencies, memoization correctness, prop drilling, stale closures, key stability, component size

**If HAS_UI:**
- Accessibility + design: WCAG 2.2 violations, missing ARIA labels, keyboard navigation, interactive states, contrast

## Step 4 — Reconcile Findings

1. Deduplicate findings that reference the same file:line
2. Score severity P0–P4:
   - **P0** — blocks merge (security hole, data loss, broken core flow)
   - **P1** — should fix before merge (correctness bug, bad UX)
   - **P2** — fix soon (performance, maintainability)
   - **P3** — nice to have (style, minor cleanup)
   - **P4** — nit / preference
3. Resolve contradictions by source evidence first: diff, tests, docs, and runtime behavior. Ask the user only when product intent is required.

## Output Format

```
## PR Review — <title>
Issues: N P0 · N P1 · N P2 · N P3

### P0 — Block merge
- `path/to/file.ts:42` — [Issue description] → [Specific fix]

### P1 — Fix before merge
- `path/to/file.ts:88` — [Issue description] → [Specific fix]

### P2 — Fix soon
...

### Verdict: Approve | Request Changes | Block
```

Omit sections that have no findings. End with a one-sentence overall verdict.
