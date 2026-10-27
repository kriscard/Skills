---
name: deslopify
description: >-
  Deslopifies AI-sounding prose and code diffs. Use when the user asks to make
  text sound human, remove ChatGPT-style filler, rewrite without fluff, clean up
  AI comments, or strip restatement comments from a diff without changing code.
---

# Deslopify

Strip the patterns that mark text as AI-generated. Preserve all factual content, author stance, intended tone, and useful depth — change the delivery, not the message.

## The Slop Patterns

Scan for these before rewriting. More slop patterns justify a stronger edit; mostly-clean text gets a light pass. Treat a pattern as slop when it adds no meaning, obscures the point, or makes the reader decode the prose. Keep intentional voice that still communicates clearly.

**Opening filler** (cut 80% of the time — start with the actual point):

- "In today's fast-paced world..."
- "It's important to note that..."
- "As we navigate the complexities of..."

**Hollow transitions**:

- "Furthermore,", "Moreover,", "Additionally," — usually just "Also," or delete
- "In conclusion," — end without announcing you're ending
- "It's worth noting that..." — just say the thing

**Emphasis inflation**:

- "Importantly,", "Crucially,", "Significantly," — earn emphasis with content
- "It goes without saying..." — then don't say it

**AI vocabulary** (replace with the plain word):

- "leverage" → "use"
- "utilize" → "use"
- "delve into" → "look at" or "explore"
- "in terms of" → restructure the sentence
- "moving forward" → cut
- "at the end of the day" → cut

**Excessive hedging**:

- "It seems that", "One might argue", "It could be said" — commit to the claim or cut it

**False ranges**:

- "from architecture to debugging" implies a scale or complete span that does not exist — list the topics directly
- Keep ranges whose endpoints define a real scale, sequence, or scope

**Empty synonym cycling**:

- Switching among "the service", "the system", "the platform", and "the solution" only to avoid repetition makes identity less clear
- Pick one accurate term and repeat it unless the terms name real distinctions

**Vague attribution**:

- "Experts believe", "studies show", "industry reports suggest" — name the source when the attribution supports the claim
- Never remove or weaken an attribution because its source is missing. Preserve the attributed wording and flag it for sourcing; do not turn attributed belief into a fact, a hedge, or the author's own claim.
- Example: keep "Experts believe the migration will cut incidents by 30%" in the revised text and note `Source needed for "Experts believe".` Do not rewrite it as "The migration may cut incidents by 30%."
- Keep attribution that is already specific enough to evaluate, including a named source, a cited study, a bounded group such as "three interviewees," or a deliberately anonymous source whose role and reason for anonymity matter.

**Sycophantic or chatbot phrasing**:

- "Great question!", "You're absolutely right", "Of course!", "I hope this helps", "Let me know if..." — respond directly
- Keep genuine warmth or praise when it is part of the author's intended relationship with the reader

**Nominalization** (convert to verb):

- "make a decision" → "decide"
- "provide assistance" → "help"
- "conduct an analysis" → "analyze"
- "have a discussion" → "discuss"

**Generic conclusions**:

- "The future looks bright" or a recap that adds no decision, implication, or next step — cut it
- Keep conclusions that synthesize evidence, state a decision, or tell the reader what follows

**Harmful over-compression**:

- Dropped articles, verbless fragments, unexplained abbreviations, and symbol-speak such as "invalid date → exit 2, no write" make the reader reconstruct the sentence
- Restore the connective meaning with complete clauses: "An invalid date exits with code 2 and writes nothing."
- Keep concise labels, headings, interface copy, and established notation when their context makes them clear

**Mannered metaphor**:

- Stock aphorisms, personified code, and decorative phrases such as "a dial worth turning" can hide the mechanism — name the literal action or property
- Keep metaphors that clarify a hard idea or belong to the author's deliberate creative voice

**Bullet lists where prose would be clearer**: not every list needs to be a list. Three related sentences often read better as a paragraph.

**En-dash used as em-dash**: `–` should be `—` (or just a comma)

## What Good Looks Like

- Short sentences land hard. Longer ones build context. Vary them.
- Prefer active voice when naming the actor improves the sentence: "We shipped X" rather than "X was shipped by the team." Passive voice remains useful when the actor is unknown, irrelevant, or intentionally de-emphasized.
- Specific beats general: "increased conversion by 18%" not "improved results"
- The first sentence is the most important — if it's filler, cut it

## Process

1. Read the full text.
2. Identify which slop patterns appear; mention only the main classes in the note.
3. Rewrite: cut filler, verb-ify nominalizations, and clarify passive constructions only when naming the actor helps.
4. Present the revised version or cleaned diff.
5. Add a 2–3 line note on the key changes made, not a list of every micro-change.

## Output Criteria

**Prose mode:** return the revised text plus a 2–3 line note naming the main classes of edits. Do not list every micro-change.

**Code comment mode:** return a cleaned diff or edit only comments, then report what was removed. Be surgical: no code, control-flow, formatting, or behavior changes.

## Code Comment Mode

When the input is a diff or the user asks to remove AI comments from code:

**What to remove:**

- Comments restating what code clearly does (`// increment counter` above `counter++`)
- Overly verbose explanations of obvious code
- Generic placeholders (`// TODO: implement`, `// Handle error`)
- Comments with AI phrasing ("This function...", "The following code...")
- Inline docs inconsistent with the file's existing comment style

**What to keep:**

- Doc comments for public APIs (JSDoc, docstrings)
- Comments explaining why (business logic, workarounds, edge cases)
- Comments matching the file's existing style and density
- License headers and attribution

**Hard constraint: DO NOT modify any code.** Only remove comments. No refactoring, no style changes, no removing try/catch or null checks. If you spot code slop, note it in the summary but leave it.

## Hard Rules (Prose Mode)

- Never change factual content — only how it's expressed
- Never add new claims or examples not in the original
- Preserve the author's stance, intended audience, and recognizable voice
- Preserve useful connective explanation; concise does not mean compressed beyond easy reading
- If the text is mostly fine, say so — don't invent problems to fix
