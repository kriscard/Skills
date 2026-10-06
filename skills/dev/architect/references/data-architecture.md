> **Read this when:** deciding persistence, data ownership, consistency,
> schema evolution, retention, or data migration.

# Data Architecture

Start with ownership and invariants. A database category is an implementation
choice downstream of the guarantees the system must provide.

## Ownership

For each important datum, identify:

- authoritative owner and write path
- readers and allowed projections
- invariants and who enforces them
- tenant, region, residency, and classification
- retention, deletion, export, and audit requirements

Shared storage does not imply shared ownership. Cross-context access needs a
contract even when modules use the same database.

## Access and workload

Use representative evidence:

- read/write shapes and frequency
- transaction scope and contention
- latency and availability targets
- expected volume, growth, and hot keys
- ad hoc query and reporting needs
- offline, replay, and synchronization requirements

Choose storage and indexing from these access patterns. Flexible schema, high
throughput, or relational shape are decision forces—not automatic database
categories.

## Consistency

State the required guarantee per workflow:

- atomic within one transaction
- read-your-writes or monotonic reads
- optimistic concurrency
- eventual convergence
- ordered processing
- idempotent retry
- compensating action

Explain what users and downstream systems observe during delay, conflict, retry,
or partial failure. “Eventually consistent” is incomplete without convergence,
time bounds, and recovery ownership.

## Contracts and evolution

Define compatibility for schemas, events, and APIs:

- additive versus breaking change
- producer/consumer deployment order
- defaults and unknown-field behavior
- versioning and deprecation
- backfill and dual-read/write period
- validation and drift detection

## Migration

Prefer reversible stages:

1. establish measurement and backup/restore confidence
2. introduce compatible schema or contract
3. backfill with checkpoints and reconciliation
4. shift reads or writes incrementally
5. verify invariants and performance
6. remove the old path after rollback windows close

Specify ownership, pause/resume behavior, failure recovery, and data comparison.
A migration plan is incomplete without rollback or forward-fix criteria.

## Privacy and lifecycle

Account for least privilege, encryption, secrets, data minimization, retention,
legal hold, deletion propagation, export, lineage, and auditability. Derived data,
logs, caches, embeddings, and backups may need the same lifecycle guarantees as
the source.

## Decision output

Compare options using the same workload and guarantees. State which requirement
decides the choice, what operational expertise it requires, and which migration
or lock-in cost it creates.
