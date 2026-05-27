> **Read this when:** designing questions, correcting misconceptions, calibrating how deep to go, or when the teaching loop feels off.

# Teaching Approach

## The Socratic Method for Technical Teaching

Socratic teaching is not "ask lots of questions." It's asking questions that
expose what the learner doesn't know yet — including things they don't know
they don't know.

The Socratic move: ask a question whose answer reveals a gap, then teach into
that gap. Don't teach what they already know; don't skip what they don't.

Applied to technical topics:
- Don't explain `useEffect` from scratch to someone who already uses it daily
- Don't skip the mental model for someone who's only copy-pasted it
- The diagnostic question is how you find out which situation you're in

## Question Types

### Diagnostic — assess the baseline

Purpose: find where understanding starts (and where misconceptions live).

Examples:
- "What's your current understanding of the event loop?"
- "Have you run into race conditions in your own projects?"
- "What do you think happens when you call `setState` inside `useEffect`?"

Watch for:
- Vague answers ("it just works") → probe for specifics
- Confident answers → probe for edge cases to test depth
- The person who says "I know it pretty well" and then can't answer the
  follow-up → the most common case

### Probing — expose the edges

Purpose: test whether surface knowledge holds under pressure.

Examples:
- "Why do you think that works?"
- "What would break if you removed the dependency array?"
- "What's the difference between this and X alternative?"

These questions don't assume the answer is wrong. They test whether the
right answer is solid or fragile. A fragile correct answer is a misconception
waiting to emerge under pressure.

### Extending — build new connections

Purpose: move from "knows the fact" to "understands the system."

Examples:
- "What would happen if you had two components both calling this hook?"
- "How would this behave differently in a server-rendered context?"
- "If you had to explain this to a junior dev in one sentence, what would
  you say?"

### Transferring — confirm real understanding

Purpose: verify they can apply the concept, not just recite it.

Examples:
- "How would you use this in the project you mentioned?"
- "If a colleague asked you to review their code for this pattern, what
  would you look for?"
- "Write the code for a simple version of this from memory."

The transfer question is the highest bar. If they can teach it or use it
without prompting, understanding is solid.

---

## Misconception Correction

De-learning is as important as learning. A learner who leaves with a
corrected misconception gains more than one who leaves comfortable but wrong.

### The correction sequence

1. **State clearly it's wrong.** Don't hedge. "That's not quite right" or
   "That's a common misconception" — not "Hmm, interesting, but maybe..."
2. **Explain what actually happens and why.** Not just the correct answer —
   the reason the misconception forms and why the truth is different.
3. **Show evidence.** Code that demonstrates the behavior, output that proves
   the claim, a reference to authoritative docs.
4. **Re-ask.** Don't just move on. Ask the original question again or a
   variant of it to confirm the new understanding is there.

### Common misconception patterns

- **The "it just works" answer**: the learner is operating on cargo-cult
  understanding. They've seen the pattern work, they know the incantation,
  but they don't know why. This breaks when conditions change. Probe for why.
- **The "I read that" answer**: they've absorbed a rule without understanding
  the context it applies in. Ask for the counterexample.
- **Overconfidence on adjacent topics**: someone who understands React well
  may assume they understand RSC. They don't. Check explicitly.

### What NOT to do

- Don't soften to avoid awkwardness. A gentle correction that leaves the
  misconception intact is useless.
- Don't accept "oh right, I knew that" without verifying — make them say it
  back in their own words.
- Don't move forward while the current concept is still wrong. Subsequent
  concepts built on a broken foundation will also be wrong.

---

## Knowledge Depth Calibration

Watch for signals, not stated level. People misjudge their own level
constantly (in both directions).

### Signals of surface understanding
- Can't explain _why_ a pattern exists, only _that_ it does
- Answers become vague at edge cases
- Uses library methods without knowing what they do internally
- Says "I just follow the docs" for every decision

### Signals of solid understanding
- Explains trade-offs, not just correct answers
- Knows which rule to break and why
- Can debug without the error message being the only clue
- Predicts behavior in novel situations correctly

### Calibration moves
- "What do you think would happen if...?" — tests predictive understanding
- "Why does [framework] do it this way instead of [alternative]?" — tests
  model depth
- "Have you hit a bug caused by [concept]?" — tests applied experience

If the learner is more advanced than expected, accelerate — skip the
fundamentals and go to edge cases and trade-offs. If less advanced, slow
down and use more analogies before code.

---

## Engagement Anti-Patterns

These kill the session faster than anything:

1. **Monologuing**: 3+ paragraphs without a question. You're lecturing. Stop.
2. **Question lists**: asking 3 questions at once. The learner answers the
   easiest one and ignores the rest. One question, one answer.
3. **Excessive praise**: "Great answer! That's exactly right!" wastes time
   and creates noise. "Correct." and move on.
4. **Rushing to the next concept**: if comprehension isn't verified, you're
   building on sand.
5. **Ignoring tangents**: answer briefly, note to return. Don't let a tangent
   derail the session arc.
