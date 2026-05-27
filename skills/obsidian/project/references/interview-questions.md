> **Read this when:** building the `AskUserQuestion` call — need exact wording, copy-pasteable option lists, or guidance on what to batch.

# Interview Question Bank

Designed for `AskUserQuestion`. Each section is a complete, copy-pasteable
question spec. Keep questions tight — the goal is one or two batched calls,
not eight sequential turns.

## CREATE mode — Gating questions (Step 1)

Run *before* the main interview to validate this is actually a Project. If
either answer fails the validity test, fall back to suggesting an Area.

```yaml
question: "What does 'done' look like for this project?"
header: "Outcome"
options:
  - label: "I'll describe it"
    description: "Free text — what's the discrete, checkable outcome?"
  - label: "I'm not sure yet"
    description: "Red flag — propose Area instead and confirm."
multiSelect: false
```

```yaml
question: "When does this need to be done?"
header: "Deadline"
options:
  - label: "Specific date"
    description: "I'll provide a date (YYYY-MM-DD)."
  - label: "End of this quarter"
    description: "Auto-set to the last day of current quarter."
  - label: "End of this year"
    description: "Auto-set to 2026-12-31."
  - label: "No deadline — ongoing"
    description: "Red flag — this is likely an Area, not a Project. Confirm before proceeding."
multiSelect: false
```

**Failure handling:** If user picks "I'm not sure" OR "No deadline", surface:
> *"Per Tiago Forte's PARA rule, Projects need both an outcome AND a deadline.
> Without one, this is an Area. Want me to scaffold under `2 - Areas/`
> instead?"*

## CREATE mode — Core interview (Step 2, batched)

Send all four questions in a single `AskUserQuestion` call.

```yaml
questions:
  - question: "What type of project is this?"
    header: "Type"
    multiSelect: false
    options:
      - label: "Work"
        description: "Roofr or other employer work."
      - label: "Side project"
        description: "Personal product or business effort."
      - label: "Personal"
        description: "Life admin, finance, family."
      - label: "Health & fitness"
        description: "Training, race prep, recovery."
      - label: "Learning"
        description: "Course, book, tech to master."

  - question: "How hot is this project right now?"
    header: "Focus"
    multiSelect: false
    options:
      - label: "🔥 Hot — active focus this week"
        description: "Tiago's Hot/Cold method: you'll work on this in the next 7 days."
      - label: "❄️ Cold — committed but simmering"
        description: "Real project, but no active work expected this week. Avoids false guilt."

  - question: "Top 3-5 success criteria (checkable)?"
    header: "Success"
    multiSelect: false
    options:
      - label: "I'll write them"
        description: "Free text — one per line, written as checkable items."

  - question: "Why now? (One sentence)"
    header: "Why"
    multiSelect: false
    options:
      - label: "I'll describe it"
        description: "Captures motivation so future-you can make keep/archive decisions in 3 months."
```

**Note on the "I'll write them" pattern:** `AskUserQuestion` doesn't have a
native free-text field, but every question has an implicit "Other" option
that accepts free text. The "I'll describe it" label makes this explicit and
trains the user that custom input is expected.

## CREATE mode — Confirmation (Step 6)

```yaml
question: "Ready to write this project note?"
header: "Confirm"
options:
  - label: "Yes, create it"
    description: "Writes to `1 - Projects/<Name>.md` using Project template."
  - label: "Promote to subfolder"
    description: "Creates `1 - Projects/<Name>/<Name>.md` for sub-notes (architecture, PRDs, etc.)."
  - label: "Let me revise"
    description: "Show the preview and let me edit before write."
multiSelect: false
```

## UPDATE mode — Project selection (Step 1)

If the user didn't name a project:

```yaml
question: "Which project to update?"
header: "Project"
multiSelect: false
options:
  # Dynamically populated from `obsidian files folder="1 - Projects/"`.
  # Cap at 4 — if more, ask user to name it instead of paginating.
```

## UPDATE mode — Targeted refresh (Step 3, batched)

Build the questions list dynamically based on what's stale. Skip questions
where the section is already current.

```yaml
questions:
  # Only include if Updated > 14 days OR section empty
  - question: "What's the current status / what's in progress?"
    header: "Status"
    options:
      - label: "I'll describe it"
        description: "Free text — replaces `What's in progress` section. `Updated:` marker auto-bumps to today."

  # Always include, optional
  - question: "Any new decisions to capture?"
    header: "Decisions"
    options:
      - label: "Yes, add one"
        description: "Appends to the Key Decisions table with today's date."
      - label: "No new decisions"
        description: "Skip this section."

  # Only include if blockers section stale AND project > 30 days old
  - question: "New blockers or open questions?"
    header: "Blockers"
    options:
      - label: "I'll list them"
        description: "Free text — appends to `Open questions / Blockers`."
      - label: "None right now"
        description: "Skip this section."

  # Only include if heat signal mismatches (Hot but no activity)
  - question: "Still Hot, or moving to Cold?"
    header: "Heat"
    options:
      - label: "🔥 Still Hot"
        description: "Keep as active focus."
      - label: "❄️ Move to Cold"
        description: "Realistic — accept it's simmering, no per-week pressure."
      - label: "🏁 Actually, this is done"
        description: "Trigger archival workflow."
```

## UPDATE mode — Archival confirmation (project completion path)

```yaml
question: "Fill the retrospective before archiving?"
header: "Retro"
options:
  - label: "Yes — let's do it"
    description: "Highly recommended. 5 min of writing captures durable value. Will ask: what went well, what didn't, what to carry forward."
  - label: "Skip — archive now"
    description: "OK, but you're leaving value on the table. Marks file as `✅ Done` and moves to `4 - Archives/Projects - YYYY/`."
multiSelect: false
```

## Wording principles

- **Lead with the answer the user is most likely to pick** (Tiago: "make the
  right thing easy").
- **Use the red-flag options as soft education**, not gatekeeping — let the
  user override, but make sure they see the tradeoff.
- **Headers are 1–2 words** ("Outcome", "Deadline", "Focus") — they show as
  chips in the UI.
- **Descriptions explain consequences**, not definitions. "Writes to X" is
  better than "This is the file path field."
- **Never include an explicit "Other" option** — the UI provides one
  automatically.
