---
name: tweet-today
description: Draft specific Twitter/X posts from a concrete work receipt, lesson, opinion, code detail, or user draft. Use when the user asks what to tweet or a receipt workflow requests social options.
argument-hint: "[topic, today summary, or conversation excerpt]"
---

# Tweet Today

Produce at least three distinct single-post options grounded in real evidence. Use `blog` for an essay and `standup` for a team update.

## 1. Find receipts

Use the nearest source: current conversation, user draft, supplied daily summary, or structured receipt from another workflow. A receipt is a shipped change, fixed bug, observed detail, tested tool, decision, mistake, screenshot, or changed opinion.

If the source lacks a subject, stance, or concrete proof, ask only for the missing piece. Request permission before inspecting notes or Git.

Complete when the evidence supports three genuinely different signals rather than three phrasings of one claim.

## 2. Run the public-safety gate

Remove or generalize credentials, private URLs and repository names, customer data, unreleased metrics, internal architecture, config values, copied logs, and private backlinks. Keep receipt IDs and vault links as private workflow metadata.

For code, retain only the minimal public-safe lines and replace sensitive values with unmistakable placeholders.

Complete when every retained fact is publishable and traceable to the source.

## 3. Choose three signals

Choose evidence-backed categories such as shipped work, learned lesson, UI detail, programming judgment, product trade-off, agent workflow, or tiny code example. Name why each signal is distinct.

Useful frames:

- I thought X; evidence Y changed it to Z.
- I did X; the reusable lesson was Y.
- X works poorly under condition Y; Z handled it better.
- The visible bug was X; the underlying cause was Y.

## 4. Draft

Write one option per signal, each within the current platform limit unless the user requests a longer format. Make one point, keep claims proportional to evidence, and use a tiny snippet only when it communicates better than prose.

Load `references/twitter-voice.md` for the final voice pass. A candidate fails when it could be posted unchanged by a generic developer account; repair it with a sharper receipt, named detail, or actual opinion.

Complete when every option is safe, source-grounded, distinct, and recognizable as the user's voice.

## 5. Present the choice

```markdown
Recommended:
> [strongest option]

Why this one: [specificity, evidence, or voice reason]

Other options:
1. **[signal]** — [post]
2. **[signal]** — [post]
```

Return clarification questions instead of generic filler when evidence remains thin. Drafting does not imply posting or publication.

## Completion gate

The result is complete when at least three distinct candidates pass safety and voice checks, the recommendation is justified in one sentence, and no private workflow metadata appears in post text.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Finalizing candidates in the user's voice or deciding whether a code/image-led post fits | `references/twitter-voice.md` |
