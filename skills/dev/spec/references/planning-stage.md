> **Read this when:** deriving or revising `plan.md` from an approved `spec.md`.

# Planning stage

The plan is an execution graph. It translates accepted requirements and design into bounded work without changing either.

## Write `plan.md`

Use this structure:

```markdown
# Implementation Plan: <title>

## Inputs

## Execution graph

### T1 — <outcome>
- Requirements: R1
- Design: D1
- Depends on: None
- Affected area: <paths or subsystem>
- Implementation boundary: <what changes and what stays unchanged>
- Validation: V1 — <command or observable check>
- Expected result: <specific pass condition>
- Deviation stop: <discovery that requires upstream review>

## Traceability

| Requirement | Design | Tasks | Expected evidence |
|---|---|---|---|
| R1 | D1 | T1 | V1 |

## Repository-wide validation

## Rollout and documentation

## Risks and deviation stops
```

Tasks may be ordered or dependency-linked. Each task must deliver one checkable outcome and include:

- a stable `T` ID;
- linked `R` and `D` IDs;
- dependencies, using task IDs;
- affected subsystem or expected files where repository evidence makes them knowable;
- a positive implementation boundary;
- an exact validation command or observable check with a stable `V` ID;
- the expected result;
- a deviation condition that stops execution rather than authorizing design drift.

Include documentation, migrations, rollout, rollback, cleanup, and removal tasks when the approved design requires them. Validation should use the repository's established checks and the smallest layer that proves the behavior. Apply the domain-routing matrix in `SKILL.md` when specialist guidance is needed to choose credible evidence; invoke `test` only when the verification layer or strategy remains unclear. TDD is optional unless the user or repository requires it.

Completion: the dependency graph has no unexplained cycles, every task is independently checkable, and implementation can select an unblocked task without rediscovering intent.

## Audit traceability

Check both directions:

- every `R` maps through at least one `D` to one or more `T` and `V` IDs;
- every `T` is authorized by a `D` and `R` rather than being opportunistic cleanup;
- every expected `V` states what result will count as evidence;
- every affected requirement has failure-path or edge-case validation where applicable.

If a task requires behavior or design absent from `spec.md`, return to the owning upstream stage. Do not smuggle a new decision into task prose.

Completion: the traceability table covers every requirement and contains no orphaned design, task, or expected-evidence ID.

## Gate the plan

Run the shared procedure in `approval-stage.md` against `plan.md`, asking the reviewer to approve executability, coverage, dependency order, validation, and deviation stops. Process annotations, revise, and resubmit the current file. Use Plan Diff for every revision.

A revision that changes accepted behavior returns to the Requirements gate. A revision that changes an accepted technical decision returns to the Design gate. After those approvals, regenerate and gate the plan again.

Completion: the current plan is explicitly approved, every requirement is covered, and no task exceeds the approved behavior or design.
