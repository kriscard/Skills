> **Read this when:** user asks about Dataview queries, dynamic MOC content, vault dashboards, or automating note organization views.

## Dataview Patterns for This Vault

The vault has Dataview installed. Use these patterns for dynamic views in notes.

### Active Projects Dashboard

````markdown
```dataview
TABLE status, due-date as "Due", file.mtime as "Last Updated"
FROM "1 - Projects"
WHERE !contains(file.folder, "Archive")
SORT due-date ASC
```
````

### Orphaned Notes (no backlinks)

````markdown
```dataview
TABLE file.inlinks as "Backlinks"
WHERE length(file.inlinks) = 0
AND !contains(file.folder, "4 - Archives")
AND !contains(file.folder, "Templates")
```
````

### Inbox Status

````markdown
```dataview
LIST
FROM "0 - Inbox"
SORT file.ctime DESC
```
````

### TIL Notes by Topic

````markdown
```dataview
TABLE file.tags as "Topics", file.ctime as "Date"
FROM "3 - Resources/TIL"
SORT file.ctime DESC
LIMIT 20
```
````

### Books Reading List

````markdown
```dataview
TABLE status, rating, author
FROM "3 - Resources/Books"
WHERE status != "read"
SORT rating DESC
```
````

### Recent Daily Notes

````markdown
```dataview
LIST
FROM "2 - Areas/Daily Ops"
WHERE file.day >= date(today) - dur(14 days)
SORT file.day DESC
```
````

### OKR Progress by Quarter

````markdown
```dataview
TABLE status, due-date as "Target"
FROM "2 - Areas/Goals"
WHERE contains(file.name, "Goals")
SORT file.ctime DESC
```
````

### Notes Modified This Week

````markdown
```dataview
TABLE file.mtime as "Modified", file.folder as "Location"
WHERE file.mtime >= date(today) - dur(7 days)
AND !contains(file.folder, "Daily Ops")
SORT file.mtime DESC
LIMIT 20
```
````

## When to Use Dataview vs Bases

| Use case | Tool |
|---|---|
| Simple list/table view | Either (Bases is lower friction) |
| Complex filtering across PARA | Dataview |
| Dashboard embedded in a note | Dataview |
| Standalone tracker (OKR, books) | Obsidian Bases (`.base` files) |
| Sharing with non-Obsidian tools | Bases (portable format) |

The vault already has 6 `.base` files for dashboards — check those before creating new Dataview queries for the same data.
