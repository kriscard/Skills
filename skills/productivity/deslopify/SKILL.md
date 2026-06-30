---
name: deslopify
description: >-
  Deslopifies AI-sounding prose and code diffs. Use when the user asks to make
  text sound human, remove ChatGPT-style filler, rewrite without fluff, clean up
  AI comments, or strip restatement comments from a diff without changing code.
---

# Deslopify

Strip the patterns that mark text as AI-generated. Preserve all factual content and the author's intended tone — change the delivery, not the message.

## The Slop Patterns

Scan for these before rewriting. More slop patterns justify a stronger edit; mostly-clean text gets a light pass.

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

**Nominalization** (convert to verb):

- "make a decision" → "decide"
- "provide assistance" → "help"
- "conduct an analysis" → "analyze"
- "have a discussion" → "discuss"

**Bullet lists where prose would be clearer**: not every list needs to be a list. Three related sentences often read better as a paragraph.

**En-dash used as em-dash**: `–` should be `—` (or just a comma)

## What Good Looks Like

- Short sentences land hard. Longer ones build context. Vary them.
- Active voice: "We shipped X" not "X was shipped by the team"
- Specific beats general: "increased conversion by 18%" not "improved results"
- The first sentence is the most important — if it's filler, cut it

## Process

1. Read the full text.
2. Identify which slop patterns appear; mention only the main classes in the note.
3. Rewrite: cut filler, verb-ify nominalizations, activate passive constructions.
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
- Preserve the author's stance and intended audience
- If the text is mostly fine, say so — don't invent problems to fix
