---
name: ingest
description: >-
  Discuss and file an article, URL, video, book note, or selected Inbox source, then create a
  human-owned Atomic Note scaffold for the user to write. Use when the user asks to ingest or add
  source material to the Obsidian knowledge base.
user-invocable: true
---

# Ingest

File one raw source and prepare one human-owned Atomic Note for the user to write. Preserve the
Karpathy LLM Wiki layers without writing the user's understanding for them.

Use `process-inbox` for general triage, `create-note` for reusable conversation knowledge, and
`save-session` for a session recap.

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

1. two or three important ideas for discussion only;
2. relevant existing pages for context only;
3. contradictions or uncertainty worth noticing;
4. the raw-source destination, proposed Atomic Note title, backlink target, and index/log changes.

Wait for the user to confirm the source destination and Atomic Note title. Discussion is mandatory,
but its contents stay in the conversation unless the user explicitly requests another write.

Completion: the user approved the raw-source destination and title of the human-owned scaffold.

## 3. Prepare the raw source

Include one raw-source operation in the approved write set:

- **Inbox source:** move it unchanged to the schema-defined immutable source directory.
- **External URL or file:** create the raw-source artifact in the schema-defined immutable directory.
  Preserve the fetched original content or transcript, canonical URL, title, author/publisher when
  known, retrieval date, and source type. Mark unavailable original content instead of replacing it
  with a summary.
- **Already filed source:** leave it unchanged and verify its path.

After filing, treat the source as immutable. If filing fails, preserve the original and stop before
creating the Atomic Note.

Completion: one raw source has an approved destination and exact backlink title.

## 4. Prepare the Atomic Note scaffold

Read the live Atomic Note template and inspect the proposed destination for an existing draft. Create
one human-owned scaffold from that template. Resolve only the template's title and date fields, keep
its prompts, aliases, and tags otherwise unchanged, and add one plain wikilink to the filed
`03 - Resources/*` note under the template's related-notes section.

The scaffold contains exactly the resolved template plus that source backlink. The user writes the
explanation, examples, connection, questions, tags, and aliases. Do not add summaries, claims,
headings, commentary, relationship explanations, agent ownership metadata, or agent-authored prose.
Do not create a separate agent-owned synthesis page or enrich existing Knowledge pages during
`ingest`. Preserve an existing human draft rather than replacing or expanding it.

Completion: the exact scaffold differs from the live template only by resolved template fields and
one backlink to the filed Resource note.

## 5. Preview and write safely

Show the complete write set before mutating the vault: the raw-source operation, the exact Atomic
Note scaffold, its human-note catalog entry, and the ingest log entry. After approval:

1. file and verify the raw source;
2. create the scaffold through the `vault` safe-write flow, accounting for automatic template
   insertion;
3. reread the scaffold and verify it contains no content beyond the resolved template and backlink;
4. register the Resource under its source section in root `index.md`;
5. register the scaffold under **Backlinks to human notes**, never **Concept notes**;
6. append one ingest operation to root `log.md` and verify both registrations.

Never interpolate generated Markdown into shell commands. Do not modify human-owned pages,
already-filed immutable sources, or existing Knowledge pages.

Completion: the verified immutable source, template-only human scaffold, index entries, and log entry
exist, or every partial failure is explicit.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Creating interconnected pages or using block references and aliases | `references/advanced-workflows.md` |
