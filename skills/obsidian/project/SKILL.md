---
name: project
description: >-
  Create, update, or complete Obsidian PARA Project notes in `1 - Projects/`. Use when the user asks
  for a project note, Obsidian/PARA project tracking, project status updates, or completing a vault
  project. Do not use for generic software/project planning unless vault notes are requested.
user-invocable: true
---

# Project Note Manager

Create or update project notes in `1 - Projects/`. A Project in PARA requires both an outcome (a
checkable "done" state) and a deadline — without both, it belongs in `2 - Areas/`.

## Mode Detection

Classify the request before doing anything:

| Signal                             | Mode                                  |
| ---------------------------------- | ------------------------------------- |
| "Create / new / set up / track"    | CREATE                                |
| "Update / refresh / status / done" | UPDATE                                |
| Ambiguous                          | Ask: "Create new or update existing?" |

## CREATE Workflow

### Step 1 — Search before write

Check if a project note already exists:

```bash
obsidian search query="<project name>"
obsidian files folder="1 - Projects/" format=json
```

If a close match exists, surface it and confirm before proceeding.

### Step 2 — Validate it's a Project (not an Area)

A project needs **both** a discrete outcome and a deadline. Ask via `AskUserQuestion`:

1. "What does 'done' look like for this project?" (free text)
2. "When does it need to be done?" (specific date / end of quarter / end of year / no deadline)

If "no deadline" or no discrete outcome: propose `2 - Areas/` instead. Don't create a project note
for things that never end.

### Step 3 — Gather project details

Load `references/interview-questions.md` and use it as the source of truth for exact intake wording.
Batch the core interview to minimize round-trips.

### Step 4 — Decide structure

- Default: single file `1 - Projects/<Project Name>.md`
- Promote to subfolder `1 - Projects/<Project Name>/` only if user mentions sub-notes (architecture
  docs, PRDs, strategy notes)

### Step 5 — Preview and get approval before writing

Show the target path, frontmatter, and initial sections. Do not write until the user explicitly
approves the target path, frontmatter, and initial content.

After approval:

```bash
obsidian create path="1 - Projects/<Name>.md" template="Project"
```

Set frontmatter with `obsidian property:set` and fill the sections with gathered details. The CLI
has no `patch` for section edits — if a section must be targeted, ask the user (MCP
`obsidian_patch_content` or recreate via `read` + `create ... overwrite`).

### Step 6 — Propose Active Projects MOC update (if it exists)

```bash
obsidian search query="Active Projects"
```

If found, preview the exact wikilink and target MOC path. Do not append until the user explicitly
approves this separate MOC update. If the user declines, leave the project note created and report
that the MOC was not updated.

## UPDATE Workflow

### Step 1 — Identify the project

If named, resolve to file path. Otherwise list and ask:

```bash
obsidian files folder="1 - Projects/" format=json
```

### Step 2 — Read and detect staleness

Read the project file. Look for:

- `Updated:` more than 14 days ago → flag for refresh
- Empty "What's in progress" section → ask what's happening
- Past due date → ask: extend, archive, or redefine?

### Step 3 — Draft changed sections only

Prefer not to rewrite the full file. Draft the exact `Current Status` update and `Updated: YYYY-MM-DD`
change, but write nothing yet.

### Step 4 — Show diff, get approval, write

Show the proposed diff and ask for explicit approval. Only after approval, use either MCP
`obsidian_patch_content` (heading-targeted) or a `read` + `create ... overwrite` rewrite, based on
the user's chosen method.

## Project Completion

If the user says "this project is done":

1. Ask if they want to fill a retrospective section first (strongly recommended — it's the most
   valuable artifact and gets lost if skipped)
2. Preview the archive path `4 - Archives/Projects - YYYY/<Name>.md`, status change, and any MOC
   updates
3. Wait for explicit approval
4. Move to the archive path
5. Set frontmatter `status: ✅ Done`
6. Update any MOC that referenced this project

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — First   | Building the intake interview — need exact question wording or option lists                  | `references/interview-questions.md` |
| 2 — Context | User questions PARA principles, Hot/Cold classification, or why outcome+deadline is required | `references/tiago-principles.md`    |
