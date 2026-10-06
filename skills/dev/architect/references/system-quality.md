> **Read this when:** comparing reliability, security, privacy, observability,
> capacity, cost, or runtime/deployment topology.

# System Quality Attributes

Quality attributes are architectural only when they shape boundaries, data flow,
runtime placement, or ownership. Replace “scalable,” “secure,” and “reliable”
with measurable scenarios.

## Scenario format

```text
Source: actor or event
Stimulus: load, failure, attack, deployment, or change
Environment: normal, degraded, peak, recovery, or migration
Artifact: affected interface, data, module, or runtime
Response: required behavior
Measure: threshold, budget, or observable signal
```

Use the attributes that can change the decision.

## Reliability and recovery

Define availability scope, dependency failure behavior, timeout budgets, retries,
idempotency, load shedding, backpressure, degraded modes, and recovery objectives.
Trace correlated failures and retry amplification rather than assuming redundancy
creates resilience.

For stateful systems, verify backup, restore, reconciliation, and disaster
recovery through exercises—not configuration alone.

## Security and privacy

Map trust boundaries, identities, authorization decisions, secrets, sensitive
data flows, tenant isolation, abuse cases, and audit requirements. State which
component owns enforcement. Security controls that only exist in clients do not
protect server resources.

Include supply-chain, administrative, and operational paths when they can bypass
normal interfaces.

## Performance and capacity

Use end-to-end budgets for latency, throughput, concurrency, resource use, and
payload size. Identify the bottleneck and scaling unit before selecting horizontal
scaling, caching, partitioning, queues, edge placement, or specialized storage.

Account for cold starts, cache misses, skew, fan-out, coordination, and data
locality. Peak behavior and failure recovery often determine capacity more than
steady-state averages.

## Observability and operability

Define the questions operators must answer, then choose signals:

- user-visible success and latency
- dependency and queue health
- saturation and capacity margin
- data correctness and reconciliation
- deployment and migration state
- security-relevant actions

Logs, metrics, and traces need stable identifiers and ownership. Dashboards
without an action or decision they support are inventory, not observability.

## Evolvability and delivery

Evaluate independent change, compatibility, deployment order, feature rollout,
rollback, and blast radius. A service boundary is valuable only when ownership
and independent operation justify its distributed-system cost.

## Cost

Compare total cost under representative and peak load: compute, storage, transfer,
managed-service fees, operational labor, incident risk, and migration. Unit cost
without workload growth or reliability requirements is not decision evidence.

## Accessibility and user resilience

When architecture controls navigation, rendering, component primitives, or async
interaction, include keyboard access, assistive-technology semantics, focus and
announcement behavior, reduced motion, localization, and degraded-network/error
states in acceptance scenarios. These constraints should survive framework and
component-library choices.
