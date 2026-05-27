---
name: spec
description: >-
  Turns requirements into structured specs before implementation. Accepts a
  Linear URL, GitHub issue URL, Jira URL, or plain text description. Use when
  the user says "write a spec for", "create a spec", "turn this into a spec",
  or pastes an issue URL (linear.app, github.com/*/issues/*, atlassian.net/browse/*).
  Always spec before implementing — rushing to code before aligning on scope is
  the #1 cause of rework.
user-invocable: true
argument-hint: "[linear-url, github-issue-url, or description]"
---

# Spec

## Two-Step Flow: Spec → Approve → Implement

The point of this skill is the pause. Generating a spec and waiting for approval before implementing ensures you and the user are aligned on scope before writing a line of code. Don't skip to implementation.

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

Display a brief summary (2–3 sentences) of what you fetched so the user can confirm you're working from the right source.

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

## Step 3 — Wait for Approval

Present the spec and ask: "Does this capture what you need? Any changes before I implement?"

Only offer to implement after the user explicitly approves. If they request changes, revise and re-present before offering to implement.

## Tips for Good Acceptance Criteria

Acceptance criteria should be testable by a QA engineer who wasn't in the room:
- Bad: "The form works correctly"
- Good: "Submitting with an empty email field shows an inline error message"

Each criterion should be falsifiable — you should be able to write a failing test before the feature exists.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Spec involves frontend — need performance, bundle, rendering, or accessibility checklist items | `references/frontend-spec-checklist.md` |
