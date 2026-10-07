---
name: blog
description: Write or revise a developer-facing article with one defensible angle, current technical evidence, and a publishable draft. Use for technical posts, opinion pieces, project writeups, TIL articles, and learned-in-public stories.
argument-hint: "[topic or title]"
---

# Blog writer

A post earns its length through one **angle**:

> Readers think or do X, but they should think or do Y because Z.

Use `tutorial` when the reader's main job is to learn a procedure. Continue here when the artifact needs an argument, lesson, opinion, or project narrative.

## 1. Establish evidence and angle

Treat user-provided receipts, project evidence, and source backlinks as private inputs. Identify the reader, current belief or behavior, replacement, and proof.

Complete when the angle sentence is specific, supported by available evidence, and narrow enough for one primary takeaway. Ask for missing evidence before outlining.

## 2. Verify current claims

Use primary sources for changing libraries, APIs, benchmarks, or ecosystem claims. Gather only evidence that can support or challenge the angle. Personal or reflective claims can rely on clearly framed experience.

Complete when each consequential technical claim is sourced, reproduced, or labeled as experience/opinion, and credible counterevidence is represented.

## 3. Choose the shape

Choose the smallest shape that supports the angle: argument, project story, comparison, short TIL, or tutorial article with a public lesson. Load `references/story-circle.md` only when tension, failed attempts, or transformation carry the post.

Complete when every planned section advances the angle.

## 4. Outline and get approval

```markdown
Title: [specific working title]
Angle: Readers think/do X, but they should think/do Y because Z.
Hook: [concrete reason to care]
Tension: [mistake, constraint, or failed approach]
Evidence: [example, code, data, or experience]
Resolution: [replacement mental model or practice]
Takeaway: [one sentence worth remembering]
```

Write the full draft after the user approves the outline or explicitly asks to skip approval.

## 5. Draft

Follow the approved structure. Start with evidence or tension. Use concrete examples, runnable focused code, and explicit trade-offs. Explain fundamentals only when the target reader needs them.

Complete when the draft has a suggested title, a supported argument, and an ending that lands the angle rather than summarizing every section.

## 6. Review

Check:

- every section supports the angle
- claims match their evidence and confidence
- private receipts, names, URLs, metrics, and backlinks remain private
- code is verified when an environment exists, otherwise marked unverified
- filler and generic transitions are removed

Invoke `deslopify` when the draft needs a dedicated anti-slop pass.

## Publishing metadata

Add a slug, description, keyword/search intent, and link suggestions only when the user requests SEO or plans public search acquisition. Check current platform and search guidance rather than enforcing fixed character, keyword-density, link-count, or word-count formulas.

## Completion gate

The result is complete when the approved angle survives the final draft, material claims are verified or qualified, public-safety checks pass, and any unverified code or publication assumption is explicit.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Tension, failed attempts, discovery, or transformation carries the article | `references/story-circle.md` |
