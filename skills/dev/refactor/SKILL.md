---
name: refactor
description: >-
  Behavior-preserving code refactoring. Use when the user asks to simplify
  complex or duplicated code, improve naming, control flow, or module structure,
  extract code, or clean up an implementation without changing functionality.
  Preserve public APIs unless the user explicitly authorizes a change.
---

# Refactor

Make the smallest structural change that produces a specific improvement while preserving the
code's observable contract.

## Process

### 1. Define the contract and target

Read applicable project guidance, the target code, its callers, and nearby tests. Name one
structural target, such as duplicated decisions, nested control flow, mixed responsibilities,
unclear ownership, or misleading names. Record the behavior that must remain stable: public APIs,
outputs, side effects, error behavior, ordering, and any performance-sensitive invariant.

Completion: the target improvement is checkable, the preserved contract is explicit, and affected
callers are accounted for.

### 2. Establish preservation evidence

Run the narrowest existing checks that exercise the contract. When coverage is missing, add or
record a focused characterization check for the behavior at risk. Resolve ambiguous behavior with
the user before changing it. Treat a discovered bug, API change, dependency change, or architectural
choice as separate work requiring approval.

Completion: the baseline result is captured, every behavior at risk has a repeatable check or a
reported coverage gap, and ambiguities are resolved or excluded from scope.

### 3. Apply one coherent simplification

Keep the change centered on the named structural target. Choose only the techniques it needs:

- flatten control flow or make the happy path explicit;
- remove genuine duplication or dead code;
- rename concepts to match their role;
- extract a cohesive function, type, or module;
- replace an awkward data structure with one that expresses the invariant.

Follow local conventions and keep public APIs, dependencies, and architectural boundaries stable.
Supporting renames or extractions belong in the same change only when they serve the target.

Completion: the target is measurably improved and every changed line supports that improvement or
preserves its contract.

### 4. Verify the contract

Repeat the baseline checks and run the repository's relevant typecheck, tests, lint, or build.
Inspect the final diff and affected callers for accidental behavior or API changes. Compare the
before and after using the target's evidence: fewer branches, less duplication, narrower ownership,
clearer names, or a smaller public surface.

Completion: relevant checks pass, or unrelated failures are reported with evidence; compatibility
is confirmed; and the improvement is demonstrated by a specific before/after comparison.

## Report

State:

- the structural target and what changed;
- the preservation evidence and commands run;
- the concrete before/after improvement;
- unresolved coverage gaps, assumptions, or separately scoped opportunities.
