---
name: ingest
description: >-
  Discuss and synthesize an article, URL, video, book note, or selected Inbox source into the
  Obsidian LLM Wiki. Use when the user asks to ingest, synthesize, or add source material to the
  knowledge base.
user-invocable: true
---

# Ingest

Turn one raw source into durable, connected knowledge. Preserve the Karpathy LLM Wiki layers:
immutable raw source, LLM-maintained wiki, and the schema/index/log that connect them.

Use `process-inbox` for general PARA triage. Use `save-note` when the source is the current
conversation synthesis rather than external material.

## 1. Resolve and read one source

Use a supplied file or URL. Otherwise list the schema-defined raw Inbox and ask the user to choose
one item. Read the complete source; fetch URL content directly when needed. Record whether the raw
source already exists in the vault or must be archived from an external URL or file.

Do not batch an entire Inbox unless the user explicitly requests repeated one-at-a-time processing.

Completion: one source, its type and provenance, and its raw-source archival state are known, and its
content has been read.

## 2. Discuss before writing

Search root `index.md` first for connected wiki pages. Use qmd when the catalog is ambiguous or the
relevant language may occur only in page bodies. Read likely pages rather than reasoning from search
snippets.

Present:

1. two or three important ideas in your own words;
2. existing pages each idea could enrich;
3. contradictions or uncertainty worth preserving;
4. proposed new pages, updates, raw-source destination, and index changes.

Wait for the user to confirm emphasis and destinations. Discussion is mandatory; silent filing is
not ingestion.

Completion: the user approved what knowledge to preserve and whether each item creates or enriches a
page.

## 3. Prepare the wiki changes

Treat search scores as clues, not decisions. Inspect candidates and choose create versus enrich from
their actual scope, ownership, and content.

Follow metadata, writable directories, naming, aliases, tags, and source-citation rules from
`AGENTS.md`. Write focused reference pages in neutral wiki voice. Every non-obvious claim must trace
to the raw source; preserve contradictions rather than silently choosing a side.

A rich source may touch several relevant entity or concept pages. The current schema may define a
target range; quality and relevance matter more than reaching a quota.

Completion: each proposed page has a destination, ownership permission, source link, and complete
content or exact section change.

## 4. Preview and write safely

Show the complete write set before mutating the vault. After approval:

1. when the source is external, archive and verify its raw-source artifact before creating claims
   that cite it;
2. create or update wiki pages using the `vault` safe-write flow;
3. reread every affected page;
4. update root `index.md` under its current schema-defined sections;
5. append one ingest operation to root `log.md`;
6. verify the index links and log entry.

Never interpolate generated Markdown into shell commands. Do not modify human-owned pages or
already-filed immutable sources.

## 5. File the raw source

Include the raw-source operation in the approved write set:

- **Inbox source:** after the wiki, index, and log verify, move it to the schema-defined immutable
  source directory rather than deleting it.
- **External URL or file:** before writing wiki pages, create the raw-source artifact in the
  schema-defined immutable directory. Preserve the fetched original content or transcript, canonical
  URL, title, author/publisher when known, retrieval date, and source type. Clearly mark unavailable
  original content instead of substituting the synthesis.
- **Already filed source:** leave it unchanged and verify its path.

Execute the operation through the safe-write or move flow and verify the artifact. After filing,
treat it as immutable. If filing fails, preserve the original, stop dependent writes, and report the
partial state.

Completion: approved wiki pages, root index, root log, and one verified immutable raw-source artifact
all exist, or every partial failure is explicit.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Creating interconnected pages or using block references and aliases | `references/advanced-workflows.md` |
