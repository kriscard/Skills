---
name: blog
description: >-
  Writes technical blog posts for developers: researches current state, drafts
  outlines for approval, then writes in an authentic voice with a clear "aha
  moment", strong hook, and concrete code examples. Make sure to use this skill
  whenever the user says "write a blog post", "draft a post about", "blog post
  on", "technical article", or runs /blog. Also triggers when the user wants to
  publish something they've learned or share an opinion — even if they just say
  "I want to write about X".
user-invocable: true
argument-hint: "[topic or title]"
---

# Blog Post Writer

Writing for developers who've read too much mediocre content. The goal is one "aha moment" the reader will actually share.

## Writing Philosophy

**One insight, clearly stated, well supported.** Not a survey. Not a tutorial in disguise. Not "here's everything I know about X."

The test: can you describe the post in one sentence that makes someone say "oh, I've been doing that wrong"? If not, the angle isn't sharp enough yet.

## Workflow

### 1. Research (if topic provided)

Before drafting, check the current state:
- Use Context7 for library/framework documentation (catches outdated advice)
- Use WebSearch for recent discussions, benchmarks, or counterarguments
- Find 2-3 concrete examples or data points that support the insight

### 2. Identify Post Type

| Type | Use When |
|------|----------|
| Tutorial | Step-by-step instructions |
| Project Showcase | Sharing what you built |
| Opinion | Your take on a topic |
| TIL | Quick, focused insight |
| Comparison | X vs Y analysis |

### 3. Draft Outline First

Present the outline before writing the full post. Get explicit approval. Map to the Story Circle narrative:

```
Title: [specific and direct — avoid "A Guide to X" or "Everything about X"]
Hook: [why this matters right now — 1-2 sentences]
Tension: [the common mistake or misconception — reader nods, feels called out]
Resolution: [the insight with evidence]
Code example: [the concrete thing they can use today]
Takeaway: [one sentence they'll remember]
```

**Story Circle mapping** (for longer posts): You (reader's situation) → Need (problem) → Go (decision to change) → Search (exploring) → Find (the insight) → Take (implementation) → Return (results) → Change (reader transforms).

### 4. Write the Full Draft

Follow the approved outline. Writing rules:

**Voice and tone:**
- First-person, direct, no corporate hedging ("it may be worth considering" → "do this")
- Short paragraphs — 3 sentences max before a break
- Specific over vague ("200ms slower" not "noticeably slower")
- Don't explain things the reader already knows — they're developers

**What to kill:**
- "In this post, I will..." — start with the interesting part
- "As we can see..." — if it needs pointing out, the code isn't clear enough
- "Simply" / "just" / "easy" — condescending and often wrong
- Passive voice for user actions — "you call" not "it is called"
- Throat-clearing in the intro — get to the hook in sentence one

**Code examples:**
- Must be runnable and focused on the key insight (not a complete app)
- Show the wrong way, then the right way — the contrast is what teaches
- Keep them under 20 lines unless the length itself is the point
- Include the import/setup only if it's non-obvious

## Post Structure

**Hook** — why this matters now. A failing production story, a surprising benchmark, a question the reader can't answer yet. Makes them commit to reading.

**Tension** — the common mistake. "Most people do X. Here's why that's wrong." This is where readers nod and feel called out.

**Resolution** — the insight with evidence. Code, benchmarks, or examples. Not just the conclusion — the reasoning that makes it stick.

**Takeaway** — one actionable thing they can do today: a code snippet, a mental model, a decision they can make differently.

## SEO Checklist

Before delivering any draft, run:
- [ ] Primary keyword in title and first paragraph
- [ ] Meta description (150-160 chars)
- [ ] URL slug is short and clean
- [ ] 2-3 internal/external links
- [ ] Code blocks specify language
- [ ] Headings use proper hierarchy (H2, H3)

SEO should be subtle — don't keyword-stuff or write for search engines over humans.

## Output

1. Outline (wait for approval)
2. Full draft with:
   - Suggested title (direct and specific)
   - Body with code examples
   - One-sentence ending that lands the insight
   - SEO metadata (description, keywords)

Estimated length: 800-1500 words. Longer only if the insight requires it.

## References

| Priority | Stage | Load when | Reference |
|----------|-------|-----------|-----------|
| 1 | Outline | Choosing post type, narrative arc, or story structure | `references/story-circle.md` |
| 2 | Draft | Need a concrete post format or section structure to follow | `references/post-templates.md` |
| 3 | Review | Voice, tone, or style questions | `references/voice-tone.md` |
| 4 | Publish | SEO metadata, keyword placement, or URL structure | `references/seo-checklist.md` |
