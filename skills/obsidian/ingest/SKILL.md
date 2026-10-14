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

Use `process-inbox` for general triage, `create-note` for reusable conversation knowledge, and
`save-session` for a session recap. The optional human-owned reflection below is part of ingest.

## 1. Resolve and read one source

Read `../vault/SKILL.md` and the live `AGENTS.md` first. Use a supplied file or URL. Otherwise list
the schema-defined raw Inbox and ask the user to choose one item. Read the complete source; fetch URL content directly when needed. Record whether the raw
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

A rich source may enrich several pages, one page, or none. Keep reusable explanations in the
schema-defined Knowledge location; keep the original source in its Resource location. Read the live
Atomic Note template for a new concept page, adapting its prompts into supported prose rather than
inventing the user's experience.

When a source warrants its own summary, use this outline with the schema's agent-owned metadata:

```markdown
# Source title

## Source
Original source link and author when known.

## Summary
The important ideas, explained clearly with citations.

## Connections and questions
Relevant existing notes, disagreements, and open questions.
```

Omit unsupported or empty sections. This is a synthesis, not the immutable original. Show its exact
destination during discussion; a source summary is optional and does not add a required ingest stage.

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

## 6. Offer a human-owned Atomic Note draft

Before continuing to another source, ask whether the user wants to create a personal Atomic Note
now, defer it, or skip it. This is separate from the agent-written synthesis. The user supplies their
own explanation and framing; do not generate a personal review on their behalf.

If accepted:

1. Read the live Atomic Note template and inspect existing related notes to avoid duplicate drafts.
2. Confirm the title, approved topic tags, and the actual ingested synthesis note to link. If no
   synthesis was created, ask which existing ingested note should be the target; do not create an
   extra synthesis merely to satisfy this step.
3. Resolve template fields, retain its writing prompts, and add a link to the ingested note under
   the template's related-notes section. Leave the explanation and questions for the user to fill.
   Omit agent ownership markers and agent-only tags. Preserve an existing human draft rather than
   replacing it.
4. Preview the exact draft, destination, and human-note catalog/log additions. After approval, create
   it through the safe-write flow, accounting for automatic template insertion, and verify content,
   ownership, tags, and the source link. Register it under the schema's human-note catalog section.

Record the choice as created, deferred, or skipped. Creating a scaffold does not mean the user has
written, understood, or endorsed the concept. Do not wait for completed prose unless the user asks;
ask before starting another source.

Completion: the user chose whether to create a draft, every approved draft is verified and correctly
registered, and no personal interpretation was invented.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Creating interconnected pages or using block references and aliases | `references/advanced-workflows.md` |
