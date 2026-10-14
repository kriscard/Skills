---
name: weekly-review
description: Summarize a completed week's daily notes into key findings, potential atomic notes, and outstanding action items.
disable-model-invocation: true
argument-hint: '[ISO week — omit for the most recently completed week]'
---

# Weekly Review

Summarize one calendar week's daily notes and write the result into that week's `## Weekly Review`
section. This is a retrospective, not a next-week planning workflow.

## 1. Confirm the review period

Read the vault's `AGENTS.md` and `../vault/SKILL.md` for live paths, ownership, and safe-write rules.
Resolve the requested ISO week or default to the most recently completed Monday–Sunday week. Locate
its existing weekly note from the live vault convention and compute the exact seven-day range.
Resolve each daily note by its own calendar date; an ISO week can cross a calendar-year folder
boundary. Archived journals may be read as evidence, but archived weekly notes remain read-only.

If the weekly note is missing, stop and report the gap. Do not create or reconstruct it as a side
effect. Ask when the requested period is partial or ambiguous. Confirm that the live vault contract
permits `weekly-review` to manage only `## Weekly Review`; otherwise return the draft without writing.

Completion: one existing weekly note, its exact Monday–Sunday range, and the write boundary for
`## Weekly Review` are confirmed.

## 2. Gather bounded evidence

Read the weekly note and each existing `YYYY-MM-DD.md` daily note in the confirmed date range, in
chronological order. Follow links from those notes only when needed to understand an entry.

Extract:

| Category | Evidence to find |
| --- | --- |
| Key findings | Insights, learnings, realizations, decisions, and useful links |
| Potential atomic notes | Recurring themes, surprising insights, new connections, or durable ideas |
| Action items | Outstanding tasks, TODOs, and follow-ups |

A potential atomic note should be worth remembering beyond the reviewed week. Deduplicate action
items and exclude work already completed. Missing or sparse notes are evidence gaps, not proof that
nothing happened. Use external systems only when the user explicitly requests them.

Completion: every proposed item traces to a weekly or daily note, a linked source, or an explicit user
correction.

## 3. Draft Weekly Review

Read the active Weekly template to confirm the review headings, without changing it. If its structure
differs from the one below, show the discrepancy and agree on the target before writing.

Draft this review structure:

```markdown
## Weekly Review

### Key Findings
- [Finding with relevant [[wikilinks]] inline]

### Potential Atomic Notes
- **[Proposed title as insight]**: [why it deserves its own note]

### Action Items
- [ ] [Outstanding follow-up]
```

Keep all three subsections. Replace example bullets with the week's evidence; use `- None identified.`
when a subsection has no supported items. Keep relevant links inline instead of adding a separate link
dump. Potential atomic notes are proposals only: do not create them. Action items are outstanding
follow-ups, not automatic commitments for the next week.

Completion: the draft is concise, deduplicated, and every factual statement is supported.

## 4. Approve, write, and verify

Show the exact proposed `## Weekly Review` section and obtain explicit approval through the `vault`
safe-write flow. If the section already exists, replace only its three review subsections. If it is
absent, append the complete section. Preserve `Focus for this week` and every other existing section.

Reread the affected weekly note. Verify that there is exactly one `## Weekly Review` section, its
three subsections match the approved draft, and no other content changed. Return the written review,
evidence gaps, and whether the note changed.
