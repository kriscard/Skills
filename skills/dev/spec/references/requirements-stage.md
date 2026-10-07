> **Read this when:** writing or revising the Requirements layer of `spec.md`.

# Requirements stage

Requirements define observable behavior and product boundaries before internal design narrows the solution.

## Write `spec.md`

Create the file with this structure:

```markdown
# Spec: <title>

## Source context

## Requirements

### Summary and problem

### Users and outcomes

### Scope

### Non-goals

### Constraints

### Observable requirements

#### R1 — <outcome>

### Edge cases and failure expectations

### Acceptance criteria

### Open product decisions
```

Adapt subsection depth to the work, but preserve the meanings. Cite source URLs and repository paths under Source context. Keep assumptions labeled and name their owner or validation path.

Each `R` requirement must:

- describe behavior visible to a user, operator, consumer, or external system;
- identify the relevant actor and conditions;
- be falsifiable without depending on a preferred implementation;
- cover material failure behavior and boundary cases;
- avoid bundling independent outcomes under one identifier.

Acceptance criteria may map to one or more requirement IDs, but every requirement needs at least one observable pass/fail criterion. Non-goals must bound plausible adjacent work, not restate unrelated exclusions.

Apply the domain-routing matrix in `SKILL.md`. For rendered UI or user interaction, invoke `frontend` when available and use its contract questions to expose accessibility, user-state, responsive, input-mode, compatibility, and trust-boundary requirements. Record accepted behavior in this layer; reserve implementation choices for Technical Design.

Completion: every `R` has observable behavior and a falsifiable criterion, scope and non-goals bound the work, constraints are sourced, and no unresolved product decision is hidden inside an assumption.

## Gate the Requirements layer

Run the shared procedure in `approval-stage.md` against the current `spec.md`, asking the reviewer to approve the Requirements layer only. Process every annotation, revise the file, and submit the current version again. In Plannotator, use Plan Diff on each revision.

Proceed only on explicit approval. Keep the approved requirements unchanged while adding Technical Design. Any later material change to behavior, scope, constraints, or acceptance criteria returns here and invalidates downstream approval.

Completion: the current Requirements layer is explicitly approved, all blocking annotations are resolved, and there are no open product decisions.
