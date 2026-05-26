# Process Inbox Command

EXECUTE THIS WORKFLOW NOW. Do not describe it — actually run the commands and process notes.

## Step 1: List Inbox

```bash
obsidian files folder="0 - Inbox/"
```

Report: "Found X notes to process." If 0: "Inbox is empty!" and stop.

## Step 2: Process Each Note

For EACH note, in order:

### 2.1 Read the note
```bash
obsidian read path="0 - Inbox/[filename]"
```
Show: `[N/TOTAL] Note: "[filename]"` + first 15 lines.

### 2.2 Get placement suggestion

Use the **para-organizer agent** to analyze the note content and suggest the PARA destination. The agent applies the decision tree and returns a specific folder path, reasoning, and suggested tags.

### 2.3 Confirm with user

Present the para-organizer's suggestion, then use AskUserQuestion:
- "Move to [suggested location]" (Recommended)
- "Move to different location"
- "Skip for now"
- "Delete note"
- "Stop processing"

WAIT for response before continuing.

### 2.4 Execute the choice

**Move:**
```bash
obsidian create path="[target]/[filename]" content="[CONTENT]" silent
obsidian delete path="0 - Inbox/[filename]" silent
```

**Different location:** Ask where, then move.

**Skip:** Leave in inbox, continue to next.

**Delete:** Confirm once, then `obsidian delete path="0 - Inbox/[filename]" silent`

**Stop:** Show summary and end.

### 2.5 Report progress

After each note: "Progress: X/Y processed (Z remaining)"

## Step 3: Final Summary

```
Inbox Processing Complete!
Processed: X | Projects: X | Areas: X | Resources: X | Archives: X | Deleted: X | Skipped: X
Remaining in inbox: X
```
