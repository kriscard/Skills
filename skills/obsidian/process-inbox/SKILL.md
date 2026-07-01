---
name: process-inbox
description: >-
  PARA triage for Obsidian Inbox notes: read each raw inbox note, suggest the correct PARA
  destination, confirm with the user, and move only on approval. Use when the user asks to process,
  clear, sort, or triage inbox notes, or runs /process-inbox.
user-invocable: true
---

# Process Inbox

Work through every note in `0 - Inbox/` one by one. This is PARA triage, not source synthesis and
not conversation-answer saving. Use `ingest` for synthesizing selected source material into wiki
notes, and `save-note` for filing the current answer. The user confirms each move; nothing moves
without explicit approval.

**Execute this workflow — do not describe it.**

## Obsidian Access

Use Obsidian CLI via Bash. On failure: "Obsidian CLI isn't working — update Obsidian with CLI
enabled."

## Step 1 — List Inbox

```bash
obsidian files folder="0 - Inbox/"
```

Report: "Found X notes to process." If 0: "Inbox is empty!" and stop.

## Step 2 — Process Each Note

Iterate in order. For EACH note:

### 2.1 Read

```bash
obsidian read path="0 - Inbox/[filename]"
```

Show: `[N/TOTAL] Note: "[filename]"` + first 15 lines.

### 2.2 Suggest Destination

Use the **para-organizer agent** to analyze the note content when available. The agent applies the
PARA decision tree and returns a specific folder path, reasoning, and suggested tags.

If the agent is unavailable, apply the fallback PARA decision tree:

- outcome + deadline → `1 - Projects/`
- ongoing responsibility/standard → `2 - Areas/`
- reference material with no action required → `3 - Resources/`
- inactive or no longer useful → `4 - Archives/`

If the category is still ambiguous, ask instead of guessing.

### 2.3 Confirm with User

Present the para-organizer's suggestion, then use `AskUserQuestion`:

```yaml
options:
  - label: 'Move to [suggested location]'
    description: '(Recommended)'
  - label: 'Move to different location'
  - label: 'Skip for now'
  - label: 'Delete note'
  - label: 'Stop processing'
```

**Wait for response before continuing.**

### 2.4 Execute the Choice

**Move (suggested location):**

```bash
obsidian move path="0 - Inbox/[filename]" to="[target]/[filename]"
```

**Different location:** Ask where, then move with `obsidian move`.

**Skip:** Leave in inbox, continue to next note.

**Delete:** Confirm once explicitly, then:

```bash
obsidian delete path="0 - Inbox/[filename]"
```

**Stop:** Show summary and end.

### 2.5 Report Progress

After each note: `Progress: X/Y processed (Z remaining)`

## Step 3 — Final Summary

```
Inbox Processing Complete!
Processed: X | Projects: X | Areas: X | Resources: X | Archives: X | Deleted: X | Skipped: X
Remaining in inbox: X
Every moved note used obsidian move; every delete had explicit confirmation.
```
