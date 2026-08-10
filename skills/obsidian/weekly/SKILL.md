---
name: weekly
description: Review one week of Obsidian evidence and prepare the next weekly note.
disable-model-invocation: true
---

# Weekly Review

An approval-gated weekly closure and planning ritual.

A **commitment** is an outcome explicitly chosen for one week. Active projects are candidates, not
commitments. The reviewed weekly note owns its closure; the next weekly note owns the next
commitments.

## 1. Resolve the review

Determine:

- whether the user wants review, planning, or both;
- the ISO week being reviewed;
- the ISO week being planned.

Canonical path:

`2 - Areas/Daily Ops/<ISO week year>/<YYYY-Www>.md`

Ask when a partial week makes the intended period ambiguous.

Completion: the operation and exact week paths are confirmed.

## 2. Gather review evidence

For the reviewed week, read in parallel:

- its weekly note, when present;
- Monday–Friday daily notes;
- notes explicitly linked from those notes;
- active monthly and quarterly goals;
- the previous weekly note when continuity matters.

Extract planned commitments, completed and unfinished work, decisions, blockers, friction, unplanned
accomplishments, radar items, and credible next actions. Cite the source note for every extracted
claim. Missing or sparse notes are evidence gaps, not evidence of inactivity.

Completion: every existing weekly commitment and every proposed accomplishment has a source or an
explicit user correction.

## 3. Close the reviewed week

For every commitment recorded in the reviewed weekly note, ask the user to confirm one state:

- `complete`;
- `scheduled`, with a real future week or calendar cue;
- `retired`.

Record completed work outside the original commitments under `Unplanned Wins`. Preserve the
original plan rather than adding retrospective commitments to it.

Prepare a closure draft containing:

- commitment states and evidence;
- unplanned wins;
- evidence worth keeping;
- friction;
- Keep / Change / Remove.

Present the draft before writing.

Completion: every planned commitment has one confirmed closure state and every closure claim has
evidence or an explicit user correction.

## 4. Discover candidate work

Query the project index first:

```bash
obsidian base:query path="MOCs/bases/Active Projects.base" format=json
```

If the Base is unavailable, fall back to:

```bash
obsidian files folder="1 - Projects/" format=json
```

Both commands provide discovery, not active status. Group support files under their top-level project
and resolve one canonical project note. A root-level project file is canonical; for a project folder,
prefer a same-named note or the note carrying the project's outcome, deadline, and status. Ask when
the canonical note is ambiguous.

Read each canonical note's outcome, deadline, status, current state, and next action. Exclude completed
or inactive projects based on their metadata, not the Base name or folder location. Also gather
non-project candidates from active goals, the reviewed week's radar and friction, recent daily-note
evidence, and work supplied by the user.

If project metadata is missing or stale, surface the discrepancy and offer an approval-gated
`/project` update. Weekly consumes project state; it does not maintain project lifecycle.

Completion: every candidate is identified as a project or non-project commitment and carries a
source.

## 5. Choose the next commitments

Present the candidates as options, not commitments. Ask the user what deserves focus in the planned
week. The user may choose, rename, combine, or introduce any outcome.

For every chosen commitment, confirm:

- outcome;
- done-when condition;
- appetite;
- first visible action;
- reason it matters this week.

Link project commitments to their project notes. Place Area responsibilities, learning, maintenance,
and other work under `Other Commitments`. Surface competing independent outcomes as an overload
question.

Nothing rolls forward automatically. A scheduled commitment enters the future weekly note only when
the user explicitly accepts it there.

Completion: every next-week commitment is explicitly chosen and has a checkable done-when condition
and first action.

## 6. Write the notes

After approval:

1. update the reviewed note's closure sections;
2. create or update the planned weekly note with only the confirmed commitments.

Use `Templates/Weekly Planning.md` when creating a note. Preserve existing human-written content.
Prefer heading-targeted patching; otherwise show the exact replacement before using read +
overwrite. Keep one copy of every heading.

Completion: the reviewed note contains the confirmed retrospective and the planned note contains
the confirmed commitments without duplicated outcomes or headings.

## Report

Return:

- reviewed commitment closures;
- unplanned wins;
- Keep / Change / Remove;
- the next confirmed commitments;
- unresolved evidence gaps, project updates, or scheduling decisions.

If Obsidian CLI fails, say: "Obsidian CLI isn't working — update Obsidian with CLI enabled."
