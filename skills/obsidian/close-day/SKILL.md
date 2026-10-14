---
name: close-day
description: Review today's log and meeting notes, optionally import Granola meetings, propose Atomic Notes, and suggest next-day actions.
disable-model-invocation: true
---

# Close Day

Look back at the day to find useful thoughts, questions, and lessons. Keep task status in Jira or
GitHub; Project notes are places to think, not progress reports.

## 1. Read today's log

Read `../vault/SKILL.md` and the live `AGENTS.md`. Resolve the local date and timezone, then read the
existing daily note and relevant linked notes. Use its actual headings. If the daily note is missing,
report that gap and continue only with available evidence; do not create a daily note as a side effect.

When Granola imports are needed, read `../import-meetings/SKILL.md` and use that workflow for access,
retrieval, deduplication, and approved snapshot creation. If access is unavailable, continue locally.

Always inspect the schema's Meetings folder for the reviewed day, even if Granola is absent or no
import ran. Select notes by meeting date in the review timezone, not import time. Read their content;
use stable source identities to distinguish duplicate versions from separate meetings. Ask which
version to link when the intended snapshot is ambiguous.

Completion: the daily log and relevant local meetings were read, any import result is explicit, and
missing meeting access or evidence does not block the local review.

## 2. Produce the day review

Use a short, evidence-backed summary:

```markdown
## Day review

### Today
What happened, including useful observations from logs and meetings.

### Thoughts and questions
What changed my understanding? What remains unclear?

### Possible Atomic Notes
Explanations, techniques, principles, or questions worth developing beyond today.

### Actions for tomorrow
Suggested follow-ups, not automatic commitments.
```

Omit empty sections. Separate the user's recorded thoughts from the agent's suggestions. A sparse log
is not proof that nothing happened. Do not invent learning or turn meeting assignments into the user's
commitments. Link evidence where it helps.

Completion: every factual statement has a source and proposed notes/actions are visibly suggestions.

## 3. Discuss what is worth keeping

For each Atomic Note candidate, read the catalog and plausible existing notes. Propose a new draft,
a permitted enrichment, a link to existing coverage, or no write. Explain why the material is useful
beyond this day. Ask whether the user wants a human-owned scaffold or an agent-written synthesis;
use `create-note` and the live template for approved creations.

Offer Project-note edits only for a relevant decision, question, or lesson. Offer an Inbox capture
when the user wants to preserve something without developing it yet. Leave next-day actions in the
review unless the user names and approves a writable destination.

Completion: candidates are checked for existing coverage and each proposed write has a purpose,
owner, destination, and explicit user decision.

## 4. Write only approved changes

Keep meeting imports in the importer's approved write set. For the day review, show exact daily
meeting links, any Knowledge drafts or updates, and optional Project/Inbox changes. Link only verified
local notes, including previously imported meetings. Apply changes through the vault safe-write flow;
Knowledge writes follow `create-note` and the schema.

The daily-note exception is limited to approved links appended under an existing `## Meetings`.
Preserve every existing entry and all other daily sections. Weekly notes remain unchanged. Do not
write the whole day review into the daily note or modify its tasks. If the daily note or Meetings
section is missing or ambiguous, present the links without writing them. Deduplicate by resolved
note path, including links with different aliases. Reread the section before appending; reconcile
concurrent edits and re-confirm any changed proposal. A rerun adds no duplicate links.

Reread each affected file. Verify imported identities, deduplicated links, ownership, required
registration, and that protected content is unchanged. Report completed writes separately from
proposals, skipped meetings, failures, and tomorrow's suggested actions.

Completion: every approved write is verified and no other daily-note content changed.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Fetching missing meeting snapshots from Granola during the day review | `../import-meetings/SKILL.md` |
