---
name: weekly
description: >-
  Weekly Obsidian review: read the week's daily notes and TILs, check goal alignment before writing,
  then synthesize confirmed highlights, learnings, carry-forward, and next-week focus. Also use for
  weekly writing prep when the user asks to surface candidate topics.
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
# Derive these from the week being reviewed, not blindly from today's date if the user asks for a
# prior week. ISO week years can differ from calendar years around New Year's.
WEEK=$(date +%G-W%V)
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
# Resolve each YYYY-MM-DD in the target ISO week, then use that date's calendar year in the path:
obsidian read path="2 - Areas/Daily Ops/<year-from-YYYY-MM-DD>/<YYYY-MM-DD>.md" 2>/dev/null
```

If you're unsure which date range to cover (e.g. the user means last week, or a partial week), **ask
before reading.** If a day's note is missing or sparse, do not conclude the day was idle — note the
gap and ask the user what happened.

Extract from daily notes:

- **Accomplishments**: things completed or shipped
- **Carry-forward items**: anything marked for "next week" or unresolved
- **Key decisions**: any choices made that shaped direction
- **Energy/focus notes**: only if the user tracks these — don't invent them

## Step 4 — Check Goal Alignment Before Writing

Read active monthly/quarterly goals before drafting weekly synthesis:

```bash
MONTHLY_PATH="2 - Areas/Goals/Monthly/M - <Month Year from reviewed week>.md"
QUARTERLY_PATH="2 - Areas/Goals/Quaterly/Quaterly Goals - Q<N> <YYYY>.md"
obsidian read path="$MONTHLY_PATH" 2>/dev/null
obsidian read path="$QUARTERLY_PATH" 2>/dev/null
```

Ask: are this week's accomplishments connected to monthly objectives?

Flag goals with zero visible progress as questions to verify, not conclusions. Set **Next Week
Focus** from the user's stated priorities — ask them directly which 1–3 things matter most next
week. Don't infer focus from activity volume or what looks unfinished.

Complete when daily notes, TIL notes, and goal notes have been gathered and the user has confirmed
highlights, carry-forward, and 1–3 next-week priorities.

## Step 5 — Synthesize into Weekly Note Sections

Write these sections into the weekly note only after Step 4 confirmation:

| Section             | Content                                                |
| ------------------- | ------------------------------------------------------ |
| **Highlights**      | 3–5 confirmed accomplishments worth remembering        |
| **What I Learned**  | Distilled from TIL notes — key insights, not summaries |
| **Carry Forward**   | Confirmed unfinished items moving to next week         |
| **Next Week Focus** | User-confirmed top 1–3 priorities                      |

Show the source for each item before writing anything. Don't decide what counts as a highlight or a
priority on the user's behalf — propose, let them correct or cut, then write only the confirmed
version.

The CLI has no `patch`, so filling these named sections means either the MCP
`obsidian_patch_content` tool (heading-targeted) or a `read` + `create ... overwrite` rewrite of the
whole note. Ask the user which to use, then write each section's content.

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
