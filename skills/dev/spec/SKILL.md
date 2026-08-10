---
name: spec
description: >-
  Creates an approval-gated spec for non-trivial feature work from an issue URL
  or requirements text. Use when the user asks for a spec/PRD, pastes a Linear,
  GitHub issue, or Jira URL, or requests implementation where scope is ambiguous
  enough to need acceptance criteria before coding.
disable-model-invocation: true
argument-hint: "[linear-url, github-issue-url, or description]"
---

# Spec

## Approval-Gated Flow: Spec → Approve → Implement

The point of this skill is the pause. Generating a spec and waiting for
approval before implementing ensures you and the user are aligned on scope
before writing code. Do not skip to implementation.

## Step 1 — Detect Source and Fetch Context

**Linear URL** (`https://*.linear.app/*/issue/*`):
```
mcp__plugin_linear_linear__get_issue
```

**GitHub issue URL** (`https://github.com/*/issues/*`):
```bash
gh issue view <number> --json title,body,labels,assignees
```

**Jira URL** (`https://*.atlassian.net/browse/*`):
Use WebFetch to retrieve the page content.

**Plain text**: treat the input as the raw requirement and proceed.

Display a brief summary (2–3 sentences) of what you fetched so the user can
confirm you're working from the right source.

If the source cannot be fetched or key scope details are missing, stop with the
missing facts and proposed assumptions; do not invent acceptance criteria.

## Step 2 — Generate the Spec

```markdown
# Spec: [Title]

## Problem
What user pain or business need does this address? Why does it matter now?

## Solution
What are we building? Describe the approach, not the implementation details.

## Acceptance Criteria
- [ ] Specific, testable condition 1
- [ ] Specific, testable condition 2
- [ ] Edge cases and error states are handled

## Out of Scope
Explicit list of what this does NOT include. This prevents scope creep.

## Technical Notes
Dependencies, migration needs, API contracts, performance constraints.
Leave empty if there's nothing notable.
```

Done only when the spec includes problem, solution, testable acceptance
criteria, out-of-scope boundaries, and technical notes or an explicit "none".

## Step 3 — Wait for Approval

Present the spec and ask: "Does this capture what you need? Any changes before I implement?"

Only offer to implement after the user explicitly approves. If they request changes, revise and re-present before offering to implement.

## Missing Context Stop Criteria

Stop and ask for clarification when:

- the issue/source cannot be fetched
- the user pain or success condition is unclear
- acceptance criteria would require inventing product behavior
- out-of-scope boundaries are material but unknown
- dependencies, migrations, or API contracts are likely but unspecified

## Tips for Good Acceptance Criteria

Acceptance criteria should be testable by a QA engineer who wasn't in the room:
- Bad: "The form works correctly"
- Good: "Submitting with an empty email field shows an inline error message"

Each criterion should be falsifiable — you should be able to write a failing test before the feature exists.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Spec involves frontend — need performance, bundle, rendering, or accessibility checklist items | `references/frontend-spec-checklist.md` |
