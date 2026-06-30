---
name: review
description: >-
  Security-first triage for code changes: inspect security vulnerabilities,
  correctness bugs, production reliability risks, performance issues, and
  maintainability concerns. Use after writing or modifying code, when reviewing
  PRs, or when the user asks "review this", "check this code", mentions code
  quality, security review, or performance audit.
---

# Code Review

Security-first triage: inspect security, correctness, and production reliability
in that priority order.

## Priority Order

1. **Security** — SQL injection, XSS, CSRF, auth bypass, secrets in code, input validation
2. **Correctness** — Logic errors, data loss risks, broken error handling, edge cases
3. **Performance** — N+1 queries, memory leaks, blocking operations, missing indexes
4. **Maintainability** — Complexity, duplication, unclear abstractions
5. **Style** — Last, and only if it deviates from team conventions

## Review Checklist

**Security (block on evidenced issues):**
- [ ] Inspect query construction for SQL injection and missing parameterization
- [ ] Inspect rendering paths for XSS and unsanitized user input
- [ ] Inspect sensitive operations for missing or bypassable auth checks
- [ ] Inspect changed files/config for secrets or credentials
- [ ] Inspect system boundaries for input validation

**Correctness:**
- [ ] Inspect error paths for silent failures or swallowed exceptions
- [ ] Inspect edge cases: empty, null, zero, large values, duplicate requests
- [ ] Inspect async operations for missing awaits, races, and stale state
- [ ] Inspect mutation/immutability assumptions

**Performance:**
- [ ] Inspect loops and serializers for N+1 queries or repeated I/O
- [ ] Inspect database queries for missing indexes or unbounded scans
- [ ] Inspect event listeners, timers, and subscriptions for cleanup
- [ ] Inspect expensive operations for appropriate caching or batching

**Tests:**
- [ ] Inspect whether new behavior has tests
- [ ] Inspect whether tests cover error paths, not just happy path
- [ ] Inspect mocks for over-mocking that hides real integration bugs

## Completion Gate

Complete the review only after inspecting changed code, relevant config, tests,
and routed references when applicable. Report only evidenced issues with
`file:line`, impact, and a concrete fix. If no issues are found, state what was
inspected.

## Output Format

```
## Summary
[1-sentence overall assessment]
Issues: N critical · N high · N medium · N low

## 🔴 Critical (block)
1. `file:line` — [issue]
   **Problem:** ...
   **Impact:** ...
   **Fix:** ...

## 🟠 High (should fix)
...

## 🟡 Medium (suggestions)
...

## ✅ What's good
...

## Verdict
[Approve / Request Changes / Block]
```

## What Not To Do

- Don't block on style preferences — that's what linters are for
- Don't give vague feedback like "this could be better"
- Don't approve without understanding the changes
- Don't ignore config changes — they cause most production incidents

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Reviewing UI code, component APIs, accessibility, or web interface patterns | `references/web-interface-guidelines.md` |
