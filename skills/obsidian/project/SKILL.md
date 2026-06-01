---
name: project
description: >-
  Creates new project notes or updates existing ones in the Obsidian vault's 1 - Projects/ folder.
  Make sure to use this skill whenever the user says "create a project note", "set up a project in
  obsidian", "new project", "track this project", "update my project status", "project is done", or
  any request to add, update, or complete a PARA project note.
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

Single `AskUserQuestion` call (batch to minimize round-trips):

1. **Status**: Active / On Hold
2. **Goal**: One-sentence outcome
3. **Key Links**: Related notes, docs, repos (optional)
4. **Next Action**: The very next physical step
5. **Notes**: Any context to capture now (optional)

### Step 4 — Decide structure

- Default: single file `1 - Projects/<Project Name>.md`
- Promote to subfolder `1 - Projects/<Project Name>/` only if user mentions sub-notes (architecture
  docs, PRDs, strategy notes)

### Step 5 — Create note

```bash
obsidian create path="1 - Projects/<Name>.md" template="Project"
```

Set frontmatter with `obsidian property:set` and fill the sections with gathered details. The CLI
has no `patch` for section edits — if a section must be targeted, ask the user (MCP
`obsidian_patch_content` or recreate via `read` + `create ... overwrite`). Always show a preview and
wait for confirmation before writing.

### Step 6 — Add to Active Projects MOC (if it exists)

```bash
obsidian search query="Active Projects"
```

If found, append a wikilink to the new project.

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

### Step 3 — Update changed sections only

Prefer not to rewrite the full file. The CLI has no `patch`, so a section-targeted update means
either the MCP `obsidian_patch_content` tool (heading-targeted) or a `read` + `create ... overwrite`
rewrite. Ask the user which to use, then update the `Current Status` section and bump the
`Updated: YYYY-MM-DD` marker to today.

### Step 4 — Show diff, get approval, write

## Project Completion

If the user says "this project is done":

1. Ask if they want to fill a retrospective section first (strongly recommended — it's the most
   valuable artifact and gets lost if skipped)
2. Move to `4 - Archives/Projects - YYYY/<Name>.md`
3. Set frontmatter `status: ✅ Done`
4. Update any MOC that referenced this project

## References

| Priority    | Load when                                                                                    | Reference                           |
| ----------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1 — First   | Building the intake interview — need exact question wording or option lists                  | `references/interview-questions.md` |
| 2 — Context | User questions PARA principles, Hot/Cold classification, or why outcome+deadline is required | `references/tiago-principles.md`    |
