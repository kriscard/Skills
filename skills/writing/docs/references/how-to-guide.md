> **Read this when:** writing task-oriented how-to documentation for someone trying to complete a specific operation.

# How-To Guide

A how-to guide gets the reader from current state to completed task with minimal detours.

## Rules

- Use a task-oriented title: "How to add authentication," not "Authentication."
- State prerequisites and link to setup; do not reteach them inline.
- Order steps by dependency. Step N should build on step N-1.
- Each step has one action and one expected result.
- Include rollback or cleanup steps when the operation mutates state.

## Step Shape

```markdown
## Step N: [Action]

Why this step matters in one sentence.

[Command or edit]

Expected result: [observable output/state]
```

## Completion Gate

The guide is ready when every step has an observable result and the reader can tell whether they are safe to continue.
