---
name: goals
description: >-
  Obsidian goals review for quarterly, monthly, or weekly goal notes. Use when the user asks to
  review goals, run an OKR check-in, update goals, set monthly goals, check whether goals are on
  track, or runs /goals.
user-invocable: true
argument-hint: '[quarterly | monthly | weekly — omit to choose]'
---

# Goals Review

Check-in and update goal notes across quarterly, monthly, and weekly levels. Goal reviews only
matter if they connect to action — this skill always ends with concrete next steps, not just status
updates.

## Ask, Don't Assume

Shared principle (canonical version in the `vault` skill): never guess, deduce, or fill gaps with
assumptions about the user's notes, priorities, or intent. If you don't know — a date range, what
counts as a win, which goals are active — **ask**. Before writing any synthesis or judgment into a
note, show your draft with its source and get explicit confirmation. Missing data is not permission
to invent.

## Step 1 — Determine Review Level

If `$ARGUMENTS` is provided, validate it against `quarterly`, `monthly`, or `weekly`. If it is
missing or anything else, ask via `AskUserQuestion`:

> "Which goals review would you like?"
>
> - Quarterly
> - Monthly
> - Weekly

## Step 2 — Load Context (run in parallel)

```bash
# OKR dashboard
obsidian base:query path="2 - Areas/Goals/OKR Dashboard.base" format=json 2>/dev/null

# Active projects (goal alignment check)
obsidian files folder="1 - Projects/" format=json
```

## Step 3 — Level-Specific Workflow

### Weekly Review

Read this week's note using the same path logic as the `weekly` skill. Derive the month folder and
ISO week from the week being reviewed, not hardcoded placeholders:

```bash
WEEK="<ISO week-year>-W<week>"          # e.g. 2026-W01; use ISO week-year for cross-year weeks
MONTH="M - <Month YYYY from reviewed week>"
obsidian read path="2 - Areas/Daily Ops/Weekly/$MONTH/$WEEK.md"
```

Check: are this week's planned priorities covered by monthly goals? Identify any monthly goals with
no weekly activity. Set next week's top 3 priorities.

Update the weekly note's "Next Week Focus" section.

### Monthly Review

```bash
MONTHLY="2 - Areas/Goals/Monthly/M - $(date +'%B %Y').md"
obsidian read path="$MONTHLY" 2>/dev/null || \
  obsidian create path="$MONTHLY" template="Monthly Goals"
```

Check quarterly progress: which quarterly objectives is this month advancing? Flag at-risk goals
only when source-bound evidence exists: a missed milestone, elapsed due date, explicit blocker, or
user-confirmed concern. Otherwise frame it as a question to verify.

Update with: progress status per goal, adjustments, and next month's focus.

### Quarterly Review

Read the current quarterly note:

```bash
# Note: folder and file use "Quaterly" spelling — preserve exactly.
# Derive Q<N> and YYYY from the review date.
QTR_PATH="2 - Areas/Goals/Quaterly/Quaterly Goals - Q<N> YYYY.md"
obsidian read path="$QTR_PATH" 2>/dev/null
```

For a **mid-quarter check-in**: assess progress, flag at-risk objectives only from missed milestones,
elapsed due dates, explicit blockers, or user-confirmed concerns, and surface blockers.

For a **quarter wrap + new quarter**: review previous quarter outcomes (hit / partial / missed),
extract learnings, then set new quarterly objectives broken into monthly milestones.

Ask via `AskUserQuestion`: "Is this a check-in or quarter transition?"

For new quarter setup, create the new quarterly note:

```bash
obsidian create path="2 - Areas/Goals/Quaterly/Quaterly Goals - Q<N> YYYY.md" \
  template="Quarterly Goals"
```

## Step 4 — Update the Goal Note

Update the relevant note with:

- Progress status per objective, with source evidence
- Adjustments to goals (if circumstances changed)
- Next actions tied to each objective

The CLI has no `patch`. If the update can append to the note, use `obsidian append`. If it must
change a specific section, ask the user: MCP `obsidian_patch_content` (heading-targeted) or `read` +
`create ... overwrite`. Always show a preview before writing and wait for explicit approval.

## Gotchas

- The quarterly folder is `Quaterly` (not "Quarterly") — this is a known vault typo. Match it
  exactly or file creation will break.
- Don't create a new quarterly note mid-quarter — read the existing one.
- Don't mark a goal "missed" without asking if it should be adjusted instead. Goals can be refined;
  they shouldn't just silently fail.
