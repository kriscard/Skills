---
name: daily
description: >-
  Daily startup ritual for the Obsidian vault: create today's workday note, surface exact context,
  and require the user to choose one daily outcome and next action. Use for "start my day", "daily
  startup", "today's focus", or /daily.
user-invocable: true
---

# Daily Startup

A 5–10 minute workday startup. The note is a cockpit the user revisits, not an AI-generated report.

## 1. Workday gate

Derive the real local date and weekday.

- Monday–Friday: continue.
- Saturday/Sunday: do not create a note. Say weekend notes are intentionally off by default and ask whether the user explicitly wants one.

Completion: the run has a confirmed workday date or explicit weekend override.

## 2. Create missing periodic notes

Batch existence checks before creating anything.

| Period | Condition | Path | Template |
| --- | --- | --- | --- |
| Daily | every confirmed workday | `2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md` | `Daily Notes` |
| Weekly | Monday | `2 - Areas/Daily Ops/YYYY/YYYY-Www.md` | `Weekly Planning` |
| Monthly | first workday on/after month start | `2 - Areas/Goals/Monthly/M - Month YYYY.md` | `Monthly Goals` |
| Quarterly | first workday on/after quarter start | `2 - Areas/Goals/Quaterly/Quaterly Goals - QN YYYY.md` | `Quarterly Goals` |

Use `obsidian read`, then `obsidian template:read ... resolve`, then `obsidian create`. Never create an empty note. Preserve the `Quaterly` spelling.

Completion: today's note exists and every due periodic note exists or a concrete CLI failure is reported.

## 3. Gather context in parallel

Read:

- today's note;
- the current flat weekly note;
- the most recent prior workday note, including its exact `## Carry Forward` section;
- active projects from `MOCs/bases/Active Projects.base`, falling back to `1 - Projects/`;
- today's open tasks;
- Inbox count.

Treat carry-forward items as **candidates**, never commitments. Detect overload when the weekly note contains more than one outcome in a lane or today's note already contains multiple competing outcomes.

Completion: the user can see the relevant weekly lanes, exact carry-forward candidates with sources, and any overload warning.

## 4. Human commitment gate

Propose concise candidates from the gathered context, then ask the user to choose or write:

1. one **Daily Outcome**;
2. what **Done when** means;
3. one **Next Action**;
4. the first **Active Focus Block** finish line.

Do not choose these silently. Do not prepend carry-forward automatically. The user may edit the AI proposal manually in Obsidian instead of answering in chat; reread the note before writing anything else.

Completion: the outcome and next action are explicitly user-confirmed.

## 5. Update named sections

Write only the confirmed values into `Daily Outcome`, `Next Action`, and `Active Focus Block`.

Prefer a heading-targeted Obsidian patch tool when available. Otherwise show the exact replacement and use a read + overwrite flow only after approval. Never append duplicate headings.

Leave `Parking Lot`, `Work Notes`, `Ideas Worth Sharing`, and `Ready to Resume` ready for manual use during the day.

Completion: the daily note contains exactly one confirmed outcome, next action, and focus finish line.

## Report

Return only:

- notes created;
- exact carry-forward candidates surfaced;
- Inbox count;
- confirmed outcome, next action, and focus block;
- any overload warning.

If Obsidian CLI fails, say: "Obsidian CLI isn't working — update Obsidian with CLI enabled."
