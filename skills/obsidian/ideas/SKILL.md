---
name: ideas
description: >-
  Idea capture and promotion for Obsidian: quick thoughts land in Inbox, conversation idea clusters
  are reviewed before writing, and daily-note ideas can be promoted to permanent notes. Use when the
  user asks to capture an idea, brain dump, write down a thought, find buried ideas, or graduate
  ideas from daily notes.
user-invocable: true
---

# Ideas Capture

Get ideas out of your head and into the vault immediately. Low friction is the whole point — capture
first, organize later. The Inbox is the landing zone.

## Quick Capture (single idea)

Write to inbox immediately, no questions:

```bash
obsidian create path="0 - Inbox/idea-$(date +%Y%m%d-%H%M).md" content="..."
```

Frontmatter to add:

```yaml
---
type: idea
captured: YYYY-MM-DD HH:MM
context: <project name or topic, if obvious>
tags: [idea]
---
```

After capturing, ask ONE optional follow-up:

> "This looks like a [project / area / resource] idea — want a full project note now, or just inbox
> for later?"

Only ask if the answer isn't already obvious. If they say "just capture it", stop there.

## Idea Extraction from Conversation

When the conversation contains multiple ideas scattered through the discussion:

1. **Identify all distinct ideas** — don't lump unrelated things together
2. **Group related ideas** into clusters (same problem space, same project, same technology)
3. **Write one note per cluster** — related ideas together, unrelated ideas separately

```bash
# One note per distinct cluster
obsidian create path="0 - Inbox/idea-$(date +%Y%m%d-%H%M)-<slug>.md" content="..."
```

Present the clusters to the user before writing, in case grouping is wrong. Write only after the
user confirms which clusters to save and which to discard.

## When to Suggest a Project Note Instead

If the idea clearly has:

- A concrete outcome ("build X", "ship Y", "learn Z")
- An implicit deadline or urgency

...ask: "This sounds like more than an idea — want me to set up a project note in `1 - Projects/`?"
Then hand off to the `project` skill if yes.

## Naming Convention

- Single idea: `idea-YYYYMMDD-HHMM.md`
- Named idea: `idea-YYYYMMDD-HHMM-<short-slug>.md`
- Extracted cluster: `idea-YYYYMMDD-HHMM-<topic>.md`

Keep slugs short (2–3 words max). The timestamp is the primary identifier.

## Promote Mode

When the user wants to promote ideas from daily notes or buried vault notes, load
`references/promote-mode.md`. The approval gate stays the same: present candidates before writing,
then create, enrich, or backlink only the ideas the user selects.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Graduating ideas from daily notes or buried vault notes into permanent notes | `references/promote-mode.md` |
