---
name: tweet-today
description: >-
  Tweet proposal skill for turning today's work, the current agent conversation,
  or a technical topic into categorized Twitter/X post options. Use when the user
  asks what to tweet today, to turn a convo/session into tweets, to draft an X
  post, or to share a software dev, programming, UI/frontend, startup, tech,
  project, bug, lesson, blog idea, or agent-session insight.
user-invocable: true
argument-hint: "[topic, today summary, or conversation excerpt]"
---

# Tweet Today

Turn available context into categorized tweet options the user can choose from today: specific, peer-level, and non-cringe.

## Boundary

Default to at least 3 single-tweet options under 280 characters, grouped by category. Do not create a thread, LinkedIn post, or blog outline unless the user asks. Never claim the tweet was posted; this skill only drafts.

If the user asks for a longer essay, use the blog skill. If they ask for a daily standup, use the standup skill.

## Workflow

### 1. Locate the source

Use the nearest available source first:

| Branch | Source |
|--------|--------|
| Conversation | Current visible conversation, agent session, or pasted transcript |
| Today | User-provided bullets about today's work; if missing, ask for them or permission to inspect notes/git |
| Topic | The named topic plus any opinion, lesson, or example already provided |
| Draft | The user's rough tweet or idea |

Complete when the source has at least: subject, user's stance or lesson, and one concrete receipt. If any of those are missing, do a mini-grill before drafting.

### 2. Mini-grill thin context

Ask only the smallest set of questions needed to make the tweet real. Prefer these, adapted to the source:

- What changed your mind today?
- What did you actually do, build, debug, or notice?
- What is the non-obvious lesson?
- Who should care, and what should they do differently?
- What concrete receipt proves it?
- Are there Twitter/X accounts whose style should inspire this batch?

Complete when the answer can support categorized tweets without inventing facts.

### 3. Propose categories

Pick the 3 strongest tweet categories for the day. Start from the user's lane — software development, programming, UI/frontend craft, startup/product, AI/agent workflows, and broader tech — then choose what the source can actually support.

Useful categories:

- **What I shipped** — visible progress, demo, launch, refactor, feature, or tool.
- **What I learned** — a concrete technical lesson, debugging insight, or changed mind.
- **Frontend/UI craft** — interaction detail, design engineering, accessibility, polish, taste.
- **Programming take** — opinion about code structure, tools, abstractions, or workflow.
- **Startup/product note** — user pain, positioning, distribution, pricing, scope, trade-off.
- **Agent workflow** — what AI agents made easier/harder, prompt/process lessons, automation.

Complete when each chosen category has a one-line reason tied to today's source.

### 4. Extract the signal per category

For each chosen category, find one tweetable idea. It should fit one of these frames:

- `I used to think X, but Y made me think Z.`
- `Today I did X; the useful lesson was Y.`
- `People reach for X, but Y works better when Z.`
- `The bug/project/detail looked like X, but the real issue was Y.`

Complete when there are at least 3 distinct signals, not the same idea rewritten three times.

### 5. Draft options

Write at least 3 tweet candidates, one per chosen category. Use different shapes when possible:

1. **Tiny lesson** — direct takeaway from the work.
2. **Micro-story** — one concrete moment, then the lesson.
3. **Point of view** — a crisp claim with a receipt.

Rules:
- keep each option under 280 characters unless the user requested X Premium length
- no hashtags unless the user asks
- no engagement bait: "Agree?", "Thoughts?", "Hot take", "Here's the truth"
- no generic AI cadence: "game-changer", "unlock", "dive into", "leveraging"
- keep first-person only when the source is genuinely personal

Complete when every option is sendable, grounded in the source, and clearly labeled with its category.

### 6. Voice pass

Before finalizing, read `../blog/references/voice-tone.md` and revise for the user's voice.

Complete when the candidates sound like a technical peer: concrete, casual-professional, lightly first-person or inclusive when natural, and free of corporate gloss.

### 7. Present the choice

Show the categories first, then the tweets. Pick the strongest option and say why in one short sentence, but make it easy for the user to choose another.

Output format:

```markdown
Categories I’d use today:
1. [Category] — [why it fits today]
2. [Category] — [why it fits today]
3. [Category] — [why it fits today]

Recommended:
> [tweet]

Why this one: [one sentence]

Other options:
1. **[Category]** — [tweet]
2. **[Category]** — [tweet]
```

If the context is too thin, output the mini-grill questions instead of weak drafts.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 | Finalizing tweet candidates in the user's public writing voice | `../blog/references/voice-tone.md` |
