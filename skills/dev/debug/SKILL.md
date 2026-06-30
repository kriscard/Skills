---
name: debug
description: >-
  Debugs errors, test failures, and unexpected behavior with systematic root-cause
  analysis. Use when the user reports a bug, says "this isn't working", a test is
  failing, an exception is thrown, output is wrong, or asks to investigate "why does X
  happen". Applies to frontend, backend, database, network, and performance issues.
---

# Debug

Trace the failure before changing code. Systematic root-cause analysis:
reproduce, isolate, hypothesize, fix, verify.

## Process

1. **Trace the failure** — capture the exact error, stack trace, failing command,
   and relevant logs. Done only when the failure can be quoted back verbatim.
2. **Reproduce reliably** — identify the smallest command or action that fails.
   Done only when it fails twice the same way, or is labeled intermittent with
   evidence.
3. **Gather evidence before hypothesis** — check recent changes, logs around the
   failure, expected environment, config, versions, and whether timing/races are
   plausible. Done only when each relevant item is recorded or ruled out.
4. **Isolate** — binary search via `git bisect`, comment blocks, feature flags,
   or a minimal repro. Done only when the failure is narrowed to a component,
   commit, input, or condition.
5. **Hypothesize** — state one specific theory and the observation that would
   disprove it. Do not change multiple things at once.
6. **Test hypothesis** — add temporary logging, use a debugger, or run a focused
   experiment. Done only when the result supports or rejects the theory.
7. **Apply minimal fix** — smallest change that addresses root cause, not symptoms.
8. **Verify** — rerun the original reproduction and relevant regression checks.
   Done only when the original failure no longer occurs and regressions are not
   detected or are explicitly reported.

## Evidence to Gather Before Hypothesis

- Full error message, stack trace, and error code
- Recent changes: `git log --oneline -10` / `git diff HEAD~1`
- Logs around the time of failure
- Environment: versions, env vars, config, external service state
- Consistency: deterministic failure or intermittent pattern

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

````markdown
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

## Verification
- [Command/repro rerun and result]

## Prevention
- [Recommendation to avoid recurrence]
````
