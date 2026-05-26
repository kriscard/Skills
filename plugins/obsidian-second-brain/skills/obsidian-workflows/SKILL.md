---
name: obsidian-workflows
disable-model-invocation: true
description: >-
  Organizes Obsidian vaults using PARA methodology, progressive summarization, and
  PKM workflows including inbox processing, Maps of Content, and review cadences.
  Make sure to use this skill whenever the user asks about organizing notes, second
  brain, inbox processing, MOCs, review cadences, PARA method, or knowledge
  management — even if they just say "how should I organize my notes?"
version: 0.1.0
---

# Obsidian Workflows & Second Brain Methodology

Actionable guidance for building and maintaining a second brain in Obsidian. This skill focuses on workflows and decisions — not PARA theory (Claude already knows that).

## PARA Quick Reference

Organize by **actionability**, not topic:

| Category | What Goes Here | Review Cadence |
|----------|---------------|----------------|
| **Projects** | Active work with clear endpoints | Weekly |
| **Areas** | Ongoing responsibilities, no endpoint | Monthly |
| **Resources** | Reference materials, future interest | Quarterly |
| **Archives** | Completed/inactive from above | Annually |

When in doubt: "Does this have a deadline or clear outcome?" Yes = Project. "Is this an ongoing responsibility?" Yes = Area. Otherwise = Resource.

## Key Workflows

### Capture (minimize friction)

1. Drop everything into Inbox
2. Minimal formatting — structure comes later
3. One idea per note (atomic)
4. Include source and why it matters
5. Tag as `#inbox` for processing

### Inbox Processing (weekly review, 30 min)

For each inbox note, decide:
- **Delete** — Not useful, was impulse capture
- **Archive** — Useful reference but no action needed now
- **Elaborate** — Add context, links, tags, then move to PARA category

Target: empty inbox weekly.

### Review Cadences

| Cadence | Time | What to Do |
|---------|------|------------|
| **Daily** | 5 min | Create daily note, review active projects, process quick captures |
| **Weekly** | 30 min | Process inbox completely, review all projects, update areas, clean loose ends |
| **Monthly** | 1 hour | Review areas, archive completed projects, check OKRs/goals, update MOCs |
| **Quarterly** | 2 hours | Strategic review, archive inactive resources, consolidate tags, adjust PARA |

## Linking Rules

### The 2-Link Rule

Every new note links to at least 2 existing notes. This prevents orphans and forces context-building. Ask "What does this connect to?" before saving.

### MOCs vs Dashboards

Keep these separate — they serve different purposes:

**MOCs (Maps of Content)** — Hand-curated navigation. Each link includes *why* it's connected. Create when a topic has 10+ related notes. Updated intentionally, not constantly.

**Dashboards** — Auto-generated views (dataview queries). Show recent activity, stats, tasks. No manual curation needed.

### When to Create a MOC

- Topic has 10+ related notes
- Need an overview of a knowledge area
- Connecting notes across multiple PARA categories
- Want curated navigation (not just a flat list)

## Evergreen Notes (3-Layer Pattern)

Concept notes that grow over time:

**Layer 1 — Definition:** What is this concept? Your own words, core explanation. Rarely changes.

**Layer 2 — Related:** How does this connect? 2-5 links with *reasons*:
```markdown
## Related
- [[Event Loop]] — closures power async callbacks
- [[Garbage Collection]] — closures affect GC behavior
```

**Layer 3 — Encounters:** Real-world usage added over time:
```markdown
# Encounters

## 2026-02-05 - Debugging closure scope issue
Discovered that closures in a forEach loop captured the loop variable by reference.
Link: [[TIL 2026-02-05]]
```

Use Outgoing Links panel to discover connections you missed.

## Progressive Summarization

Refine notes just-in-time (when you revisit them, not when you capture):

1. **Capture** — Full source material
2. **Bold** — Key passages (10-20% of content)
3. **Highlight** — Within bold (10-20% of that)
4. **Summarize** — 2-3 sentence executive summary at top
5. **Remix** — Create new output from distilled knowledge

Apply layers only when you return to a note for a specific purpose. Don't process everything upfront.

## Gotchas

- Inbox zero is a target cadence, not a daily requirement — weekly processing is the realistic goal
- Don't create MOCs prematurely — wait for 10+ related notes; premature MOCs become maintenance burden
- Progressive Summarization is just-in-time, not upfront — only bold/highlight when you RETURN to a note for a purpose
- The 2-Link Rule ("every note links to at least 2 existing notes") is easy to skip under time pressure — enforce it, orphaned notes are lost knowledge
- Evergreen notes Layer 3 (Encounters) is the most valuable but most neglected — actively prompt to add real-world encounters when revisiting concept notes
- Review cadences will drift — anchor them to existing habits (daily standup, weekly planning meeting)

## Reference Files

| Reference | Load when |
|-----------|-----------|
| `references/advanced-workflows.md` | User asks about advanced linking, block references, evergreen note structure |
| `references/dataview-patterns.md` | User asks about Dataview queries, dynamic views, vault dashboards |
| `references/moc-advanced.md` | User asks about MOC architecture, hierarchical MOCs, dynamic MOCs |
| `references/para-deep-dive.md` | User wants deep PARA methodology, project/area/resource nuances |

## Integration with Plugin Commands

This skill informs all plugin commands and agents:
- `/daily-startup` uses daily note workflow patterns
- `/process-inbox` delegates to para-organizer agent for PARA placement
- `/review-okrs` delegates to okr-tracker agent for reviews
- `/maintain-vault` delegates link and tag checks to specialist agents
- `/ideas` surfaces emergent ideas and promotes daily note candidates
