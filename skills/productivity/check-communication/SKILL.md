---
name: check-communication
description: >-
  Reviews draft communication before sending: Slack, email, PR comments, status
  updates, proposals, feedback, and pushback. Use when the user asks if a
  message sounds right, wants a rewrite, or pastes a draft for tone, clarity,
  buried asks, passive aggression, length, or next-step review.
---

# Communication Review

Review draft messages before sending. The goal: ask-first, reader-shaped, and minimum words. Output a revised version + 2–3 specific notes.

## The Five Checks

Run all five on every piece of communication.

Completion criterion: output includes the detected message type, a sendable revision, and 2–3 notes explaining the highest-impact changes. For non-FYI messages, the ask or intended reader action is explicit.

### 1. Clarity — Is the point obvious in the first sentence?

If the reader has to reach paragraph 3 to understand why you're messaging them, rewrite. The ask or context belongs at the top.

Bad: Three paragraphs of context → "Anyway, could you take a look at this?"
Good: "Can you review the auth PR by Friday? Context below."

### 2. Tone — Does it match the channel and relationship?

| Channel | Expected register |
|---|---|
| Slack DM (peer) | Casual, direct, abbreviations fine |
| Slack public channel | Slightly more formal, context for lurkers |
| Email (internal) | Professional, not stiff |
| Email (external/client) | Formal, no jargon |
| PR comment | Technical, factual, no passive aggression |
| Performance feedback | Specific, evidence-based, forward-looking |

Red flags: sarcasm that won't land in text, hedging that reads as passive aggression, jargon with non-technical stakeholders.

### 3. Action — What do you want the reader to do?

Vague: "Let me know your thoughts."
Clear: "Can you approve by Wednesday, or flag blockers by EOD Tuesday?"

Every non-FYI message should make the desired reader response explicit. If the message is purely informational, make that clear too.

### 4. Length — Can you cut 30%?

Usually yes. Prune:

- Context the reader already has
- Apologies for the message itself ("Sorry to bother you, but...")
- Qualifiers that add nothing ("I just wanted to quickly mention...")
- CC'd people who don't need to be CC'd

### 5. Context — Does the reader have enough to act?

Check from the reader's perspective: could they respond or take action without a follow-up question? If not, add the missing piece.

## Auto-Detect Message Type

Before evaluating, identify the message type from content:

| Type | Signals |
|---|---|
| Status update | Progress language, timeline mentions, blockers |
| Standup | Short, daily cadence, what I did / will do |
| Proposal / RFC | Suggests a change, asks for approval, presents options |
| PR review comment | Code references, review language, suggestions |
| Disagreement | Countering a position, expressing concern |
| Slack message | Casual tone, async communication |
| Email / formal | Recipients, subject-like structure, formal tone |

State the detected type, then apply the type-specific check below in addition to the five core checks.

## Type-Specific Checks

**Status update → STATUS framework:**

- State (on track / at risk / blocked)
- Target (deliverable and deadline)
- Achieved (impact over activity — "reduced latency 40%", not "worked on caching")
- Threats (what could go wrong)
- Unblocks (what you need from others)

**Proposal / RFC → proposal structure:**

- Problem stated with real data (not vague discomfort)
- Trade-offs named — pros AND cons (listing only upsides loses trust)
- Alternatives considered and rejected with reasons
- Rollback plan present
- Open Questions section calls out decision points (silence = readers didn't know what to react to)

**PR review comment:**

- Uses prefixes: `nit:` / `suggestion:` / `question:` / `issue:` / `thought:`
- Explains why for blockers, not just what to change
- Avoids making the author feel dumb — explain, don't judge

**Disagreement / pushback:**

- Steel Man: does it restate the other position charitably before countering?
- "Us vs the problem" framing, not "me vs you"
- Watch for: "As I already explained...", defensive language

**Slack async:**

- Thread Rule: if it'll take >3 exchanges, call instead
- Appropriate length for the medium — Slack isn't email

## Common Issues

- **Burying the ask**: context → context → context → buried ask at line 15. Move the ask to line 1, put context second.
- **"Per my last email..."**: almost always reads as passive-aggressive. Reword or remove.
- **Ambiguous next steps**: "Let me know" is not an action. Specify: what, by when, from whom.
- **Technical jargon to non-technical readers**: always flag, always simplify.
- **Apologetic opener**: "Sorry to bother you" weakens the message. Cut it.
- **No surprises risk**: flag if the message would catch stakeholders off guard in a group setting.

## Output Format

Detected type first, then revised version, then 2–3 notes:

```text
Detected type: [type]

[Revised message]

---
What's landing well: [1-2 specific strengths]

What to tighten:
- [What changed and why — specific, with a concrete rewrite if needed]
- [max 2-3 issues]
```

If the draft is mostly fine, say so briefly and note only the 1–2 small tweaks. Peer-level tone throughout — you're reading this as a colleague who wants it to succeed, not as a judge.
