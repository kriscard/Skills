---
name: ingest
description: >-
  Discuss and file an article, URL, video, podcast, book note, or selected Inbox source as one
  Resource note with preserved source content and space for personal annotations. Use when the user
  asks to ingest or add source material to the Obsidian knowledge base.
user-invocable: true
---

# Ingest

Ingest the source now; extract independent ideas later. Create or reuse one Resource note containing
source metadata, a short summary, selected highlights, space for personal reflections, related links,
and the preserved original. An Atomic Note is optional, not a required companion to every source.

Use `process-inbox` for general triage, `create-note` for explicitly requested independent ideas,
and `save-session` for a session recap. An idea earns an Atomic Note when it stands independently of
one source. Several sources may support the same idea; one source may support several ideas.

## 1. Resolve and read one source

Read `../vault/SKILL.md` and the live `AGENTS.md` first. Use a supplied file or URL. Otherwise list
the schema-defined Inbox and ask the user to choose one item. Read the complete available source;
fetch URL content directly when needed. Identify its type, provenance, and whether it already exists
in the vault. Report inaccessible or partial content explicitly.

Do not batch an entire Inbox unless the user explicitly requests repeated one-at-a-time processing.

Completion: one source, its provenance, available content, and existing archival state are known.

## 2. Discuss before writing

Search root `index.md` first for the source and connected wiki pages. Use qmd when the catalog is
ambiguous or relevant language may occur only in page bodies. Read likely matches rather than
reasoning from search snippets. Reuse an existing Resource note for the same source.

Present:

1. two or three important ideas, plus contradictions or uncertainty worth noticing;
2. the Resource destination and proposed summary, highlights, and related links;
3. exact tag deltas under the shared vault tag contract and required index/log changes.

Link useful existing Atomic Notes from the Resource without requiring edits to those notes.
Obsidian discovers inbound links automatically. A shared topic alone does not establish a useful
connection. If no related note fits, proceed without one.

Keep personal interpretations in the conversation unless the user approves saving their wording or
explicitly requests drafting help. A source summary describes the source, not the user's beliefs.
If the user requests a new Atomic Note, hand it off to `create-note` with its own preview and approval;
its creation is not an ingest completion requirement.

Completion: the Resource target is known, the source has been discussed, and the proposed content,
connections, and uncertainties are explicit. No Atomic Note target is required.

## 3. Prepare one Resource note

Discover and read the relevant active Resource template if one exists. Preserve its fields and
required structure. If none exists, preview the following structure with provenance metadata:

```markdown
## Summary

## Highlights

## My Notes

## Why this resonated

## Related notes

## Original article
```

Use an appropriate original-content heading for videos, podcasts, books, and other source types.
Populate sections as follows:

- **Summary:** a few sentences describing the source's main point. Attribute claims to the source
  and disclose partial access rather than presenting a summary of unavailable material.
- **Highlights:** a small selection of verbatim passages with source locations when available.
  Distinguish quotations from commentary; avoid duplicating the entire source here.
- **My Notes:** leave empty for the user unless they approve supplied wording or explicitly request
  drafting help. Label any requested agent-drafted reflection as a draft, not an endorsed belief.
- **Why this resonated:** leave empty unless the user supplies or explicitly requests the content.
  Do not infer personal significance from the fact that they saved a source.
- **Related notes:** approved links to verified existing notes, with brief connection descriptions
  where useful. Leave empty when none fit.
- **Original content:** preserve the fetched original text or transcript and attribution separately
  from annotations. Include canonical URL, title, author/publisher when known, retrieval date, and
  source type in the note's metadata or a clearly delimited provenance block. Mark unavailable
  content rather than substituting the summary for the original.

Apply this structure within the approved operation:

- **Inbox source:** move it to the approved schema-defined source directory. Preserve its original
  body, attribution, and existing personal prose. Wrapping original content in a source section or
  adding annotation sections requires an exact preview and approval.
- **External URL or file:** create one Resource artifact combining the preserved original and the
  approved annotation sections. Do not create a second raw-source or synthesis note by default.
- **Already filed source:** preserve existing structure, body, attribution, and personal prose.
  Propose only missing or explicitly requested section changes; avoid duplicate sections or notes.

Follow live `AGENTS.md` ownership and source permissions, including any immutability boundary. If
annotations in the Resource are prohibited, explain the conflict and ask for direction before writing;
this skill grants no exception. Change tags only within the exact approved scope and live permissions.
Human ownership alone does not establish `type/original`, and an article annotation is not automatically
`type/atomic`. Preserve existing bibliographic and plugin fields.

Completion: one Resource operation is ready for approval, with preserved original content, clearly
separated annotations, exact metadata changes, and no invented personal reflections.

## 4. Preview and write safely

Show the complete write set before mutating the vault: exact paths, source move or creation,
proposed sections and content, tag deltas, catalog entry, and ingest log entry. After explicit approval:

1. file or update the Resource through the `vault` safe-write flow, accounting for automatic template
   insertion; if filing fails, preserve the original and report the failure;
2. reread the Resource and verify one frontmatter block, resolved template fields, intact original
   content and attribution, distinct annotation sections, and only approved metadata/prose changes;
3. verify related links resolve without changing their targets;
4. register the Resource under its source section in root `index.md`, avoiding duplicate entries;
5. append one ingest operation to root `log.md` and verify both registrations;
6. run `obsidian open path="<vault-relative Resource path>"` so the Resource becomes the active note
   for the user to annotate.

Never interpolate generated Markdown into shell commands. Preserve everything outside the approved
write set. Existing Atomic Notes remain unchanged during this workflow. Opening the Resource is the
final action. If Obsidian or its CLI is unavailable, keep completed ingestion intact and report the
exact Resource path the user should open.

Completion: one verified Resource note contains the available original and approved annotations,
index/log registration is verified, and the Resource is open in Obsidian or its path is reported.
Every blocked, partial, or unverified item is explicit. No Atomic Note creation is required.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Creating interconnected pages or using block references and aliases | `references/advanced-workflows.md` |
