---
name: daily
description: Open or create today's Obsidian daily note and optionally capture a few tasks, thoughts, or observations.
disable-model-invocation: true
---

# Daily Note

Use the existing daily log for human capture. One bullet is sufficient; planning is optional.

## 1. Resolve today's note

Derive the real local date. Read the vault's `AGENTS.md` and `../vault/SKILL.md` for paths, ownership,
and safe writes. Resolve today's daily-note path and current template.

Open the note if it exists. Otherwise, preview the target and template content, obtain any approval
required by the vault contract, and create it through the shared safe-write flow. Weekdays and weekends
behave alike when invoked; no additional weekend confirmation is needed.

Only today's daily note is in the write scope.

Completion: today's note exists, or a missing permission or template has been reported and writes stopped.

## 2. Prepare user-supplied entries

Use tasks, thoughts, events, ideas, links, or observations supplied by the user. If they only invoked
the skill, ask at most one optional question:

> What are you doing, noticing, or thinking about today?

Preserve their wording and voice:

- explicit actions become `- [ ]` tasks;
- completed actions become `- [x]` only when the user says they are complete;
- everything else becomes an ordinary `-` bullet.

Append entries without rewriting earlier content or reconstructing activity. Leave unresolved work
in its original note unless the user explicitly selects it for today. An empty answer requires no entry.

Gather additional context only when the user explicitly asks for planning help. In that branch, read
only the sources needed for the request, propose up to three candidate tasks, and obtain confirmation
before preparing them for capture.

Completion: entries reflect explicit user input or confirmed selections, or nothing needs adding.

## 3. Write and verify

Preview the proposed entries and obtain approval using the shared vault safe-write flow.
Append under `## Today` when present. For a legacy note without that heading, append at the end without
migrating its existing sections. Replace an empty starter bullet with the first approved entry when
applicable; leave all substantive content intact.

Reread the affected content and verify that existing entries were preserved, only approved content was
added, bullet types match user intent, and no unrelated sections or notes changed.

Return the daily-note path and exact entries added. If nothing was added, return only the path.
