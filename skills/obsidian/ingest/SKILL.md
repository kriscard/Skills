---
name: ingest
description: >-
  Discuss and file an article, URL, video, book note, or selected Inbox source, then reuse a matching
  Atomic Note or create a human-owned scaffold for the user to write. Use when the user asks to
  ingest or add source material to the Obsidian knowledge base.
user-invocable: true
---

# Ingest

File one raw source and connect it to one Atomic Note for the user to write. Reuse the note for the
same coherent idea; create a scaffold only for a distinct idea. Preserve the Karpathy LLM Wiki layers
without writing the user's understanding for them.

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

Compare the source's ideas with likely Atomic Notes by scope, not title alone. Atomicity follows the
idea, not the source:

- **Same coherent idea:** recommend reusing the existing note and adding only the new Resource
  backlink. A different source, author, framework, or example does not justify a duplicate note.
- **Distinct reusable idea or question:** recommend a new scaffold and link it to the Resource.
- **Unclear boundary:** show the closest existing note and ask whether the idea belongs there.

Present:

1. two or three important ideas for discussion only;
2. the closest existing Atomic Note and why it is the same idea or a different one;
3. contradictions or uncertainty worth noticing;
4. the raw-source destination, recommended existing-or-new Atomic Note target, backlink, and
   index/log changes.

Wait for the user to confirm the source destination and Atomic Note target. Discussion is mandatory,
but its contents stay in the conversation unless the user explicitly requests another write.

Completion: the user approved the raw-source destination and either an existing Atomic Note or a new
scaffold title.

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

## 4. Prepare the Atomic Note target

Use the target the user approved:

- **Existing note:** preserve all current content and propose one bounded change: add one plain
  wikilink to the filed `03 - Resources/*` note under its related-notes section. If that exact link
  already exists, leave the note unchanged. Do not create another Atomic Note for the same idea.
- **New note:** read the live Atomic Note template and confirm the destination does not exist. Create
  one human-owned scaffold from the template. Resolve only its title and date fields, keep its
  prompts, aliases, and tags otherwise unchanged, and add one plain wikilink to the filed Resource
  note under the template's related-notes section.

The user writes the explanation, examples, connection, questions, tags, and aliases. The Atomic Note
contains no new summaries, claims, headings, commentary, relationship explanations, agent ownership
metadata, or agent-authored prose. Do not create a separate agent-owned synthesis page or enrich the
note's prose during `ingest`.

Completion: an existing note has one approved Resource backlink, or a new scaffold differs from the
live template only by resolved fields and that backlink.

## 5. Preview and write safely

Show the complete write set before mutating the vault: the raw-source operation, the exact bounded
Atomic Note change, any required catalog entry, and the ingest log entry. After approval:

1. file and verify the raw source;
2. create the new scaffold or add the backlink to the approved existing note through the `vault`
   safe-write flow, accounting for automatic template insertion;
3. reread the Atomic Note and verify that the backlink is its only ingest-authored content;
4. register the Resource under its source section in root `index.md`;
5. for a new scaffold, register it under **Backlinks to human notes**, never **Concept notes**; keep an
   existing note's current catalog placement and avoid a duplicate entry;
6. append one ingest operation to root `log.md` and verify the registrations;
7. run `obsidian open path="<vault-relative Atomic Note path>"` so the approved Atomic Note becomes
   the active note for the user to write in immediately.

Never interpolate generated Markdown into shell commands. Apart from the approved backlink, preserve
human-owned pages, already-filed immutable sources, and existing Knowledge pages. Opening the note is
the final action. If Obsidian or its CLI is unavailable, keep the completed ingestion intact and
report the exact note path the user should open.

Completion: the verified immutable source, reused note or template-only scaffold, index entries, and
log entry exist, and the Atomic Note is open in Obsidian; every partial failure is explicit.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Creating interconnected pages or using block references and aliases | `references/advanced-workflows.md` |
