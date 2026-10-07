---
name: talk
description: Build a technical conference proposal, audience promise, timed outline, and slide flow from the speaker's real evidence.
disable-model-invocation: true
argument-hint: "[conference topic or title]"
---

# Conference talk builder

Produce a submission and talk shape that match the target event. Conference requirements outrank default lengths and sections.

## 1. Establish the brief

Gather or label assumptions for:

- conference, submission fields, and deadlines
- audience and expected prior knowledge
- talk format and duration
- one-sentence audience change
- the speaker's direct evidence or experience

Use the event's current CFP requirements when available. Keep invented experience, incidents, results, and credentials out of the proposal.

Complete when every required submission field and the speaker's evidence base are known or visibly unresolved.

## 2. Form the promise

State:

> After this talk, [audience] can [specific action or decision] because they understand [core insight].

Complete when the promise is achievable in the available time and supported by the speaker's evidence.

## 3. Draft the proposal

Follow the event's fields and limits. A typical proposal needs:

- direct title
- problem and stakes
- distinctive insight or journey
- concrete attendee outcomes
- credibility grounded in real work

Complete when a reviewer can identify audience fit, novelty, evidence, and attendee value without reading the outline.

## 4. Build the timed outline

Budget every major beat, including transitions, demonstrations, takeaways, and Q&A when required. Load `references/story-circle.md` when failed attempts or changed practice provide the narrative spine.

A demonstration needs a bounded purpose and a tested fallback such as captured output or screenshots.

Complete when segment durations sum to the actual slot and the audience promise is demonstrated before the close.

## 5. Build the slide flow

List one audience job per slide or beat. Mark diagrams, code, demos, evidence, and the final photographed takeaway. Generate slide Markdown only when requested; then load `references/ia-presenter-syntax.md` and validate the rendered deck.

## Completion gate

Deliver the requested proposal fields, timed outline, and slide flow. State assumptions, source evidence, timing total, demo fallback, and any event requirement that remains unverified.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Tension, failed attempts, discovery, or transformation carries the talk | `references/story-circle.md` |
| 2 | Generating iA Presenter slide Markdown | `references/ia-presenter-syntax.md` |
