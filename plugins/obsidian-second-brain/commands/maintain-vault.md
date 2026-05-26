# Maintain Vault Command

Run a comprehensive vault health check to identify and report issues. This is **read-only** — no changes are made automatically.

## Wiki Lint (Karpathy pattern)

Before structural checks, audit the wiki layer in `3 - Resources/`:

### W1. Orphan wiki pages
Pages with `source: claude-memory` that have zero inbound links. These are dead ends — either link them from related pages or flag for deletion.

### W2. Concepts without pages
Scan recent `index.md` entries and wiki pages for concept names mentioned in prose but lacking their own page in `3 - Resources/`. List candidates.

### W3. Contradictions
Read pairs of related wiki pages and flag where claims conflict. Focus on `3 - Resources/Coding/` and `3 - Resources/Concepts/`.

### W4. Stale sources
Check `index.md` Articles/Videos/Tweets entries. Flag any source older than 6 months whose wiki pages may need revisiting given newer content.

### W5. Sources not in index
Files in `3 - Resources/Articles|Tweets|Videos/` not listed in `index.md`. Run:
```bash
obsidian files folder="3 - Resources/Articles/" format=json
```
Cross-check against index.md sections.

### W6. Missing cross-references
Related concept pages that don't link to each other. Use `qmd query` on page titles to find semantic neighbors, then check if they're wikilinked.

Append to log.md after lint:
```
## [YYYY-MM-DD] lint | <summary of findings>
```

## Obsidian Access

Use Obsidian CLI commands directly via Bash. If a CLI command fails, tell the user "Obsidian CLI isn't working — update Obsidian with CLI enabled."

## Checks to Run

### 1. Broken Links
Find `[[wiki links]]` pointing to non-existent notes. Use `obsidian unresolved verbose counts` to get all broken links with referencing notes. For each: show link target, all referencing notes, and suggest fixes.

### 2. Orphaned Notes
Notes with zero incoming links (excluding Templates/, Archives/, daily notes < 7 days old). Use `obsidian orphans` to find them. Suggest linking opportunities or archiving.

### 3. 2-Link Rule Violations
Notes with fewer than 2 outgoing links (excluding Templates/, Archives/, Daily Ops/). Suggest connections.

### 4. Unlinked Mentions
Text matching existing note titles that isn't linked. Focus on `3 - Resources/Coding/`, `3 - Resources/TIL/`, `1 - Projects/`.

### 5. Missing Related Sections
Concept notes in `3 - Resources/Coding/` without `## Related` section.

### 6. Missing Encounters Sections
Learning notes in `3 - Resources/Coding/` without `# Encounters` section.

### 7. TIL Cross-References
TIL notes linking to concepts whose Encounters section doesn't reference back.

### 8. Tag Consistency
Check against Tag Taxonomy (`3 - Resources/Obsidian org/Tag Taxonomy.md`):
- Max 4 tags per note
- No redundant folder-type tags (project, area, reference, daily, moc)
- TIL notes use `til/` prefix
- Only valid taxonomy tags

### 9. Vault Statistics
Gather overall vault health numbers using:
- `obsidian vault info=files` — total file counts
- `obsidian tasks todo total` — outstanding tasks across vault
- `obsidian tasks todo path="1 - Projects/" total` — project-specific task counts
- `obsidian orphans total` — orphaned note count
- `obsidian deadends total` — deadend note count
- `obsidian unresolved total` — unresolved link count

## Summary Report

```
Vault Health Check Complete!

Link Health:
- Broken links: X found
- Orphaned notes: Y found
- 2-Link Rule violations: Z found
- Unlinked mentions: W found

Structure Health:
- Missing Related sections: A found
- Missing Encounters sections: B found
- TIL cross-references missing: C found

Tag Health:
- Tag issues: D found

Overall health: Good / Needs attention / Critical

Priority fixes:
1. [Most impactful issue]
2. [Second priority]
3. [Third priority]
```

**Health assessment:**
- **Good**: <10 issues total
- **Needs attention**: 10-30 issues
- **Critical**: >30 issues or many broken links

**Priority order:** Broken links > 2-Link violations > Missing Related > Unlinked mentions > Missing Encounters > TIL cross-refs > Tags

## CLI Commands

```bash
obsidian unresolved verbose counts
obsidian unresolved total
obsidian orphans total
obsidian orphans
obsidian deadends total
obsidian deadends
obsidian tags counts sort=count
obsidian tasks todo total
obsidian tasks todo path="1 - Projects/" total
obsidian read path="3 - Resources/Obsidian org/Tag Taxonomy.md"
obsidian files folder="3 - Resources/Coding/" format=json
obsidian files format=json
obsidian vault info=files
```
