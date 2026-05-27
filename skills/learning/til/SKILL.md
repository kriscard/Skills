---
name: til
description: >-
  Captures learnings from any session — coding, research, or a /learn
  conversation — into an engaging TIL note in the Obsidian vault. Make sure
  to use this skill whenever the user runs /til, says "save what I learned",
  "create a TIL", "document this session", "write up what we built", or
  reaches the end of any learning or coding session where new things were
  learned. Also triggers at the end of a /learn session when the user says
  "done". Writes like telling a story to a friend — not a dry report.
user-invocable: true
argument-hint: "[project or topic name — omit to infer from context]"
---

# TIL (Today I Learned) Capture

Turn a session into a durable, engaging knowledge note. The goal is a note
future-you will actually want to read — not a dry changelog.

## Step 1 — Identify the Topic

Use `$ARGUMENTS` if provided. Otherwise infer from:
1. Current working directory (`pwd`)
2. Git repo name (`git remote get-url origin`)
3. Dominant topic from the conversation

## Step 2 — Check for an Existing TIL Today

```bash
obsidian read path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" 2>/dev/null
```

If a note exists: append a new section. Never overwrite — today may have
multiple sessions.

## Step 3 — Extract Learnings from the Conversation

Analyze the full conversation and pull out:

- **What was built, learned, or designed** — the artifact or insight
- **Key decisions and trade-offs** — why this approach over alternatives
- **Bugs or blockers encountered and fixed** — symptom, root cause, fix
- **"Aha moments"** — insights that reframe how you think about something
- **What would be done differently** — honest retrospective

## Step 4 — Write with an Engaging Voice

Write like telling a story to a friend, not filing a report.

**Use:**
- Analogies: "it's like a cache, but for..."
- Anecdotes: "We tried X first — it broke because..."
- Before/after code for bug fixes and pattern changes
- Mermaid diagrams for architecture or data flow when they clarify structure

**Required frontmatter tags (3–5 using `til/` prefix):**

| Category | Examples |
|----------|---------|
| Technology | `til/react`, `til/typescript`, `til/nextjs`, `til/python` |
| Patterns | `til/architecture`, `til/testing`, `til/debugging`, `til/performance` |
| Libraries | `til/tanstack-query`, `til/zod`, `til/prisma` |
| Concepts | `til/accessibility`, `til/security`, `til/composition` |

**Note structure:**

```markdown
---
tags: [til/typescript, til/architecture]
date: YYYY-MM-DD
project: <topic or project name>
---

# TIL: <engaging title that captures the insight>

## What We Covered
<brief context — one sentence>

## The Story
<narrative with anecdotes, analogies, code snippets>

## Key Insight
<the one thing to remember>

## What I'd Do Differently
<honest retrospective — skip if nothing stands out>
```

## Step 5 — Save the Note

```bash
# New note
obsidian create path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" \
  content="<full note content>"

# Existing note — append new section
obsidian patch path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" \
  section="## Session 2 — <title>" content="<content>"
```

## Hard Rules

- Never mention Claude or AI assistance in the note — write in first person
- Never overwrite an existing TIL — always append a new section
- Write for future-you in 6 months, not for the PR description
- If Obsidian CLI fails: tell the user "Obsidian CLI isn't working — update
  Obsidian with CLI enabled"
