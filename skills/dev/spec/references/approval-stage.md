> **Read this when:** an artifact is ready for review, a revision needs reapproval, or final `approval.md` must be written.

# Approval stage

Approval applies to the current file contents, not to an earlier idea or review session.

## Run a review gate

Use Plannotator by default:

1. Check whether a `plannotator` tool is available, including a namespaced tool. If it is, call it with `action: "annotate"`, the artifact path as `target`, and `gate: true`. End the turn and wait for the reviewer's returned decision.
2. Without a tool, check whether the `plannotator` CLI is available. Run `plannotator annotate <artifact> --gate --json` with a long or unlimited timeout. Classify the result by the JSON `decision` field.
3. If Plannotator is unavailable or the user chooses chat, present or link the current artifact and ask for explicit approval of the named stage and file.

An `approved` Plannotator decision is approval even when it includes non-blocking notes. An `annotated` or `dismissed` decision is not approval. Address blocking feedback in the artifact and open a new gate. Use Plan Diff in Plannotator to review revisions; in chat, summarize the exact changes before asking again.

Record the approval method and which current stage it covers in working notes. Do not create final `approval.md` until Requirements, Technical Design, and Plan are all approved.

Completion: the reviewer explicitly approved the named stage against the current saved file, or the run remains at that gate.

## Apply invalidation

Use these ownership rules:

| Changed content | Return to | Also invalidates |
|---|---|---|
| Observable behavior, scope, constraints, acceptance criteria | Requirements | Design and Plan |
| Internal boundary, contract, data flow, failure handling, security, migration, rollout | Design | Plan |
| Task order, affected area, implementation boundary, or validation only | Plan | Plan only |

Formatting or typo corrections that do not alter meaning do not require an upstream gate, but the final hashes must cover the corrected files. When meaning is uncertain, treat the edit as material.

Completion: every material revision has passed its owning gate and each dependent artifact has been reconciled and reapproved.

## Finalize `approval.md`

Before writing approval state:

1. confirm Requirements and Technical Design approval applies to the current `spec.md`;
2. confirm Plan approval applies to the current `plan.md`;
3. check the `R` → `D` → `T` → `V` traceability table for full coverage;
4. compute lowercase SHA-256 hashes from the current bytes of both files using an available SHA-256 utility or language standard library;
5. write `approval.md` in the same directory.

Use this shape:

```markdown
# Approval

Status: Approved
Method: Plannotator | Explicit chat approval | Mixed
Approved at: <ISO-8601 timestamp>

## Approved artifacts

- `spec.md`
  - SHA-256: `<hash>`
- `plan.md`
  - SHA-256: `<hash>`

## Stage approvals

- Requirements: <method and decision reference>
- Technical Design: <method and decision reference>
- Plan: <method and decision reference>

## Exceptions

None.
```

List approved exceptions precisely instead of writing `None` when they exist. Do not describe a hash as a signature or Git identity.

Recompute both hashes after writing `approval.md` and verify they still match its values. `approval.md` is invalid whenever either canonical artifact later changes.

Completion: `approval.md` names the approval method and stage decisions, both recorded hashes match the current canonical files, and no unresolved blocker is hidden in Exceptions.

## Report and stop

Report:

- the artifact directory;
- the three canonical file paths;
- the approval method;
- any supporting artifacts and approved exceptions;
- that implementation has not started.

Stop without modifying application code, running implementation tasks, committing, pushing, closing tickets, or creating branches.

Completion: the user has a precise handoff to an implementation workflow and `/spec` has performed planning only.
