> **Read this when:** technical prose needs sentence-level clarity work, including reader-mode boundaries, condition/action order, common paths and exceptions, technical naming, link text, modifier scope, or list introductions.

# Technical style

Use this guide after naming the document's reader job. It improves how technical prose carries that job; it does not replace the type-specific template or force every section into one format.

## Set the reader mode

Name the dominant mode from what the reader is doing:

- **Acting:** complete an operation or follow a procedure.
- **Looking up:** find facts, options, limits, inputs, outputs, or errors.
- **Reviewing or deciding:** evaluate a proposal, scope, trade-off, or recorded decision.
- **Understanding or aligning:** build a mental model of context, constraints, rationale, or product intent.

Let the dominant mode control the opening and section order. A document may contain supporting modes when they help the same reader job. For example, an RFC can lead with a decision request, include reference-like API details, and explain trade-offs. Label those sections and return to the primary job instead of forcing a one-mode-only document.

## Order information for action

Put a condition or warning before the action it governs when order changes meaning or safety:

- `To remove the cached result, run pnpm cache:clear.`
- `If the migration has reached the cutover phase, stop the old writer before enabling the new one.`

Do not mechanically move every purpose clause to the front. Keep the sentence order that makes the dependency unmistakable.

Explain the common path before its exceptions. Give the reader the default action or behavior first, then add uncommon branches, edge cases, and recovery paths where they become relevant.

## Name concrete technical things

Prefer the exact symbol, file, flag, command, UI control, response field, or system component over a generic substitute. Write `validate:skills`, `skills/writing/docs/SKILL.md`, or the `Retry-After` header when those are the things the reader must find or use.

Use one established name per concept. Define a necessary new term once. Do not cycle through synonyms when repetition preserves technical identity.

## Make links actionable

Write link text that names the destination or the action it enables:

- `See the [API authentication guide] for token scopes.`
- `Follow [Configure a preview deployment] before running the release command.`

Avoid link text such as `click here`, `this page`, or a bare URL when the destination can be named. Keep the fact or instruction in the current document when the reader needs it to complete the immediate job; link to supporting depth instead of making the link carry missing context.

## Remove ambiguous modifiers

Place `only`, `not`, and similar modifiers next to the word or phrase they change. Repeat a noun when `it`, `this`, `that`, or `they` could point to more than one thing. Break up noun strings when readers must decode which words modify which noun.

Keep articles, verbs, and joining words that reveal structure. When `and` or `or` can group terms in more than one way, rewrite with explicit pairs such as `both ... and`, `either ... or`, or separate sentences.

## Introduce complete lists

Introduce each list with a complete sentence that says what the items represent. State whether the list is complete or gives examples when that distinction matters.

Use numbered items for a sequence and bullets for an unordered set. Keep list items grammatically parallel so readers can compare them without reconstructing the sentence.

## Optimize for clarity, not a sentence limit

Split a sentence when it contains independent instructions, forces the reader to backtrack, or leaves a condition, actor, or modifier unclear. Keep a longer sentence when its clauses express one coherent fact and the relationships remain clear. Vary sentence length to match the material; do not enforce a universal word count.

Apply a rule only when it makes the sentence easier to understand or act on. If a rewrite becomes mechanical or less precise, use a clearer construction or keep the original.

## Completion gate

- The opening and section order serve the dominant reader mode.
- Supporting modes are labeled and serve the same reader job.
- Conditions and warnings appear before the actions they govern when sequence matters.
- The common path appears before exceptions.
- Technical things use exact, consistent names.
- Link text names its destination or action.
- Modifiers, pronouns, noun strings, and conjunctions have one clear reading.
- Every list has a complete introduction and an explicit relationship among its items.
- Sentence breaks follow meaning and readability, not a fixed length.
