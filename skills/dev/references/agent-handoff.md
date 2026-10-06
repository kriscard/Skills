> **Read this when:** the user requests a handoff to a named person, agent, or
> workflow. Confirm the receiver and requested next action before writing it.

# Agent Handoff

A handoff points the receiver to the real request, reviewed revision, evidence,
and remaining work. Link source artifacts instead of restating them. Include only
claims supported by completed work or clearly mark them as risks or incomplete.

```markdown
# Handoff: [Outcome]

## Request
- Source: [issue, plan, specification, or message]
- Reviewed revision: [commit, branch, PR, document version, or date]
- Intended outcome: [one sentence]

## What changed
- [User-visible or system change]
- [Important implementation boundary]

## Validation
- `[command]` → [result]
- [browser, integration, migration, or operator proof] → [result]

## Evidence
- Diff: [link or revision]
- Screenshots, HTML, logs, or reports: [links]

## Deviations and decisions
- [Difference from the request and why]
- [New decision recorded elsewhere]

## Risks and incomplete work
- [Known risk, skipped proof, or follow-up]

## Next action
[Review, revise, merge, deploy, investigate, or hand to another owner.]
```

Use `Not applicable` or omit a bullet when a section legitimately has no content.
Never present planned validation as completed evidence.
