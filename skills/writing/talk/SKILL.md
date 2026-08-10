---
name: talk
description: >-
  Conference talk builder for technical CFP submissions, speaking proposals, timed talk outlines,
  and slide flows. Use when the user asks for a conference talk, CFP abstract, talk proposal, or to
  turn a project/article into a speaking proposal.
disable-model-invocation: true
argument-hint: "[conference topic or title]"
---

# Conference Talk Builder

Structured for technical developer conferences. Produces three core deliverables: CFP abstract, talk
outline with timing, and key slides list. Optional iA Presenter markdown is generated only when the
user asks for slide markdown.

## What Makes a Talk Work

The talk structure that gets accepted and remembered:

1. **Visceral opening** — a failure story, a question the audience can't answer, or a stat that
   reframes the topic. Not "today I'm going to tell you about X."
2. **The painful thing everyone does** — establish shared experience. The audience needs to
   recognize themselves.
3. **The journey with failed attempts** — what the speaker tried, what failed, and what changed.
   This is credibility: lived experience, not a literature review.
4. **The insight with a demo** — the thing attendees came for. Keep demos minimal and have a backup.
5. **Monday morning takeaways** — 3 concrete actions attendees can take back to work.

## Workflow

### 1. Clarify the Submission

Before drafting, confirm or explicitly mark assumptions for:

- target conference and audience level
- talk length (default: 25–30 minutes)
- one-sentence core insight
- speaker's direct experience with the topic

Do not invent speaker experience. If credibility is missing, ask for the story, project, production
incident, research, or client work that gives the speaker standing.

Complete when those four inputs are known or a clearly labeled assumption is shown for user approval.

### 2. Draft CFP Abstract

**Format (400–500 words total):**

```text
TITLE
[Direct and specific. Concrete beats clever.]

ABSTRACT (250–300 words)
Paragraph 1: The problem — what's painful now and why it matters
Paragraph 2: The journey — what was tried, what failed, what changed
Paragraph 3: What attendees will leave able to do

WHAT ATTENDEES WILL LEARN
- [Specific skill or decision they'll be able to make]
- [Specific tool, pattern, or technique they'll use]
- [Mental model that changes how they approach this problem]

SPEAKER BIO HOOK (50 words)
One sentence about why this speaker is the right person for this topic.
```

Complete when the abstract names the problem, journey, takeaway, and credibility hook.

### 3. Build the Timed Outline

```text
[0:00-2:00]  Opening hook — failure/question/stat
[2:00-7:00]  Problem setup — the painful thing everyone does
[7:00-15:00] Journey — failed attempts and turning point
[15:00-22:00] Resolution — insight, demo, or concrete example
[22:00-25:00] Takeaways + Q&A setup
```

Adjust for actual length. Keep demo segments to 5–7 minutes max.

### 4. List Key Slides

Not the slides themselves — the logical flow. One line per slide/beat:

```text
1. Opening image/question
2. The mistake everyone makes
3. Concrete wrong-way example
4. Moment of discovery
5. Key concept / architecture diagram
6. Right-way example
7. Proof: benchmark, result, or production lesson
8. Demo or backup screenshot
9. Three takeaways
10. One slide people will photograph
```

### 5. Generate iA Presenter Markdown Only If Requested

If the user asks for slide markdown, load `references/ia-presenter-syntax.md` and follow it. Do not
reconstruct the syntax from memory.

## Output

Deliverables in this order:

1. CFP abstract
2. Talk outline with timing
3. Key slides list
4. iA Presenter markdown, only if requested

Present 1–3 together; they inform each other and a CFP reviewer needs the full shape.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Building the narrative arc or structuring the talk story | `references/story-circle.md` |
| 2 | Generating iA Presenter slide markdown | `references/ia-presenter-syntax.md` |
