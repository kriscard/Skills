---
name: daily
description: Daily startup ritual that creates today's Obsidian note and confirms one outcome and next action.
disable-model-invocation: true
---

# Daily Startup

Run a short workday startup. This skill owns today's note only; `goals` owns monthly, quarterly, and
yearly objectives, while `weekly-review` owns retrospective weekly review.

## 1. Confirm the date

Derive the real local date and weekday.

- Monday–Friday: continue.
- Saturday/Sunday: ask whether the user explicitly wants a weekend note before creating one.

Completion: the workday date or weekend override is confirmed.

## 2. Resolve today's note

Read `AGENTS.md` and derive the current daily-note path and template from the live vault. Check
whether today's note exists. If it does not, resolve the current daily template, preview the target,
and create a non-empty note safely.

Do not create weekly or goal notes as a side effect. If expected periodic context is missing, report
it and offer the appropriate ritual instead.

Completion: today's note exists and its expected sections are known.

## 3. Gather context

Read in parallel when available:

- today's note;
- the current weekly note as context only;
- the most recent prior workday note and its exact carry-forward section;
- active projects from the live project index, falling back to current project files;
- today's open tasks;
- Inbox count.

Carry-forward items are candidates, not commitments. Flag competing outcomes rather than silently
choosing among them.

Completion: the user can see sourced candidates, relevant weekly context, and any overload warning.

## 4. Confirm today's commitment

Propose concise candidates, then have the user confirm or write:

1. one Daily Outcome;
2. a checkable Done When condition;
3. one Next Action;
4. the first Active Focus Block finish line.

The user may edit in Obsidian instead; reread before continuing. Never silently promote a candidate.

Completion: all four values are explicitly confirmed.

## 5. Update and verify

Preview the exact named-section changes. After approval, update only the daily commitment sections
using the safe-write flow from `vault`. Do not duplicate headings or overwrite work-log sections.
Reread the note and verify one confirmed outcome, next action, and focus finish line.

Return only created files, sourced carry-forward candidates, Inbox count, the confirmed commitment,
and unresolved warnings.
