> **Read this when:** user asks about advanced linking strategies, block references, inline vs reference-style links, or precision linking techniques.

## Advanced Linking Strategies

### Block References for Precision

Link specific paragraphs, not entire notes:

```markdown
## In Source Note
This is an important insight. ^key-insight

## In Referencing Note
As noted: ![[Source Note#^key-insight]]
```

Use when: quoting specific claims in arguments, referencing exact specs in projects, building composite documents, tracking idea evolution.

### Contextual Backlinks

When reviewing backlinks, add context to the link so future-you knows why the connection exists:

```markdown
## Mentioned In
[[Other Note]] - Discusses related concept X
[[Project Note]] - Application in [Project Name]
```

### Alias System for Common Terms

```markdown
---
aliases: [ML, machine learning, ML models]
---
# Machine Learning
```

Now `[[ML]]` auto-links to this note. Use for acronyms, alternative names, common misspellings.

### Inline vs Reference-style Links

**Inline** (default, most notes): `The [[PARA Method]] organizes notes by actionability.`

**Reference-style** (long-form writing): Use when multiple references to same note or publishing outside Obsidian.

## Evergreen Note Structure (3-Layer)

**Layer 1 — Definition:** Core explanation in your own words. Rarely changes.

**Layer 2 — Related:** 2–5 links with explicit reasons:
```markdown
## Related
- [[Event Loop]] — closures power async callbacks
- [[Garbage Collection]] — closures affect GC behavior
```

**Layer 3 — Encounters:** Real-world usage added over time:
```markdown
# Encounters
## 2026-02-05 - Debugging closure scope issue
Discovered closures in forEach captured loop variable by reference.
Link: [[TIL 2026-02-05]]
```

Layer 3 (Encounters) is the most valuable and most neglected — actively add encounters when revisiting concept notes.
