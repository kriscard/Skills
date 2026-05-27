---
name: docs
description: >-
  Writes technical documentation: READMEs, API docs, architecture docs,
  how-to guides, RFCs, design docs, and ADRs. Applies type-specific rules for
  each format to ensure docs are actually useful — not just technically correct.
  Make sure to use this skill whenever the user says "write documentation",
  "document this", "create a README", "API docs", "technical docs", "write an
  RFC", "design doc", "architecture proposal", "write up a proposal", "draft a
  decision record", "share this with the team", "document this function/
  component/service", or asks to explain how something works for other
  developers. Also triggers when existing docs need a quality review.
user-invocable: true
---

# Technical Documentation Writer

Different documentation types serve different purposes. The format rules exist because readers come to each type with a specific goal — give them what they came for immediately.

## Documentation Types and Rules

### README

The README answers: "what is this and can I use it in 2 minutes?"

**Rules:**
- First sentence: what this IS, not what it will do someday. "A CLI for syncing Obsidian vaults" not "This project aims to..."
- Installation in <5 commands. If it takes more, show the most common path and link to full setup
- One working example before any explanation — show before you tell
- Link to full docs, don't duplicate them

**Structure:**
```
# Project Name
One sentence description.

## Install
[<5 commands]

## Quick Start
[One working example]

## [Links to deeper docs if needed]
```

### API Docs

**Rules:**
- Describe behavior, not implementation — "Returns paginated results sorted by createdAt" not "Calls the database with a LIMIT clause"
- Every parameter: name, type, required/optional, default, what it does
- Every return value: type, shape, what it contains
- One realistic example per endpoint — not a toy example, something close to real usage
- Document the error cases: what fails, what you get back, what to do about it

**Parameter format:**
```
name (string, required) — The user's display name. Max 50 characters.
limit (number, optional, default: 20) — Results per page. Max 100.
```

### Architecture Docs

**Rules:**
- Explain decisions (WHY), not just structure (WHAT). Structure can be read from code. Decisions cannot.
- For each major architectural choice: what was considered, what was chosen, why, what tradeoffs were accepted
- C4 diagrams for system context (level 1: system in its environment) and container diagrams (level 2: major components)
- Keep current — an outdated architecture doc is actively harmful (misleads more than no doc)

**Structure:**
```
## Context
[What problem this system solves, who uses it]

## Key Decisions
[Decision record format: what, why, alternatives considered, tradeoffs]

## System Diagram
[C4 context or container diagram]

## Data Flow
[How data moves through the system for the main use cases]
```

### How-To Guides

**Rules:**
- Task-oriented title: "How to add authentication" not "Authentication"
- Assumes the reader has the prerequisite knowledge — link to it, don't re-teach it
- Steps are ordered by dependency: step N builds on step N-1
- Each step has one action and one expected result

### RFC / Design Doc / ADR

For team-facing proposals and records. Ask which type before starting — each has a different section convention.

| Type | Use When |
|------|----------|
| RFC | Change isn't decided yet — soliciting feedback before committing |
| Product design doc | Scoping new work — goals, non-goals, user stories, success metrics |
| Architecture proposal | System design or pattern change — current state, proposed design, trade-offs, migration |
| ADR | Decision already made — capture context, decision, consequences |

**Workflow for proposals/records:**
1. Confirm doc type and primary audience (specific team, eng leads, whole org)
2. Ask for context dump — problem, background, constraints, stakeholder concerns
3. Follow the brainstorm → curate → draft → refine loop for each section
4. Start with the section that has the most unknowns; save TL;DR for last
5. After 3 iterations with no changes, ask "what can be removed without losing value?"
6. Reader test: predict 5 questions a reader with no context would ask — does the doc answer them?

**RFC/design doc structure:**
```
## TL;DR
[Summary — write last]

## Problem
[What's painful, with real data]

## Proposed Solution
[Scoped, not "change everything"]

## Why Now?
[What triggered this]

## Trade-offs
[Pros AND cons — naming downsides builds trust]

## Alternatives Considered
[What you rejected and why]

## Rollback Plan
[Makes skeptics comfortable]

## Open Questions
[Decision points for the reader — silence in team chat means readers didn't know what to react to]
```

For docs going into team chat: include a TL;DR at the top suitable for pasting into Slack.

## Quality Checklist

Before delivering any docs, verify:

- [ ] First sentence tells you what this IS, not what it does someday
- [ ] Code examples run without modification (test them)
- [ ] All required config / env vars are documented
- [ ] Common errors documented with how to fix them
- [ ] No passive voice for user actions ("you run" not "the command is run")
- [ ] No "simply" / "just" / "easy" — the reader is here because it wasn't obvious
- [ ] Links work (check any URLs referenced)
- [ ] Consistent terminology throughout (pick one name per concept)

## Workflow

1. Identify the documentation type (README, API, architecture, how-to)
2. Ask for any missing context: what's the audience, what do they already know, what do they need to do
3. Draft with type-specific rules applied
4. Run through the quality checklist before delivering

## References

Load the template that matches the doc type — all are equal priority, triggered by type alone.

| Doc Type | Load when | Reference |
|----------|-----------|-----------|
| ADR | Decision already made — need to capture context and consequences | `references/adr-template.md` |
| RFC | Change not decided — soliciting team feedback before committing | `references/rfc-template.md` |
| Architecture Proposal | System design or pattern change with trade-off analysis | `references/architecture-proposal-template.md` |
| Design Doc | Scoping new work — goals, non-goals, user stories, success metrics | `references/design-doc-template.md` |
