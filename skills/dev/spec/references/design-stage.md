> **Read this when:** adding or revising the Technical Design layer after Requirements approval.

# Design stage

Technical Design records accepted internal decisions needed to satisfy the approved requirements safely. It is neither a file-by-file task list nor a code dump.

## Establish the design

Append this layer to `spec.md` without rewriting approved requirements:

```markdown
## Technical Design

### Current-system evidence

### Components and responsibilities

### Data flow and state transitions

### Interfaces and contracts

### Failure and recovery behavior

### Security, privacy, and abuse boundaries

### Compatibility, migration, and rollout

### Observability and operations

### Design decisions

#### D1 — <decision>
- Requirements: R1
- Decision:
- Evidence:
- Trade-offs:
- Reversal or rollback:

### Assumptions and blockers
```

Include only applicable sections, but state `Not applicable — <reason>` when omitting a risk-bearing concern could look accidental. Add supporting artifacts when detail would bury the decision: contracts, data model, migration sequence, research notes, or decision records belong beside the canonical files and are linked from `spec.md`.

Every `D` decision must link to at least one `R` requirement and state the evidence or constraint that makes it appropriate. Cover, when material:

- ownership boundaries and responsibilities;
- request, event, and state flows;
- APIs, events, schemas, storage, and protocol contracts;
- failure, retry, recovery, idempotency, and consistency behavior;
- authorization, security, privacy, untrusted content, and abuse cases;
- backward compatibility, migration, rollout, rollback, and removal;
- operational signals, capacity limits, and support ownership.

Apply the domain-routing matrix in `SKILL.md`. Invoke `frontend` for browser-facing design, `react` only when React-specific behavior is affected, and `nextjs-app-architecture` only when its framework boundaries are present. Route consequential system boundaries through `architect` and version-sensitive external claims through `research`. Record accepted conclusions and primary evidence here; domain skills advise this stage without implementing.

Completion: every design decision traces to requirements, every affected interface and material failure mode is explicit, supporting artifacts are linked, and no blocker remains disguised as an assumption.

## Protect approved requirements

Compare the revised `spec.md` with the approved Requirements version. Clarifying internal behavior is design; changing an observable outcome, scope boundary, constraint, or acceptance criterion is a Requirements revision.

When Requirements changed materially:

1. return to the Requirements gate;
2. obtain approval of the revised Requirements layer;
3. reconcile the design against that version;
4. gate the design again.

Completion: the Technical Design addition preserves the currently approved Requirements layer, or the upstream gate has been rerun.

## Gate Technical Design

Run the shared procedure in `approval-stage.md` against `spec.md`, asking the reviewer to approve the Technical Design and its fit to the approved Requirements. Process annotations, revise, and reopen the current file. Use Plan Diff to expose every revision.

Proceed only on explicit approval of the current design. A later material design change invalidates plan approval as well.

Completion: the current Requirements and Technical Design layers are explicitly approved and their `R` → `D` links are complete.
