# Maintain Vault Command

Run a comprehensive vault health check. **Read-only** — no changes made automatically.

## Step 1: Wiki Lint (Karpathy pattern)

Audit the wiki layer in `3 - Resources/` before structural checks.

### W1. Orphan wiki pages
Pages with `source: claude-memory` frontmatter that have zero inbound links. Dead ends — either link them from related pages or flag for deletion.
```bash
obsidian orphans
```

### W2. Concepts without pages
Scan recent `index.md` entries and wiki pages for concept names mentioned in prose but lacking their own page in `3 - Resources/`. List candidates.

### W3. Contradictions
Read pairs of related wiki pages in `3 - Resources/Coding/` and `3 - Resources/Concepts/`. Flag conflicting claims.

### W4. Stale sources
Check `index.md` Articles/Videos/Tweets entries. Flag sources older than 6 months whose wiki pages may need revisiting.

### W5. Sources not in index
Files in `3 - Resources/Articles|Tweets|Videos/` not listed in `index.md`:
```bash
obsidian files folder="3 - Resources/Articles/" format=json
```
Cross-check against `index.md` sections.

### W6. Missing cross-references
Related concept pages that don't link each other. Use `obsidian search` on page titles to find semantic neighbors, check if wikilinked.

After wiki lint, append to `log.md`:
```
## [YYYY-MM-DD] lint | <summary of findings>
```

## Step 2: Link Health

Delegate to the **link-maintainer agent** for:
- Broken links (`obsidian unresolved verbose counts`)
- Orphaned notes (`obsidian orphans`)
- 2-Link Rule violations
- Unlinked mention opportunities

## Step 3: Tag Consistency

Delegate to the **tag-optimizer agent** for:
- Redundant folder-type tags
- Notes exceeding 4-tag limit
- Missing `til/` prefixes
- Tag consolidation opportunities

## Step 4: Vault Statistics

```bash
obsidian vault info=files         # total file counts
obsidian tasks todo total         # outstanding tasks
obsidian tasks todo path="1 - Projects/" total
obsidian orphans total
obsidian deadends total
obsidian unresolved total
```

## Summary Report

```
Vault Health Check Complete!

Wiki Lint: [X issues found]
- W1 Orphan wiki pages: X
- W2 Concepts without pages: X
- W3 Contradictions: X
- W4 Stale sources: X
- W5 Sources not in index: X
- W6 Missing cross-references: X

Link Health: [handled by link-maintainer agent]
Tag Health: [handled by tag-optimizer agent]

Vault Stats:
- Total files: X | Orphans: X | Dead ends: X | Broken links: X
- Outstanding tasks: X (Projects: X)

Overall: Good / Needs attention / Critical
Priority fixes: [top 3 issues]
```

**Health thresholds:** Good = <10 total issues | Needs attention = 10–30 | Critical = >30 or many broken links in active notes
