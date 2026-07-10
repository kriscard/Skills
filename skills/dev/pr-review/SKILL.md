---
name: pr-review
description: >-
  Bug-first, evidence-only PR review with guidance-scoped specialist passes for
  security, correctness, architecture, React patterns, and accessibility. Use
  when the user says "review this PR", "review my changes", "review the diff",
  or mentions a PR number. Prefers silence over speculative findings.
user-invocable: true
argument-hint: "[PR number or branch — omit for current branch vs PR/default base]"
---

# PR Review

Bug-first PR review: report only findings with evidence, reachable impact, and a
concrete fix. Prefer silence over false positives.

## Step 1 — Acquire Context (run independent reads in parallel)

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

Also read applicable guidance:

- root `CLAUDE.md` / `REVIEW.md`
- any `CLAUDE.md` / `REVIEW.md` in directories containing modified files
- skip rules for generated files, vendored code, snapshots, fixtures, or file patterns

Build a guidance map: which rules apply to which changed paths.

Done only when you have: base branch, head branch, file list, full diff, commit
list, PR description, guidance map, and skipped paths. If any item is
unavailable, state why before review.

## Step 2 — Profile the Diff

Check what the diff touches to decide which specialist passes to run:

- `HAS_REACT` — diff contains `.tsx`, `.jsx`, `use*.ts`, `components/`, or similar
- `HAS_ARCH` — diff touches `services/`, `schemas/`, `api/`, `routes/`, `migrations/`, `prisma/`
- `HAS_UI` — diff contains CSS, Tailwind classes, styled-components, or design tokens
- `HAS_CONFIG` — diff touches build, deploy, dependency, env, CI, auth, or database config

## Step 3 — Run Specialist Passes

For non-trivial diffs, run specialist passes in parallel when agents are
available. Otherwise run the same passes sequentially yourself. Each pass must
read enough surrounding code to confirm data flow and call sites.

**Always run:**
- **Bug + regression** — logic errors, broken edge cases, build failures, wrong results
- **Security + trust boundaries** — exploit paths, auth bypasses, injection, races, secret exposure
- **Guideline compliance** — exact violations of the guidance map; cite the rule and respect skip rules

**If HAS_ARCH:**
- **Architecture** — coupling, boundary violations, schema design, migration/backward compatibility

**If HAS_REACT:**
- **React runtime** — hook dependencies, stale closures, key stability, hydration, waterfalls, memoization correctness

**If HAS_UI:**
- **Accessibility + interface** — WCAG issues, labels, keyboard navigation, focus states, contrast, interactive states

**If HAS_CONFIG:**
- **Release safety** — deploy/build breaks, unsafe defaults, missing migrations, dependency/runtime mismatch

## Step 4 — Validate Candidate Findings

Before reporting a candidate, confirm all gates:

- The issue was introduced by this PR, or is pre-existing but directly relevant
  to the changed code path.
- The affected path is reachable with realistic inputs or states.
- The problem is not handled elsewhere by a guard, fallback, type guarantee,
  transaction, try/catch, sanitizer, or caller contract.
- The impact is concrete: accuracy, security, reliability, performance, or
  maintainability harm the author would likely fix.
- The finding is guidance-scoped: it does not violate skip rules and cites any
  exact project rule it enforces.

If validation fails, drop the finding silently.

## Step 5 — Reconcile Findings

1. Deduplicate findings that describe the same underlying issue.
2. Keep the most specific description and highest justified severity.
3. Score severity:
   - **P0** — production-stopping issue: exploitable security hole, data loss, broken core flow, deploy/build break
   - **P1** — should fix before merge: clear correctness, reliability, or security bug
   - **P2** — fix soon: performance or maintainability issue a senior engineer would care about
   - **P3** — low risk: clear guidance violation or minor bug worth fixing, but non-blocking
   - **Pre-existing** — existing bug directly relevant to the changed path but not introduced here
4. Resolve contradictions by source evidence first: diff, tests, docs, runtime behavior. Ask the user only when product intent is required.

## Output Format

```
## PR Review — <title>
Issues: N P0 · N P1 · N P2 · N P3 · N pre-existing

### P0
- `path/to/file.ts:42` — [Issue description] → [Specific fix]

### P1
- `path/to/file.ts:88` — [Issue description] → [Specific fix]

### P2
...

### Pre-existing
...

### Risk Summary
[No blocking issues found / Found issues worth addressing before merge / Found production-risk issue]
```

Omit sections that have no findings. Do not approve, block, or post comments.

## Hard Constraints

- Do not comment on GitHub/GitLab or call commenting tools unless the user explicitly asks
- Do not flag style, formatting, or missing tests unless guidance says so or the issue creates concrete risk
- Do not invent rules; enforce only evidenced bugs and applicable project guidance
- Do not flag theoretical security risks without a plausible path to harm
- Do not flag skipped paths or generated files unless guidance explicitly includes them
- Prefer no findings over weak findings
