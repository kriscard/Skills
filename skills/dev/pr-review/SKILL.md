---
name: pr-review
description: >-
  Bug-first, evidence-only review of a pull request or branch-versus-base diff.
  Use when the user explicitly asks to review a pull request, supplies a PR number
  or URL, names a branch comparison, or asks to review changes since a fixed point.
user-invocable: true
argument-hint: "[PR number/URL | head branch [base ref]]"
---

# PR Review

Acquire a verified comparison and originating requirements, then apply the shared review engine.

## Process

### 1. Pin the comparison

For a PR number or URL, acquire metadata and the complete diff:

```bash
pr="<number-or-url>"
gh pr view "$pr" --json title,body,files,baseRefName,headRefName,commits,url
gh pr diff "$pr"
```

For a branch review, use the named head and optional base. When the base is omitted, resolve the
remote default branch or explicit project guidance rather than assuming `main`:

```bash
git status -sb
head_ref="<head-ref>"
# Choose the supplied base, or run the second form when it was omitted:
base_ref="<base-ref>"
# base_ref="$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null)"
test -n "$base_ref"
git rev-parse --verify "${base_ref}^{commit}"
git rev-parse --verify "${head_ref}^{commit}"
git merge-base "$base_ref" "$head_ref"
git diff "${base_ref}...${head_ref}"
git log "${base_ref}..${head_ref}" --oneline
```

Use the PR's base and head when metadata provides them. Stop with the exact failure when a ref does
not resolve. Stop cleanly when the verified diff is empty.

Completion: the base and head resolve, merge-base semantics define the comparison, and the title or
scope, changed paths, full diff, and commit list are captured and non-empty.

### 2. Build guidance and spec maps

Read applicable guidance:

- root `AGENTS.md`, `CLAUDE.md`, and `REVIEW.md`;
- every applicable copy from the repository root through each changed file's parent directory;
- skip rules for generated files, vendored code, snapshots, fixtures, or path exclusions.

Build a guidance map from changed paths to governing rules. Locate the originating spec in this
order:

1. the PR body and explicitly linked issue;
2. issue references in commit messages;
3. a path supplied by the user;
4. a matching document under `docs/` or `specs/`.

Fetch referenced issues with the repository's issue-tracker workflow or `gh issue view`; an issue
number alone is not a spec. Record `no spec available` when none exists, then continue the Risk and
Standards axes without inventing requirements.

Completion: every changed path has applicable guidance and skip status, and the spec is captured
with its source or explicitly unavailable.

### 3. Assemble specialist packets

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — Required | Every PR or branch review | `references/review-core.md` |
| 2 — High | Rendered web UI, interaction, forms, responsive behavior, or accessibility changed | `references/frontend-risk-checks.md` |

Prepare independent packets for:

- **Risk** — the full diff, changed paths, commits, surrounding code, relevant tests/config, and
  conditional risk references;
- **Standards** — the full diff and guidance map;
- **Spec** — the full diff and sourced requirements, when available.

Run packets in parallel only when agents are authorized and available; otherwise run them
sequentially with isolated notes. Each reviewer must inspect enough surrounding code and call sites
to prove or disprove impact.

Completion: every applicable axis returns candidate findings or an evidence-backed no-findings
result that identifies what it inspected.

### 4. Validate and report

Apply the core validation gate, reconcile only genuine duplicates, and preserve the Risk,
Standards, and Spec axes in the final report. Do not post comments or submit a platform review
unless the user explicitly requests that separate action.

Completion: every reported finding passes the shared gate, every applicable axis is represented,
and the report follows the core output contract.
