---
name: review
description: >-
  Reviews code for security vulnerabilities, performance issues, correctness bugs, and
  production reliability concerns. Use after writing or modifying code, when reviewing
  PRs, when the user asks "review this", "check this code", mentions code quality,
  security review, or performance audit. Covers all languages and frameworks.
---

# Code Review

Security, correctness, and production reliability — in that priority order.

## Priority Order

1. **Security** — SQL injection, XSS, CSRF, auth bypass, secrets in code, input validation
2. **Correctness** — Logic errors, data loss risks, broken error handling, edge cases
3. **Performance** — N+1 queries, memory leaks, blocking operations, missing indexes
4. **Maintainability** — Complexity, duplication, unclear abstractions
5. **Style** — Last, and only if it deviates from team conventions

## Review Checklist

**Security (block on any of these):**
- [ ] No SQL injection vectors (parameterized queries used)
- [ ] No XSS — user input sanitized before rendering
- [ ] Auth checks on all sensitive operations
- [ ] No secrets or credentials in code
- [ ] Input validation at system boundaries

**Correctness:**
- [ ] Error paths handled — no silent failures
- [ ] Edge cases covered (empty, null, zero, large values)
- [ ] Async operations properly awaited
- [ ] No data mutation where immutability expected

**Performance:**
- [ ] No N+1 queries in loops
- [ ] Database queries have appropriate indexes
- [ ] No memory leaks (event listeners, timers cleaned up)
- [ ] Expensive operations cached where appropriate

**Tests:**
- [ ] Tests exist for new code
- [ ] Tests cover error paths, not just happy path
- [ ] No over-mocking that makes tests pass while real code breaks

## Output Format

```
## Summary
[1-sentence overall assessment]
Issues: N critical · N high · N medium · N low

## 🔴 Critical (block)
1. `file:line` — [issue]
   **Problem:** ...
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
