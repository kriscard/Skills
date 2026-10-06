> **Read this when:** diagnosing maintainability symptoms or deciding whether a
> structural refactor is warranted.

# Code Smells and Refactoring Signals

A smell is a prompt to gather evidence, not a verdict. Describe the observed
change pattern first, then use the shared codebase-design vocabulary to locate
the interface or seam responsible.

This catalog is deliberately non-exhaustive. An unnamed symptom still qualifies
when evidence shows change amplification, cognitive load, unknown unknowns,
obscured ownership, or behavior leaking across interfaces. Describe it in the
repository's own terms and apply the same refactor gate; never force it into the
nearest named smell.

## Architecture signals

### Change amplification

One logical change repeatedly touches unrelated callers, layers, or packages.
Trace recent examples and identify which knowledge is duplicated. Recommend a
module move only when one owner can provide greater locality.

### Divergent change

One module changes for unrelated business or technical reasons. Separate
responsibilities when they have distinct owners, invariants, dependencies, or
change cadence—not merely to reduce file size.

### Feature envy

Behavior repeatedly reaches through another module's interface to interpret its
state. The behavior may belong with that state or in an orchestration module that
legitimately owns both concerns. Verify ownership before moving it.

### Inappropriate intimacy

Callers depend on implementation details, undocumented ordering, internal data
shape, or private lifecycle. Strengthen the interface or move the seam so callers
need less knowledge.

### Pass-through module

A module delegates while adding no policy, translation, lifecycle, compatibility,
or test leverage. Apply the deletion test: if removal makes complexity disappear,
the module may be shallow; if complexity spreads across callers, it was providing
locality.

## Component and function signals

### Mixed component responsibilities

Rendering, remote data, domain rules, and effects change independently but are
entangled. Split at a demonstrated change boundary. A long cohesive component may
be healthier than several pass-through components.

### Difficult interface

Callers must supply many unrelated facts, understand ordering, or coordinate
invalid combinations. Prefer an interface that represents the real operation and
makes invalid states harder to express. An options object improves syntax but
does not by itself reduce interface complexity.

### Data clump

The same fields travel together and share invariants across several interfaces.
Model them together when they represent one domain concept; visual similarity or
coincidental co-occurrence is insufficient.

### Prop threading

Values cross components that neither own nor use them. First reconsider
composition and state ownership. Context or a store is justified when the value
is genuinely ambient or shared across a bounded subtree; it is not an automatic
fix for depth alone.

### Dead code

A symbol or branch is unreachable through supported entry points. Confirm dynamic
loading, reflection, generated references, and public compatibility before
removal.

## Data and type signals

### Primitive confusion

Distinct domain values share a primitive representation and are accidentally
interchangeable. Use validation, domain types, or branded/nominal types where the
error risk justifies the interface cost.

### Parallel structures

Collections depend on positional synchronization or duplicated keys. Model one
record per concept or establish an explicit keyed relationship.

## Refactor gate

Refactor when all are true:

1. the symptom is demonstrated by current code, history, defects, or measured
   friction
2. the proposed interface has a clear owner and improves leverage or locality
3. behavior can be protected by tests or another observable verification loop
4. migration can be incremental or has an explicit rollback

Choose the smallest structural change that addresses the demonstrated cause.
Separate behavior-preserving moves from behavior changes when that separation
improves review and rollback; do not impose commit boundaries that make the work
less coherent.

## Reporting format

```text
Observed: concrete change pattern and evidence
Cause: interface, ownership, or seam problem supported by the evidence
Impact: defect risk, change amplification, cognitive load, or unknown unknowns
Refactor: smallest boundary or interface change
Verification: behavior that must remain stable
```
