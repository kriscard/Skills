---
name: capture-receipt
description: >-
  Preserve concrete work or learning evidence for possible future sharing without interrupting the
  active task. Use for "save this for sharing", "capture this receipt", "tweet this now", or a
  receipt promoted during close-day.
user-invocable: true
argument-hint: '[lesson, decision, proof, or source context]'
---

# Capture Receipt

The goal is to preserve a sourced insight while it is fresh, decide whether it is safe to share,
and return attention to the work in progress. A receipt is evidence for future writing—not a draft
and never proof that something was published.

## 1. Preserve the active task

Record the active task, its next action, and the file, link, or command needed to resume. Use `none`
when no task is active.

Completion: the skill can name where attention returns.

## 2. Build one sourced receipt

Use the nearest trustworthy evidence: current session, today's note, project artifact, screenshot,
commit, code snippet, decision, or user-provided text.

Capture:

- ID: `YYYYMMDD-short-slug`;
- idea or lesson;
- proof or link;
- project or context;
- daily-note backlink when applicable;
- stable source reference when available;
- safety: `public-safe`, `needs-review`, or `private`;
- state: `captured`.

Do not invent proof. Ask the smallest question needed for a missing essential field.

## 3. Apply the safety gate

Credentials, private URLs or repositories, customer data, unreleased metrics, internal code,
employer-confidential details, and uncertain ownership are `private` or `needs-review`. Only
`public-safe` receipts may enter a writing workflow. A generalized internal lesson requires approval
of the sanitized version.

Completion: the safety state is explicit and unsafe evidence remains private.

## 4. Choose the outcome

Offer four choices:

1. save only;
2. save, then hand a public-safe receipt to `tweet-today`;
3. save, then hand a public-safe receipt to `blog` for an outline;
4. cancel and return to the active task.

When `close-day` promoted the receipt, also prepare the schema-defined publication-queue update.

## 5. Preview, write, and return

Show the exact receipt and destinations before writing. After approval, use the `vault` safe-write
flow, verify each destination, and start only the requested writing handoff. Publication requires an
explicit published state or public URL.

End by restating the active task, next action, and reopen target.
