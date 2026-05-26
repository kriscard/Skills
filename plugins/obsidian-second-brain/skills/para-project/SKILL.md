---
name: para-project
description: >-
  Create new PARA projects or update existing ones in the Obsidian vault. Runs a
  focused interview (AskUserQuestion) to capture outcome, deadline, success
  criteria, and stakeholders, then scaffolds from the `Project.md` template or
  patches missing sections of an existing project. Make sure to use this skill
  whenever the user says "start a new project", "create a project for X", "kick
  off [name]", "update my [project] note", "refresh [project] status", or
  mentions adding/refining a project in `1 - Projects/`.
version: 0.1.0
---

# PARA Project Scaffolder & Updater

Create or update a project note in `1 - Projects/` with a tight interview that
captures what makes a Project actually a Project (Tiago Forte's definition:
**outcome + deadline**). This skill orchestrates the workflow — it does not
redesign the existing `Templates/Project.md` and does not duplicate PARA
explanation already covered by `obsidian-workflows`.

## When this skill fires

- "Start a new project for ..." / "Kick off ..." / "Create a project note"
- "Update my Markly status" / "Refresh project X" / "Roll forward [project]"
- "Move [thing] out of Inbox into a project"

For *categorization* questions ("where should this note go?") use the
`para-organizer` agent instead — this skill assumes the project decision is
already made.

## Mode detection (first step)

Before anything else, classify the request:

| Signal | Mode |
|--------|------|
| "Create / start / new project / kick off" | **CREATE** |
| "Update / refresh / status / roll forward" | **UPDATE** |
| Ambiguous | Ask once: "Create new or update existing?" |

If CREATE, run **Search-before-write** (per `CLAUDE.md`):
```bash
qmd query "<proposed-project-name>" --json -n 5 || obsidian search:context query="<name>" limit=5
```
If a close match exists, surface it and confirm before scaffolding.

## CREATE workflow

### Step 1 — Project validity gate

Tiago Forte's rule: a Project requires **both** an outcome (a "done" state)
**and** a deadline/target date. If either is missing, it's an Area, not a
Project. Don't skip this — it's the #1 cause of stalled project lists.

Ask the user the two gating questions via `AskUserQuestion`:

```
Q1: "What does 'done' look like for this project?"
    (Free text — needs a discrete, checkable outcome)

Q2: "When does this need to be done?"
    Options:
      - "I have a specific date" → free text follow-up
      - "End of this quarter"
      - "End of this year"
      - "No deadline — it's ongoing"  ← red flag, see fallback
```

**Fallback:** If user answers "no deadline / ongoing" or can't name a discrete
outcome, propose: *"This sounds like an Area, not a Project. Want me to scaffold
it under `2 - Areas/` instead?"* Don't bulldoze through.

### Step 2 — Core interview (one AskUserQuestion call, batched)

Ask the remaining four questions in a single `AskUserQuestion` invocation
(multiple questions, single tool call) to minimize round-trips:

1. **Project type** (header: "Type", single-select):
   - Work / Side project / Personal / Health / Learning / Other
   - *Drives default tags and folder convention.*

2. **Heat** (header: "Focus", single-select — see `references/tiago-principles.md`):
   - 🔥 Hot — active focus this week
   - ❄️ Cold — committed but simmering
   - *Tiago's 2024 simplification; addresses "stalled projects list" problem.*

3. **Success criteria** (free text, prompt for 3–5 checkable items)

4. **Why now?** (free text, 1 sentence)
   - *Captured up-front because future-you will forget the motivation — and
     motivation is what tells you whether to keep going or archive when energy
     drops.*

### Step 3 — Tag & link suggestions

Compute defaults, then surface them for confirmation:

- **Tags:** `project` + type tag (e.g., `side-project`, `work`, `learning`).
  Don't add subject tags here — the user can append them.
- **Links:** Read active OKR notes (`2 - Areas/Goals/Quarterly/` newest file).
  Suggest 0–2 wikilinks if objectives match.

### Step 4 — Folder structure decision

Default: single file `1 - Projects/<Name>.md`.

Promote to a subfolder `1 - Projects/<Name>/<Name>.md` only if user mentions
sub-notes (architecture, ideation, strategy, PRDs). Match the `Markly/` and
`Roofr AI Marketplace/` patterns already in the vault.

### Step 5 — Scaffold from template

