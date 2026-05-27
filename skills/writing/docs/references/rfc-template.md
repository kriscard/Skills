# RFC Template

A Request for Comments proposes a change and gathers feedback **before** the decision is made. The goal is to surface objections early.

## Sections

```markdown
# RFC: [Short title]

**Status:** Draft | In Review | Accepted | Rejected | Superseded by [link]
**Author(s):** [name(s)]
**Reviewers:** [@handles]
**Created:** YYYY-MM-DD
**Last updated:** YYYY-MM-DD

## TL;DR

One paragraph. What is this proposing, and what should the reader do? (Approve, comment on X, push back if Y.) Suitable for pasting into chat.

## Motivation

What problem are we solving? Why now? What happens if we don't?

Include concrete evidence — incidents, slow processes, customer complaints, missed deadlines. "It would be nicer if..." is weak motivation; "We've lost 3 days of eng time per quarter to X" is strong.

## Goals

What this proposal aims to achieve. Be specific and measurable when possible.

## Non-goals

What this explicitly does **not** try to do. Critical for scope control — without this, reviewers will assume the proposal covers more than it does and either approve too broadly or reject it for not solving things it never tried to solve.

## Proposal

The actual change being proposed. Include:
- Concrete design / API / behavior
- Diagrams if architectural
- Code samples for interface changes
- Examples of before/after

This is the section that gets the most iteration. Start with the highest-uncertainty sub-piece first.

## Alternatives Considered

For each alternative:
- What it is
- Why it was rejected (not just "it's worse" — be specific)

Reviewers will think of these themselves. Pre-empt them or get pulled into the same discussion 5 times.

## Trade-offs

What this proposal gives up. No design is free — being explicit about costs builds trust.

## Migration / Rollout

How do we get from current state to proposed state? Who has to change what? Timeline?

## Open Questions

Things the author isn't sure about. **This is where the discussion lives** — frame each as a question reviewers can answer, not a statement.

Examples:
- Should we support backward compatibility for X, or break it cleanly?
- Is the team okay with N weeks of dual-write before cutover?

## Decision Log

Append-only record of decisions made during review. Date + decision + who made it.
```

## When this template fits

Use RFC when:
- Decision isn't made yet
- Multiple teams or stakeholders need to weigh in
- Reversing the decision would be expensive
- You want async review (people comment on the doc rather than meeting)

Don't use RFC when:
- The decision is already made — use an ADR instead
- The work is small enough that a slack message + GitHub PR is enough
- It's purely tactical (use a tech spec)

## Common failure modes

- **No TL;DR** — reviewers bounce off long docs without a hook
- **Goals without non-goals** — scope creep in review
- **No "Open Questions"** — reviewers don't know what to react to, so they don't react
- **Alternatives Considered = "we picked the best one"** — reviewers don't trust the analysis
- **No status field** — readers don't know if this is settled or still up for debate
