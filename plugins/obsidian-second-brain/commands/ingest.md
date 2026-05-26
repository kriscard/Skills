# Ingest Command

Process a source from `0 - Inbox/` into the wiki. This is interactive — discuss before writing.

## Step 1: Find the source

If the user named a file, use it directly. Otherwise list inbox:
```bash
obsidian files folder="0 - Inbox/"
```

If inbox is empty, say so and stop.

## Step 2: Read the source

```bash
obsidian read path="0 - Inbox/[filename]"
```

## Step 3: Discuss before writing

Share your read of the source with Chris:
- What are the 2–3 most important ideas?
- What existing wiki pages does this connect to or update?
- Any contradictions with what's already in the wiki?

Use `qmd query "<topic>" --json -n 5` for each key concept to find related pages.

Wait for Chris to respond. Let him guide what to emphasize before writing anything.

## Step 4: Write wiki pages

Based on the discussion:

**For each key concept or entity mentioned:**
- Check if a page exists: `qmd query "<concept>" --json -n 3`
- Score ≥ 0.7 → update existing page (append a dated section)
- Score < 0.5 → create new page in `3 - Resources/<subfolder>/`

New page frontmatter:
```yaml
---
source: claude-memory
created: YYYY-MM-DD
tags: [claude-memory, <topic-tags>]
---
```

Target 3–10 pages per source. Focus on durable concepts, not summaries of the article itself.

## Step 5: Update index.md

Add an entry under the right section:
```markdown
- **<Title>** (YYYY-MM-DD) — [[<stem>]] (<rel-path>) · from <hostname>. _<one-line summary>_
```

Sections: Articles / Tweets / Videos / Books / Concept notes (claude-memory)

## Step 6: Append to log.md

```markdown
## [YYYY-MM-DD] ingest | <title>
```

## Step 7: Move the source

Move the source file from `0 - Inbox/` to `3 - Resources/<Type>/`:
```bash
obsidian move path="0 - Inbox/[filename]" newPath="3 - Resources/[Type]/[filename]"
```

Type mapping: article → Articles, tweet → Tweets, video → Videos, book → Books

## Done

Report: how many wiki pages were created or updated, what was filed where.
