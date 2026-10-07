---
name: process-inbox
description: >-
  Triage Obsidian Inbox notes into PARA destinations one at a time with explicit approval. Use when
  the user asks to process, clear, sort, or triage the vault Inbox.
user-invocable: true
---

# Process Inbox

Classify captures; do not synthesize source knowledge here. Use `ingest` when a selected source
should become connected LLM Wiki knowledge, and `save-note` for a conversation synthesis.

## 1. Establish scope

Read `AGENTS.md`, resolve the live Inbox path, and list its notes. Report the count. Stop when empty.

Ask whether nested raw-source inboxes should be included when the schema distinguishes them from
general capture.

Completion: the ordered queue and scope are confirmed.

## 2. Process one note at a time

For each note:

1. read enough content and metadata to classify it;
2. show its filename and concise summary;
3. apply the PARA decision tree from `AGENTS.md`, falling back to canonical actionability:
   - active finite outcome → Project;
   - ongoing responsibility or standard → Area;
   - useful information without current finite outcome → Resource;
   - inactive material → Archive;
   - unclear → remain in Inbox;
4. propose one specific destination and explain the evidence;
5. wait for the user's decision.

Offer at most four authored choices:

1. move to the suggested destination;
2. choose a different destination;
3. skip this note;
4. stop processing.

A delete request may come through the custom-answer path or follow-up conversation. Confirm deletion
separately immediately before executing it.

When the note is an external source that merits synthesis, offer `ingest`; do not move it as ordinary
reference material first.

## 3. Execute and verify

Use the current Obsidian CLI help for move/delete syntax. After each approved operation, verify the
source and destination state. On failure, stop that item and report it rather than incrementing the
processed count.

## 4. Report

Return counts for Projects, Areas, Resources, Archives, skipped, deleted, handed to ingest, failed,
and remaining. State that every move and deletion was individually approved.
