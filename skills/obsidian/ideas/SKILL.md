---
name: ideas
description: >-
  Capture ideas into the Obsidian Inbox, group idea clusters from a conversation, or promote buried
  ideas into durable notes. Use for "capture this idea", "brain dump", "write down this thought",
  "find buried ideas", or "graduate this idea".
user-invocable: true
---

# Ideas

Capture first and organize later. The Inbox is the low-friction landing zone; durable promotion is a
separate, approval-gated operation.

## Quick capture

Read `AGENTS.md` and resolve the live Inbox convention. Draft one short idea note with a timestamp,
source context when known, and only schema-supported metadata. Write it through a file capability
that passes content separately from its path—never through interpolated shell text.

Do not interrupt a clear “just capture it” request with classification questions. After verifying
the file, optionally offer a project note only when the idea clearly describes a finite outcome.

Completion: one verified Inbox note exists and its path is reported.

## Conversation extraction

When several ideas are scattered through the conversation:

1. identify distinct ideas;
2. group only ideas that share a problem or intended outcome;
3. present the proposed clusters;
4. let the user keep, regroup, or discard them;
5. write one approved Inbox note per cluster and verify each file.

Do not merge unrelated ideas merely to reduce note count.

## Project handoff

When an idea has a finite outcome and credible intent to act, offer the `project` skill. A date may be
a local schema requirement, but lack of a deadline alone does not make the idea an Area under
canonical PARA.

## Promote mode

When the user wants to graduate ideas from daily notes or buried vault notes, load
`references/promote-mode.md`. Present candidates before writing, then create, enrich, or backlink
only what the user selects.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 | Graduating daily-note or buried ideas into permanent notes | `references/promote-mode.md` |
