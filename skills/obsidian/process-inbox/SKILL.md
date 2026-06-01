---
name: process-inbox
description: >-
  Processes every note in the Obsidian inbox — reads each one, uses the para-organizer agent to
  suggest the right PARA destination, confirms with the user, and moves or deletes on approval. Make
  sure to use this skill whenever the user says "process my inbox", "clear my inbox", "triage inbox
  notes", "sort inbox", or runs /process-inbox. Execute the workflow — do not describe it.
user-invocable: true
---

# Process Inbox

Work through every note in `0 - Inbox/` one by one. The para-organizer agent suggests placement; the
user confirms each move. Nothing moves without explicit approval.

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

Use the **para-organizer agent** to analyze the note content. The agent applies the PARA decision
tree and returns a specific folder path, reasoning, and suggested tags.

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
obsidian create path="[target]/[filename]" content="[CONTENT]"
obsidian delete path="0 - Inbox/[filename]"
```

**Different location:** Ask where, then move using the same commands.

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
```
