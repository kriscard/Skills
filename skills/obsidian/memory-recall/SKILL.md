---
name: memory-recall
description: >-
  Searches the Obsidian vault for prior knowledge, past decisions, and accumulated learnings — and
  finds unexpected connections between domains. Make sure to use this skill whenever the user asks
  "do I have notes on", "what did I write about", "find in my vault", "check my notes about", "have
  I learned about", "what did I decide about", "connect [A] and [B]", "find bridges between", or any
  phrasing that implies consulting personal vault knowledge rather than answering from general
  knowledge. Also fires when user references prior sessions or wants to know what they already know
  about a topic.
---

# Memory Recall

Surface what the user already knows from their vault before answering from training data. The vault
is the source of truth for personal decisions, accumulated learnings, and prior context.

## Recall Flow

Run steps in order — stop as soon as you have strong results.

### Step 1 — Search Resources first (for concepts and reference knowledge)

```bash
obsidian search query="<topic>"
```

For concepts, wiki pages, and reference material, check `3 - Resources/` first:

```bash
obsidian files folder="3 - Resources/" format=json
```

### Step 2 — Check TIL for past learnings

```bash
obsidian files folder="3 - Resources/TIL/" format=json
```

Filter by date range if the user specified a time window. Read the most relevant TIL notes directly.

### Step 3 — Check Projects for project-specific context

```bash
obsidian files folder="1 - Projects/" format=json
```

Read the relevant project note if the topic is project-specific.

### Step 4 — Keyword fallback

If the above searches miss, try a context search for surrounding lines:

```bash
obsidian search:context query="<topic>" limit=10
```

### Step 5 — Scan recent daily notes (last resort)

If the topic is recent and might only live in daily notes:

```bash
obsidian read path="2 - Areas/Daily Ops/2026/YYYY-MM-DD.md"
```

## How to Report Findings

**Always cite the source** — include the file path so the user can navigate to the note:
`3 - Resources/TIL/til-2026-03-12.md`

**Synthesize, don't dump.** If multiple notes cover the topic, summarize what they collectively say.
Paste full content only if explicitly requested.

**Be honest about gaps.** If the vault doesn't cover the topic, say so explicitly. Then offer to
answer from general knowledge.

**Distinguish note types:**

- TIL notes (`3 - Resources/TIL/`) = first-person learning captures
- Resource notes (`3 - Resources/`) = reference and wiki material
- Project notes (`1 - Projects/`) = project-specific context and decisions

## Connection Discovery Mode

When the user asks to connect two domains (e.g., "connect design and engineering"):

### Step 1 — Map Each Domain

```bash
obsidian search query="<domain A>" format=json
obsidian search query="<domain B>" format=json
```

Read key notes. Follow backlinks 2–3 hops from hub notes in each domain. If one domain has
significantly fewer notes, go 3–4 hops deep on the sparse one — the less-explored side is where
surprises are.

### Step 2 — Find Overlaps

- **Shared references**: notes in both domains' backlink chains
- **Shared themes**: same concept appearing in both, even if notes aren't linked
- **Shared patterns**: both domains facing the same problem or stuck on the same question

### Step 3 — Synthesize

For each bridge found:

```
Bridge [#]: [Title]
  In Domain A: [how it appears]
  In Domain B: [how it appears differently]
  The connection: [what links them]
  Depth: Surface / Structural / Foundational
  Implication: [what this suggests for either domain]
```

Surface the strongest bridge and any **missing links** — connections that should exist but haven't
been made. Suggest specific notes to link or create.

**The test**: the best output makes you see both domains differently. Don't force connections — if
domains genuinely don't connect, say so.

## What NOT to do

- Don't write or modify notes — recall is strictly read-only
- Don't hallucinate citations — if you can't find a note, say "no match found"
- Don't dump full notes unless explicitly asked
