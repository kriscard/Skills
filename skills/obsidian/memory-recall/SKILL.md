---
name: memory-recall
description: >-
  Search the Obsidian vault for prior knowledge, decisions, and connections. Use for "do I have notes
  on", "what did I write or decide", "find in my vault", "what do I know about", or requests to
  connect topics using personal knowledge.
user-invocable: true
argument-hint: '[topic — omit to infer from context]'
---

# Memory Recall

Answer from the user's accumulated knowledge before general model knowledge. This skill is strictly
read-only; `create-note` handles filing a valuable synthesis back into Knowledge.

## Topic recall

### 1. Read the catalog first

Read `../vault/SKILL.md` and the live schema, then root `index.md`. Select likely pages from titles,
summaries, aliases, tags, and wikilinks. Also consider raw-source catalog sections when the question
asks for evidence. The catalog is not a complete inventory of human notes.

Completion: catalog candidates are listed, or the catalog has no plausible coverage.

### 2. Search when the catalog is insufficient

Use qmd when the catalog is ambiguous, returns no plausible page, or the topic may appear only in
page bodies. Query the user's intended sense for ambiguous terms. Include Knowledge, relevant
Resources, and dated or archived journals when the question calls for them; derive paths from the
schema. MOCs and their embedded Bases can provide additional entry points.

If semantic search is unavailable or incomplete, use keyword search and report the limitation.
Refreshing QMD embeddings and refreshing an Obsidian plugin's search index are separate operations;
this read-only skill does neither automatically.

Search scores rank candidates; they do not determine truth. Inspect close candidates around any
numeric boundary rather than declaring coverage or absence from a score alone.

Completion: the candidate set covers both catalog and relevant body-search evidence.

### 3. Read and navigate

Read the actual candidate pages. Follow aliases, wikilinks, and backlinks when they materially expand
or challenge the answer. Do not answer from index entries or search snippets alone.

Completion: every page used in the answer was read, and important contradictory or missing evidence
is known.

### 4. Synthesize with citations

Answer concisely from the pages and cite them with navigable `[[wikilinks]]` or paths. Separate what
the vault says from general knowledge. If the search found no credible coverage, say so and offer a
general answer rather than stretching a weak match.

Offer `create-note` when the answer develops a reusable explanation, comparison, connection, or
question. Use `save-session` only when the user wants a dated record of the session itself.

## Connection discovery

When asked to connect two domains:

1. map each domain index-first, using qmd only as needed;
2. read representative pages and follow useful backlinks on both sides;
3. identify shared sources, themes, structures, and meaningful differences;
4. report only defensible bridges, citing at least one page from each domain;
5. state missing links or evidence gaps instead of forcing a connection.

Completion: both domains were mapped, cited pages were read, and each reported bridge changes or
clarifies the understanding of both sides.