Use `obsidian` CLI to create from the existing template — never copy-paste the
template body. The `Templates/Project.md` is **read-only** per `CLAUDE.md`.

```bash
obsidian create path="1 - Projects/<Name>.md" template="Project" silent=true
```

Then patch frontmatter and the `# {{title}}` heading via `obsidian` CLI patch
operations.

### Step 6 — Approval gate

Per `CLAUDE.md`, **every project write needs explicit user approval before it
happens.** Present the assembled note (frontmatter + sections) as a preview
and confirm via `AskUserQuestion` before writing.

## UPDATE workflow

### Step 1 — Identify the project

If the user named one ("update Markly"), resolve to file. Otherwise list
active projects:
```bash
obsidian files folder="1 - Projects/" format=json
```
Present the list and ask which one.

### Step 2 — Read & detect drift

Read the project file. Look for these staleness signals:

| Signal | Action |
|--------|--------|
| `Updated: YYYY-MM-DD` more than 14 days ago | Flag for status refresh |
| `What's in progress` section empty | Ask what's happening now |
| `Open questions / Blockers` empty AND project ongoing > 30 days | Probe for blockers |
| Heat is `🔥 Hot` but no commits / activity in 7 days | Suggest demoting to `❄️ Cold` |
| `due-date` is in the past | Ask: extend, archive, or redefine? |

### Step 3 — Targeted interview

Only ask about *missing* or *stale* sections. Don't re-interview what's
already filled. Pattern:

```
AskUserQuestion (batched):
  - "Current status update?" (if Updated > 14 days)
  - "Any new decisions to capture?" (always, optional)
  - "New blockers / open questions?" (if blockers section is stale)
  - "Heat changed — still 🔥 Hot or moving to ❄️ Cold?" (if heat-signal mismatch)
```

### Step 4 — Patch sections in place

Use `obsidian` CLI section-patch operations — never rewrite the full file.

```bash
obsidian patch path="1 - Projects/<Name>.md" section="Current Status" content="..." silent=true
```

Update the `Updated: YYYY-MM-DD` marker to today.

### Step 5 — Approval gate

Show the diff. User approves before write (per `CLAUDE.md`).

## Project completion path

If during UPDATE the user says "this is done":

1. Move file to `4 - Archives/Projects - YYYY/<Name>.md`
2. Set frontmatter `status: ✅ Done`
3. Prompt: "Want to fill the Retrospective section before archiving?" — strongly
   recommended; the retrospective is the most-valuable durable artifact from a
   project and will be lost if skipped.
4. Update any MOC that referenced this project.

## Routing table (when to read references)

| Read this when | File |
|---|---|
| User asks "why this question?" or wants to understand the Project/Area distinction, Hot/Cold method, or weekly check ritual | `references/tiago-principles.md` |
| Building the AskUserQuestion call — need the exact wording, option lists, and copy-pasteable JSON | `references/interview-questions.md` |

## Gotchas

- **Don't skip the validity gate** — accepting "no deadline" creates the
  stalled-projects-list problem. Propose Area instead.
- **Don't redesign the template** — `Templates/Project.md` is the source of
  truth. The skill scaffolds *from* it, never replaces it.
- **Don't auto-write without approval** — `CLAUDE.md` is explicit: every PARA
  write requires user confirmation. Present a preview, then write.
- **Don't ask 8 questions in 8 turns** — batch into 1–2 `AskUserQuestion`
  calls. The interview should feel like a single conversation, not a quiz.
- **Don't duplicate tags with folder location** — note is in `1 - Projects/`,
  so `#project` tag is redundant in the body but kept in frontmatter for Bases
  queries.
- **Don't add subject tags automatically** — the user knows their subject
  taxonomy; auto-tagging by topic causes drift.

## Integration with other components

- **`para-organizer` agent** — Run *first* if user is unsure whether something
  is a Project. This skill takes over once the decision is "yes, Project".
- **`obsidian-workflows` skill** — Loaded automatically for PARA theory and
  review cadences. This skill does not duplicate that content.
- **`vault-structure` skill** — Auto-loaded; provides `Templates/Project.md` path and template conventions.
- **`/daily-startup` command** — Lists active projects. After this skill runs,
  the new/updated project will appear there.
- **`okr-tracker` agent** — Use during Step 3 (link suggestions) to surface
  active OKR connections.
