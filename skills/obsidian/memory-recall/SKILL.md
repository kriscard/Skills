---
name: memory-recall
description: >-
  Searches the Obsidian vault for prior knowledge, past decisions, and accumulated learnings — and
  finds unexpected connections between domains. Make sure to use this skill whenever the user asks
  "do I have notes on", "what do I know about", "what did I write about", "find in my vault", "check
  my notes about", "have I learned about", "what did I decide about", "connect [A] and [B]", "find
  bridges between", or any phrasing that implies consulting personal vault knowledge rather than
  answering from general knowledge. Also fires when user references prior sessions or wants to know
  what they already know about a topic.
user-invocable: true
argument-hint: '[topic — omit to infer from context]'
---

# Memory Recall

Surface what the user already knows from their vault before answering from training data. The vault
is the source of truth for personal decisions, accumulated learnings, and prior context.

**Recall is index-first (Karpathy's LLM-wiki principle).** Read the catalog (`index.md`) first to
find relevant pages, then drill into those pages. qmd is a search accelerator used only when the
index alone is not enough. This is faithful to the wiki pattern and works better than blind semantic
retrieval at this scale.

If `$ARGUMENTS` is provided (e.g. `/memory-recall what do I know about useEffect`), that string is
the topic. Otherwise infer the topic from the conversation.

## Tool roles (the hybrid)

- **`index.md`** = the curated catalog. Read FIRST. The navigation map: titles, one-line summaries,
  tags, `[[wikilinks]]`.
- **qmd** = content search across the whole vault. Use as a FALLBACK when the index skim is
  ambiguous or to catch pages whose body matches but whose summary does not.
- **obsidian CLI** = navigation. Follow `[[backlinks]]`, resolve aliases, read a known page, list a
  folder, read the live vault (no index lag).

## Recall Flow (Mode A — topic recall)

### Step 1 — Read the index first (always)

Read the catalog by ABSOLUTE path so this works from any directory, not just the vault:

```
Read /Users/kriscard/obsidian-vault-kriscard/index.md
```

Skim the `## Concept notes (claude-memory)` section (and `## Articles` / `## Videos` if relevant).
Pick 3–8 candidate pages whose title, one-line summary, or tags match the topic. This selection is
reasoning over the catalog, not keyword scoring.

### Step 2 — qmd only if the index is not enough

If the index skim is ambiguous, returns nothing obvious, or the topic might live in page bodies not
reflected in summaries, search content:

```bash
qmd query "<topic>" --json -n 8 2>/dev/null
```

The single-line form auto-expands (qmd generates lex/vec/hyde internally). Escalate for harder
cases:

- **Ambiguous term** — this vault mixes domains, so "performance" could be React render perf, Hyrox
  fitness, or team health. Add `intent` to steer expansion and reranking toward the sense you mean.
- **Unknown vocabulary** — add a `hyde:` line: 50–100 words of the answer you expect.
- **Max recall** — structured `lex:` + `vec:`; put the best guess first (it gets 2x fusion weight).

```bash
qmd query $'intent: react render performance, not fitness\nlex: useEffect rerender\nvec: how to avoid unnecessary renders' --json -n 8 2>/dev/null
```

Add the qmd hits to the candidate set. Score bands: ≥ 0.7 strong, 0.5–0.7 probable, < 0.5 weak.

qmd gotchas: (1) progress goes to **stderr**, so always append `2>/dev/null` to keep `--json` output
clean for parsing. (2) In `lex`/`vec`/`hyde` lines a hyphen inside a word like `re-render` is parsed
as `-negation` and errors; drop the hyphen or rephrase.

### Step 3 — Drill into the actual pages (navigation = obsidian CLI)

Read the candidate pages in full before answering. Use obsidian CLI to read the live page and follow
the wiki's link structure; use `qmd get "#docid"` for a quick body pull of a qmd hit.

```bash
obsidian read path="3 - Resources/<subfolder>/<page>.md"
qmd get "#<docid>"
```

Follow `[[backlinks]]` and resolve aliases via obsidian to pull in connected pages the
catalog/search missed.

### Step 4 — Synthesize with citations

Answer from the pages, citing each with `[[wikilink]]`. Synthesize across pages; do not dump full
notes unless asked. Be honest about gaps: if no index entry matches AND qmd top score < 0.5, say the
vault has no coverage and offer a general-knowledge answer.

### Step 5 — Offer to file the answer back

If the synthesis is worth keeping (a new connection, comparison, or decision), offer to file it as a
wiki page via the save-note skill. Good answers compound into the wiki.

## Connection Discovery Mode (Mode B)

When the user asks to connect two domains ("connect A and B", "bridges between"):

1. **Map each domain index-first**: read `index.md`, collect the pages under each domain by
   title/tag; augment with `qmd query "<domain>" --json 2>/dev/null` if the catalog is thin.
2. **Pull hubs and follow backlinks** 2–3 hops via obsidian CLI. If one domain has far fewer notes,
   go 3–4 hops deep on the sparse side — that is where surprises are.
3. **Find overlaps**: shared references (notes in both backlink chains), shared themes (same concept
   in both, even if unlinked), shared patterns (both stuck on the same problem). A useful qmd trick:
   feed one domain's vocabulary as a `hyde:` query against the other to surface adjacent pages.
4. **Synthesize each bridge**:

```
Bridge [#]: [Title]
  In Domain A: [how it appears]
  In Domain B: [how it appears differently]
  The connection: [what links them]
  Depth: Surface / Structural / Foundational
  Implication: [what this suggests for either domain]
```

Surface the strongest bridge and any **missing links** (connections that should exist but have not
been made). The test: the best output makes you see both domains differently. Do not force
connections; if the domains genuinely do not connect, say so.

## How to Report Findings

- **Cite the source** with the file path / `[[wikilink]]` so the user can navigate.
- **Synthesize, do not dump.** Summarize what the pages collectively say.
- **Be honest about gaps.** No index match and qmd < 0.5 means say so, then offer general knowledge.
- **Distinguish note types**: TIL (`3 - Resources/TIL/`) = first-person captures; Resources = wiki
  reference; Projects (`1 - Projects/`) = project-specific context.

## What NOT to do

- Don't skip the index. Index-first is the rule; qmd is the fallback, not the entry point.
- Don't write or modify notes — recall is strictly read-only (filing back is the save-note skill).
- Don't answer from snippets alone — read the pages that matter first.
- Don't hallucinate citations — if you can't find a note, say "no match found".
- Don't stretch a sub-0.5 match into a confident answer — flag the gap instead.
