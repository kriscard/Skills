---
name: audit-para
description: >-
  Audits the Obsidian vault for PARA classification correctness — finds
  projects missing outcomes or deadlines, done-but-not-archived projects,
  stalled notes, areas with deadlines, and archives that got touched recently.
  Produces a structured report then offers an interactive fix flow. Make sure
  to use this skill whenever the user says "audit my vault", "check PARA
  classification", "are my notes in the right place?", "PARA audit", or runs
  /audit-para. Run weekly — daily noise dulls the signal. Never auto-fixes:
  every vault write requires explicit approval.
user-invocable: true
---

# Audit PARA

Hybrid workflow: Phase 1 is a read-only audit pass that produces a
severity-grouped report. Phase 2 is an interactive fix flow — nothing writes
without explicit approval per `AGENTS.md`.

**Scope this skill owns:** PARA classification correctness only.
Hard signals: projects without outcome/deadline, done-but-not-archived,
stalled >30 days, past `due-date` still Active, areas with deadlines,
resources with `project` tag or deadline, archives modified in last 14 days.

**Scope this skill does NOT cover** (delegate):
- Broken links, orphans, tag consistency → `maintain` skill
- Behavioral drift, avoidance → `spot-drift` skill
- Inbox categorization → `process-inbox` skill

## Obsidian Access

Use Obsidian CLI via Bash. On failure: "Obsidian CLI isn't working — update
Obsidian with CLI enabled."

## Phase 1 — Audit Pass (READ-ONLY)

### Step 1 — Vault rules

```bash
obsidian read path="AGENTS.md"
```

### Step 2 — Inventory all buckets (run in parallel)

```bash
obsidian files folder="1 - Projects/" format=json
obsidian files folder="2 - Areas/" format=json
obsidian files folder="3 - Resources/" format=json
obsidian files folder="4 - Archives/" format=json
```

For each Project file, pull frontmatter + body to run hard checks.
Cap deep reads at the active project count — Areas/Resources/Archives can
be inventoried by frontmatter alone unless flagged.

```bash
obsidian property:read path="1 - Projects/<file>.md" name="status"
obsidian property:read path="1 - Projects/<file>.md" name="due-date"
obsidian property:read path="1 - Projects/<file>.md" name="tags"
obsidian read path="1 - Projects/<file>.md"
```

### Check Matrix (hard signals only)

| Folder    | Check                                          | Severity  |
|-----------|------------------------------------------------|-----------|
| Projects  | `due-date` empty or missing                    | 🔴 critical |
| Projects  | `## 🎯 Objective` section body empty           | 🔴 critical |
| Projects  | `status` contains "Done" or "Complete"         | 🔴 critical (archive) |
| Projects  | `due-date` < today AND `status` Active         | 🔴 critical (overdue) |
| Projects  | `Updated:` marker >30 days AND retro empty     | 🟡 stalled |
| Areas     | `due-date` is set                              | 🔴 critical (areas don't have deadlines) |
| Areas     | tagged `project` in frontmatter                | 🔴 critical |
| Resources | `due-date` set OR tagged `project`             | 🔴 critical (wrong bucket) |
| Archives  | file modified time < 14 days ago               | 🟡 stalled (reactivated?) |

**`Updated:` marker:** parse from body under `## 📍 Current Status\n_Updated: YYYY-MM-DD_`.
Use the template marker, not filesystem mtime — mtime gets touched by
metadata changes.

### Step 3 — Report

```
PARA Audit — YYYY-MM-DD

🔴 Critical (classification violations)
  Projects/
    - "<name>": missing due-date frontmatter
    - "<name>": status ✅ Done but still in 1 - Projects/
    - "<name>": due-date 2026-01-15 is past, status 🟢 Active
  Areas/
    - "<name>": has due-date — should be a Project

🟡 Stalled (needs review)
  - "<name>": Updated 2026-04-01 (43 days), no retrospective

🟢 Healthy
  - <count> Projects pass all checks
  - <count> Areas pass all checks

Total: X critical, Y stalled. Want to fix the criticals now?
```

## Phase 2 — Batch Fix Flow (INTERACTIVE)

If 0 critical: stop with "PARA classification healthy."

If >0 critical, use `AskUserQuestion`:

```yaml
question: "Fix the N critical findings now?"
options:
  - label: "Yes — walk through them"
    description: "One at a time. Propose action, ask for approval per item."
  - label: "Fix only the archivable ones"
    description: "Target 'done but not archived' only (safest batch)."
  - label: "Skip — I'll handle later"
    description: "Report stays; return via /audit-para."
```

### Per-Finding Action Proposals

For each critical finding, propose a specific action:

| Finding | Proposed action | Route to |
|---------|-----------------|----------|
| Project missing outcome/deadline | Add fields or convert to Area | `para-project` skill (UPDATE mode) |
| Project ✅ Done, not archived | Move to `4 - Archives/Projects - YYYY/<name>.md`, prompt retro | Direct move + retro prompt |
| Project past due-date, Active | Extend / mark done / archive / convert to Area | `AskUserQuestion` → branch |
| Area with due-date | Convert to Project or remove due-date | `para-organizer` agent + file move |
| Resource with `project` tag or due-date | Re-categorize | `para-organizer` agent |
| Archive modified recently | Confirm: intentional edit or reactivate? | `AskUserQuestion` → file move |

Per item: present proposal → `AskUserQuestion {Apply / Skip / Modify}` →
apply only on explicit approve.

### Retrospective Gate (for archive moves)

Before any Project → Archives move, check if `## 🔄 Retrospective` is empty.
If empty:

```yaml
question: "Fill the retrospective before archiving '<name>'?"
options:
  - label: "Yes — quick 3-question prompt"
    description: "What went well, what didn't, what to carry forward. ~3 min."
  - label: "Skip — archive as-is"
    description: "OK, but you lose the durable artifact."
```

If yes: ask 3 questions via `AskUserQuestion`, patch via `obsidian patch`,
then move.

## Gotchas

- Run weekly, not daily — daily noise dulls the signal.
- Never auto-fix. Phase 2 batching is not silent batch writes.
- Don't overlap with `maintain` skill — structural issues (broken links,
  missing sections) belong there.
- Avoid deep content reads for Areas/Resources — frontmatter checks are fast;
  full reads at scale are slow.
- If a user disagrees with a finding, respect it. PARA is a tool, not a law.
  Offer to add an exception note in the file or skip the finding for this run.

## References

| Load when | Reference |
|-----------|-----------|
| Deep theory on PARA categories, migration, variations, or troubleshooting | `references/para-deep-dive.md` |
