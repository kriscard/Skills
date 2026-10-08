---
name: todays-focus
description: Get an optional, read-only briefing with today's constraints and up to three evidence-backed focus suggestions.
disable-model-invocation: true
---

# Today's Focus

AI gathers and compresses context; the user decides. This briefing is optional and is not a prerequisite
for `/daily`.

Read-only boundary: leave vault files, tasks, and calendars unchanged. Create no notes, plan files, or
commitments; keep `index.md` and `log.md` untouched.

## 1. Gather bounded context

Derive the real local date and read the vault's `AGENTS.md` for paths and ownership boundaries.
Use only these sources for the initial briefing:

1. The current weekly note, when it exists.
2. Active tasks in the primary task tracker, including explicitly assigned work, blockers, and deadlines.
3. Today's calendar, when a read-only connection is available.

Use configured integrations and repository instructions to identify the primary task tracker. If none
is identifiable, use tasks in today's existing daily note as a limited fallback and disclose the gap.
Bound task retrieval to the user's assigned active work and the calendar to today. Do not scan every
project, the Inbox, messages, Git history, or the whole vault.

Treat missing, stale, or inaccessible sources as limitations. Continue with available evidence rather
than asking the user to create context notes, connect tools, or fill out a form. A calendar gap is not
proof that the user has free time. Unfinished tasks and weekly intentions are candidates, not commitments.

If the user explicitly asks to consider another source, expand only to that source. If they already
have a clear plan and ask only for a check, assess that plan rather than replacing it.

Completion: each available source has been checked and missing or stale context identified.

## 2. Return a short briefing

Keep the entire response under 300 words, using only populated sections:

- **Constraints:** up to three verified schedule constraints, deadlines, or blockers.
- **Suggested focus:** up to three candidates, each with a brief reason and a source link or note path.
- **Questions:** zero to three optional questions, only for ambiguities that could materially change the choice.

Return fewer suggestions when the evidence is weak; zero is valid. Distinguish known facts from
recommendations. Do not turn availability guesses into facts or propose more work simply to fill slots.
If sources disagree, flag the conflict instead of silently choosing one.

Completion: the user can accept, edit, reject, or ignore a concise evidence-backed briefing.

## 3. Leave the decision with the user

Finish after the briefing; do not require answers or a follow-up ritual.

If the user wants to record selected candidates, offer the manual handoff:

> Run `/daily` with the selected tasks to record them.

`/daily` is user-invoked; finish this briefing without invoking it on the user's behalf.
