---
name: vault-structure
user-invocable: false
description: >-
  Provides the user's specific Obsidian vault structure — folder organization
  (PARA), tagging taxonomy, templates, and file conventions. Contains paths and
  patterns Claude cannot know without this skill. Make sure to use this skill
  whenever placing notes in the vault, choosing tags, or needing vault-specific
  folder structure and paths.
version: 0.1.0
---

# Vault Structure & Configuration

Obsidian vault implementing a modified PARA method with MOCs, Bases, and a subject-only tagging system.

**Vault Path:**
!`echo "${CLAUDE_PLUGIN_OPTION_VAULT_PATH:-not configured — set vault_path in plugin settings}"`

## Core Folder Structure

```
├── 0 - Inbox/              # Unprocessed notes, process weekly
├── 1 - Projects/           # Active work with deadlines
├── 2 - Areas/              # Ongoing responsibilities
│   ├── Daily Ops/          # Daily notes (YYYY/), weekly planning
│   ├── Goals/              # Quarterly/, Monthly/, Yearly/
│   └── Relationships/      # People notes
├── 3 - Resources/          # Reference materials
│   └── TIL/                # Today I Learned notes
├── 4 - Archives/           # Completed/inactive items
├── MOCs/                   # Maps of Content (navigation)
└── Templates/              # Note templates
```

## PARA Decision Making

### Where Should This Note Go?

1. **Active project with a deadline?** -> `1 - Projects/[Project Name]/`
2. **Ongoing responsibility?** -> `2 - Areas/[Area Name]/`
3. **Reference material for future use?** -> `3 - Resources/`
4. **Daily/temporal tracking?** -> `2 - Areas/Daily Ops/` or `2 - Areas/Goals/`
5. **Unprocessed or uncertain?** -> `0 - Inbox/`
6. **Completed or inactive?** -> `4 - Archives/`

**Key principles:**
- **Projects** - Time-bound, specific outcome, will move to Archives
- **Areas** - Ongoing, no end date, standard to maintain
- **Resources** - Passive reference, no immediate action required
- **Archives** - Completed projects, inactive areas, outdated resources

## Bases (Queryable Dashboards)

| Base | Path |
|------|------|
| Daily Notes | `2 - Areas/Daily Ops/Daily Notes.base` |
| Weekly Planning | `2 - Areas/Daily Ops/Weekly Planning.base` |
| OKR Dashboard | `2 - Areas/Goals/OKR Dashboard.base` |
| Books | `3 - Resources/Books/0 - Books.base` |
| TIL Index | `3 - Resources/TIL/TIL Index.base` |
| Active Projects | `MOCs/Active Projects.base` |

```bash
obsidian bases                                                          # List all bases
obsidian base:query path="2 - Areas/Goals/OKR Dashboard.base" format=json  # Query a base
```

## Maps of Content (MOCs)

**Location:** `MOCs/` | **Template:** `MOC Template.md`

**When to create:**
- Topic has 10+ related notes
- Need overview of a knowledge area
- Connecting multiple projects/areas
- Want to explain concept structure

Use Dataview queries for dynamic content. Link across PARA categories. Update during monthly reviews.

## Linking Conventions

```markdown
[[Note Name]]              # Standard link
[[Note Name|Display Text]] # Aliased link
[[Note Name#Heading]]      # Section link
[[Note Name#^block-id]]    # Block reference
```

Link freely across PARA boundaries — projects to areas, areas to resources, everything to MOCs.

## Gotchas

- **Don't duplicate folder context with tags** — if note is in `1 - Projects/`, don't tag it `#project`
- **Daily notes go in `2 - Areas/Daily Ops/YYYY/`**, not in root or Inbox
- **Always use `silent` flag** when creating/appending via CLI to avoid Obsidian stealing focus
- **MOCs: wait for 10+ related notes** — premature MOCs become maintenance burden
- **Archives folder uses year suffix:** `4 - Archives/Projects - YYYY/`

## Reading Vault Files

```bash
# Read files
obsidian read path="3 - Resources/Obsidian org/Tag Taxonomy.md"
obsidian read path="3 - Resources/Obsidian org/PARA Method Implementation.md"

# List files
obsidian files folder="0 - Inbox/" format=json
```

## Reference Files

| Reference | Contents |
|-----------|----------|
| `references/tagging-system.md` | Tag categories, anti-patterns, examples |
| `references/templates-guide.md` | All templates, default templates by use case |
| `references/maintenance-checklists.md` | Weekly/monthly/quarterly tasks, common operations (create, move, archive) |
| `references/detailed-structure.md` | Comprehensive folder breakdown, file inventories |

### Vault Documentation (in-vault)

- **Tag Taxonomy.md** — `3 - Resources/Obsidian org/Tag Taxonomy.md`
- **PARA Method Implementation.md** — `3 - Resources/Obsidian org/PARA Method Implementation.md`
- **Vault Maintenance Guide.md** — `3 - Resources/Obsidian org/Vault Maintenance Guide.md`
