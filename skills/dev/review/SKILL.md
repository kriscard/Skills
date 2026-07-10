---
name: review
description: >-
  Bug-first, evidence-only review for code changes: find production-impacting
  security, correctness, reliability, performance, and maintainability issues.
  Use after writing or modifying code, when reviewing diffs or PRs, or when the
  user asks "review this", "check this code", mentions security, code quality,
  or performance. Enforces project guidance when available and prefers silence
  over speculative findings.
---

# Code Review

Bug-first triage: report only findings with evidence, reachable impact, and a
concrete fix. Prefer silence over false positives.

## Step 1 — Gather Context

1. Identify the changed files or specific code under review.
2. Read applicable project guidance: root `CLAUDE.md` / `REVIEW.md` and any
   path-local copies in directories containing reviewed files.
3. Build a guidance map: which rules apply to which paths, including skip rules
   for generated files, vendored code, snapshots, fixtures, or other exclusions.
4. Load routed references when the changed code matches a reference trigger.

Done only when the review scope, applicable guidance, and skipped paths are
known. If any context is unavailable, state what is missing before reviewing.

## Step 2 — Inspect Bug-First

Review changed code and enough surrounding code to prove or disprove impact.
Use this priority order:

1. **Security** — injection, XSS, CSRF, auth bypass, secret exposure, trust-boundary mistakes
2. **Correctness** — wrong results, data loss, broken error handling, edge cases, async races
3. **Reliability** — production crashes, unsafe config, migration/deploy hazards, cleanup leaks
4. **Performance** — N+1 queries, unbounded scans, memory leaks, repeated I/O, missing batching
5. **Maintainability** — only senior-engineer issues: duplication, needless complexity, violated local patterns
6. **Style/tests** — only when project guidance says so, or when the issue creates concrete production risk

## Step 3 — Validate Findings

Before reporting a candidate finding, confirm all gates:

- The issue is introduced by, or directly relevant to, the reviewed change.
- The code path is reachable with realistic inputs or states.
- The problem is not handled elsewhere by a guard, fallback, type guarantee,
  transaction, try/catch, sanitizer, or caller contract.
- The impact is concrete: accuracy, security, reliability, performance, or
  maintainability harm the author would likely fix.
- The finding is guidance-scoped: it does not violate skip rules and cites any
  exact project rule it enforces.

If any gate fails, drop the finding silently.

## Severity

- **Critical** — exploitable security issue, data loss, broken core flow, deploy/build break
- **High** — correctness or reliability bug that should be fixed before merge
- **Medium** — performance or maintainability issue a senior engineer would fix soon
- **Low** — clear guidance violation or minor bug worth fixing, but non-blocking
- **Pre-existing** — existing bug directly relevant to the changed path but not introduced here

## Completion Gate

Complete the review only after applying the guidance map, inspecting changed
code plus relevant config/tests/call sites, and validating every reported
finding. If no issues are found, state what was inspected.

## Output Format

```
## Summary
[1-sentence overall assessment]
Issues: N critical · N high · N medium · N low · N pre-existing

## 🔴 Critical
1. `file:line` — [issue]
   **Problem:** ...
   **Impact:** ...
   **Fix:** ...

## 🟠 High
...

## 🟡 Medium
...

## 🔵 Low
...

## ⚪ Pre-existing
...

## Risk Summary
[No blocking issues found / Found issues worth addressing before merge / Found production-risk issue]
```

Omit empty sections.

## What Not To Do

- Don't approve, block, or own merge authority; provide a risk summary instead
- Don't flag style, formatting, or missing tests unless guidance says so or the issue creates concrete risk
- Don't invent rules; enforce only evidenced bugs and applicable project guidance
- Don't flag theoretical security risks without a plausible path to harm
- Don't flag skipped paths or generated files unless guidance explicitly includes them
- Don't give vague feedback like "this could be better"
- Don't ignore config changes — they cause many production incidents

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Reviewing UI code, component APIs, accessibility, or web interface patterns | `references/web-interface-guidelines.md` |
