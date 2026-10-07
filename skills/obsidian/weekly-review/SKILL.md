---
name: weekly-review
description: Retrospective review of an existing completed weekly Obsidian note.
disable-model-invocation: true
argument-hint: '[ISO week — omit for the most recently completed week]'
---

# Weekly Review

Review what happened in one completed week. This skill does not create the next weekly plan or edit
monthly, quarterly, or yearly goals.

## 1. Confirm the review period

Read `AGENTS.md`, resolve the requested or most recently completed ISO week, and identify its weekly
note from the live vault convention. Ask when a partial or current week makes the period ambiguous.

The weekly note must already exist and be complete enough to review. If it is missing or still being
written, stop and ask the user to finish it first.

Completion: one existing completed weekly note and exact date range are confirmed.

## 2. Gather evidence

Read:

- the weekly note;
- daily notes within its date range;
- notes explicitly linked from those notes;
- active goals and projects only when needed to evaluate stated alignment.

Extract original commitments, outcomes, unfinished work, decisions, blockers, friction, unplanned
wins, and lessons. Cite a source note for each claim. Missing notes are evidence gaps, not proof of
inactivity.

Completion: each proposed review claim has a source or an explicit user correction.

## 3. Close each commitment

For every commitment recorded in the weekly note, have the user confirm one state:

- complete;
- intentionally carried forward, with its destination;
- retired.

Keep unplanned accomplishments under Unplanned Wins rather than rewriting the original plan.

Completion: every original commitment has one confirmed closure state.

## 4. Draft the retrospective

Prepare only:

- commitment outcomes with evidence;
- unplanned wins;
- decisions and lessons worth preserving;
- friction;
- Keep / Change / Remove;
- confirmed carry-forward candidates.

Report goal alignment as evidence, but do not revise goals. When evidence suggests an objective
needs changing, offer `/goals` after the review.

## 5. Approve, write, and verify

Show the complete retrospective draft before writing. After approval, update only the reviewed
weekly note through the `vault` safe-write flow. Preserve the original plan and existing
human-written content. Reread and verify that each commitment has exactly one closure state.

Return the closure summary, unplanned wins, Keep / Change / Remove, confirmed carry-forward, and
unresolved evidence gaps.
