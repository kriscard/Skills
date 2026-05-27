> **Read this when:** user asks about MOC structure, hierarchical MOCs, dynamic MOCs with Dataview, or when to create a MOC vs. a note.

## MOC Patterns (Maps of Content)

MOCs are hand-curated navigation hubs — not auto-generated lists. Each link includes WHY it's connected.

### MOC Template Structure

```markdown
# [Topic] MOC

## Overview
One paragraph: what this domain covers and why it matters.

## Core Concepts
- [[Concept A]] — foundation for understanding X
- [[Concept B]] — see also [[Concept A]]

## Projects Using This
- [[Project Name]] — applying [concept] to [outcome]

## Resources
- [[Book: Title]] — best introduction
- [[Tutorial: Topic]] — hands-on reference

## TIL Notes
- [[TIL 2026-02-05]] — discovered [insight]

## Open Questions
- How does X relate to Y?
```

### Hierarchical MOC Architecture

```
Web Development (Domain MOC)
├── Frontend Frameworks (Topic MOC)
│   ├── React Patterns (concept note)
│   └── React 19 Features (concept note)
├── Backend Architecture (Topic MOC)
└── DevOps Practices (Topic MOC)
```

**Rule:** Create a Topic MOC when a Domain MOC has 10+ direct links and they cluster into themes.

### When to Create a MOC vs When to Wait

**Create now if:**
- A topic has 10+ related notes that need navigation
- You keep manually searching for notes in the same domain
- A project ends and leaves behind a cluster of resources worth preserving

**Wait if:**
- Fewer than 10 notes (premature MOCs become maintenance burden)
- Notes don't naturally cluster — forcing structure where none exists
- Topic is fully covered by one comprehensive note

### Dynamic MOCs with Dataview

Combine hand-curated "Core Concepts" with dynamic recent activity:

````markdown
# React MOC

## Core Concepts (hand-curated)
- [[React Patterns]] — component composition
- [[React 19 Features]] — server components, actions

## Recent Notes (auto-updated)
```dataview
TABLE file.ctime as "Date"
FROM #react
SORT file.ctime DESC
LIMIT 10
```

## TIL Notes
```dataview
LIST
FROM "3 - Resources/TIL"
WHERE contains(file.tags, "til/react")
SORT file.ctime DESC
```
````

**Hybrid approach:** Static hand-curation for conceptual structure + Dataview for recency. Never pure auto-generated MOCs — they lose the WHY behind connections.

### MOC Review Cadence

- **Monthly**: Add new notes created that month if they belong
- **Quarterly**: Prune links to archived notes, add new topic MOCs if warranted
- Don't update MOCs daily — the value is in curated, not exhaustive, lists
