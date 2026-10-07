---
name: project
description: >-
  Create, update, or complete Obsidian PARA Project notes. Use when the user requests a vault project
  note, project status update, project completion, or PARA project tracking. Do not use for generic
  software planning unless a vault artifact is requested.
user-invocable: true
---

# Project

Manage finite, outcome-bound work in the vault's live Projects location. Canonical PARA requires a
defined outcome; apply deadline and metadata requirements only when `AGENTS.md` defines them.

## Choose a mode

- Create: new, set up, or track.
- Update: refresh, status, or changed plan.
- Complete: done, stopped, or archive.

Ask when the mode is ambiguous.

## Create

### 1. Search and validate

Read `AGENTS.md`, discover the current Projects path and template, then search for an existing note.
Inspect close matches before proposing a duplicate.

Confirm the work is a Project rather than an Area: it must be an active finite effort with a
checkable outcome. If it is an ongoing standard, propose an Area instead.

### 2. Gather the core contract

Ask no more than four concise questions in one structured batch when needed:

1. What outcome marks this project complete?
2. What does done look like in checkable terms?
3. What time horizon or target date applies, if any?
4. What is the first visible action and why does this matter now?

Use answers already present in the conversation instead of asking again. Gather additional detail
only when the schema requires it.

### 3. Choose structure and preview

Default to one project file. Use a project folder only when the work already needs durable supporting
notes. Show the target, metadata, outcome, success criteria, horizon, first action, and initial
sections before writing.

After approval, create through the `vault` safe-write flow, then verify the page and any separately
approved project-index link.

## Update

Resolve and read the canonical project note. Compare its recorded state with user-provided evidence.
Draft only the sections that changed and distinguish observed staleness from assumptions.

Show the exact change, obtain approval, update safely, and reread. Do not rewrite supporting or
human-owned notes without permission from `AGENTS.md` and the user.

## Complete

Confirm whether the outcome was achieved, deliberately stopped, or superseded. Offer a concise
retrospective before archiving. Preview:

- final status and outcome;
- lessons or decisions worth retaining;
- the live schema-defined archive destination;
- affected project-index links.

After approval, write the final state, move the note using current CLI syntax, update approved links,
and verify both source absence and destination presence.

## Completion

Report the canonical path, mode, confirmed outcome/state, writes performed, index changes, and any
unresolved schema or evidence gap.
