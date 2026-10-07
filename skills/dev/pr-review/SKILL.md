---
name: pr-review
description: >-
  Bug-first, evidence-only pull request review with guidance-scoped passes for
  security, correctness, architecture, React patterns, and accessibility. Use
  when the user explicitly asks to review a pull request or supplies a PR
  number or URL for review. Prefers silence over speculative findings.
user-invocable: true
argument-hint: "[PR number or branch — omit for current branch vs PR/default base]"
---

# PR Review

Bug-first PR review: report only findings with evidence, reachable impact, and a
concrete fix. Prefer silence over false positives.

## Step 1 — Acquire Context (run independent reads in parallel)

```bash
# If a PR number or URL is given:
gh pr view <number-or-url> --json title,body,files,baseRefName,headRefName,commits
gh pr diff <number-or-url>

# If a named branch is given, replace <head> with that branch.
# Otherwise use HEAD. Resolve the repository's default base branch first:
git status -sb
base_ref="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)"
merge_base="$(git merge-base "$base_ref" <head>)"
git diff "$merge_base"..<head>
git log "$merge_base"..<head> --oneline
```

Use the PR's `baseRefName` when available. Otherwise resolve the base from the
repository's remote default branch or explicit project guidance. Do not assume
`main`.

Also read applicable guidance:

- root `AGENTS.md`, `CLAUDE.md`, and `REVIEW.md`
- every applicable copy of those files from the root through each changed
  file's parent directory
- skip rules for generated files, vendored code, snapshots, fixtures, or file patterns

Build a guidance map: which rules apply to which changed paths.

Done only when every mode has a base ref, head ref, file list, full diff, commit
list, guidance map, and skipped paths. For a PR, also require its title and
body. If any required item is unavailable, state why before review.

## Step 2 — Profile the Diff

Classify the diff to decide which specialist passes to run:

- `HAS_REACT` — changed `.jsx` / `.tsx`, React or Next.js imports, hooks, or components
- `HAS_ARCH` — changed service or module boundaries, schemas, APIs, routes,
  migrations, or persistence
- `HAS_UI` — changed rendered markup, styles, Tailwind classes, or design tokens
- `HAS_CONFIG` — changed build, deploy, dependency, environment, CI, auth, or
  database configuration

Done only when each flag is recorded as true or false with the changed paths or
diff evidence that determined it.

## Step 3 — Run Specialist Passes

Run every applicable pass. Parallelize independent passes when agents are
authorized and available; otherwise run them sequentially. Each pass must read
enough surrounding code to confirm data flow and call sites.

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

A pass is complete only when it returns candidate findings or records no
finding and identifies the code, config, tests, or call sites it inspected.
Proceed only after every applicable pass is complete.

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
