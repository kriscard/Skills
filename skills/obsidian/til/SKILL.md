---
name: til
description: >-
  Captures learnings from a coding session into an engaging TIL note in the
  Obsidian vault. Make sure to use this skill whenever the user runs /til,
  says "save what I learned", "create a TIL note", "document this session",
  "write up what we built", or reaches the end of any coding session where
  new things were learned. Writes like telling a story to a friend — not a
  dry report.
user-invocable: true
argument-hint: "[project name — omit to infer from context]"
---

# TIL (Today I Learned) Capture

Turn a coding session into a durable, engaging knowledge note. The goal is a
note future-you will actually want to read — not a dry changelog.

## Step 1 — Identify the Project

Use `$ARGUMENTS` if provided. Otherwise infer from:
1. Current working directory (`pwd`)
2. Git repo name (`git remote get-url origin`)
3. Dominant topic from the conversation

## Step 2 — Check for an Existing TIL Today

```bash
obsidian read path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" 2>/dev/null
```

If a note exists: append a new section. Never overwrite — today may have
multiple learning sessions.

## Step 3 — Extract Learnings from the Conversation

Analyze the full conversation and pull out:

- **What was built or designed** — the artifact and its purpose
- **Key architectural decisions** — why this approach over alternatives
- **Bugs encountered and fixed** — the symptom, root cause, and fix
- **"Aha moments"** — insights that reframe how you think about something
- **What would be done differently** — honest retrospective

## Step 4 — Write with an Engaging Voice

Write like telling a story to a friend, not filing a report.

**Use:**
- Analogies: "it's like a cache, but for..."
- Anecdotes: "We tried X first — it broke because..."
- Before/after code for bug fixes
- Mermaid diagrams for architecture or data flow when they'd clarify structure

**Required frontmatter tags (3–5 tags using `til/` prefix):**

| Category | Examples |
|----------|---------|
| Technology | `til/react`, `til/typescript`, `til/nextjs`, `til/python` |
| Patterns | `til/architecture`, `til/testing`, `til/debugging`, `til/performance` |
| Libraries | `til/tanstack-query`, `til/zod`, `til/prisma` |

Pick tags that match what was actually learned — don't over-tag.

**Note structure:**
```markdown
---
tags: [til/typescript, til/architecture, til/debugging]
date: YYYY-MM-DD
project: <project name>
---

# TIL: <engaging title that captures the insight>

## What We Built
<brief context>

## The Story
<narrative with anecdotes, analogies, code snippets>

## Key Insight
<the one thing to remember>

## What I'd Do Differently
<honest retrospective>
```

## Step 5 — Save the Note

```bash
# New note
obsidian create path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" ...

# Existing note — append new section
obsidian patch path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" \
  section="## Session 2 — <title>" content="..."
```

## Hard Rules

- NEVER mention Claude or AI assistance in the note content — write in first
  person as if you discovered everything yourself
- NEVER overwrite an existing TIL — always append a new dated section
- Write for future-you in 6 months, not for the PR description
