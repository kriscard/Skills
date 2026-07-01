> **Read this when:** the user wants to graduate ideas from daily notes or buried vault notes into permanent notes.

# Promote Mode — Graduate Daily Note Ideas

## Step 1 — Scan the last 14 days of daily notes

```bash
obsidian read path="2 - Areas/Daily Ops/<year-from-YYYY-MM-DD>/YYYY-MM-DD.md"  # repeat for each day
```

Explicit signals: `#idea`, `#expand`, "I should write about", named concepts, unresolved `[[links]]`.

Implicit signals: high-energy paragraphs (longer, stronger language), original frameworks, recurring themes across 3+ days, questions that keep reappearing.

Not candidates: tasks, meeting logistics, things with existing standalone notes.

## Step 2 — Cross-reference existing vault

For each candidate:

```bash
obsidian search query="<candidate concept>" format=json
```

Categorize: New concept (no note exists) / Underdeveloped (thin note) / Already covered (skip) /
Recurring unresolved `[[link]]` (high priority).

## Step 3 — Present candidates table

| # | Idea | Source | Days Mentioned | Status | Recommendation |
| --- | --- | --- | --- | --- | --- |

Include for each: 1–2 sentence summary, exact quote from daily note, and what it connects to in the vault.

## Step 4 — Graduate selected ideas

User review of the candidates table is the gate; do not create, enrich, or backlink notes until the selected ideas and target folders are approved.

For new notes: place in `3 - Resources/` (concept), `1 - Projects/` (actionable + deadline), or `2 - Areas/` (ongoing interest). Write as a mini-essay (3–8 paragraphs) with core claim, context from daily notes, `[[backlinks]]`, and open questions. Go back and add `[[links]]` in source daily notes.

For enriching existing notes: read note, add dated section, add backlinks, update source daily note links.
