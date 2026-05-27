# Obsidian CLI Reference

Complete command reference for Obsidian's native CLI. All commands use the `obsidian` binary.

## File Targeting

Two ways to target files:

| Parameter | Behavior | Example |
|-----------|----------|---------|
| `file=<name>` | Wikilink-style resolution (no path/ext needed) | `file=Recipe` finds `Recipes/Recipe.md` |
| `path=<path>` | Exact path from vault root | `path="3 - Resources/TIL/til-2026-02-16.md"` |

## File Operations

```bash
# Read file content
"obsidian" read path="2 - Areas/Daily Ops/2026/2026-02-14.md"
"obsidian" read file="Recipe"  # wikilink resolution

# List files in folder (json for parsing)
"obsidian" files folder="0 - Inbox/" format=json

# Create new file
"obsidian" create path="3 - Resources/TIL/til-2026-02-14.md" content="# TIL..." silent

# Create from template
"obsidian" create path="note.md" template="Daily Notes" silent

# Append to file (silent = don't open)
"obsidian" append path="note.md" content="\n## New Section" silent

# Append inline (no newline added)
"obsidian" append path="note.md" content=" - item" silent inline

# Prepend after frontmatter
"obsidian" prepend path="note.md" content="# Header" silent

# Move/rename file
"obsidian" move path="old.md" to="folder/new.md"

# Delete file (to trash)
"obsidian" delete path="note.md"

# Delete permanently
"obsidian" delete path="note.md" permanent

# Search vault
"obsidian" search query="meeting notes" format=json limit=20
```

## Daily Notes

```bash
# Read today's daily note
"obsidian" daily:read

# Append to daily note
"obsidian" daily:append content="- [ ] Buy groceries" silent

# Prepend to daily note
"obsidian" daily:prepend content="# Morning Notes" silent

# Open daily note (just get path)
"obsidian" daily silent
```

## Tasks

```bash
# List all tasks
"obsidian" tasks all

# List tasks from daily note
"obsidian" tasks daily

# List incomplete tasks
"obsidian" tasks todo

# List completed tasks
"obsidian" tasks done

# Toggle a task
"obsidian" task path="note.md" line=8 toggle

# Mark task done
"obsidian" task path="note.md" line=8 done
```

## Tags

```bash
# List all tags with counts
"obsidian" tags all counts

# Get info about specific tag
"obsidian" tag name="project" verbose
```

## Links & Graph

```bash
# List backlinks to a file
"obsidian" backlinks path="note.md" counts

# List outgoing links
"obsidian" links path="note.md"

# Find broken (unresolved) links
"obsidian" unresolved verbose counts

# Find orphan files (no incoming links)
"obsidian" orphans

# Find dead-end files (no outgoing links)
"obsidian" deadends
```

## Properties (Frontmatter)

```bash
# List properties of a file
"obsidian" properties path="note.md" format=yaml

# Set a property
"obsidian" property:set path="note.md" name="status" value="complete"

# Set property with type
"obsidian" property:set path="note.md" name="priority" value="5" type=number

# Read a property value
"obsidian" property:read path="note.md" name="status"

# Remove a property
"obsidian" property:remove path="note.md" name="draft"
```

## Templates

```bash
# List available templates
"obsidian" templates

# Read template (with variables resolved)
"obsidian" template:read name="Daily Notes" resolve

# Read template raw
"obsidian" template:read name="Daily Notes"
```

## Outline & Structure

```bash
# Show headings tree
"obsidian" outline path="note.md" format=tree

# Show headings as markdown
"obsidian" outline path="note.md" format=md
```

## Vault Info

```bash
# Full vault info
"obsidian" vault

# Specific info
"obsidian" vault info=files    # file count
"obsidian" vault info=size     # vault size
```

## CLI Flags

| Flag | Effect |
|------|--------|
| `silent` | Don't open file after operation |
| `overwrite` | Replace existing file |
| `inline` | Append/prepend without adding newline |
| `permanent` | Delete permanently (skip trash) |
| `resolve` | Resolve template variables |
| `verbose` | Include extra details |
| `counts` | Include occurrence counts |
| `total` | Return count only |

## Output Formats

| Format | Use for |
|--------|---------|
| `format=json` | Parsing in code |
| `format=text` | Human readable |
| `format=yaml` | Properties/frontmatter |
| `format=tree` | Outline hierarchy |
| `format=md` | Markdown output |

## Multiline Content

Use `\n` for newlines and `\t` for tabs:

```bash
"obsidian" create path="note.md" content="# Title\n\nBody text\n\n- Item 1\n- Item 2" silent
```
