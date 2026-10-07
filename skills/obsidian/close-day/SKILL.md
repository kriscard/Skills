---
name: close-day
description: End-of-day ritual that records a resume state, triages sharing receipts, and confirms carry-forward.
disable-model-invocation: true
---

# Close Day

Close today's active loop without turning the ritual into a portfolio review.

## 1. Load today's cockpit

Read `AGENTS.md`, resolve today's note, and inspect the schema-defined sections corresponding to:

- daily outcome and next action;
- active focus and work notes;
- ideas or receipts worth sharing;
- ready-to-resume state;
- carry-forward items.

If the note is missing, stop and offer `/daily`. Sparse sections trigger a question, not an
inference of inactivity.

Completion: current state, unresolved work, and captured receipts are visible.

## 2. Record a resume state

Have the user confirm:

- outcome state: complete, deliberately stopped, or blocked;
- what is now true;
- the next visible action;
- the file, link, or command needed to resume.

Draft one concise resume state and obtain approval before writing it.

Completion: future-you can resume without reconstructing the task.

## 3. Triage receipts

For every captured sharing idea, ask for one decision:

- **Promote:** hand the sourced idea to `capture-receipt`.
- **Defer:** leave it for the weekly review.
- **Discard from pipeline:** remove its sharing candidacy without deleting the underlying work note.

Only explicitly public-safe material may proceed to publication drafting. Never publish, claim
publication, or expose confidential information.

Completion: each receipt is promoted, deferred, or discarded.

## 4. Confirm carry-forward

Extract unfinished promises and blockers with source locations. Ask which items truly belong to the
next workday. Prepare one canonical carry-forward section containing only confirmed items.

Nothing rolls forward automatically; unselected work remains in its source system.

Completion: tomorrow's candidates are confirmed and no commitment was inferred.

## 5. Write and verify

Preview all named-section changes together. After approval, use the `vault` safe-write flow and
respect ownership declared in `AGENTS.md`. Reread the note and verify the resume state and single
carry-forward section.

Return only the outcome state, resume action, receipt decisions, confirmed carry-forward, and any
unresolved item.
