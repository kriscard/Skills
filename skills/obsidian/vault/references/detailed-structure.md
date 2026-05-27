# Detailed Vault Structure

Comprehensive breakdown of the vault's folder hierarchy, files, and organizational patterns.

## Complete Folder Tree

```
obsidian-vault-kriscard/
├── 0 - Inbox/                  # Unprocessed capture zone
├── 1 - Projects/               # Active projects with deadlines
├── 2 - Areas/                  # Ongoing responsibilities
│   ├── Careers/                # Professional development
│   │   └── 1on1/               # 1-on-1 meeting notes
│   ├── Daily Ops/              # Daily notes
│   │   ├── YYYY/              # Daily notes by year
│   │   └── Weekly/             # Weekly planning by month
│   │       ├── 1 - January 2026/
│   │       └── 2 - February 2026/
│   ├── Goals/                  # OKR tracking
│   │   ├── Monthly/            # Monthly goals
│   │   ├── Quarterly/          # Quarterly OKRs
│   │   └── Yearly/             # Annual goals
│   ├── Health and self care/   # Health tracking
│   └── Relationships/          # People notes
├── 3 - Resources/              # Reference materials
│   ├── Coding/                 # Development resources
│   ├── Obsidian org/           # Vault organization docs
│   │   ├── PARA Method Implementation.md
│   │   ├── Tag MOC.md
│   │   ├── Tag Taxonomy.md
│   │   ├── Vault Maintenance Guide.md
│   │   └── Vault Organization Guide.md
│   └── TIL/                    # Today I Learned notes
├── 4 - Archives/               # Completed/inactive items
│   ├── Daily Notes/            # Old daily notes
│   └── Projects - YYYY/        # Archived projects by year
├── MOCs/                       # Maps of Content
│   ├── Master MOC.md
│   ├── TIL Index.md
│   └── [Topic] MOC.md
├── Templates/                  # Note templates
│   ├── Daily Notes.md
│   ├── Weekly Planning.md
│   ├── Monthly Goals.md
│   ├── Quarterly Goals.md
│   └── [Other templates...]
└── README.md
```

## Folder Purposes

### 0 - Inbox/
- **Purpose**: Capture zone for unprocessed notes
- **Workflow**: Process weekly, move to appropriate PARA category
- **Target**: Empty every week
- **Tags**: None needed (processing determines tags)

### 1 - Projects/
- **Purpose**: Active work with specific outcomes and deadlines
- **Criteria**:
  - Has clear deadline or target date
  - Has specific, measurable outcome
  - Requires multiple steps
  - Will move to Archives when complete
- **Tags**: Subject tag + optional `#active`
- **Examples**: "Launch website", "Complete course", "Job search"

### 2 - Areas/
- **Purpose**: Ongoing responsibilities without end dates
- **Structure**:
  - `Careers/` - Professional development
  - `Careers/1on1/` - Meeting notes
  - `Daily Ops/` - Daily notes
  - `Daily Ops/Weekly/` - Weekly planning
  - `Goals/` - OKRs (quarterly, monthly, yearly)
  - `Health and self care/` - Wellness tracking
  - `Relationships/` - People notes
- **Tags**: Subject tag only (e.g., `#career`, `#personal`)

### 3 - Resources/
- **Purpose**: Reference materials and passive information
- **Structure**:
  - `Coding/` - Development resources
  - `Obsidian org/` - Vault organization docs
  - `TIL/` - Today I Learned notes
- **Tags**: Subject tag only (e.g., `#react`, `#tools`)
- **TIL tags**: Use `til/` prefix (e.g., `#til/react`, `#til/architecture`)

### 4 - Archives/
- **Purpose**: Completed or inactive items
- **Organization**: By year or category
  - `Projects - 2026/`
  - `Daily Notes/`
- **When to archive**:
  - Projects: Completed or abandoned
  - Daily notes: After 90+ days

### MOCs/
- **Purpose**: Maps of Content for navigation AND system dashboards
- **Key distinction**: MOCs vs Dashboards (keep separate)

**MOCs (Manual Curation):**
- Hand-curated navigation with context
- Links include *why* they're connected
- Updated when important notes emerge
- Use cases:
  - Topic has 10+ related notes
  - Need curated overview of knowledge area
  - Connecting multiple projects/areas
- **Naming**: `[Topic] MOC.md`

**Dashboards (Automation):**
- Auto-generated via dataview queries
- Show stats, recent activity, tasks
- Update automatically, no manual curation
- **Naming**: `[Purpose] Dashboard.md`

**Key files**:
- `Master MOC.md` - Curated navigation hub (starred notes, entry points)
- `Vault Dashboard.md` - Auto-generated system stats (dataview queries)
- `TIL Index.md` - TIL notes organized by topic
- `[Topic] MOC.md` - Domain-specific navigation

### Templates/
- Central location for all note templates
- Applied via Templater plugin based on folder

## PARA-Aligned Tag Taxonomy

**Core principle**: Tags complement folders—don't duplicate them.

