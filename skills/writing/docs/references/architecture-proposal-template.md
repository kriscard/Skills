# Architecture Proposal Template

An architecture proposal proposes a change to **how systems are built** — a pattern, a service boundary, an infrastructure shift. Audience: engineers and architects who need to evaluate the design and migration cost.

## Sections

```markdown
# Architecture Proposal: [Short title]

**Author(s):** [name(s)]
**Reviewers:** [@handles, especially anyone on affected systems]
**Status:** Draft | In Review | Approved | Implemented | Rejected
**Created:** YYYY-MM-DD
**Affected systems:** [list services / repos / teams]

## TL;DR

One paragraph. What's the architectural change, what problem does it solve, and what's the rough migration cost? Suitable for chat paste.

## Context

What's the current state? Include:
- Architecture as it exists today (diagram if helpful)
- Constraints we're operating under
- Recent history relevant to this decision

This grounds reviewers who aren't deep in the affected area.

## Problem

What's wrong with the current architecture? Be specific:
- Concrete pain points (incidents, slow features, scaling limits)
- Evidence of the cost (eng hours, downtime, customer impact)
- Why the current design no longer fits

"It's not clean" is weak. "We've had 3 incidents in 6 months caused by X" is strong.

## Proposed Architecture

The new design. Include:
- Architecture diagram (boxes + arrows, sequence diagram, C4 if formal)
- Component responsibilities
- Data flow
- Interface contracts
- Failure modes

For each major component, explain **why it exists** — not just what it does.

## Alternatives Considered

For each alternative architecture:
- Sketch of the design
- Why it was rejected (latency, cost, complexity, team familiarity)

Including alternatives shows you've thought about it. Skipping them invites "did you consider X?" comments that derail the review.

## Trade-offs

What this design gives up:
- Operational complexity?
- Latency?
- Consistency model?
- Engineering effort to maintain?

Every architecture has trade-offs. Naming them builds trust.

## Migration Plan

How do we get from current to proposed state? This is where most architecture proposals live or die.

- Sequence of changes (in order)
- Backward compatibility strategy (dual-write, shadow reads, feature flags)
- Rollback plan for each step
- Estimated effort per phase
- Who has to change what (team-level)

If migration takes more than ~2 quarters, break it into phases with clear success criteria for each.

## Risks

For each risk:
- What it is
- Likelihood × impact
- Detection (how do we know it's happening?)
- Mitigation

Common risks: data loss during migration, performance regression, organizational change cost, dependency surprises.

## Open Questions

What's still undecided. Frame as questions reviewers can answer.

Examples:
- Should service X own the new responsibility, or should we spin up a new service?
- Are we OK with eventual consistency on Y for the first quarter?

## Implementation Tracking

Once approved, link to:
- Tickets / epics
- Status updates
- Postmortems / lessons (after the fact)
```

## When this template fits

Use an architecture proposal when:
- Changing system boundaries or major patterns
- Introducing a new service, datastore, or infrastructure tier
- Proposing a refactor large enough to need cross-team buy-in
- The migration matters as much as the destination

Don't use it when:
- The change fits in one repo / one team's domain — code review is enough
- The decision is already made — use an ADR
- It's a product question — use a design doc

## Common failure modes

- **No "Context" section** — reviewers outside the affected area can't engage
- **Diagrams without why** — boxes without intent reads like a brain dump
- **No migration plan** — "we'll figure it out" means reviewers can't sign off on cost
- **Alternatives Considered missing or token** — reviewers don't trust the choice
- **No risks** — signals the author hasn't stress-tested the design
- **No "Open Questions"** — review becomes a yes/no instead of a discussion
