---
name: weekly
description: >-
  Runs the weekly review ritual — reads daily notes, surfaces TIL notes from the week, synthesizes
  accomplishments and learnings, and checks goal alignment. Also surfaces candidate topics for
  writing by mining patterns and insights from the week's notes. Make sure to use this skill
  whenever the user says "weekly review", "weekly learnings", "what did I learn this week", "write
  my weekly note", "prep my weekly writing", "surface this week's ideas", or runs /weekly. A
  15-minute weekly synthesis turns scattered daily notes into retained knowledge that actually
  compounds.
user-invocable: true
---

# Weekly Review

Synthesize the week into a single coherent note. The goal is not to log what happened — it's to
extract what you'll actually remember and carry forward.

## Ask, Don't Assume

Shared principle (canonical version in the `vault` skill): never guess, deduce, or fill gaps with
assumptions about the user's notes, priorities, or intent. If you don't know — a date range, what
counts as a win, which goals are active — **ask**. Before writing any synthesis or judgment into a
note, show your draft with its source and get explicit confirmation. Missing data is not permission
to invent.

## Step 1 — Read/Create This Week's Note

```bash
WEEK=$(date +%Y-W%V)
MONTH=$(date +"%B %Y" | sed 's/^/M - /')
WEEKLY_PATH="2 - Areas/Daily Ops/Weekly/$MONTH/$WEEK.md"

obsidian read path="$WEEKLY_PATH" 2>/dev/null || \
  obsidian create path="$WEEKLY_PATH" template="Weekly"
```

## Step 2 — Gather This Week's TIL Notes

```bash
obsidian files folder="3 - Resources/TIL/" format=json
```

Filter for files created or modified this week (ISO week number from filename `til-YYYY-MM-DD.md`).
Read each matching TIL note.

## Step 3 — Read Daily Notes for the Week

Compute the actual dates for this week and read each day's note (don't hardcode the year or assume a
Mon–Fri week — derive the real dates):

```bash
# Resolve each YYYY-MM-DD in the current week, then:
obsidian read path="2 - Areas/Daily Ops/$(date +%Y)/<YYYY-MM-DD>.md" 2>/dev/null
```

If you're unsure which date range to cover (e.g. the user means last week, or a partial week), **ask
before reading.** If a day's note is missing or sparse, do not conclude the day was idle — note the
gap and ask the user what happened.

Extract from daily notes:

- **Accomplishments**: things completed or shipped
- **Carry-forward items**: anything marked for "next week" or unresolved
- **Key decisions**: any choices made that shaped direction
- **Energy/focus notes**: only if the user tracks these — don't invent them

## Step 4 — Synthesize into Weekly Note Sections

Write these sections into the weekly note:

| Section             | Content                                                |
| ------------------- | ------------------------------------------------------ |
| **Highlights**      | 3–5 bullet accomplishments worth remembering           |
| **What I Learned**  | Distilled from TIL notes — key insights, not summaries |
| **Carry Forward**   | Unfinished items moving to next week                   |
| **Next Week Focus** | Top 1–3 priorities (from carry-forward + goal check)   |

**Draft each section from the notes, then show the user what you extracted and the source for each
item before writing anything.** Don't decide what counts as a highlight or a priority on their
behalf — propose, let them correct or cut, then write only the confirmed version.

The CLI has no `patch`, so filling these named sections means either the MCP
`obsidian_patch_content` tool (heading-targeted) or a `read` + `create ... overwrite` rewrite of the
whole note. Ask the user which to use, then write each section's content.

## Step 5 — Check Goal Alignment

Read active monthly/quarterly goals:

```bash
MONTHLY_PATH="2 - Areas/Goals/Monthly/M - $(date +'%B %Y').md"
obsidian read path="$MONTHLY_PATH" 2>/dev/null
```

Ask: are this week's accomplishments connected to monthly objectives?

Flag any goals that saw zero progress this week — not to guilt-trip, but because consistent drift
means the goal should be adjusted or dropped.

Set **Next Week Focus** from the user's stated priorities — ask them directly which 1–3 things
matter most next week. Don't infer the focus from activity volume or what looks unfinished.

## Report

After synthesis:

- Confirm which weekly note was created/updated
- List the TIL notes pulled in
- Surface any goals with zero weekly progress
- Show the carry-forward count for next week

## Writing Prep Mode

When the user wants candidate topics for writing (not note synthesis), output to terminal only — no
file creation.

Read previous weekly learnings for continuity:

```bash
obsidian search query="Weekly Learnings" format=json
# Read the most recent one — extract threads opened but unresolved
```

Then present:

```
WEEKLY LEARNINGS PREP — Week [N], [YYYY]

FROM LAST EDITION:
- [Thread from previous that developed further this week]
- [Promise made that can now be addressed]

CANDIDATE TOPICS (ranked by depth + relevance):
[#]. [Topic] — [Project/Area]
    What happened: [specific events or decisions]
    The insight: [the non-obvious thing worth sharing]
    Source: [which daily notes contain the raw thinking]

CONNECTING THREAD:
[Theme that ties multiple candidates together]

SUGGESTED STRUCTURE:
[3–4 sections based on depth of material]
```

Rules: be specific (cite daily note dates), prioritize insights over updates, match existing tone
(first person, reflective, connects specific events to broader ideas). Present candidates as options
— let the user pick which to develop; never assume which topic they want to write. Offer the
connecting thread and structure as suggestions to confirm, not decisions already made.
