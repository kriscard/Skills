---
name: til
description: >-
  TIL capture for explicit requests to save learned material from a session into an engaging
  Obsidian note. Use when the user runs /til or asks to save, document, or write up what they
  learned.
user-invocable: true
argument-hint: "[project or topic name — omit to infer from context]"
---

# TIL (Today I Learned) Capture

Turn a session into a durable, engaging knowledge note. The goal is a note future-you will actually
want to read — not a dry changelog. This skill is the single source of truth for TIL note format.

## Step 1 — Identify the Topic

Use `$ARGUMENTS` if provided. Otherwise infer from:

1. Current working directory (`pwd`)
2. Git repo name (`git remote get-url origin`)
3. Dominant topic from the conversation

Complete when the topic/project name is explicit or the inferred topic is shown to the user.

## Step 2 — Check for an Existing TIL Today

```bash
obsidian read path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" 2>/dev/null
```

If a note exists, append a session entry. Never overwrite — today may have multiple sessions.

## Step 3 — Extract Learnings from the Conversation

Analyze the full conversation and pull out only evidence-backed material:

- **What was built, learned, or designed** — the artifact or insight
- **Key decisions and trade-offs** — why this approach over alternatives
- **Bugs or blockers encountered and fixed** — symptom, root cause, fix
- **Aha moments** — insights that reframe how you think about something
- **What would be done differently** — honest retrospective

Completion: every listed learning category has either extracted evidence from the conversation or is
intentionally omitted as not applicable. Do not pad empty categories.

## Step 4 — Write with an Engaging Voice

Write like telling a story to a friend, not filing a report.

Use:

- analogies: "it's like a cache, but for..."
- anecdotes: "We tried X first — it broke because..."
- before/after code for bug fixes and pattern changes
- Mermaid diagrams for architecture or data flow when they clarify structure

Required frontmatter tags: 3–5 tags using the `til/` prefix.

| Category | Examples |
| --- | --- |
| Technology | `til/react`, `til/typescript`, `til/nextjs`, `til/python` |
| Patterns | `til/architecture`, `til/testing`, `til/debugging`, `til/performance` |
| Libraries | `til/tanstack-query`, `til/zod`, `til/prisma` |
| Concepts | `til/accessibility`, `til/security`, `til/composition` |

### New-note shape

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

<honest retrospective — omit if nothing stands out>
```

### Existing-note append shape

Append only a session section. Do not repeat frontmatter or the top-level `# TIL` title.

```markdown
## Session N — <engaging title>

### What We Covered

<brief context>

### The Story

<narrative>

### Key Insight

<the one thing to remember>

### What I'd Do Differently

<omit if nothing stands out>
```

## Step 5 — Save the Note

```bash
# New note
obsidian create path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" \
  content="<full note content>"

# Existing note — append a session entry only
obsidian append path="3 - Resources/TIL/til-$(date +%Y-%m-%d).md" \
  content="\n## Session N — <title>\n\n<session content>"
```

After saving, confirm the note title, location, and categories included.

## Hard Rules

- Never mention Claude or AI assistance in the note — write in first person
- Never overwrite an existing TIL — always append a session entry
- Write for future-you in 6 months, not for the PR description
- If Obsidian CLI fails: tell the user "Obsidian CLI isn't working — update Obsidian with CLI enabled"
