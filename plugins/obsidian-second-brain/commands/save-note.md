# Save Note Command

File the current conversation answer as a permanent wiki page. Use when a session produces a synthesis, analysis, or insight worth keeping.

## Step 1: Determine what to save

Ask Chris: "What should the note be titled, and which folder?" if not already clear from context.

Default subfolders:
- `3 - Resources/Coding/` — engineering patterns, technical decisions
- `3 - Resources/Reflections/` — personal insights, mental models
- `3 - Resources/Concepts/` — general concepts and entities
- `3 - Resources/Communication/` — leadership, writing, comms patterns

## Step 2: Search before writing

```bash
qmd query "<topic>" --json -n 5
```

Score ≥ 0.7 → append a dated section to the existing page instead of creating a new one.  
Score < 0.5 → create a new page.

## Step 3: Write the note

```bash
obsidian create path="3 - Resources/<subfolder>/<title>.md" content="..." silent
```

Frontmatter:
```yaml
---
source: claude-memory
created: YYYY-MM-DD
tags: [claude-memory, <topic-tags>]
---
```

Body: the synthesized answer from this session. Self-contained — no references to "the conversation above." Should make sense to a reader with no context.

## Step 4: Update index.md

Add under `## Concept notes (claude-memory)`:
```markdown
- **<Title>** (YYYY-MM-DD) — [[<stem>]] (<rel-path>). _<one-line summary>_ · tags: <tags>
```

## Step 5: Append to log.md

```markdown
## [YYYY-MM-DD] save-note | <title>
```

## Done

Confirm: note path, index.md updated, log.md appended.
