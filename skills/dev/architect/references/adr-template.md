> **Read this when:** writing an ADR for a resolved architectural decision that
> needs durable context, alternatives, consequences, and confirmation.

# Architecture Decision Record Template

An ADR records one architecturally significant choice that future people and
agents would otherwise have to rediscover. Write it after one direction has been
chosen. If alternatives are still unresolved, keep them in the design discussion
or uncertainty map.

Follow the target repository's ADR convention when one exists. Otherwise use this
template:

```markdown
# [NNNN] [Decision in active voice]

Date: [YYYY-MM-DD]
Status: Proposed | Accepted | Rejected | Deprecated | Superseded by [link]

## Context
[The forces, constraints, and problem that make a decision necessary.]

## Decision drivers
- [Quality, constraint, or requirement that changes the choice]

## Considered options
1. [Option]
2. [Option]

## Decision
We will [specific choice].

## Consequences
- [Positive or enabling consequence]
- [Cost, limitation, or new responsibility]

## Confirmation
[How implementation or operation will prove the decision is being followed.]
```

`Proposed` means one chosen direction awaiting acceptance, not multiple unresolved
options. Once accepted, preserve the historical record; supersede it with a new
ADR rather than rewriting the old decision.

## Annotated example (abbreviated)

```markdown
# 0012 Store job leases in the database

Status: Accepted

## Context
Two workers can claim the same queued job after a process restart. In-memory
locks do not survive or coordinate across processes.

## Decision
We will acquire a time-bounded lease with one conditional database update before
work begins.

## Consequences
- Workers can recover abandoned jobs after the lease expires.
- Lease duration and renewal become operational settings that require monitoring.

## Confirmation
An integration test starts two workers against one database and proves only one
performs the job.
```

## Completion gate

- The title and decision use active language.
- Context states the forces and constraints, not only the selected technology.
- Drivers explain what changed the choice.
- Considered options are materially viable, not padding.
- Consequences include accepted costs or responsibilities.
- Confirmation is observable in implementation or operation.
- Date, owner, rationale, and evidence are sourced rather than invented.
