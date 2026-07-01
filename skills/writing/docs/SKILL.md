---
name: docs
description: >-
  Reader-job technical documentation: READMEs, API docs, architecture docs, how-tos, RFCs,
  design docs, and ADRs. Use when writing, revising, or reviewing docs for other developers.
user-invocable: true
---

# Technical Documentation Writer

Write for the reader's job: what they came to understand, decide, or do. A technically correct doc
that does not serve that job is still a failed doc.

## Boundaries

- Use `blog` for publishable articles with an argument, story, or public-facing lesson.
- Use `tutorial` for learning-oriented step-by-step teaching with checkpoints.
- Use this skill for reference docs, team proposals, decision records, READMEs, API docs, and
  how-to docs whose primary purpose is work, review, or operation.

## Workflow

### 1. Name the doc type and reader job

Identify the document type before drafting: README, API docs, architecture docs, how-to, RFC,
design doc, architecture proposal, or ADR.

Complete when:

- the doc type is named
- the primary audience is named
- the reader job is stated as `Reader needs to <do/decide/understand> so they can <outcome>`
- missing inputs are requested before drafting

### 2. Load the matching reference

Use the routing table below. If a template or type-specific rule applies, load that reference before
writing.

Complete when the matching reference has been loaded, or no reference applies and that is stated.

### 3. Gather the minimum context

Ask only for context needed by the reader job:

- current state and desired outcome
- constraints, dependencies, and owners
- concrete examples, commands, APIs, or decisions
- known errors, risks, alternatives, or non-goals

Complete when every required placeholder in the selected template has either source material or an
explicit `TBD`/question for the user.

### 4. Draft for use, review, or decision

Lead with what the reader needs first. Show before explaining when the reader must do something;
state the decision or proposal before deep rationale when the reader must decide.

Complete when:

- the opening answers the reader job
- every section exists to help the reader do, decide, or understand something
- examples are realistic and include required setup/config/error handling when relevant
- uncertainties are marked instead of invented

### 5. Run the quality gate

Before delivering, verify:

- [ ] First sentence says what this is or what decision/proposal is being made
- [ ] Code examples or commands were run when an environment is available; otherwise marked unverified
- [ ] Required config, inputs, env vars, and permissions are documented
- [ ] Common errors or risks include what to do next
- [ ] Links referenced in the doc were checked when accessible
- [ ] Terminology is consistent: one name per concept
- [ ] No "simple" / "just" / "easy" for user actions

Complete when all applicable checks pass or failures are called out explicitly.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Decision already made; capture context, decision, and consequences | `references/adr-template.md` |
| 1 | Change not decided; solicit review before committing | `references/rfc-template.md` |
| 1 | Scoping new product work with goals, non-goals, user stories, and metrics | `references/design-doc-template.md` |
| 1 | System design or pattern change with trade-offs and migration concerns | `references/architecture-proposal-template.md` |
| 2 | Creating or revising a README | `references/readme-guide.md` |
| 2 | Creating or revising API documentation | `references/api-docs-guide.md` |
| 2 | Creating or revising a task-oriented how-to guide | `references/how-to-guide.md` |
