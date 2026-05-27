# Vault Maintenance & Common Operations

## Weekly Tasks

- [ ] Process inbox to zero (`0 - Inbox/`)
- [ ] Review all active projects (`1 - Projects/`)
- [ ] Check OKRs and update weekly planning

## Monthly Tasks

- [ ] Review all areas (`2 - Areas/`)
- [ ] Archive completed projects
- [ ] Update MOCs with new notes
- [ ] Clean up unused tags
- [ ] Check for broken links

## Quarterly Tasks

- [ ] Review OKRs and set new quarterly goals
- [ ] Archive old daily notes
- [ ] Consolidate resources
- [ ] Review vault structure

For complete maintenance procedures, reference **Vault Maintenance Guide.md** in the vault (`3 - Resources/Obsidian org/`).

---

## Common Vault Operations

### Creating Notes

**Daily note:**
- Location: `2 - Areas/Daily Ops/YYYY/`
- Template: `Daily Notes.md`
- Name: `YYYY-MM-DD.md`
- Tags: None needed (folder provides context)

**Project note:**
- Location: `1 - Projects/[Project Name]/`
- Template: `Project Brief.md` or `Project Planning.md`
- Tags: Subject tag + `#active` if currently working

**Meeting note:**
- Location: Varies (often in project or area folder)
- Template: `Meeting Notes.md` or `1-on-1 Meeting Notes.md`
- Tags: Subject tag only (e.g., `#career`)

**Learning note:**
- Location: `3 - Resources/`
- Template: `Learning.md` or `Learning Tech Template.md`
- Tags: Subject tag only (e.g., `#react`)

**TIL note:**
- Location: `3 - Resources/TIL/`
- Template: None (created by /til command)
- Tags: `til/` prefixed topic tags (e.g., `#til/react`, `#til/architecture`)

### Moving Notes

When PARA category changes:
1. Identify current and target folders
2. Update internal links if needed
3. Update backlinks in other notes
4. Update MOCs that reference this note
5. Use Obsidian's file move (preserves links)

### Archiving

**When to archive:**
- Projects: When completed or abandoned
- Areas: When no longer your responsibility
- Resources: When outdated or no longer relevant
- Daily notes: After 90+ days

**Archive locations:**
- Projects: `4 - Archives/Projects - YYYY/`
- Daily notes: `4 - Archives/Daily Notes/`

### Inbox Processing Workflow

**Inbox location:** `0 - Inbox/`

**Processing steps:**
1. Read note content
2. Apply PARA decision tree
3. Add subject tag(s) only (folder handles content type)
4. Link to related notes or MOCs
5. Move to proper PARA category
6. Target: Empty inbox weekly
