---
name: review
description: >-
  Bug-first, evidence-only review of selected code, uncommitted changes, or code
  modified in the current task. Use when the user asks to review or check code,
  security, correctness, quality, or performance without naming a pull request or
  branch comparison. Use pr-review for a PR number, PR URL, or branch-versus-base review.
---

# Code Review

Review a bounded code scope for production-impacting defects and applicable project-rule
violations. Prefer silence over speculative findings.

## Process

### 1. Assemble the review packet

Identify the selected files, snippet, or working-tree diff. For repository changes, inspect both
staged and unstaged changes and read enough surrounding code, callers, tests, and configuration to
trace their impact.

Read applicable guidance:

- root `AGENTS.md`, `CLAUDE.md`, and `REVIEW.md`;
- every applicable copy from the repository root through each reviewed file's parent directory;
- skip rules for generated files, vendored code, snapshots, fixtures, or path exclusions.

Build a guidance map from changed paths to governing rules. Treat the user's request or supplied
artifact as the spec; otherwise record that no separate spec is available.

Completion: the packet contains the bounded scope, changed code or full diff, relevant surrounding
code, guidance map, skipped paths, and a spec source or explicit `no spec available`.

### 2. Load applicable review references

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — Required | Every code review | `references/review-core.md` |
| 2 — High | Rendered web UI, interaction, forms, responsive behavior, or accessibility changed | `references/frontend-risk-checks.md` |

Completion: the core is loaded, every conditional reference has been selected from changed-code
evidence, and the review packet names which references apply.

### 3. Run and report the review

Apply every axis, validation gate, severity rule, and output requirement in the core reference. Run
independent axes in parallel only when agents are authorized and available; otherwise keep separate
notes while running them sequentially.

Completion: every applicable axis records findings or an evidence-backed no-findings result, every
reported candidate passes the core validation gate, and the final report follows the core format.

## Boundary

This skill reviews code already in scope. A pull request or branch comparison requires
`pr-review`, which first resolves metadata, the comparison base, commits, and originating spec.
