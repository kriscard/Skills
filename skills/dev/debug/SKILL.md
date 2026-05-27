---
name: debug
description: >-
  Debugs errors, test failures, and unexpected behavior with systematic root-cause
  analysis. Use when the user reports a bug, says "this isn't working", a test is
  failing, an exception is thrown, output is wrong, or asks to investigate "why does X
  happen". Applies to frontend, backend, database, network, and performance issues.
---

# Debug

Systematic root-cause analysis — reproduce, isolate, hypothesize, fix, verify.

## Process

1. **Read the error** — full message, stack trace, error code. Don't skip this.
2. **Reproduce reliably** — minimal steps before touching any code.
3. **Isolate** — binary search via `git bisect`, comment blocks, or minimal repro.
4. **Hypothesize** — one specific theory. Don't change multiple things at once.
5. **Test hypothesis** — add logging, use debugger, modify code.
6. **Apply minimal fix** — smallest change that addresses root cause, not symptoms.
7. **Verify** — confirm fix works and no regressions.

## Diagnosis Checklist

**Start here before touching code:**

- [ ] Read the full error message — it often tells you exactly what's wrong
- [ ] Check recent changes: `git log --oneline -10` / `git diff HEAD~1`
- [ ] Check logs around time of failure
- [ ] Verify environment matches expected (versions, env vars, config)
- [ ] Could this be a race condition or timing issue?
- [ ] Is this intermittent or consistent?

**Reproduction:**

```bash
# Find the commit that introduced it
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-sha>
```

**Strategic logging:**

```typescript
// Entry/exit with parameters — temporary, remove after fix
console.log('[debug] functionName called', { param1, param2 });
// ...
console.log('[debug] functionName result', { result });
```

## Anti-Patterns

- Don't make random changes hoping something fixes it — form a hypothesis first
- Don't fix symptoms without understanding root cause
- Don't debug in production without safeguards
- Don't leave debug logs or breakpoints in committed code
- Don't trust your mental model — read the actual code

## Output

```
## Root Cause
[What actually caused the issue]

## Evidence
- [Log excerpt / stack trace / variable state]

## Fix
`file:line`
```diff
- broken code
+ fixed code
```

**Why this fixes it:** [reasoning]

## Prevention
- [Recommendation to avoid recurrence]
```
