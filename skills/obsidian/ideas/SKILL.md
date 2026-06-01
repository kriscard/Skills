---
name: ideas
description: >-
  Captures ideas, brain dumps, and quick thoughts into the Obsidian Inbox with zero friction — and
  surfaces ideas buried in the vault. Make sure to use this skill whenever the user says "capture
  this idea", "I have an idea", "brain dump", "write down this thought", "idea for", "find my
  ideas", "surface ideas from my vault", "graduate ideas from daily notes", "what ideas haven't I
  developed", or whenever there's a quick insight that needs to land somewhere before it evaporates.
  Also fires when extracting idea clusters from a conversation or promoting daily note ideas to
  permanent notes.
user-invocable: true
---

# Ideas Capture

Get ideas out of your head and into the vault immediately. Low friction is the whole point — capture
first, organize later. The Inbox is the landing zone.

## Quick Capture (single idea)

Write to inbox immediately, no questions:

```bash
obsidian create path="0 - Inbox/idea-$(date +%Y%m%d-%H%M).md" content="..."
```

Frontmatter to add:

```yaml
---
type: idea
captured: YYYY-MM-DD HH:MM
context: <project name or topic, if obvious>
tags: [idea]
---
```

After capturing, ask ONE optional follow-up:

> "This looks like a [project / area / resource] idea — want a full project note now, or just inbox
> for later?"

Only ask if the answer isn't already obvious. If they say "just capture it", stop there.

## Idea Extraction from Conversation

When the conversation contains multiple ideas scattered through the discussion:

1. **Identify all distinct ideas** — don't lump unrelated things together
2. **Group related ideas** into clusters (same problem space, same project, same technology)
3. **Write one note per cluster** — related ideas together, unrelated ideas separately

```bash
# One note per distinct cluster
obsidian create path="0 - Inbox/idea-$(date +%Y%m%d-%H%M)-<slug>.md" content="..."
```

Present the clusters to the user before writing, in case grouping is wrong.

## When to Suggest a Project Note Instead

If the idea clearly has:

- A concrete outcome ("build X", "ship Y", "learn Z")
- An implicit deadline or urgency

...ask: "This sounds like more than an idea — want me to set up a project note in `1 - Projects/`?"
Then hand off to the `project` skill if yes.

## Naming Convention

- Single idea: `idea-YYYYMMDD-HHMM.md`
- Named idea: `idea-YYYYMMDD-HHMM-<short-slug>.md`
- Extracted cluster: `idea-YYYYMMDD-HHMM-<topic>.md`

Keep slugs short (2–3 words max). The timestamp is the primary identifier.

## Promote Mode — Graduate Daily Note Ideas

When the user wants to promote ideas from daily notes to permanent notes:

### Step 1 — Scan the last 14 days of daily notes

```bash
obsidian read path="2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md"  # repeat for each day
```

**Explicit signals**: `#idea`, `#expand`, "I should write about", named concepts, unresolved
`[[links]]`

**Implicit signals**: high-energy paragraphs (longer, stronger language), original frameworks,
recurring themes across 3+ days, questions that keep reappearing

**Not candidates**: tasks, meeting logistics, things with existing standalone notes

### Step 2 — Cross-reference existing vault

For each candidate:

```bash
obsidian search query="<candidate concept>" format=json
```

Categorize: New concept (no note exists) / Underdeveloped (thin note) / Already covered (skip) /
Recurring unresolved `[[link]]` (high priority)

### Step 3 — Present candidates table

| #   | Idea | Source | Days Mentioned | Status | Recommendation |
| --- | ---- | ------ | -------------- | ------ | -------------- |

Include for each: 1–2 sentence summary, exact quote from daily note, what it connects to in vault.

### Step 4 — Graduate selected ideas

**Always ask before creating or modifying files.**

For new notes: place in `3 - Resources/` (concept), `1 - Projects/` (actionable + deadline),
`2 - Areas/` (ongoing interest). Write as mini-essay (3–8 paragraphs) with core claim, context from
daily notes, `[[backlinks]]`, open questions. Go back and add `[[links]]` in source daily notes.

For enriching existing: read note, add dated section, add backlinks, update source daily note links.
