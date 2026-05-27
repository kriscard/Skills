> **Read this when:** starting a new session, setting pacing, structuring the arc from diagnostic to synthesis, or when a session is drifting without direction.

# Session Format

## The Session Arc

A well-run session has five stages. Don't skip stages; each one sets up the
next.

### Stage 1 — Topic Scoping (first 3–5 exchanges)

Goal: get specific. "I want to learn React" is not a topic. "I want to
understand why my `useEffect` runs twice in dev mode" is.

Questions to scope:
- "What specifically do you want to understand about X?"
- "What's the use case driving this?"
- "Is there a specific bug or pattern you're trying to make sense of?"

If the topic is too broad (all of React, all of TypeScript), help them narrow
it. A focused session at depth beats a surface tour every time.

Output of scoping: one clear learning goal for the session.

### Stage 2 — Knowledge Assessment (2–3 diagnostic questions)

Goal: find the baseline. Don't assume; ask.

Run 2–3 diagnostic questions from the `teaching-approach.md` diagnostic
category. The answers tell you:
- Where to start teaching
- What misconceptions to address
- Which examples will land (reference their actual stack/project)

Don't skip this even if they say "I'm a beginner." Beginners know different
things depending on what they've bumped into.

### Stage 3 — Core Concept Teaching

Goal: one concept at a time, verified before moving on.

Structure per concept:
1. Assess (1 question)
2. Explain (one concept, match depth to level)
3. Example (code, realistic and minimal)
4. Verify (1 focused question via AskUserQuestion)
5. Correct or confirm, then advance

Pacing rule: don't move to the next concept until the current one is solid.
Slow and thorough beats fast and shallow.

**Depth > breadth.** It's better to fully understand 2 concepts than to
surface-skim 6. If time runs short, ask: "Which of the remaining topics is
most important to cover before we stop?"

### Stage 4 — Applied Example

Goal: connect theory to real problem.

Solve a realistic problem together using the concept(s) covered. Options:
- Use the learner's stated use case from scoping
- Pose a scenario: "Imagine you're building X and you encounter Y..."
- Ask them to write the code, then review it together

This is where transfer happens. If they can apply it in a novel context,
it's internalized. If they can only recognize it in the example from Stage 3,
it's not yet.

### Stage 5 — Synthesis

Goal: solidify and close.

1. **Explain it back**: "Can you explain [core concept] back to me in your
   own words?" This surfaces any remaining gaps.
2. **Key learnings summary**: "Here are the 3 things we covered today" —
   stated as insights, not a lesson outline.
3. **What to explore next**: 1–2 concrete suggestions based on what they
   learned and what they're building.
4. **Offer to save**: "Want me to save this as a TIL note? Run `/learn done`."

---

## Pacing Guidelines

### Signs you're moving too fast
- Answers to verify questions are vague or restate the question
- They say "yeah, I think so" without actually demonstrating understanding
- New concepts seem to confuse them more than illuminate

**Response**: slow down, add an analogy, try a different example, or go back
and re-verify the previous concept.

### Signs you're moving too slow
- They answer verify questions immediately and correctly
- They anticipate what you're about to explain
- They ask about edge cases and trade-offs before you get there

**Response**: skip the fundamentals, acknowledge their level ("you've got this
down — let's go to the interesting part"), and jump to edge cases and advanced
patterns.

### Handling tangents

- **Related tangent**: answer in 2–3 sentences, note it for later, return to
  main thread. "Good question — that's connected to [X]. Let's come back to
  it after we finish [current concept]."
- **Unrelated tangent**: defer explicitly. "That's worth covering separately.
  Let's add it to the list for after this session."
- **Better tangent**: if their question reveals the original topic is wrong
  for their use case, pivot. The session goal is their understanding, not
  completing a fixed plan.

---

## Session Length Heuristics

| Session type | Rough time | Depth |
|---|---|---|
| Single concept (e.g., "explain closures") | 15–20 min | Deep on one thing |
| Domain overview (e.g., "how does React rendering work") | 30–45 min | 3–4 concepts |
| Debugging help (e.g., "why does this re-render") | 10–15 min | Focused on the problem |
| Full topic (e.g., "teach me React Query") | Multiple sessions | Staged per session |

For multi-session topics, end each session with an explicit summary of what
was covered and a clear starting point for next time.

---

## Research Step for Library/Framework Topics

Before teaching any specific library or framework, fetch current docs:

```
1. mcp__context7__resolve-library-id with library name
2. mcp__context7__query-docs with resolved ID and relevant topic
```

Why: training data may be stale. A React Query v4 answer to a v5 question
causes more confusion than admitting uncertainty. Current docs take 10 seconds
to fetch and prevent teaching the wrong thing.

This applies to: React, Next.js, Vite, Prisma, Drizzle, TanStack Query,
Zustand, Hono, Bun, any library that ships major versions regularly.

Does not apply to: language fundamentals (JavaScript closures, TypeScript
types, CSS specificity), computer science concepts, architectural patterns.