> **Folders = "What type"** (project, area, resource)
> **Tags = "What about"** (React, career, interview)

### Subject Tags (Pick 1-2)
- `javascript` - JavaScript ecosystem
- `react` - React framework
- `css` - Styling and design
- `typescript` - TypeScript features
- `web` - General web dev
- `career` - Professional development
- `personal` - Health, goals, life
- `tools` - Dev tools and workflows

### Status Tags (Optional)
- `active` - Currently working on
- `interview` - Job interview prep

### Flashcard Tags
- `flashcards` + `[topic]_flashcards`
- Essential for spaced repetition

### TIL Tags
- Use `til/` prefix: `til/react`, `til/architecture`, `til/testing`

### Tags NOT to Use
Folder already handles these:
- ~~`project`~~ → `1 - Projects/`
- ~~`area`~~ → `2 - Areas/`
- ~~`reference`~~ → `3 - Resources/`
- ~~`daily`~~ → `2 - Areas/Daily Ops/`
- ~~`moc`~~ → `MOCs/`
- ~~`meeting`~~ → File location

## File Naming Conventions

### Daily Notes
```
2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md
```

### Weekly Planning
```
2 - Areas/Daily Ops/Weekly/M - Month YYYY/YYYY-Www.md
```
Example: `2 - Areas/Daily Ops/Weekly/2 - February 2026/2026-W06.md`

### Monthly Goals
```
2 - Areas/Goals/Monthly/M - Month YYYY.md
```
Example: `2 - Areas/Goals/Monthly/2 - February 2026.md`

### Quarterly Goals
```
2 - Areas/Goals/Quarterly/Quaterly Goals - QN YYYY.md
```
Note: Typo "Quaterly" is preserved for compatibility

### TIL Notes
```
3 - Resources/TIL/til-YYYY-MM-DD.md
```

### Projects
```
1 - Projects/[Project Name]/[Note Name].md
```

### MOCs
```
MOCs/[Topic] MOC.md
```

## Metadata Patterns

### Project Notes (in 1 - Projects/)
```yaml
---
created: 2026-01-15
tags: [react, active]  # Subject + status only
status: active
deadline: 2026-03-01
---
```

### Resource Notes (in 3 - Resources/)
```yaml
---
created: 2026-01-15
tags: [react]  # Subject only
source: https://example.com
---
```

### TIL Notes (in 3 - Resources/TIL/)
```yaml
---
date: "2026-01-15"
tags:
  - til/react
  - til/hooks
  - til/architecture
---
```

### Flashcard Notes
```yaml
---
tags: [flashcards, react, react_flashcards, interview]
---
```

## Dataview Query Patterns

### Active Projects
```dataview
TABLE status, deadline
FROM "1 - Projects"
WHERE !contains(file.folder, "Archive")
SORT deadline ASC
```

### Unprocessed Inbox
```dataview
LIST
FROM "0 - Inbox"
```

### Recent Daily Notes
```dataview
LIST
FROM "2 - Areas/Daily Ops"
WHERE !contains(file.folder, "Weekly")
SORT file.name DESC
LIMIT 7
```

### TIL Notes by Topic
```dataview
TABLE file.tags as "Topics"
FROM "3 - Resources/TIL"
WHERE contains(tags, "til/react")
SORT file.name DESC
```

### All React Content (Cross-Category)
```dataview
LIST
FROM #react
SORT file.mtime DESC
```

## Maintenance Patterns

### Weekly Checklist
- [ ] Process inbox to zero
- [ ] Review active projects
- [ ] Update weekly planning
- [ ] Check OKRs

### Monthly Checklist
- [ ] Review all areas
- [ ] Archive completed projects
- [ ] Update MOCs
- [ ] Remove redundant folder-type tags
- [ ] Check broken links

### Quarterly Checklist
- [ ] Review quarterly OKRs
- [ ] Archive old daily notes (90+ days)
- [ ] Consolidate resources
- [ ] Vault structure review

## Template to Folder Mapping

Configured in Templater plugin:

| Folder | Template |
|--------|----------|
| `3 - Resources/Books` | `Book Reviews.md` |
| `3 - Resources/Coding` | `Learning.md` |
| `2 - Areas/Relationships` | `People.md` |
| `2 - Areas/Careers/1on1` | `1-on-1 Meeting Notes.md` |
| `0 - Inbox` | `General Notes.md` |

## Common Operations

### Creating New Projects
1. Create note in `1 - Projects/[Project Name]/`
2. Use `Project Brief.md` template
3. Tag: Subject + `#active` (e.g., `[react, active]`)
4. Link to parent area
5. Add to weekly planning

### Processing Inbox
1. Read note content
2. Decide PARA category based on actionability
3. Move to appropriate folder
4. Add subject tag only (folder handles content type)
5. Link to related notes

### Moving Notes Between Categories
1. Use Obsidian file move (preserves links)
2. Update tags (remove old folder-type tags if any)
3. Update relevant MOCs

This detailed structure serves as a complete reference for understanding the vault's organization, patterns, and conventions aligned with pure PARA methodology.
