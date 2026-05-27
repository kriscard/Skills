# Product Design Doc Template

A product design doc defines **what to build and why**. The audience is engineers, PMs, and designers who need to align on scope and approach before implementation.

## Sections

```markdown
# Design Doc: [Feature / project name]

**Author(s):** [name(s)]
**Stakeholders:** [PM, design, eng leads, exec sponsor]
**Status:** Draft | In Review | Approved | Shipped
**Created:** YYYY-MM-DD
**Target ship date:** YYYY-MM-DD or "TBD"

## TL;DR

One paragraph. What are we building, for whom, and why does it matter? Suitable for pasting into chat or a status update.

## Problem Statement

What's the user (or business) problem? Include:
- Who has this problem?
- How do they experience it today?
- Evidence it's worth solving (data, research, support tickets, sales feedback)

Avoid jumping to solutions here — describe the problem in user terms.

## Goals

What success looks like. Each goal should be:
- Specific (what changes)
- Measurable (how do we know it worked)
- Tied to a user or business outcome

## Non-Goals

Explicit out-of-scope items. This section prevents:
- Scope creep during implementation
- Reviewers blocking on missing features that were never the point
- Sales/marketing assuming the feature does more than it does

## User Stories / Use Cases

Concrete scenarios. Format:
> As a [user type], I want to [action] so that [outcome].

Include the unhappy paths and edge cases — they're where design decisions actually get made.

## Proposed Solution

What we're building. Include:
- High-level approach
- Key UX flows (sketches, mocks, wireframes — link to Figma)
- Major UI/API surfaces
- Behavior in edge cases

If there's significant technical design, link to a separate architecture doc rather than inlining it.

## Success Metrics

How do we know it's working post-launch?
- Leading indicators (adoption, engagement)
- Lagging indicators (retention, revenue, NPS)
- Counter-metrics (what should NOT get worse)

## Risks

What could go wrong? For each risk:
- What it is
- Likelihood / impact
- Mitigation plan

Common risks: technical complexity, dependency on another team, user adoption, performance, compliance.

## Dependencies

What needs to be true / done by other people before this can ship?
- Other teams' work
- Infra changes
- Vendor / contract
- Legal / compliance review

## Open Questions

What's still undecided. Frame as questions so reviewers can answer.

## Rollout Plan

- Internal alpha → beta → GA?
- Feature flag strategy?
- Documentation, support training, sales enablement?
```

## When this template fits

Use a product design doc when:
- Building a new feature or significantly changing an existing one
- Multiple disciplines (eng, design, PM) need to align
- The work spans more than 1–2 weeks
- Stakeholders outside the immediate team need visibility

Don't use it when:
- The work is a pure tech refactor — use an architecture proposal
- The decision is just "do or don't" — use an RFC
- It's a bug fix or single-engineer task — no doc needed

## Common failure modes

- **Solution before problem** — readers can't evaluate fit
- **No success metrics** — there's no way to evaluate post-launch
- **Vague user stories** — design decisions get made implicitly during implementation
- **No non-goals** — scope balloons in review
- **Risks section is empty or generic** — signals the author hasn't thought about what could go wrong
