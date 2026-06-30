---
name: blog
description: >-
  Blog post writer for developer-facing technical posts. Use when the user wants
  to write, draft, outline, revise, or publish a blog post, technical article,
  opinion piece, project writeup, TIL, or post about something they learned.
user-invocable: true
argument-hint: "[topic or title]"
---

# Blog Post Writer

Writing for developers who've read too much mediocre content. The goal is one sharp **aha** the reader will actually share.

## Boundary

A blog post may teach, but it must still have an angle. If the user wants pure step-by-step instruction, use the tutorial skill instead. If they want a publishable article with a lesson, story, opinion, or project narrative, continue here.

## Philosophy

**One insight, clearly stated, well supported.** Not a survey. Not "here's everything I know about X."

The angle test:

> Readers think/do X, but they should think/do Y because Z.

If that sentence is weak, the post is not ready to outline.

## Workflow

### 1. Find the angle

Identify the post's one-sentence angle before researching or outlining.

Complete when:
- the angle fits `Readers think/do X, but they should think/do Y because Z`
- the reader, misconception, and payoff are specific
- the post has one primary **aha**, not a pile of related points

If the angle is missing or mushy, ask follow-up questions before continuing.

### 2. Research only what the angle needs

Check current facts before drafting technical claims. Use available research tools for official docs, recent discussions, benchmarks, counterarguments, and examples.

Complete when:
- current docs or source material have been checked for any library/framework/API claims
- 2-3 concrete examples, data points, or counterarguments support the angle
- outdated or common-but-wrong advice is identified when relevant

Skip external research only when the post is explicitly personal, reflective, or based entirely on user-provided material.

### 3. Choose the post shape

Pick the smallest structure that serves the angle:

| Shape | Use when |
|-------|----------|
| Tutorial article | Teaching a process with a publishable lesson, not just instructions |
| Project writeup | Sharing what was built and what it proves |
| Opinion | Arguing for a clear technical judgment |
| TIL | Capturing one small useful discovery |
| Comparison | Helping readers choose between options |

Complete when the shape is named and every planned section supports the angle.

### 4. Draft the outline and wait

Present an outline before writing the full post. Do not draft the article until the user approves.

Outline format:

```markdown
Title: [specific and direct; avoid "A Guide to X" / "Everything about X"]
Angle: Readers think/do X, but they should think/do Y because Z.
Hook: [why this matters now]
Tension: [the common mistake or misconception]
Resolution: [the insight with evidence]
Example: [the concrete code/example/story that proves it]
Takeaway: [one sentence readers remember]
```

Complete when the user explicitly approves the outline or asks for changes and those changes are incorporated.

### 5. Write the draft

Follow the approved outline. Keep the reader moving toward the **aha**.

Rules:
- start with the interesting part, not "In this post..."
- write first-person and direct; avoid corporate hedging
- use short paragraphs, usually 1-3 sentences
- prefer concrete numbers, examples, and trade-offs over vague claims
- assume intermediate developer knowledge; do not explain basics unless the angle requires it
- show the wrong way before the right way when contrast teaches the insight
- keep code examples runnable, focused, and under 20 lines unless length is the point

Complete when the draft includes:
- suggested title
- body with evidence or examples
- code blocks with languages when code is present
- one-sentence ending that lands the insight

### 6. Review before delivering

Review the draft for technical correctness, voice, and angle discipline.

Complete when:
- every section supports the angle
- technical claims are sourced, verified, or clearly framed as experience/opinion
- filler phrases and AI-sounding transitions are removed
- the hook, tension, resolution, and takeaway are visible

### 7. Add publishing metadata only when needed

Run SEO checks only when the user intends to publish publicly, asks for SEO, or the post targets search traffic.

When SEO applies, include:
- meta description
- URL slug
- primary keyword
- 2-3 internal/external link suggestions

SEO must stay subordinate to the human reader.

## Output

Default sequence:

1. Outline and approval request
2. Full draft after approval
3. Optional publishing metadata when SEO applies

Default length: 800-1500 words. Use shorter for TILs and longer only when the angle genuinely needs it.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| 1 | The angle needs a narrative arc, personal story, migration story, or before/after transformation | `references/story-circle.md` |
| 2 | A post shape has been chosen and a concrete section template is needed | `references/post-templates.md` |
| 3 | Revising a draft for voice, clarity, authenticity, or AI-slop removal | `references/voice-tone.md` |
| 4 | User wants SEO, public publishing metadata, or search traffic | `references/seo-checklist.md` |
