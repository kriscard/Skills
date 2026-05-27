---
name: talk
description: >-
  Writes conference talk proposals and outlines: CFP abstracts, talk structure
  with timing, and key slides flow. Optimized for technical developer conferences.
  Make sure to use this skill whenever the user says "conference talk", "write a
  talk", "presentation on", "CFP submission", "talk proposal", or runs /talk.
  Also triggers when the user wants to submit to a conference or turn a blog post
  or project into a speaking proposal.
user-invocable: true
argument-hint: "[conference topic or title]"
---

# Conference Talk Builder

Structured for technical developer conferences (25-30 min single track). Produces three deliverables: CFP abstract, talk outline with timing, key slides list.

## What Makes a Talk Work

The talk structure that gets accepted and remembered:

1. **Visceral opening** — a failure story, a question the audience can't answer, a stat that reframes what they thought they knew. Not "today I'm going to tell you about X."

2. **The painful thing everyone does** — establish shared experience. The audience needs to recognize themselves. If they're nodding, you have them.

3. **The journey with failed attempts** — how you discovered the solution, including what didn't work. This is what separates a talk from a blog post. The failed attempts are credibility — they show you lived this, not just read about it.

4. **The insight with a demo** — the thing they came for. Keep demos minimal. Have a backup screenshot. Live demos fail publicly; plan for it.

5. **Monday morning takeaways** — 3 concrete things they can do when they're back at their desk. Not "think differently about X" — actual actions.

## Workflow

### 1. Clarify the Submission

Before writing, establish:
- Target conference / audience level (introductory, intermediate, advanced)
- Talk length (default: 25-30 min)
- The single core insight — if it takes more than one sentence, the scope is too broad
- Speaker's direct experience with the topic (required for credibility in the abstract)

### 2. Draft CFP Abstract

**Format (400-500 words total):**

```
TITLE
[Direct and specific. "How we reduced deploy time from 40 min to 90 sec" 
beats "Optimizing CI/CD Pipelines". Concrete beats clever.]

ABSTRACT (250-300 words)
Paragraph 1: The problem — what's painful about this right now, why it matters today
Paragraph 2: The journey — what you tried, what failed, what you discovered
Paragraph 3: What attendees will leave with (specific, not vague)

WHAT ATTENDEES WILL LEARN
- [Specific skill or decision they'll be able to make]
- [Specific tool, pattern, or technique they'll use]
- [Mental model that changes how they approach this problem]

SPEAKER BIO HOOK (50 words)
Not a resume. One sentence about why you specifically are the right person 
to give this talk — the thing that establishes credibility on this topic.
```

### 3. Talk Outline with Timing

```
[0:00-2:00]  Opening hook — the failure/question/stat
[2:00-7:00]  Problem setup — the painful thing everyone does, why it's wrong
[7:00-15:00] Journey — what you tried, what failed, the turning point
[15:00-22:00] Resolution — the insight, live demo or concrete example
[22:00-25:00] Takeaways + Q&A setup
```

Adjust for actual length. Keep demo segments to 5-7 min max — they always run long.

### 4. Key Slides List

Not the slides themselves — the logical flow. One line per slide/beat:

```
1. Opening image/question (no title slide to start)
2. "Here's the mistake" — the thing everyone does
3. Code showing the wrong way
4. The moment of discovery
5. Architecture diagram / key concept
6. Code showing the right way
7. Benchmark / result / proof
8. Demo (or screenshot if demo risky)
9. Three takeaways
10. One slide people will photograph
```

### 5. iA Presenter Slides (if requested)

When the user asks for slide markdown (not just the outline), generate iA Presenter format:

```markdown
# Slide Title

	Content visible on slide (indented with tab)

Speaker notes without tab (invisible to audience)

// reminder comment

---
```

**iA Presenter rules:**
- Separate slides with `---`
- Visible slide content must be indented with a tab
- Speaker notes are left-margin (no indent)
- Code blocks on slides: break across multiple slides if >8 lines — code must be readable on a bad projector
- Use `// comment` for author reminders

Structure: Title slide → speaker intro → one or more slides per Story Circle step → closing with contact/resources.

## Output

Deliverables in this order:
1. CFP abstract (ready to paste into submission form)
2. Talk outline with timing
3. Key slides list
4. iA Presenter markdown (if requested)

Present 1–3 together — they inform each other and the reviewer needs to see the full shape.

## References

| Priority | Stage | Load when | Reference |
|----------|-------|-----------|-----------|
| 1 | Outline | Building the narrative arc or structuring the talk story | `references/story-circle.md` |
| 2 | Slides | Generating iA Presenter slide markdown | `references/ia-presenter-syntax.md` |
