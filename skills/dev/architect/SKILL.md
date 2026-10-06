---
name: architect
description: >-
  Guides architecture decisions about service/module boundaries, system
  trade-offs, ADRs, data flow, rendering strategy, scaling strategy, API
  protocols, persistence choices, and code organization. Use when the user asks
  "how should I structure this", "what's the right approach", or needs a
  decision that affects multiple modules, teams, deployment boundaries, or future
  reversibility. Do not use for routine React implementation, PR review, or
  simple refactors unless the user is making an architectural decision.
---

# Architect

Resolve one consequential design decision at a time. Architecture is the fit
between constraints and trade-offs, not a catalog of preferred technologies.

## Workflow

### 1. Frame the decision

State the decision as a choice, its scope, the trigger, and the cost of reversing
it. Inspect the repository and existing decision records before asking questions.
Gather only constraints that could change the recommendation; state non-blocking
unknowns as assumptions.

Ask when missing context blocks comparison. Resolve dependent decisions in order
rather than mixing them into one recommendation.

Done when the decision, current state, decision owner, constraints, and
reversibility are explicit.

### 2. Diagnose the current system

Trace the current architecture through ownership, interfaces, data flow, runtime
boundaries, and operations. Distinguish observed behavior from inferred intent.
Name the evidence behind claims about scale, coupling, latency, reliability,
security, ownership, or operational burden.

Done when the current design and its demonstrated pain are clear enough to judge
whether change is warranted.

### 3. Compare viable options

Compare the status quo with every materially viable alternative. Preserve a
rejected alternative only when its rejection is non-obvious or likely to be
revisited. Do not pad the comparison to reach a fixed option count.

Evaluate each option against the same decision-specific criteria, including when
relevant:

- fit with current constraints and established architecture
- complexity added, removed, or shifted
- migration and interoperability
- user and customer impact, including accessibility where relevant
- failure modes, security, privacy, and data consistency
- reliability, recovery, operational ownership, and observability
- cost, performance, capacity, and scaling evidence
- evolvability, reversibility, and lock-in

Done when every viable option is evaluated against the criteria that can change
the decision.

### 4. Recommend and verify

Give one recommendation or state that evidence is insufficient. Include:

1. the recommendation and why it wins
2. viable alternatives and why they lose
3. trade-offs, risks, and failure modes
4. assumptions and unresolved questions
5. an incremental next step or experiment
6. validation signals and rollback/reversal path

Use current, version-specific documentation when a recommendation depends on a
framework, library, provider, or platform. Prefer the repository's established
stack unless measured limitations justify migration.

Use this response shape:

```markdown
## Recommendation
**Decision:** [one sentence]
**Why:** [decisive constraints and evidence]

## Options
| Option | Fit | Costs and risks | Reversibility |
|---|---|---|---|

## Assumptions and unknowns
[What is assumed; what could change the decision]

## Next step
[Smallest experiment, migration slice, or implementation step]

## Validation and reversal
[Signals, failure threshold, rollback or migration path]

## Durable artifact
[Existing record, recommended artifact, or why none is needed]
```

Done when the recommendation is actionable and the user can tell what evidence
would confirm or overturn it.

### 5. Ask what happens next

The recommendation memo is the default stopping point. When the user has not
already specified the next output, ask whether they want to:

- stop at the recommendation
- create an ADR
- create a technical design or diagram
- prepare a handoff for a named person, agent, or workflow
- continue through their orchestrator or planning workflow

Before preparing a handoff, ask who or what will receive it and what that receiver
must do next.

A result qualifies as an **ADR candidate** when it is hard to reverse,
surprising, constrained by facts outside the code, establishes ownership or
integration boundaries, deliberately deviates from the expected path, or rejects
a non-obvious alternative. Identify the candidate in the normal response. Draft
or write the ADR only when the decision is resolved and the user chooses that
artifact. When evidence is insufficient, preserve the open questions instead of
recording an unresolved assumption as a decision. Link an existing ADR when it
already owns the decision.

Done when the user has chosen the stopping point, artifact, or handoff target.

## References Routing Table

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Code organization, module interfaces, seams, depth, or testability | `references/codebase-design.md` |
| 1 — High | Diagnosing maintainability symptoms or deciding whether to refactor | `references/code-smells.md` |
| 2 — High | Service boundaries, client-specific orchestration, API protocols, or request waterfalls | `references/fullstack-patterns.md` |
| 2 — High | Frontend composition, state ownership, rendering, or delivery strategy | `references/frontend-patterns.md` |
| 2 — High | Persistence, data ownership, consistency, schema evolution, or migration | `references/data-architecture.md` |
| 2 — High | Reliability, security, privacy, observability, capacity, or runtime topology | `references/system-quality.md` |
| 2 — High | Durable decision, design/spec, uncertainty map, or diagram | `references/decision-artifacts.md` |
| 2 — Conditional | Writing a resolved ADR when the repository has no template | `references/adr-template.md` |
| 2 — Conditional | User requests a handoff and names its receiver | `references/agent-handoff.md` |
| 3 — Medium | Object creation, wrapping, adaptation, composition, or subsystem access | `references/patterns-structural.md` |
| 3 — Medium | Events, coordination, interchangeable behavior, explicit state, queues, or traversal | `references/patterns-behavioral.md` |

## Completion Gate

The decision is complete only when:

- repository evidence and user constraints are separated from assumptions
- the status quo and every viable alternative use the same evaluation criteria
- the recommendation states what complexity it adds, removes, or shifts
- validation and reversal are concrete
- the user has chosen to stop, create an artifact, or hand the decision to a
  named receiver or workflow
