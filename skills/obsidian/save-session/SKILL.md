---
name: save-session
description: Save a dated Obsidian recap of the current agent session, including outcomes, decisions, useful examples, changed files, and deferred work.
disable-model-invocation: true
argument-hint: '[optional context or session title]'
---

# Save Session

Preserve what happened in this session so the user can resume or understand it later. This is a dated
record, not an Atomic Note and not a replacement for the issue tracker. Use `create-note` separately
when a lesson deserves reusable Knowledge.

## 1. Establish the evidence

Read `../vault/SKILL.md` and the live `AGENTS.md`. Review the available conversation and its tool
results. Incorporate supplied context without treating a request or attempted action as a completed
result. If history was compacted or unavailable, state the coverage limit.

Collect outcomes, decisions and reasons, useful examples, changed files, verification results, and
work deliberately deferred. Separate pre-existing changes from work performed in this session.
Exclude credentials, secrets, and unnecessary personal or workplace data.

Completion: every claimed outcome has session evidence; failures and unverified work remain explicit.

## 2. Resolve the session note

Use the real local date, a short descriptive title, and the schema-defined session directory. Inspect
any existing note with the same title/date. Ask before updating it; otherwise choose a distinct path.
Never overwrite a previous session merely because it happened on the same day.

Read a live session template if one exists. Otherwise use this outline with the session metadata
required by the schema:

```markdown
# Session title

## Summary
What this session was about and how it ended.

## What was done
Verified actions and outcomes.

## Decisions
What was chosen, why, and relevant alternatives.

## Useful examples
Commands, code, or explanations worth keeping.

## Changed files
Paths and the purpose of each session change.

## Deferred work
Unfinished work, known limitations, and questions left open.
```

Omit sections without evidence. Account for every known session-changed file, grouping repetitive
paths only when the complete file list remains available in a linked receipt. Include useful detail
without dumping the transcript or raw tool output. Keep planned and completed work distinct.

Completion: the path is collision-safe and the draft records both outcomes and remaining work.

## 3. Preview, save, and verify

Show the complete note and required log entry for approval. Write through the vault safe-write flow,
reread the note, and verify metadata, links, and the approved log append. Report partial failures.

Keep daily notes unchanged. The inspiration's automatic daily append is not part of this vault's
permissions. Session records do not need wiki-index entries; offer a separate `create-note` proposal
for reusable explanations or questions, without creating them as a side effect.

Completion: the approved recap and log entry exist, no unrelated note changed, and the saved path plus
any useful Knowledge candidates are reported.

## Design source

Adapted from [Fred Oliveira's done skill](https://github.com/fredoliveira/agents/blob/main/skills/done/SKILL.md):
retain decisions, examples, changed files, and deferred work. Use this vault's paths, ownership,
approval, and safe-write rules rather than copying its shell writes or daily-note append.
