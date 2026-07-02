> **Read this when:** finalizing tweet candidates, choosing tweet shapes, or deciding whether a code snippet/image-led tweet fits Chris's Twitter/X voice.

# Twitter/X Voice

## Voice snapshot

Write like a software builder sharing what caught his attention today: casual, technical, curious, and lightly opinionated. The tone is peer-to-peer, not influencer-thread mode.

Core patterns from Chris's tweets:

- first-person observations: “I like how…”, “I really recommend…”, “I'm diving more into…”
- soft contrarian takes: “I never get why…”, “maybe too many”, “maybe it's our turn now”
- practical endorsement: “Worth checking out”, “it is just the way to go”
- concise tool commentary around JavaScript, React/Next.js, AI skills, Obsidian, Herdr, Vite/VoidZero, and dev tooling
- repost/quote context is common: add a short take on why the linked thing matters
- occasional emoji is okay when it feels natural, usually one max: 🚀, 🐐, 🍿, 🤷🏽‍♂️

## Boring-tweet test

A tweet fails if it could be posted by any generic AI/dev account. Do not ship vague motivational advice, polished thread-bait, or empty tool praise. When rewriting, make it more specific, not more formal.

Before/after:

```text
Bad: AI agents are changing how developers work. Exciting times.
Good: I'm starting to think agent workflows need fewer prompts and more stateful workspaces. The tool matters less than keeping context visible.
```

```text
Bad: Next.js Server Components make data fetching easier.
Good: I like how simple parallel fetching is in Next.js Server Components. You can move independent queries next to the component that needs them and avoid turning the page into an orchestration file.
```

To fix a boring tweet, add one of:

- a concrete receipt from the day
- a named tool/framework/API
- a tiny code or UI detail
- a soft disagreement
- a specific “I used to think X, now Y” shift

## Preferred tweet shapes

### Simple observation

Use when the day produced a clear technical detail.

```text
I like how simple [thing] is in [tool/framework] with [specific feature].
```

### Recommendation

Use when the user tried or studied something worth sharing.

```text
I really recommend [approach/tool] when [situation]. It makes [specific outcome] much easier.
```

### Soft critique

Use when the useful idea is a restraint, trade-off, or anti-pattern.

```text
I never get why people use [tool] to recreate [old workflow].

[short reason / better direction]
```

### Discovery note

Use for exploration days.

```text
I'm diving more into [tool/ecosystem] this week, and there are some really cool things there.

Worth checking out.
```

### Code/image-led note

Use when code is the receipt. Keep prose simple and let the snippet carry the point.

```text
I like how [framework/tool] handles [technical thing].

[tiny code snippet or mention of screenshot]
```

## Code snippets

Use a code snippet only when it makes the tweet clearer than prose.

Good snippets:

- 1–4 lines
- real syntax from a public-safe example
- a tiny API shape, before/after, CSS detail, command, or bug pattern
- understandable without long setup

Avoid snippets when:

- they need too much context
- they include internal names or private architecture
- the tweet becomes unreadable on mobile
- a screenshot would work better than inline code

Before publishing snippets, apply the safety gate in `SKILL.md`.

## Do

- Be specific about the tool/framework/feature.
- Keep the claim modest unless the evidence is strong.
- Prefer “I like…”, “I recommend…”, “I never get why…” over generic advice voice.
- Make one point per tweet.
- Use quoted material or links as receipts when relevant.

## Don't

- Don't write engagement bait: “Agree?”, “Thoughts?”, “Hot take”.
- Don't use AI/influencer clichés: “game-changer”, “unlock”, “10x”, “here's the truth”, “exciting times”, “the future of”.
- Don't write generic advice like “focus on fundamentals”, “ship consistently”, or “tools should solve problems” unless tied to a concrete receipt.
- Don't over-polish into a blog intro.
- Don't force a code snippet just because the source is technical.
- Don't overuse emojis or hashtags.
