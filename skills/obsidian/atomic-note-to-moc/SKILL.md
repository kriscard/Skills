---
name: atomic-note-to-moc
description: >-
  Integrate an atomic note with the vault's MOC system and related notes. Use after creating or saving
  an atomic note that needs folder or tag classification, anchor consideration, or cross-links.
---

# Atomic Note to MOC

Classify one existing atomic note and, when requested, integrate it into the vault's Base-backed
MOCs without turning every note into a curated anchor.

## 1. Establish the contract

Read the vault's `AGENTS.md` and `../vault/SKILL.md`. Resolve the target note, its owner, and its current
folder and metadata. Resolve the MOC and Base directories from the schema. Read candidate MOCs and
their actual embedded Base definitions, including any compatibility lists, to learn their filters.

Use live permissions and the vault safe-write flow. For human-owned notes, preserve user prose;
exact explicitly approved tag metadata may change where live `AGENTS.md` permits it. Present other
recommendations without modifying human writing.

Completion: the target note, its write boundary, candidate MOCs, and the exact Base filters that could
include it are known.

## 2. Classify the note

Evaluate tags under the shared vault tag contract, independently of Base membership. A note's
presence in a Base does not prove correct classification; absence does not prove missing tags.
Distinguish taxonomy-grounded classification from stale folder filters or compatibility lists.
Keep reusable knowledge in its schema-defined location; add no tags or moves just to satisfy an
old query. Read dependencies and report impact, keeping Base/plugin changes outside tagging scope.

Preserve ownership and unrelated metadata. Propose an index entry when the schema requires one;
register it only within an approved write set.

A MOC's hard-linked anchors are curated entry points. Propose a direct MOC link only when the note is
important enough to serve as an anchor; ordinary notes need no curated anchor. If no current MOC or
Base fits, classification can still be complete. A missing MOC requires neither a new Base nor
invented classification. If MOC integration was requested, report the gap and ask whether a separate
MOC/Base change is wanted.

Preview every proposed note, index, Base, or MOC mutation and obtain approval through the vault
safe-write flow before applying it.

Completion: taxonomy-grounded classification is resolved or its ambiguity reported, approved tag
deltas are verified, any required index entry exists, and no MOC anchor was added without explicit
approval. Ordinary classification does not require Base integration.

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

When Base-backed MOC integration is actually requested, query or render the affected Base after
approved integration changes and confirm that the target note appears.
A valid filter file alone does not prove membership. Preserve the MOC's existing Base embed and
unrelated anchors. If the query cannot be verified, report that limitation instead of claiming the
note is integrated.
