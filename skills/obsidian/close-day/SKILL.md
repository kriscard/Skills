---
name: close-day
description: >-
  Runs the end-of-day processing ritual for the Obsidian vault — parses the daily note, merges
  Claude session insights, updates active project notes in place, surfaces vault connections, and
  writes carry-forward items for tomorrow. Make sure to use this skill whenever the user says "close
  my day", "end of day", "wrap up today", "process today's notes", "what did I do today", or runs
  /close-day. Five minutes of structured closing prevents a week of lost context.
user-invocable: true
---

# Close Day

End-of-day ritual. Parses today's daily note + Claude sessions, updates project notes in-place,
surfaces vault connections, and sets up tomorrow. **A 5-minute ritual — not a lengthy report.**

## Ask, Don't Assume

Shared principle (canonical version in the `vault` skill): never guess, deduce, or fill gaps with
assumptions about the user's notes, priorities, or intent. If you don't know — a date range, what
counts as a win, which goals are active — **ask**. Before writing any synthesis or judgment into a
note, show your draft with its source and get explicit confirmation. Missing data is not permission
to invent.

## Obsidian Access

Use Obsidian CLI via Bash. On failure: "Obsidian CLI isn't working — update Obsidian with CLI
enabled."

## Step 1 — Load Context (run in parallel)

```bash
TODAY="2 - Areas/Daily Ops/$(date +%Y)/$(date +%Y-%m-%d).md"
obsidian read path="$TODAY" 2>/dev/null || echo "(no daily note — run /daily first)"
obsidian files folder="1 - Projects/" format=json
obsidian read path="AGENTS.md" 2>/dev/null || echo "(AGENTS.md not found)"
```

Parse all captured content from today's daily note: free-form writing, meeting notes, ideas, tasks,
people referenced, decisions made.

## Step 2 — Process Claude Session Log

```bash
obsidian read path="2 - Areas/Daily Ops/$(date +%Y)/Claude Sessions/$(date +%Y-%m-%d).md"
```

Session blocks: `## HH:MM — <project>` → **Decisions / Lessons / Action items / Files touched**.

Split into two buckets:

**Bucket A — On-project** (project header matches an active project): Ingest fully. Feed Decisions,
Lessons, Action items into Step 4.

**Bucket B — Off-project** (dotfiles, neovim, plugin work, etc.): Present as one-liners:
`[HH:MM — project] <takeaway>` Ask: "Capture any of these as TIL / resource notes?" — only on
explicit pick.

After bucketing, surface items from on-project sessions **not** reflected in the daily note
(decisions made, action items committed to). Propose additions — do not auto-write to the daily
note.

## Step 3 — Vault Connection Discovery

Run searches per theme from today, then trace backlinks:

```bash
obsidian search:context query="<theme 1>" limit=10
obsidian search:context query="<theme 2>" limit=10
obsidian backlinks file="<today's note>"
```

Surface: "Today you wrote about X. This connects to [[note]] from [date] — worth revisiting?" Flag
themes recurring 3+ times in the past two weeks.

## Step 4 — Extract & Categorize

Sources: today's daily note (Step 1) + on-project sessions (Step 2, Bucket A).

Four categories to extract:

- **Action Items** — promises to others, deadlines, follow-ups
- **Ideas & Insights** — observations, hypotheses, perspective shifts
- **People & Commitments** — messages to send, meetings to schedule
- **Questions Raised** — things to investigate, pending decisions

Cross-reference against existing open tasks:

```bash
obsidian tasks todo path="$TODAY"
```

Flag any action items missing from the task list.

## Step 5 — Update Project Notes In-Place

Match active projects to today's work (explicit mentions + implied work). For each match, read the
project note first:

```bash
obsidian read path="1 - Projects/<project-name>/<main-note>.md"
```

Then update only the sections that changed. **These are section-targeted edits — never append raw
entries at the bottom.** The CLI has no `patch`, so updating a named section means either the MCP
`obsidian_patch_content` tool (heading-targeted, supports `operation: replace|append`) or a `read` +
`create ... overwrite` rewrite of the whole note. Ask the user which to use, then apply the changes
below:

- **`📍 Current Status`** — _replace_ the section with summary + date:
  `_Updated: $(date +%Y-%m-%d)_\n\n<status>\n\n### What's in progress\n<merged list>\n\n### Open questions / Blockers\n<merged list>`
- **`🧠 Key Decisions`** — _append_ a row only if a decision was made today:
  `| $(date +%Y-%m-%d) | <decision> | <why> |`
- **`📝 Notes & Context`** — _append_ only if a new insight emerged: `\n<insight>`

Guidelines: only update on meaningful progress; preserve existing content; use the user's own
language; adapt to non-standard templates.

### Related Notes Discovery (per matched project)

```bash
qmd query "<project name> <keyword>" --json -n 5
obsidian links file="1 - Projects/<project-name>/<main-note>.md"
```

Filter: drop `2 - Areas/Daily Ops/` hits, already-linked notes, and `source: claude-memory` notes
unless opted in. Keep at most 3 candidates.

Propose — never write without approval:

```
[[Project A]] — related notes worth linking:
  - [[note-1]] (3 - Resources/...) — <why it matches>
Approve any to append to 🔗 Links & References?
```

## Step 6 — Carry Forward

```bash
TODAY="2 - Areas/Daily Ops/$(date +%Y)/$(date +%Y-%m-%d).md"
obsidian append path="$TODAY" content="## Carry Forward\n- [item 1]\n- [item 2]"
```

If the Quick Wrap section is empty, draft answers:

- Did I explore anything new today?
- What did I actually move forward?
- What bottleneck became obvious?
- One thing to carry into tomorrow?

## Step 7 — Wiki Distillation (optional, always ask)

> Want to distill today's session log into wiki concept notes? Runs a dry-run first so you can
> review before any writes. ~$0.02–0.05. [y/N]

If yes, dry-run first:

```bash
uv run ~/.dotfiles/.claude/scripts/memory_compile.py --date $(date +%Y-%m-%d) 2>&1 | tail -60
```

Surface: concepts extracted, new-note vs moc-backlink split, flagged false-positive matches (qmd
0.88–0.95). Then ask: "Apply? Skip backlinks? [y / skip-backlinks / N]"

Apply:

```bash
uv run ~/.dotfiles/.claude/scripts/memory_compile.py --date $(date +%Y-%m-%d) --apply --yes
# skip-backlinks variant: add --skip-backlinks
```

If no: note that the plan is saved at `~/.claude/state/memory-compile-plans/$(date +%Y-%m-%d).json`.

## Output Format

Keep output concise. Focus on filing what matters, not summarizing the day.

```
Today's Extraction — [categories with items]
Session Off-Project Highlights — [one-liners; user picks any to capture]
Session ↔ Daily Note Gaps — [decisions/actions not yet in daily note]
Vault Connections — [recurring themes, links to older notes]
Project Notes Updated — [list with what changed per project]
Related Notes (proposed) — [per-project candidates; awaiting approval]
Carry Forward — [what matters tomorrow]
Quick Wrap — [draft answers if section empty]
Wiki Distillation — [if opted in: plan summary, applied paths, skipped]
```
