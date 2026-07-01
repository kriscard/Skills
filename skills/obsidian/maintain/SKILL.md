---
name: maintain
description: >-
  Runs a read-only health check on the Obsidian vault — finds broken links, orphaned notes, tag
  inconsistencies, and wiki issues, then reports prioritized fixes. Make sure to use this skill
  whenever the user says "vault health check", "fix broken links", "clean up my vault", "vault
  maintenance", or runs /maintain. Never modifies anything without explicit request — this skill
  diagnoses, it doesn't operate.
user-invocable: true
---

# Vault Maintenance

Read-only health audit. Diagnoses issues across four dimensions: wiki quality, link integrity, tag
consistency, and overall stats. Reports findings with prioritized fixes — then waits for the user to
decide what to act on.

**Never modify a note without an explicit "fix this" instruction.**

This skill checks integrity (links, tags, wiki quality). For PARA structure on Projects and Areas —
stalled projects, missing outcomes/deadlines, done-but-not-archived — use `audit-para`.

## Step 1 — Wiki Lint (`3 - Resources/` layer)

Audit the wiki layer before structural checks. Six checks:

**W1. Orphan wiki pages** — pages with `source: claude-memory` frontmatter that have zero inbound
links:

```bash
obsidian orphans
```

**W2. Concepts without pages** — scan `index.md` and wiki pages for concept names mentioned in prose
but lacking their own page in `3 - Resources/`.

**W3. Contradictions** — read pairs of related wiki pages in `3 - Resources/Coding/` and
`3 - Resources/Concepts/`. Flag conflicting claims.

**W4. Stale sources** — check `index.md` Articles/Videos/Tweets entries. Flag sources older than 6
months whose wiki pages may need revisiting.

**W5. Sources not in index** — files in `3 - Resources/Articles/`, `3 - Resources/Tweets/`,
`3 - Resources/Videos/` not listed in `index.md`:

```bash
obsidian files folder="3 - Resources/Articles/" format=json
obsidian files folder="3 - Resources/Tweets/" format=json
obsidian files folder="3 - Resources/Videos/" format=json
```

Cross-check each against `index.md` sections.

**W6. Missing cross-references** — related concept pages that don't link each other. Use
`obsidian search` on page titles to find semantic neighbors, check if wikilinked.

After wiki lint, keep findings in the report only. Do not append to `log.md`; this skill is
read-only until the user explicitly asks for a fix.

## Step 2 — Link Health

For deep link analysis, delegate to the **link-maintainer agent** which handles the 2-Link Rule and
unlinked mention checks. For a quick check:

```bash
obsidian unresolved verbose counts
obsidian orphans total
obsidian deadends total
```

Capture:

- Count of broken/unresolved links
- Count of orphaned notes (no inbound links)
- Count of dead-end notes (no outgoing links)
- Most-linked-to missing targets (high-impact fixes first)

## Step 3 — Tag Consistency

For deep tag analysis, delegate to the **tag-optimizer agent**. For a quick check:

```bash
obsidian tags counts sort=count
```

Scan for:

- **Redundant tags**: tags that duplicate folder location (e.g., `#project` on a note already in
  `1 - Projects/`)
- **Notes exceeding 4-tag limit**: more than 4 tags is a signal of unclear categorization
- **TIL notes missing `til/` prefix**: any tags in `3 - Resources/TIL/` notes that don't follow the
  `til/<tech>` convention
- **Tags to consolidate**: near-duplicates (`js` → `javascript`)

## Step 4 — Stats

Run all in parallel:

```bash
obsidian vault info=files
obsidian tasks todo total
obsidian orphans total
obsidian deadends total
obsidian unresolved total
```

## Report Format

```
Vault Health Check Complete!

Wiki Lint: X issues
- W1 Orphan wiki pages: X
- W2 Concepts without pages: X
- W3 Contradictions: X
- W4 Stale sources: X
- W5 Sources not in index: X
- W6 Missing cross-references: X

Link Health: X broken | X orphans | X dead ends
Tag Health:  X redundant | X over-limit | X missing til/

Stats: X files | X orphans | X dead ends | X broken links
       X outstanding tasks (Projects: X)

Overall: Good / Needs Attention / Critical
Priority fixes: [top 3 issues]
```

**Health thresholds:**

- **Good**: < 10 total issues
- **Needs Attention**: 10–30 issues
- **Critical**: > 30 issues or many broken links in active notes

After the report, ask: "Want me to fix any of these?" Only then act. Completion: no notes have
been modified, every issue in the report includes a source/path or command output summary, and the
top 3 priority fixes are listed.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| Optional | Need weekly/monthly/quarterly maintenance checklists | `references/maintenance-checklists.md` |
