---
name: close-day
description: Review today's daily log, mark confirmed tasks complete, and optionally capture what changed.
disable-model-invocation: true
---

# Close Day

A lightweight, optional check-in. The daily note remains the user's log, not a status report.

## 1. Read today's log

Read the vault's `AGENTS.md` and `../vault/SKILL.md` for paths, ownership, and safe writes.
Resolve today's note using the real local date, on weekdays or weekends alike.

If the note is missing, stop and offer `/daily`; do not create it as a side effect.
Read `## Today`. For an older-format note, read the existing entries without migrating its structure.
Show unchecked tasks briefly as unresolved entries, not assumed commitments for tomorrow. Ignore empty
checkbox placeholders. Sparse notes are evidence gaps, not proof of inactivity.

Completion: today's recorded entries and unresolved tasks are visible.

## 2. Ask one optional question

> What changed today, and is there anything you don't want to forget?

If the user already supplied this information, use it without asking again. If they have nothing to
add or correct, finish without modifying the note.

Use only explicit user confirmation to:

- mark an existing task complete;
- append thoughts, events, observations, or links as ordinary bullets;
- append a short `Resume:` bullet only when the user explicitly requests a reminder for resuming work.

Preserve the user's voice. Leave unresolved tasks where they are; no automatic migration, external
activity reconstruction, sharing-idea triage, or additional questionnaire.

Completion: the requested changes are clear, or there is nothing to write.

## 3. Write and verify

Preview the exact changes and obtain approval using the vault safe-write flow. Update confirmed
checkboxes in place and append new bullets under `## Today`. For an older-format note without that
heading, append the approved bullets at the end; preserve its existing sections.

Keep shutdown, carry-forward, idea-triage, and resume sections out of this operation. Do not change
other notes or external systems.

Reread the affected content and verify that unrelated entries were preserved and every change traces
to the user's confirmation. Return the note path and exact changes, or state that nothing changed.
