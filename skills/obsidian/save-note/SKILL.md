---
name: save-note
description: >-
  File a valuable conversation synthesis into the Obsidian LLM Wiki so it can be retrieved and
  compounded later. Use for "save this to my notes", "add this to my knowledge base", "create a
  wiki page", or "file this answer".
user-invocable: true
argument-hint: '[title — omit to infer from context]'
---

# Save Note

File the current answer as durable LLM Wiki knowledge, not as a transcript or generic capture. The
page must stand alone for a future reader with no conversation context.

## 1. Define the artifact

Infer or ask for the title and intended knowledge domain. Read `AGENTS.md` to discover writable wiki
directories and metadata rules. Do not choose a destination from a cached folder list.

Completion: title, scope, and permitted destination are known.

## 2. Search before writing

Read root `index.md` first. Use qmd when the catalog is ambiguous or likely matches may exist only in
page bodies. Treat scores as ranking hints; read plausible candidates before deciding.

Choose one outcome:

- enrich an existing LLM-managed page;
- create a distinct page;
- cancel because the answer is already covered.

Never append to a human-owned page without explicit permission from `AGENTS.md` and the user.

Completion: create versus enrich is justified from the actual candidate pages.

## 3. Draft a standalone wiki page

Follow the schema's current frontmatter, alias, tag, citation, and linking conventions. Preserve
source attribution and mark unsupported claims as required by the schema.

The body must:

- explain the topic without phrases such as “above” or “as we discussed”;
- use reference-focused rather than transcript voice;
- link related wiki pages;
- separate evidence, decisions, and open questions when relevant.

Completion: the destination, duplicate-search result, metadata, self-contained body, and links are
ready for review.

## 4. Preview, write, and register

Show the complete page or exact existing-page change, plus root index and log changes. After explicit
approval:

1. write through the `vault` safe-write flow;
2. reread the affected page;
3. update root `index.md` in its live schema-defined section;
4. append one `save-note` operation to root `log.md`;
5. verify that the index entry resolves to the saved page.

Never interpolate generated Markdown into shell commands. Report partial failures without claiming
the note was fully registered.
