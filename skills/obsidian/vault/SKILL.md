---
name: vault
description: >-
  Foundational Obsidian vault context skill. Make sure to use this skill whenever the user mentions
  Obsidian, notes, vault, PARA, "in my notes", "check my vault", "second brain", or any interaction
  that touches the personal knowledge system. Provides vault structure, CLI reference, and PARA
  rules that all other obsidian skills build on.
---

# Vault Context

Core knowledge layer for the Obsidian vault. Always load before any vault operation — this provides
the map that makes every other skill accurate.

## Ask, Don't Assume

These skills act on the user's personal knowledge — the interpretation is theirs, not yours. This
principle is shared by every ritual skill (daily, close-day, weekly, goals, spot-drift).

- If you don't know something — a path, a date range, what counts as a "win", which goals are active
  — **ask**. Don't infer it from context or pick a default silently.
- Before writing any synthesis or judgment into a note, **present your draft with its source and get
  explicit confirmation.** Let the user correct, add, or cut before anything is written.
- Missing or ambiguous data is not permission to invent. Surface the gap and ask — a sparse or
  missing note does not mean nothing happened.
- One question at a time for judgment calls; batch only purely factual unknowns.

## Vault Path

`/Users/kriscard/obsidian-vault-kriscard`

## PARA Structure

| Layer     | Path             | What belongs here                           |
| --------- | ---------------- | ------------------------------------------- |
| Inbox     | `0 - Inbox/`     | Unprocessed captures, raw ideas             |
| Projects  | `1 - Projects/`  | Active deliverables with outcome + deadline |
| Areas     | `2 - Areas/`     | Ongoing responsibilities (no end date)      |
| Resources | `3 - Resources/` | Reference material, TIL, wiki pages         |
| Archives  | `4 - Archives/`  | Inactive projects, old resources            |

**PARA rule of thumb:**

- Project = outcome + deadline. No deadline → Area.
- Area = standard to maintain, not a finish line to cross.
- Resource = potentially useful reference, not actionable.
- Archive = anything from the other three that's no longer active.

## Key Paths

```
2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md          # Daily notes
2 - Areas/Daily Ops/Weekly/M - Month YYYY/YYYY-Www.md  # Weekly notes
2 - Areas/Goals/Quaterly/Quaterly Goals - QN YYYY.md   # Quarterly goals (typo preserved)
2 - Areas/Goals/Monthly/M - Month YYYY.md        # Monthly goals
2 - Areas/Goals/OKR Dashboard.base               # OKR base query
3 - Resources/TIL/til-YYYY-MM-DD.md             # TIL notes
0 - Inbox/                                       # Processing queue
```

Note: the quarterly folder is spelled "Quaterly" — preserve this to match the existing vault
structure.

## Obsidian CLI Reference

```bash
obsidian read path="<path>"                      # Read a note
obsidian create path="<path>" template="<name>"  # Create from template
obsidian create path="<path>" content="..." overwrite  # Overwrite a whole note
obsidian append path="<path>" content="..."      # Append to end of note
obsidian prepend path="<path>" content="..."     # Prepend to top of note
obsidian move path="<src>" to="<dst>"            # Move/rename note
obsidian files folder="<path>" format=json       # List files
obsidian search query="<q>"                      # Full-text search
obsidian search:context query="<q>" limit=10     # Search with surrounding lines
obsidian tasks todo path="<daily-note path>"     # Today's open tasks (path, not folder)
obsidian task path="<path>" line=N done          # Mark a task done
obsidian orphans                                 # Orphaned notes
obsidian deadends                                # Notes with no outgoing links
obsidian unresolved verbose counts               # Broken links
obsidian backlinks path="<path>" counts          # Backlinks to a note
obsidian links path="<path>"                     # Outgoing links from a note
obsidian vault info=files                        # Vault stats
obsidian tags counts sort=count                  # All tags with usage counts
obsidian property:read path="<path>" name="<k>"  # Read a frontmatter property
obsidian property:set path="<path>" name="<k>" value="<v>"  # Set a property
obsidian template:read name="<name>" resolve title="<t>"  # Render template
obsidian base:query path="<path>" format=json    # Query a .base file
```

**No `patch` command.** The CLI cannot edit a specific section in place. To write to a note:
`append`/`prepend` when landing the content anywhere in the note is fine. When it must update or
replace a _named section_, ask the user: use the MCP `obsidian_patch_content` tool (supports
heading/block/frontmatter targeting), or recreate the note via `read` + `create ... overwrite`.

**No `daily:*` commands.** `daily` is only a flag on `task`/`tasks`, and that flag needs the Daily
Notes core plugin enabled (currently disabled). Work the daily note by its path:
`TODAY="2 - Areas/Daily Ops/$(date +%Y)/$(date +%Y-%m-%d).md"`, then `obsidian read path="$TODAY"` /
`append` / `prepend`. Today's open tasks: `obsidian tasks todo path="$TODAY"` (note `tasks path=`
takes a file, not a folder).

If any `obsidian` command fails: tell the user "Obsidian CLI isn't working — update Obsidian with
CLI enabled."

## Templates Location

`Templates/` folder in vault root. Key templates:

- `Templates/Daily Notes.md`
- `Templates/Weekly.md`
- `Templates/Project.md`
- `Templates/TIL.md`

## References

| Priority   | Load when                                                      | Reference                          |
| ---------- | -------------------------------------------------------------- | ---------------------------------- |
| 1 — High   | Full CLI command needed beyond the inline reference            | `references/cli-reference.md`      |
| 2 — High   | obsidian-utils script commands or invocation syntax            | `references/obsidian-utils.md`     |
| 3 — Medium | Complete folder tree, metadata patterns, or naming conventions | `references/detailed-structure.md` |
| 4 — Medium | Tag taxonomy or tagging best practices                         | `references/tagging-system.md`     |
| 5 — Medium | Which template to use for a note type                          | `references/templates-guide.md`    |
