---
name: tweet-today
description: >-
  Tweet Today creates categorized Twitter/X post options from today's work, a
  conversation, a draft, or a technical topic. Use when the user asks what to
  tweet today or wants software dev, programming, UI/frontend, startup/product,
  tech, code-snippet, or AI-agent tweet options.
user-invocable: true
argument-hint: "[topic, today summary, or conversation excerpt]"
---

# Tweet Today

Turn available context into categorized tweet options the user can choose from today: specific, peer-level, and non-cringe.

## Boundary

Default to at least 3 single-tweet options under 280 characters, grouped by category. Do not create a thread, LinkedIn post, or blog outline unless the user asks. Never claim the tweet was posted; this skill only drafts.

If the user asks for a longer essay, use the blog skill. If they ask for a daily standup, use the standup skill.

## Workflow

### 1. Harvest receipts

Use the nearest available source first, then extract concrete receipts:

| Branch | Source |
|--------|--------|
| Conversation | Current visible conversation, agent session, or pasted transcript |
| Today | User-provided bullets about today's work; if missing, ask for them or permission to inspect notes/git |
| Topic | The named topic plus any opinion, lesson, or example already provided |
| Draft | The user's rough tweet or idea |
| Structured receipt | A public-safe receipt promoted by `capture-receipt` or `close-day`, including proof and private source backlinks |

Receipts are shipped changes, bugs fixed, screenshots, code snippets, tools tried, decisions made, mistakes noticed, or opinion shifts.

Complete when the source can support 3 distinct tweet options. For a full-day request, aim for 3-5 receipts. If the source lacks subject, stance/lesson, or a concrete receipt, do a mini-grill before drafting.

### 2. Mini-grill thin context

Ask only the smallest set of questions needed to make the tweet real. Prefer these, adapted to the source:

- What changed your mind today?
- What did you actually do, build, debug, or notice?
- What is the non-obvious lesson?
- Who should care, and what should they do differently?
- What concrete receipt proves it?
- Are there Twitter/X accounts whose style should inspire this batch?

Complete when the answer can support categorized tweets without inventing facts.

### 3. Safety gate

Scan the source before drafting. Remove or generalize anything unsafe: secrets, credentials, tokens, API keys, private URLs, private repo names, customer data, unreleased metrics, `.env` values, config values, or copied logs.

For code snippets, keep only public-safe examples. Replace sensitive values with placeholders like `YOUR_API_KEY`, `<internal-url>`, or `example.com`.

Complete when every usable receipt is safe to publish, or unsafe receipts have been dropped.

For a structured receipt, keep receipt ID, daily/project/session backlinks, and safety state as **private draft metadata**. Never include those internal references in the tweet text.

### 4. Propose categories

Pick the 3 strongest tweet categories for the day. Start from the user's lane — software development, programming, UI/frontend craft, startup/product, AI/agent workflows, and broader tech — then choose what the source can actually support.

Useful categories:

- **What I shipped** — visible progress, demo, launch, refactor, feature, or tool.
- **What I learned** — a concrete technical lesson, debugging insight, or changed mind.
- **Frontend/UI craft** — interaction detail, design engineering, accessibility, polish, taste.
- **Programming take** — opinion about code structure, tools, abstractions, or workflow.
- **Startup/product note** — user pain, positioning, distribution, pricing, scope, trade-off.
- **Agent workflow** — what AI agents made easier/harder, prompt/process lessons, automation.
- **Code snippet** — a tiny before/after, API shape, bug pattern, CSS detail, or command that makes the lesson concrete.

Complete when each chosen category has a one-line reason and at least one receipt tied to today's source.

### 5. Extract the signal per category

For each chosen category, find one tweetable idea. It should fit one of these frames:

- `I used to think X, but Y made me think Z.`
- `Today I did X; the useful lesson was Y.`
- `People reach for X, but Y works better when Z.`
- `The bug/project/detail looked like X, but the real issue was Y.`

Complete when there are at least 3 distinct signals, not the same idea rewritten three times.

### 6. Draft options

Write at least 3 tweet candidates, one per chosen category. Use different shapes when possible:

1. **Tiny lesson** — direct takeaway from the work.
2. **Micro-story** — one concrete moment, then the lesson.
3. **Point of view** — a crisp claim with a receipt.
4. **Code snippet** — a tiny snippet only when code makes the insight sharper than prose.

Rules:
- keep each option under 280 characters unless the user requested X Premium length
- no hashtags unless the user asks
- no engagement bait: "Agree?", "Thoughts?", "Hot take", "Here's the truth"
- no generic AI cadence: "game-changer", "unlock", "dive into", "leveraging"
- keep first-person only when the source is genuinely personal
- when a code snippet helps, prefer 1-4 lines, real syntax, and enough surrounding prose to explain the point
- if a useful snippet needs sensitive values, use the sanitized placeholders from the safety gate

Complete when every option is sendable, grounded in the source, clearly labeled with its category, and safe to publish.

### 7. Voice pass

Before finalizing, read `references/twitter-voice.md` and revise for the user's Twitter/X voice.

Run the boring-tweet test: if a tweet could be posted by any generic AI/dev account, rewrite it around a sharper receipt, stronger opinion, or more specific wording.

Complete when the candidates sound like Chris's X voice: casual, technical, lightly opinionated, specific, non-boring, and free of generic AI/influencer cadence.

### 8. Present the choice

Show the categories first, then the tweets. Pick the strongest option by specificity, receipt quality, voice match, and conversation potential — not by safest/polished wording. Say why in one short sentence, but make it easy for the user to choose another.

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

### 9. Optionally save the approved draft

After the user chooses or edits a candidate, offer to append it under `## ✍️ Drafts` in `1 - Projects/Public Technical Presence/Public Technical Presence.md` with its receipt ID and private source backlinks. Show the exact write and require approval.

Save state as `draft`, never `published`. Only a user-confirmed public URL or explicit publication confirmation may move it to `## 🚀 Published`.

Complete when the approved draft is either saved with metadata or deliberately left in chat.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 | Finalizing tweet candidates in the user's Twitter/X voice, choosing tweet shapes, or deciding whether a code snippet fits | `references/twitter-voice.md` |
