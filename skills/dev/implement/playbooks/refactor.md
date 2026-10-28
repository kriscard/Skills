> **Read this when:** improving structure while preserving observable behavior and public contracts.

# Refactor

1. Name one structural problem and the contract to preserve: outputs, effects, failures,
   ordering, APIs and relevant performance invariants. Inventory affected callers.
   Compose `refactor` for the detailed behavior-preserving method; use `codebase-design`
   only when interface burden, responsibility or split/join analysis is needed.
2. Run preservation checks **before** restructuring. Compose `test` for missing
   characterization coverage. A typecheck alone does not pin runtime behavior. Resolve
   ambiguous behavior or record a blocked proof before relying on a preservation claim.
3. Apply one coherent simplification in small checkable units. Read
   [design fit](../references/design-fit.md) for non-obvious interface changes and bounded
   convention replacements. Preserve public contracts; a discovered defect, feature or
   compatibility change needs separate authority, not a silent route switch.
4. Rerun the same checks after each unit. Verify affected callers and inventory entries,
   including strings, examples and generated/external boundaries. Finish with relevant
   broader checks and compare the concrete total caller-plus-implementation burden.
5. Follow [evidence](../references/evidence.md) and
   [review and return](../references/review-and-return.md). Claim only the structural
   improvement and boundary actually verified, with residual debt explicit.

**Return:** structural target, before/after burden, preserved contract, baseline and final
checks, changed paths, gaps and any deliberately excluded behavior change.
