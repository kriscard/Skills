---
name: save-note
description: >-
  Files the current conversation answer as a permanent wiki page in Obsidian. Make sure to use this
  skill whenever the user says "save this to my notes", "add this to my knowledge base", "create a
  wiki page for this", "save what we discussed", or "file this answer". Converts session synthesis,
  insights, or technical decisions into a self-contained reference note. Never writes a note that
  references "the conversation above" — the body must stand alone.
user-invocable: true
argument-hint: '[title — omit to infer from context]'
---

# Save Note

File this session's answer as a permanent wiki page in Obsidian. The note must be self-contained — a
reader with no context should be able to understand it.

## Step 1 — Determine Title and Folder

If `$ARGUMENTS` provides a title, use it. Otherwise ask: "What should this note be titled, and which
folder?" using `AskUserQuestion`.

Default subfolders in `3 - Resources/`:

| Subfolder        | When to use                                          |
| ---------------- | ---------------------------------------------------- |
| `Coding/`        | Engineering patterns, technical decisions, API notes |
| `Reflections/`   | Personal insights, mental models, lessons learned    |
| `Concepts/`      | General concepts, frameworks, ideas                  |
| `Communication/` | Leadership, writing, comms patterns                  |

## Step 2 — Search Before Writing

```bash
obsidian search query="<topic>"
```

- Score ≥ 0.7 → append a dated section to the existing page
- Score < 0.5 → create a new page

## Step 3 — Write the Note

**New page:**

```bash
obsidian create path="3 - Resources/<subfolder>/<title>.md" content="<note>"
```

**Append to existing:**

```bash
obsidian append path="3 - Resources/<subfolder>/<existing>.md" \
  content="\n## Update — $(date +%Y-%m-%d)\n\n<content>"
```

Frontmatter for new pages:

```yaml
---
source: claude-memory
created: YYYY-MM-DD
tags: [claude-memory, <topic-tags>]
---
```

Body: the synthesized answer from this session. Neutral, reference-focused voice — no "I learned
that..." framing. Should make sense to a reader with no context.

## Step 4 — Update Index and Log

Add to `index.md` under the `## Concept notes (claude-memory)` heading. The CLI has no `patch`, so
this section-targeted insert means either the MCP `obsidian_patch_content` tool (target the heading,
`operation: append`) or `read` + `create ... overwrite`. Ask the user which. Entry format:

```
- **<Title>** ($(date +%Y-%m-%d)) — [[<stem>]] (<path>). _<one-line summary>_
```

Append to `log.md` (chronological — append is fine):

```bash
obsidian append path="3 - Resources/log.md" content="\n## $(date +%Y-%m-%d)\nsave-note | <title>"
```

## Hard Rules

- Body must be self-contained — no "as we discussed" or "see above"
- Search before writing — never create duplicate pages
- Write in wiki style: neutral, reference-focused, not diary voice
- If Obsidian CLI fails: tell the user "Obsidian CLI isn't working — update Obsidian with CLI
  enabled"
