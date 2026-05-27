# Architecture Decision Record (ADR) Template

An ADR captures a decision **after it's made**. Audience: future engineers who need to understand why something was done a certain way — including future-you in 6 months.

The defining feature of an ADR: it is **immutable**. Once accepted, you don't edit it — you supersede it with a new ADR.

## Sections

```markdown
# ADR-NNNN: [Short title — the decision in 6 words or less]

**Status:** Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
**Date:** YYYY-MM-DD
**Deciders:** [names]
**Consulted:** [names]

## Context

What's the situation that required a decision? Include:
- Forces at play (technical, organizational, business)
- Constraints we can't change
- Why this decision is being made now

Keep it tight — readers can read the linked RFC or design doc for full background.

## Decision

What we decided. State it as an active choice:
> We will [decision].

Not "We discussed using X" or "X seems better than Y" — what was actually chosen.

## Consequences

What changes because of this decision?
- **Positive:** what gets better
- **Negative:** what costs we accept
- **Neutral:** what's now constrained going forward

Be honest about the trade-offs. ADRs that only list upsides aren't trusted.

## Alternatives Considered

For each alternative:
- What it was
- Why it was rejected

Keep this brief — full analysis lives in the RFC. The ADR records what was rejected and why, so future readers don't re-litigate.

## References

- Link to RFC or design doc that led to this decision
- Link to related ADRs
- Link to implementation PR(s)
```

## When this template fits

Use an ADR when:
- A decision has been made (not "we're considering")
- The decision will be load-bearing for future work
- Future engineers will ask "why did we do it this way?"

Don't use it when:
- The decision is still under debate — use an RFC
- The decision is tactical and won't shape future work
- The decision is about product scope — use a design doc

## ADRs vs. RFCs

| | RFC | ADR |
|---|---|---|
| When | Decision pending | Decision made |
| Mutability | Iterates during review | Immutable after acceptance |
| Audience | Reviewers giving feedback | Future engineers reading history |
| Length | Can be long | Short (1–2 pages) |
| Lives where | Often a doc / wiki | Often in-repo (`docs/adr/`) |

A common pattern: RFC drives the discussion, then an ADR distills the accepted decision. They're complementary, not redundant.

## Common failure modes

- **Mutating an accepted ADR** — breaks the historical record; instead, write a new ADR that supersedes it
- **No date** — readers can't tell when the context was true
- **Vague decision statement** — "we'll consider using X" isn't a decision
- **Consequences section is all positive** — signals the author skipped trade-offs
- **No "Alternatives Considered"** — future readers don't know what was rejected and may re-propose it
