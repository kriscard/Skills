---
name: check-communication
description: >-
  Reviews draft communication before sending: Slack, email, PR comments, status
  updates, proposals, feedback, and pushback. Use when the user asks if a
  message sounds right, wants a rewrite, or pastes a draft for tone, clarity,
  buried asks, passive aggression, length, or next-step review.
---

# Communication Review

Review draft messages before sending. The goal: clear, kind, reader-shaped, and only as long as needed. Output a revised version + 2–3 specific notes.

## Workflow

### 0. Calibrate tone

Infer the channel, relationship, stakes, and communication goal before rewriting. Default to **Warm direct**: clear and concise, but still human.

Use **Empathetic** when the message involves feedback, disagreement, apology, performance, conflict, disappointment, power dynamics, or anything that could land as cold or dismissive.

Use UserQuestionTool only when tone or stakes are ambiguous enough that guessing would change the rewrite. Ask one question:

> What tone should this land with?

Options:

| Tone mode | Use when |
|---|---|
| Warm direct | Default for most peer/team messages: clear, polite, not over-softened |
| Empathetic | Sensitive, relational, conflict, feedback, apology, or high-emotion messages |
| Executive concise | Decision-oriented updates for busy readers who need the point fast |
| Detailed but readable | The reader needs context, but the message should still avoid becoming a wall |

Complete when the output tone mode is chosen, either inferred from the draft or selected by the user.

## The Five Checks

Run all five on every piece of communication.

Completion criterion: output includes the detected message type, selected tone mode, a sendable revision, and 2–3 notes explaining the highest-impact changes. For non-FYI messages, the ask or intended reader action is explicit.

### 1. Clarity — Is the point obvious in the first sentence?

If the reader has to reach paragraph 3 to understand why you're messaging them, rewrite. The ask or context belongs at the top.

Bad: Three paragraphs of context → "Anyway, could you take a look at this?"
Good: "Can you review the auth PR by Friday? Context below."

### 2. Tone — Does it match the channel, relationship, and stakes?

| Channel | Expected register |
|---|---|
| Slack DM (peer) | Casual, warm direct, abbreviations fine |
| Slack public channel | Slightly more formal, context for lurkers |
| Email (internal) | Professional, not stiff |
| Email (external/client) | Formal, kind, no jargon |
| PR comment | Technical, factual, no passive aggression |
| Performance feedback | Empathetic, specific, evidence-based, forward-looking |

Red flags: sarcasm that won't land in text, hedging that reads as passive aggression, jargon with non-technical stakeholders, or directness that reads cold when the message has relational stakes.

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

### 6. Empathy — Does it preserve the relationship?

Clear is not enough if the revision lands cold. Check whether the message acknowledges effort, context, or impact when that would help the reader receive it.

A good revision:

- keeps the ask clear
- avoids sounding annoyed, dismissive, or transactional
- acknowledges effort or context when useful
- avoids over-apologizing or burying the point in cushioning

Complete when the revision is direct enough to act on and warm enough for the relationship/stakes.

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
- Acknowledge what is reasonable in the other view before naming the concern
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

Detected type and tone mode first, then revised version, then 2–3 notes:

```text
Detected type: [type]
Tone mode: [Warm direct / Empathetic / Executive concise / Detailed but readable]

[Revised message]

---
What's landing well: [1-2 specific strengths]

What to tighten:
- [What changed and why — specific, with a concrete rewrite if needed]
- [max 2-3 issues]
```

If the draft is mostly fine, say so briefly and note only the 1–2 small tweaks. Peer-level tone throughout — you're reading this as a colleague who wants it to succeed, not as a judge.
