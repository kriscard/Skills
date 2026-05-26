---
name: obsidian
description: >-
  Performs Obsidian vault FILE OPERATIONS via CLI — reading notes, creating files,
  appending content, searching across the vault, listing folders, fetching daily/weekly
  notes. Use when the user wants to read, write, search, or list vault files; work
  with daily/weekly notes; run backlink/link queries; or process inbox files. Triggers:
  "read my daily note", "search the vault for X", "create a note in [folder]", "list
  files in...", "what's in my inbox", "append to today's note". Do NOT use for Obsidian
  Markdown syntax authoring (wikilinks, callouts, frontmatter properties, embeds, tag
  syntax) — defer to the obsidian-markdown skill for those. Do NOT use for .base or
  .canvas file authoring — defer to obsidian-bases / json-canvas skills.
---

# Obsidian Operations Skill

CLI-first approach to all vault operations. Always use `obsidian` commands directly.
If commands fail, tell the user: "Obsidian CLI isn't working — update Obsidian with CLI enabled."

## Vault Rules (read this first)

Before any vault write or proposal, read the vault's `AGENTS.md` once per session:

```bash
obsidian read path="CLAUDE.md"
```

It defines what you can write without asking and what requires explicit user approval:
- **Auto-write set** (no per-write permission): session logs in `2 - Areas/Daily Ops/<year>/Claude Sessions/`, `MEMORY.md`, the Claude Memory MOC, the `## 💬 Sessions` wikilink in today's daily note.
- **Permission-required writes**: everything else — new notes in `3 - Resources/`, edits to existing PARA notes, any deletion. Always ask BEFORE the write.
- **Search-before-write**: run `qmd query "<topic>" --json -n 8` (fallback `obsidian search:context`) before proposing any new note. Match without `source: claude-memory` frontmatter = human note → don't modify; suggest backlinks in MOC instead.
- **Provenance**: agent-written notes carry `source: claude-memory` frontmatter. Notes WITHOUT it are human-curated — do not modify.
- **Templates/ is read-only.**

Read-only operations (read / search / list) do NOT need this precondition — proceed directly.

If `obsidian read path="CLAUDE.md"` fails, stop and confirm the vault path with the user before proceeding.

## Quick Reference

| Operation | CLI Command |
|-----------|------------|
| Read file | `obsidian read path="..."` |
| Create file | `obsidian create path="..." content="..." silent` |
| Append | `obsidian append path="..." content="..." silent` |
| Search | `obsidian search query="..." format=json` |
| List files | `obsidian files folder="..." format=json` |
| Daily note | `obsidian daily:read` |

## File Targeting

| Parameter | Behavior | Example |
|-----------|----------|---------|
| `file=<name>` | Wikilink-style resolution (no path/ext needed) | `file=Recipe` finds `Recipes/Recipe.md` |
| `path=<path>` | Exact path from vault root | `path="3 - Resources/TIL/til-2026-02-16.md"` |

## Vault Structure

Default vault (from plugin settings):
!`echo "${CLAUDE_PLUGIN_OPTION_VAULT_PATH:-not configured — set vault_path in plugin settings}"`

Key paths:
- `0 - Inbox/` - Incoming notes
- `1 - Projects/` - Active projects
- `2 - Areas/` - Ongoing responsibilities
- `3 - Resources/` - Reference material
- `4 - Archives/` - Completed/inactive
- `Templates/` - Note templates

## Gotchas

- Always use `silent` flag for non-interactive operations — without it Obsidian opens the file and steals focus
- Paths with spaces need quoting: `path="3 - Resources/TIL/note.md"`
- `file=` resolution is wikilink-style (name only, no ext) — use `path=` when you know the exact path
- CLI requires Obsidian to be running with CLI enabled — if commands fail, tell user to check Settings > General > CLI
- `delete` sends to trash by default — add `permanent` flag only when user explicitly confirms permanent deletion
- `format=json` is essential when parsing output programmatically — text format is for display only

## Best Practices

1. **Use `silent` flag** - Always add `silent` for non-interactive operations
2. **Use `format=json`** - For parsing output programmatically
3. **Prefer `file=`** - When you know the name but not the path
4. **Use `path=`** - When you know the exact path
5. **Batch operations** - Use parallel calls when checking multiple files
6. **Templates** - Use `template=` parameter when creating from templates
7. **Confirmation** - Never delete without explicit user confirmation

## CLI Requirements

Obsidian CLI requires:
- Obsidian with CLI enabled: Settings > General > Command line interface
- Obsidian must be running

If CLI commands fail, tell the user "Obsidian CLI isn't working — update Obsidian with CLI enabled."

## Reference Files

| Reference | Contents |
|-----------|----------|
| [cli-reference.md](references/cli-reference.md) | Full CLI commands: file ops, daily notes, tasks, tags, links, properties, templates, outline, vault info, flags, output formats |
| [obsidian-utils.md](references/obsidian-utils.md) | obsidian-utils.sh wrapper script commands |
