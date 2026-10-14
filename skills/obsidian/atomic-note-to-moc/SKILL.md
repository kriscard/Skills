---
name: atomic-note-to-moc
description: >-
  Integrate an atomic note with the vault's MOC system and related notes. Use after creating or saving
  an atomic note that needs folder or tag classification, anchor consideration, or cross-links.
---

# Atomic Note to MOC

Integrate one existing atomic note into the vault's Base-backed MOCs without turning every note into a
curated anchor.

## 1. Establish the contract

Read the vault's `AGENTS.md` and `../vault/SKILL.md`. Resolve the target note, its owner, and its current
folder and metadata. Resolve the MOC and Base directories from the schema. Read candidate MOCs and
their actual embedded Base definitions, including any compatibility lists, to learn their filters.

Treat agent-owned notes as writable through the vault safe-write flow. For human-owned notes, present
recommendations without modifying them.

Completion: the target note, its write boundary, candidate MOCs, and the exact Base filters that could
include it are known.

## 2. Classify the note

Check whether the note already appears in the relevant Base. If it does, leave its classification
alone. If it does not, distinguish a genuinely missing topic tag from a stale folder filter or
compatibility list. Keep reusable knowledge in its schema-defined location rather than moving it to
satisfy an old query. Read the live tag guide before proposing tag changes.

Preserve ownership and unrelated metadata. Propose an index entry when the schema requires one;
register it only within an approved write set.

A MOC's hard-linked anchors are curated entry points. Propose a direct MOC link only when the note is
important enough to serve as an anchor; ordinary notes belong in the Base only. If no current MOC or
Base fits, ask whether to extend an existing Base, create a new MOC, or leave the note unclassified.

Preview every proposed note, index, Base, or MOC mutation and obtain approval through the vault
safe-write flow before applying it.

Completion: the approved classification makes the note discoverable through the relevant Base, any
required index entry exists, and no MOC anchor was added without explicit approval.

## 3. Propose connections

Explore notes surfaced by the relevant MOCs and Bases. Suggest only connections that clarify or
qualify the target note's single insight. Show the exact proposed links and obtain approval before
modifying the target or any related note.

After approved edits, reread every changed file and report exactly what changed.

Completion: meaningful cross-links were proposed, declined or approved explicitly, and every approved
change was verified without broadening either note's subject.

## Preserve atomicity

| Do | Avoid |
| --- | --- |
| Add a brief link that adds nuance | Add an explanation that expands the note's scope |
| Suggest connections before editing | Turn a note into a discussion hub |
| Keep the title and first paragraph sufficient | Make another note required to understand the insight |

Before proposing a cross-link, ask:

- Does the title still capture the complete insight?
- Can the first paragraph stand on its own?
- Would this link change what the note is fundamentally about?

When a link would change the subject, present it as a related-note suggestion instead of an edit.

## Verify discovery

After an approved change, query or render the affected Base and confirm that the target note appears.
A valid filter file alone does not prove membership. Preserve the MOC's existing Base embed and
unrelated anchors. If the query cannot be verified, report that limitation instead of claiming the
note is integrated.
