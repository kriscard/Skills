> **Read this when:** reviewing code after the scope, changed code or diff, guidance map, skipped paths, and spec source have been assembled.

# Review core

A review has three independent axes. Preserve their evidence separately so a strong result on one
axis cannot hide a failure on another.

## 1. Run the axes

### Risk

Inspect changed code and enough surrounding code, callers, tests, and configuration to prove or
disprove production impact. Cover every applicable class:

- **Security:** trust boundaries, authorization, injection, secret exposure, unsafe parsing, races.
- **Correctness:** wrong results, data loss, edge cases, stale state, broken error handling.
- **Reliability:** crashes, cleanup leaks, unsafe defaults, migration or deployment hazards.
- **Performance:** unbounded work, repeated I/O, N+1 access, memory leaks, demonstrated render cost.
- **Maintainability:** only concrete ownership, coupling, or complexity problems a senior engineer
  would fix soon.

Apply domain checks when the diff provides evidence for them: architecture and compatibility for
schema/API/migration changes; React runtime and hydration for React changes; release safety for
build, dependency, environment, CI, auth, or database configuration; frontend risk checks for
user-facing web UI.

Completion: every changed path has been inspected against each applicable risk class, with
candidate findings or recorded evidence for no finding.

### Standards

Apply only documented repository guidance that governs the changed path. Cite the source file and
exact rule for each candidate. Repository guidance overrides generic heuristics. Treat rules already
enforced by passing automation as tooling results rather than review findings unless the diff
bypasses that automation or the user asks for a standards audit.

Completion: every governing rule in the guidance map has been evaluated against every changed path
it covers.

### Spec

When a spec exists, map each requirement to `implemented`, `partial`, `missing`, or `not verifiable`.
Report partial or missing behavior, implementation that contradicts a requirement, and unrequested
scope only when it creates concrete risk. Quote or cite the requirement for every candidate. When no
spec exists, mark this axis `not run — no spec available`.

Completion: every sourced requirement has a status, and every Spec candidate cites its source.

## 2. Validate candidates

Report a candidate only when all applicable gates pass:

- the issue is introduced by the change, or is pre-existing but directly relevant to the changed
  path;
- the path is reachable with realistic inputs or states;
- guards, types, transactions, sanitizers, fallbacks, error handling, and caller contracts do not
  already handle it;
- the impact is concrete and worth fixing;
- Risk findings cite code evidence, Standards findings cite the governing rule, and Spec findings
  cite the requirement;
- the smallest safe correction is specific.

Discard failed candidates silently. Label directly relevant existing defects as `Pre-existing`
rather than attributing them to the change.

Completion: every surviving finding has a location or requirement citation, reachable scenario,
concrete impact, evidence, and correction.

## 3. Reconcile and score

Deduplicate findings that describe the same underlying defect, but retain evidence from every axis
it affects. Resolve contradictions using source code, tests, project guidance, specifications, and
verified runtime behavior; request product intent only when those sources cannot decide.

Use one severity scale:

- **P0:** exploitable security failure, data loss, broken core flow, or deploy/build failure.
- **P1:** clear correctness, security, reliability, or critical-requirement failure to fix before
  merge.
- **P2:** demonstrated performance, maintainability, accessibility, UX, or partial-requirement issue
  worth fixing soon.
- **P3:** limited-risk bug or exact project-rule violation worth fixing but non-blocking.

Completion: each finding has one justified severity, one primary axis, and any cross-axis evidence.

## 4. Report

```text
## Review — <scope>

### Risk
- [P1] `path/file.ts:42` — [problem and reachable impact] → [smallest safe correction]

### Standards
- [P3] `path/file.ts:88` — [violation] (`AGENTS.md`: "rule") → [correction]

### Spec
Coverage: N implemented · N partial · N missing · N not verifiable
- [P1] [requirement citation] — [missing or incorrect behavior] → [correction]

### Pre-existing
- [P2] `path/file.ts:12` — [relevant existing defect] → [correction]

### Verification
[What was inspected, checks run, unavailable evidence, and residual risks]

### Risk Summary
[No blocking issues found / Issues worth addressing before merge / Production-risk issue found]
```

Omit empty finding sections. Keep the Spec status even when no spec is available. If no findings
survive, say so and identify the changed paths, surrounding code, and checks inspected.

Keep the review read-only. Provide platform comments or approval actions only as a separately
requested step. Style, formatting, missing tests, generated code, vendored code, and skipped paths
become findings only when applicable guidance requires them or they create concrete risk.

Completion: every applicable axis is represented, every finding carries its evidence and severity,
no-findings results state what was inspected, and platform state remains unchanged.
