> **Read this when:** correcting an observed defect rather than redefining intended behavior.

# Bug fix

1. Capture exact expected versus actual behavior, triggering conditions and affected path.
   Compose `debug` for diagnosis before proposing a fix; it owns reproduction, minimized
   experiments and causal evidence. Use relevant version specialists only when the failure
   depends on their mechanics. If reproduction or intent is unavailable, report the precise
   missing input/access rather than guess.
2. Once cause and intended contract are established, compose `test` for the smallest credible
   regression check. Run it failing on the actual symptom where feasible; otherwise retain
   the already-observed reproduction loop and explain the coverage limitation.
3. Apply the narrowest causal fix. If failure handling, contracts or ownership change, read
   [design fit](../references/design-fit.md). Consider honest idempotence or an enforceable
   invariant before adding caller recovery branches, but preserve meaningful failure and
   external contracts. Unrelated cleanup remains outside the task.
4. Rerun the same symptom/conditions and regression check, then the smallest broader suite
   and static checks that can expose collateral damage. For intermittent defects compare
   the pinned conditions and sample sizes, not one lucky pass. Remove authorized temporary
   instrumentation without deleting unrelated work.
5. Inspect the diff and direct callers, apply [evidence](../references/evidence.md), and
   follow [review and return](../references/review-and-return.md). Stop on any needed
   scope/design change rather than turning diagnosis into a new feature.

**Return:** root cause, failing-before/passing-after evidence, fix and affected paths,
remaining recurrence/environment uncertainty, and `R/D/T/V` links for spec-governed work.
