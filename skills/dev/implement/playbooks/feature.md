> **Read this when:** adding or changing intended product or consumer-visible behavior.

# Feature

1. Confirm the accepted outcome, constraints, non-goals, normal/edge/failure expectations,
   and observation point. For a spec, select an unblocked `T` with its `R/D/V` mapping.
   Stop for consequential unresolved behavior or design using the main skill's spec gate.
2. Trace the owning implementation and direct callers. Read
   [skill composition](../references/skill-composition.md) for matching guidance and
   [design fit](../references/design-fit.md) when contracts or mechanisms change.
   Describe non-obvious contracts before their bodies; keep the increment a complete
   current capability rather than a speculative framework.
3. Compose `test` for behavioral coverage. Establish the focused baseline, then implement
   one coherent unit with its acceptance checks. Use red-before-green when TDD is required
   or a cheap regression seam exists; do not impose a new runner or test philosophy.
4. Run focused evidence, inspect expected failures and edge behavior, then affected broader
   tests/static checks. If acceptance depends on runtime wiring, exercise that safe real
   surface under [evidence](../references/evidence.md); static green alone is insufficient.
5. Inspect changed callers and diff for scope, contract and burden. Complete the unit only
   when its expected evidence is observed. Repeat for the next authorized dependent unit,
   then follow [review and return](../references/review-and-return.md).

**Return:** behavior delivered, contract/design choices, changed paths, acceptance and
failure evidence, spec IDs when present, remaining uncertainty and next user decision.
