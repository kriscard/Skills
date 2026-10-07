---
name: til
description: Save demonstrated learning, corrected misconceptions, and useful examples from a session as a durable Obsidian TIL note. Use when a learning workflow hands off a session or the user asks to save what they learned.
argument-hint: "[project or topic name — omit to infer from context]"
---

# TIL capture

Create a note future-you can understand without the conversation. Invoke `vault` for vault conventions and `obsidian-cli` for safe read, create, append, and verification operations.

## 1. Establish the topic

Use `$ARGUMENTS` when present. Otherwise infer from the conversation and current project, then state the inferred topic before writing.

Complete when the title describes the learned concept rather than only the repository name.

## 2. Inspect today's note

Target `3 - Resources/TIL/til-YYYY-MM-DD.md` unless the vault skill identifies a newer convention. Read the existing note before deciding between creation and append.

For an existing note, count its `## Session N` headings and use the next integer. Preserve its frontmatter and top-level title.

Complete when the operation is classified as new note or append and the destination plus next session number are known.

## 3. Extract evidence

Include only conversation-backed material:

- what the learner can now explain or apply
- corrected misconceptions and the evidence that corrected them
- decisions or trade-offs that changed their model
- a minimal example worth reusing
- unresolved questions or a useful next experiment

Omit categories without evidence.

## 4. Write the note

Use first person and a concrete title. Prefer explanation over a session transcript.

### New note

```markdown
---
tags: [til/topic]
date: YYYY-MM-DD
project: <topic or project>
---

# TIL: <specific insight>

## What I Learned

<context and explanation>

## The Example

<minimal example when useful>

## Key Insight

<one durable takeaway>

## Next Question

<omit when none remains>
```

### Existing note

Append only:

```markdown
## Session <next integer> — <specific insight>

### What I Learned

<session-specific explanation>

### Key Insight

<one durable takeaway>
```

Use 3–5 `til/` tags derived from actual subjects. Keep project or session backlinks only when the vault convention calls for them.

## 5. Save safely

Use the Obsidian integration's create or append operation. Pass note content as tool data or through a safely written temporary file; conversation-derived Markdown must not be interpolated into executable shell text.

Read the destination after writing and confirm that frontmatter, heading level, session number, and content are intact.

## Completion gate

Report the note title, vault path, create/append mode, session number when appended, and the concepts included. A successful command without a read-back is incomplete.
