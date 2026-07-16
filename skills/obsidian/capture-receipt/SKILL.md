---
name: capture-receipt
description: >-
  Capture a concrete work or learning receipt in today's Obsidian note, then optionally hand it to
  tweet-today or blog. Use when the user says "save this for sharing", "capture this receipt",
  "tweet this now", or when close-day promotes an Idea Worth Sharing.
user-invocable: true
argument-hint: "[lesson, decision, proof, or source context]"
---

# Capture Receipt

A receipt is concrete proof worth reconsidering for publication. Capture first; choose format second.

## 1. Preserve the active task

Before branching into content, identify:

- the task currently active;
- its ready-to-resume next action;
- the file, link, or command to reopen.

If no active task exists, record `none`. Do not let content drafting silently replace the work block.

Completion: the skill can name what attention returns to.

## 2. Harvest the receipt

Use the nearest trustworthy source: current session, today's note, explicit project evidence, screenshot, commit, code snippet, decision, or user-provided text.

Build one receipt:

- **ID:** `YYYYMMDD-short-slug`
- **Idea / lesson:** the non-obvious change, decision, or insight
- **Proof / link:** concrete evidence
- **Project:** Roofr, Markly, learning, or other
- **Daily source:** today's wikilink
- **Source session:** stable reference when available
- **Safety:** `public-safe`, `needs-review`, or `private`
- **State:** `captured`

Do not invent proof. Thin context triggers the smallest possible question.

Completion: every field is sourced or explicitly marked unavailable.

## 3. Safety gate

`private` or `needs-review` applies to secrets, credentials, private URLs/repositories, customer data, unreleased metrics, internal code, employer-confidential details, and uncertain ownership.

Only `public-safe` receipts may be handed to writing skills. Generalize an internal pattern only after the user approves the sanitized version.

Completion: the receipt has an explicit safety state and unsafe evidence stays private.

## 4. Choose one branch

Ask:

1. **Save only** — append to today's `## Ideas Worth Sharing` section.
2. **Draft tweet now** — save first, then hand the public-safe receipt to `tweet-today`.
3. **Create blog outline** — save first, then hand the public-safe receipt to `blog`; stop at outline approval.
4. **Cancel** — write nothing and return to the active task.

When invoked by `close-day` for a promoted receipt, also append the approved structured receipt to the `## 🧾 Receipt Queue` table in `1 - Projects/Public Technical Presence/Public Technical Presence.md` with state `promoted`.

Completion: the user explicitly selected a branch.

## 5. Approval-gated write

Show the exact receipt before writing. Use heading-targeted patching when available; otherwise use read + overwrite only after approval. Never duplicate `Ideas Worth Sharing` or publishing-project headings.

Do not mark a draft as published. Publication requires a user-confirmed public URL or explicit published state.

Completion: the approved receipt is stored in the intended section and any requested writing handoff has started.

## 6. Return attention

End with:

- active task;
- next action;
- reopen target.

If the branch created a draft, make clear that returning to the active task is the default next move.
