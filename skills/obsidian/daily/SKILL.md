---
name: daily
description: >-
  Runs the daily startup ritual for the Obsidian vault — creates today's
  periodic notes, surfaces carry-forward items, checks inbox, and sets the
  day's focus. Make sure to use this skill whenever the user says "start my
  day", "daily startup", "morning routine", "what's my focus today", "set up
  today's note", or runs /daily. A 5-minute structured startup beats 30
  minutes of reactive context-switching.
user-invocable: true
---

# Daily Startup

Structured morning ritual that creates periodic notes, surfaces what carried
forward from yesterday, checks the inbox, and locks in today's focus.

## Step 1 — Create Periodic Notes (no confirmation needed)

**Performance rule: batch all existence checks in parallel, then batch all template fetches in parallel, then create. Minimize round-trips.**

Get today's path and check if the daily note exists:

```bash
TODAY=$(obsidian daily:path)
obsidian daily:read 2>/dev/null
```

If missing, render from template and create:

```bash
obsidian template:read name="Daily Notes" resolve title="$TODAY"
obsidian create path="$TODAY" content="$PROCESSED_TEMPLATE" silent
```

**Template variable substitution** — if `resolve` doesn't substitute all variables, replace manually:
- `{{date}}` → `YYYY-MM-DD`
- `{{title}}` → note title
- `{{week}}` → `W05`
- `{{month}}` → `January`
- `{{quarter}}` → `Q1`
- `{{year}}` → `YYYY`

**NEVER create empty notes.** If template fetch fails, report the error.

Run these checks in parallel based on today's date, then create all missing notes:

| Period | Condition | Path | Template |
|--------|-----------|------|----------|
| Daily | always | `2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md` | `Daily Notes` |
| Weekly | Monday | `2 - Areas/Daily Ops/Weekly/M - Month YYYY/YYYY-Www.md` | `Weekly Planning` |
| Monthly | 1st of month | `2 - Areas/Goals/Monthly/M - Month YYYY.md` | `Monthly Goals` |
| Quarterly | Jan 1, Apr 1, Jul 1, Oct 1 | `2 - Areas/Goals/Quarterly/Quaterly Goals - QN YYYY.md` | `Quarterly Goals` |

**Note:** The quarterly FOLDER is `Quarterly/` but the FILE name uses the typo `Quaterly Goals - QN YYYY.md` — preserve this to match existing vault structure.

## Step 2 — Yesterday's Carry-Forward

**Always check carry-forward before setting today's priorities.**

Read yesterday's daily note:

```bash
YESTERDAY=$(date -v-1d +%Y/%Y-%m-%d)
obsidian read path="2 - Areas/Daily Ops/$YESTERDAY.md" 2>/dev/null
```

Extract any items marked "Carry Forward → Tomorrow" or similar. Prepend them
to today's note immediately:

```bash
obsidian daily:prepend content="**Carry forward from yesterday:**\n- [ ] Item 1\n- [ ] Item 2" silent
```

These are the first candidates for today's focus.

## Step 3 — Gather Context (run in parallel)

```bash
# Inbox count
obsidian files folder="0 - Inbox/" format=json

# Active projects
obsidian base:query path="MOCs/Active Projects.base" format=json 2>/dev/null || \
  obsidian files folder="1 - Projects/" format=json

# Open tasks
obsidian tasks todo daily
```

## Step 4 — Focus Interview (interactive)

Ask via `AskUserQuestion` with `multiSelect`:

> "Which projects are you focusing on today?"
> (list active projects from Step 3)

Then a single-select follow-up:

> "What's the single most important thing to finish today?"

## Step 5 — Update Daily Note

Update today's note sections in-place (never append new sections at the bottom):

```bash
obsidian daily:append content="..." silent
```

Or patch specific sections:

```bash
obsidian patch path="$TODAY" section="Focus" content="..."
obsidian patch path="$TODAY" section="Carry Forward" content="..."
```

## Report

After completion, tell the user:
- Which periodic notes were created (daily / weekly / monthly / quarterly)
- Inbox count (and flag if > 10 items — might need an ingest session)
- Carry-forward items surfaced from yesterday
- Confirmed today's focus
