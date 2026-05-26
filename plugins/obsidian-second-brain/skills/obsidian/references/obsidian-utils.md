# obsidian-utils Reference

Shared utility script that wraps Obsidian CLI operations. Available as a bare command (on PATH) when the plugin is enabled:
```bash
obsidian-utils <command> [args]
```
Located at `${CLAUDE_PLUGIN_ROOT}/bin/obsidian-utils`.

## Script Commands

| Operation | Command | Example |
|-----------|---------|---------|
| Read file | `./obsidian-utils.sh read "path.md"` | Read by exact path |
| Read by name | `./obsidian-utils.sh read-file "Recipe"` | Wikilink-style resolution |
| List files | `./obsidian-utils.sh list "folder/" json` | List with format |
| Create file | `./obsidian-utils.sh create "path.md" "content"` | Create note |
| Create from template | `./obsidian-utils.sh create-template "path.md" "Template"` | Use template |
| Append | `./obsidian-utils.sh append "path.md" "content"` | Append to note |
| Prepend | `./obsidian-utils.sh prepend "path.md" "content"` | Prepend after frontmatter |
| Search | `./obsidian-utils.sh search "query" json` | Search vault |
| Delete | `./obsidian-utils.sh delete "path.md"` | Delete note (trash) |
| Move | `./obsidian-utils.sh move "old.md" "new.md"` | Move/rename |
| Daily note | `./obsidian-utils.sh daily read` | Read today's daily |
| Daily append | `./obsidian-utils.sh daily append "content"` | Append to daily |
| Tasks | `./obsidian-utils.sh tasks all` | List all tasks |
| Tags | `./obsidian-utils.sh tags` | List tags with counts |
| Backlinks | `./obsidian-utils.sh backlinks "path.md"` | List backlinks |
| Unresolved | `./obsidian-utils.sh unresolved` | Find broken links |
| Orphans | `./obsidian-utils.sh orphans` | Find orphan files |
| Outline | `./obsidian-utils.sh outline "path.md"` | Show headings |
| Properties | `./obsidian-utils.sh properties "path.md"` | List frontmatter |
| Set property | `./obsidian-utils.sh property-set "path.md" "key" "value"` | Set frontmatter |
| Templates | `./obsidian-utils.sh templates` | List templates |
| Template read | `./obsidian-utils.sh template-read "Name"` | Get resolved template |
