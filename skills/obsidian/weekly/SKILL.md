---
name: weekly
description: >-
  Weekly Obsidian review and planning: close workday evidence, choose up to one outcome per lane,
  schedule protected blocks, and prepare Markly, teaching, and publishing actions. Use for "weekly
  review", "plan next week", writing prep, or /weekly.
user-invocable: true
---

# Weekly Review

Weekly portfolio review: decide, close, and prepare. Balance is weekly, not daily.

## 1. Resolve the week

Derive the requested ISO week. Ask only when the user could mean the current or previous partial week.

Canonical path:

`2 - Areas/Daily Ops/<ISO week year>/<YYYY-Www>.md`

Read it or create it with template `Weekly Planning`. Review Monday–Friday daily notes by default; missing or sparse notes are gaps to ask about, not evidence of inactivity.

Completion: the correct flat weekly note and workday range are confirmed.

## 2. Gather evidence in parallel

Read:

- workday daily notes;
- TIL notes and teach lesson/learning-record links from the week;
- the active monthly and quarterly goals;
- `1 - Projects/Public Technical Presence/Public Technical Presence.md`;
- explicit project evidence linked from daily notes;
- prior weekly outcomes and statuses.

Extract accomplishments, decisions, blocked work, sharing receipts, and protected-block evidence. Cite source notes. Do not rank by activity volume.

Completion: every proposed highlight or outcome state has a source.

## 3. Close the current portfolio

The four lanes are:

1. Roofr Leverage
2. Markly
3. Learning
4. Public Artifact

For each lane:

- no outcome → `not-planned`;
- planned outcome → user chooses `complete`, `scheduled`, or `retired`.

There is no automatic rollover. A scheduled item must have a real future week or calendar cue. Show the closure draft and require confirmation before writing.

Completion: every lane has one allowed status and every planned lane has evidence or an explicit user correction.

## 4. Choose next week's portfolio

Ask the user to choose **up to one** outcome per lane. `not-planned` is valid.

For each planned lane, require:

- outcome;
- done-when condition;
- appetite;
- first visible action.

Challenge independent workstreams that can reuse the same evidence. Prefer one real problem producing work progress, a teach session, a durable note, and possibly a public post.

Completion: no lane has more than one outcome and every planned lane has a first action.

## 5. Protect personal blocks

Prompt the user to place these in the personal calendar:

- Wednesday Markly: 2–3 hours;
- teach session completed by Thursday: 60–90 minutes;
- publication block late week or early next week: about 60 minutes.

Do not create events or claim they exist without an approved calendar integration. Workday gaps remain unscheduled bonus capacity.

Teaching workspace:

`/Users/kriscard/projects/learning/full-stack-through-markly`

Before suggesting `/teach`, verify that the workspace exists. If the user asks to start the session, run `pwd` and compare its resolved path with the configured workspace. When they differ, stop without invoking `/teach` and provide exactly:

```bash
cd /Users/kriscard/projects/learning/full-stack-through-markly
```

Then tell the user to start a new Pi/Claude session there and invoke `/teach`. Never run `/teach` from the vault root or another working directory.

Completion: block placement is confirmed or explicitly left unresolved, and any teach invocation is guarded by an exact working-directory match.

## 6. Prepare the next actions

Write:

- Markly first action;
- teach topic and workspace—the first pilot candidate is CodeRabbit AI customization for Markly;
- publishing source receipt and first action.

For writing prep, rank only evidence-backed receipts. Offer `tweet-today` for a small artifact or `blog` for an angle-first outline. One post per week is the commitment; optional extras never become debt.

Completion: next week can start without re-deciding these actions.

## 7. Update the weekly note and publishing project

Write confirmed evidence, statuses, next outcomes, calendar confirmations, and Keep / Change / Remove into the existing named sections. Lane `Status` fields are the single source of closure state; do not create a second status list.

After the user chooses the public artifact, offer an exact approval-gated update to `## 📌 Current Weekly Artifact` in the LLM-owned Public Technical Presence project. Include week, outcome, source receipt, state, and published URL when available. When publication is explicitly confirmed, append one `## 🚀 Published` table row containing week, date, artifact, public URL, and source receipt. Do not alter other project sections without approval.

Prefer heading-targeted patching; otherwise show the exact rewrite before approval. Never duplicate headings.

## Report

Return:

- current lane closures;
- next week's planned and not-planned lanes;
- block-placement confirmation;
- prepared Markly, teach, and publishing actions;
- any goal with no verified progress as a question, not a judgment.

If Obsidian CLI fails, say: "Obsidian CLI isn't working — update Obsidian with CLI enabled."
