---
name: close-day
description: >-
  End-of-day Obsidian ritual: close the active focus loop, triage Ideas Worth Sharing, and confirm
  tomorrow's carry-forward. Use for "close my day", "end of day", "wrap up today", or /close-day.
disable-model-invocation: true
---

# Close Day

A 5–10 minute closure ritual, not a generated daily report.

## 1. Load the cockpit

Read today's workday note and parse only these named sections first:

- `Daily Outcome`
- `Next Action`
- `Active Focus Block`
- `Parking Lot`
- `Work Notes`
- `Ideas Worth Sharing`
- `Ready to Resume`
- `Carry Forward`

If the note is missing, stop and suggest `/daily`. If sections are sparse, ask what happened; do not infer inactivity.

Completion: the current state, unresolved commitments, and captured sharing ideas are visible.

## 2. Close the active loop

Ask the user to confirm or edit:

- outcome state: complete / deliberately stopped / blocked;
- what is now true;
- the next visible action;
- the file, link, or command to reopen.

Write one credible `Ready to Resume` state. Do not restart the whole portfolio or generate a long retrospective.

Completion: future-you can resume without reconstructing the task.

## 3. Triage Ideas Worth Sharing

For every non-empty receipt, ask for one decision:

- **Promote** — durable enough for `Public Technical Presence`;
- **Defer** — keep in the daily note for the weekly review;
- **Discard** — remove it from the publishing pipeline without deleting the underlying work note.

On promotion, preserve receipt ID, idea/lesson, proof, project, daily-note backlink, source session, and safety state. Hand off to `capture-receipt` for the approved write and offer:

1. save only;
2. draft a tweet now through `tweet-today`;
3. create a blog outline through `blog`.

Never publish, claim publication, or expose private Roofr information. Anything marked `no` or `needs review` stays private until the user explicitly clears it.

Completion: every captured sharing idea is promoted, deferred, or discarded.

## 4. Confirm tomorrow candidates

Extract promises, blockers, and unfinished work from today's note. Show exact source lines and ask what truly belongs tomorrow.

Update exactly one `## Carry Forward` section with confirmed tomorrow items only. Unselected work stays in its source system or weekly radar; it does not become silent debt.

Completion: the note has one canonical Carry Forward section and no inferred commitments.

## 5. Optional project maintenance

Only propose a project update when today's note contains meaningful status, decision, or insight evidence.

- Never modify a human-written note without `source: claude-memory`.
- For an LLM-owned project note, show the exact named-section change and require approval.
- Public Technical Presence writes are limited to its receipt/draft/published sections.

Completion: protected notes remain untouched and approved LLM-owned updates are targeted.

## Report

Return only:

- outcome state and ready-to-resume action;
- receipt decisions and any handoff started;
- confirmed Carry Forward items;
- optional approved project update.

If Obsidian CLI fails, say: "Obsidian CLI isn't working — update Obsidian with CLI enabled."
