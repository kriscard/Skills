---
name: create-note
description: >-
  Create an Obsidian Inbox capture, a human-owned Atomic Note draft, or approved reusable knowledge
  from a conversation. Use for "capture this", "create a note", "write this in my own words",
  "save this explanation", or promoting material from existing notes. Use ingest for external sources
  and save-session for a session recap.
user-invocable: true
---

# Create Note

Choose the purpose before the template. An Atomic Note can explain a technique, preserve a principle,
or explore a question; it is not limited to ideas.

## 1. Choose the note and owner

Read `../vault/SKILL.md` and the live `AGENTS.md`. Resolve the destination and active template:

| Intent | Note |
| --- | --- |
| Save an observation, question, thought, or snippet before losing it | Inbox capture using General Notes |
| Leave space for the user to develop their own explanation | Human-owned draft using Atomic Note |
| Preserve a reusable explanation developed in the conversation | Approved agent-written Knowledge note using Atomic Note |
| Explain connections across several notes | MOC using its live template and existing Bases |

Use the request to choose the mode; ask when authorship or destination is unclear. A quick capture
needs no classification interview. An unfinished question can already deserve an Atomic Note.

When promoting material from daily notes or other existing notes, read `references/promote-mode.md`.

Completion: purpose, owner, destination, and active template are known.

## 2. Check for an existing note

For Knowledge or MOCs, read root `index.md`, search when needed, and inspect plausible matches.
Choose to create, link, or enrich based on scope and ownership. An existing human-owned page is not
an automatic enrichment target. For Inbox captures, check for a filename collision without turning
capture into a vault-wide research task.

Completion: the proposed write does not overwrite an existing note or duplicate known coverage.

## 3. Draft the right amount

- **Capture:** keep the supplied material short and preserve its meaning and source context.
- **Human draft:** use the live template, resolve title/date fields, and add only approved tags and
  relevant source links. Leave the user's explanation and questions for them to write. User-supplied
  prose may be included exactly as approved. Omit agent ownership metadata.
- **Agent synthesis:** write a standalone explanation supported by the conversation and sources.
  Distinguish facts from open questions; use the schema's wiki metadata. Do not invent the user's
  beliefs, experiences, or learning.
- **MOC:** explain the connections, preserve existing Base embeds, and select an existing Base when
  useful. A new or changed Base needs separate approval.

Completion: the draft fits its purpose and represents its owner honestly.

## 4. Preview, write, and verify

Show the exact path and content or section edit, plus any required index/log changes. After approval,
use the vault safe-write flow and account for automatic template insertion. Reread the result and
verify one frontmatter block, resolved fields, and working links.

Register Knowledge writes as the live schema requires. Human drafts belong under the human-note
catalog section, not agent-written concepts. Ordinary Inbox captures need no wiki registration.
Preserve source daily notes and unrelated content.

Completion: every approved change is verified, required registration is complete, and the report
states the path, owner, create/enrich mode, and any incomplete step.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Promoting observations, questions, or explanations from existing notes | `references/promote-mode.md` |
