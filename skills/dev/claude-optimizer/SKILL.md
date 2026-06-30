---
name: claude-optimizer
description: >-
  Audits and improves CLAUDE.md files to make Claude more compliant and
  effective. Use when the user says "optimize my CLAUDE.md", "my claude.md
  is too long", "improve my claude instructions", "claude isn't following
  my instructions", or wants to improve how Claude behaves in a project.
  CLAUDE.md is loaded on every turn — bloated instructions dilute the signal.
---

# Claude Optimizer

## Why This Matters

CLAUDE.md is loaded into context on every single turn. Bloated or poorly structured instructions compete with the user's actual request for attention. A well-structured CLAUDE.md dramatically improves compliance; a 10K-token wall of prose does the opposite.

## Workflow

**Step 1 — Always read and measure**

```bash
find . -name CLAUDE.md -print
wc -w path/to/CLAUDE.md
rg -n '(^|\s)@[^\s]+' $(find . -name CLAUDE.md -print)
# Rough token estimate: word count ÷ 0.75
```

Also inspect nested `CLAUDE.md` files and `@`-referenced files because they may
load into context too. Report any referenced file you did not inspect.

**Step 2 — Analyze against these criteria**

Use this inline table for the fast audit. Load `references/best-practices.md`
when proposing a detailed restructure, token budget, or rewritten organization.

| Issue | Symptom | Fix |
|-------|---------|-----|
| Token bloat | >3,500 tokens | Move deep content to `@references/` files |
| Explanatory fluff | "It's important to note that...", "Please ensure..." | Delete. Claude 4 follows direct instructions. |
| Duplicated rules | Same constraint stated 3 different ways | Keep the clearest one |
| Missing structure | Safety rules buried mid-file | Safety rules first — highest attention at top |
| Prose where lists work | Paragraph describing a workflow | Numbered list or code block |
| Missing parallel hints | Sequential tool calls that could be concurrent | Add "Run X and Y in parallel" where appropriate |
| Inline content that should be referenced | Large code templates, full file examples | Move to `@path/to/reference.md` |

**Target:** 2,500–3,500 tokens. Hard limit: 5,000 tokens. Below 1,500 often means missing critical context.

**Step 3 — Propose changes with reasoning**

Show the user what you'd change and why. Never silently rewrite the file. The
user knows their workflow better than you do — some verbosity is intentional.

**Step 4 — Stop after proposal unless approved**

Rewrite only after the user explicitly approves edits. If the file is large,
show a diff-style summary of what's changing rather than pasting the entire new
version.

## Structure Template

```markdown
# Safety Rules (first — highest attention)
Hard constraints that cannot be overridden.

# Communication Style
How Claude should respond.

# Workflow
Step-by-step processes. Use numbered lists or code blocks.

# Project Context
What the project is, stack, key conventions.

# Commands / Tools
Available scripts, how to run them.
```

## What NOT to Remove

- Safety rules (even if they feel obvious)
- Project-specific conventions that differ from defaults
- Commands that Claude genuinely needs to run (test, lint, build)
- `@references` to files with deep context (they load lazily, low cost)

## Completion Gate

An audit is complete only after reporting:

- word count and rough token estimate
- nested `CLAUDE.md` files and `@` referenced files checked
- top 5 highest-impact cuts or restructures
- what must stay unchanged
- estimated before/after token budget

Stop after the proposal unless the user explicitly approves edits.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 — High | Proposing detailed CLAUDE.md structure, token budgets, include/exclude choices, or a rewrite plan | `references/best-practices.md` |
