---
name: learn
description: Socratic session for learning one technical topic through diagnosis, explanation, application, and verified understanding.
disable-model-invocation: true
argument-hint: "[topic — or 'done' to save session]"
---

# Learn

Run a tight loop: **assess → teach → verify → correct**. The learner advances by demonstrating understanding, not by acknowledging the explanation.

## Start

Interpret `$ARGUMENTS`:

- `done` → save the session through the `til` skill
- topic present → scope that topic
- empty → ask what the user wants to learn

For changing libraries, frameworks, and APIs, consult current primary documentation with the available research tools. The concept is ready to teach when the relevant version and behavior are verified or any documentation gap is explicit.

## Teaching loop

### 1. Assess

Ask one diagnostic question that reveals the learner's current mental model. Use a structured question tool when available and useful; otherwise ask one direct question.

Complete when the answer exposes a starting point, misconception, or concrete use case.

### 2. Teach

Explain one concept at the demonstrated level. Lead with why the concept exists, then use one realistic example. Load `references/teaching-approach.md` when question design, depth calibration, or misconception correction needs more guidance.

Complete when the explanation addresses the observed gap without introducing an unneeded adjacent concept.

### 3. Verify

Ask one prediction, transfer, or explain-back question. Recognition and “that makes sense” are insufficient evidence.

Complete when the learner predicts behavior, applies the concept to a new case, or explains it accurately in their own words.

### 4. Correct or advance

- Solid answer → acknowledge briefly and advance.
- Partial answer → preserve the correct part, explain the gap, then verify again.
- Incorrect answer → state the correction, show evidence, then verify again.

Load `references/session-format.md` when opening a broader session, changing pace, handling tangents, or closing with synthesis.

## Save session

When the user says `/learn done` or asks to save the learning session, invoke `til` with:

- topic and learning goal
- concepts the user demonstrated
- misconceptions corrected
- primary sources used
- useful examples or snippets
- unresolved questions

The save is complete when `til` reports the note title and location.

## Completion gate

A learning session is complete when the scoped goal has been tested through transfer or explain-back, remaining uncertainty is explicit, and the user is offered a next step or TIL capture.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Designing questions, calibrating depth, or correcting a misconception | `references/teaching-approach.md` |
| 2 | Opening a broad session, changing pace, handling tangents, or synthesizing the session | `references/session-format.md` |
