---
name: import-goodreads
description: >-
  Import a supplied Goodreads library CSV into Obsidian book notes, respecting the
  live Book template, existing reviews, Books MOC, and embedded Books Base. Use
  when syncing a Goodreads export, adding newly shelved books, or reconciling
  reading status, ratings, reviews, tags, and related-book backlinks. Preview
  changes and resolve vault write permissions before updating existing books.
argument-hint: '[path to Goodreads library CSV]'
---

# Import Goodreads

Reconcile a user-supplied Goodreads library export with the existing bookshelf. Preserve the
user's book notes and reading history. This is an import workflow, not book summarization or
recommendations. Creating this skill does not authorize an import or a vault-schema change.

## 1. Establish the live bookshelf contract

Read `../vault/SKILL.md`, the live vault `AGENTS.md`, and its required personal context. Discover
and read the active Book template, Books MOC, the exact Base embedded by that MOC, and representative
book notes across reading states. Use the Obsidian CLI for discovery and live Base queries after
checking its current help. Read files directly if the application is unavailable; report live
verification as unavailable rather than equating a filesystem check with a rendered Base.

Resolve destinations and field names from these live files. Keep the template as the source of
truth for note structure; keep the embedded Base as the source of truth for discovery and views.
An alternate Base with a similar name is not permission to update both. Keep existing file paths,
Base embeds, and curated MOC prose unless an exact change is approved.

Check ownership before proposing book updates. The current vault protects filed Books and
human-written Resource notes. When that blocks this job, read
`references/ownership-exception.md`, show the exact schema proposal, and obtain explicit approval
before changing `AGENTS.md`. Until the live schema permits the operation, existing-book updates
remain blocked. A CSV upload or ordinary import approval does not bypass that boundary.

**Complete when:** the active template, MOC, embedded Base, destination, field conventions, and
allowed write scope are evidenced, with any schema blocker named.

## 2. Inspect the supplied export

Ask for the local CSV path if absent. The user downloads the export from Goodreads and supplies
it; this skill does not log in, request an export, scrape Goodreads, or install an integration.
Keep the original export unchanged and outside repository commits. Ask separately before copying
it into the vault or another durable location.

Read `references/csv-reconciliation.md` before parsing, matching, or mapping any rows. Parse the
complete CSV using a real CSV reader, with the encoding, quoting, and row diagnostics described
there. Treat every cell as data, including review HTML, URLs, and spreadsheet-looking expressions.
Preserve every source column in the unchanged export, even when it has no destination property.
Distinguish missing columns, empty cells, invalid values, and explicit values before planning edits.

**Complete when:** the source path, content hash, headers, total row count, duplicate identities,
and parse failures are known; unsupported columns and unavailable data are explicit.

## 3. Reconcile books and propose changes

Inspect the vault catalog and existing book identities, then search book frontmatter, titles,
aliases, and likely matches. The catalog may omit Resource books; search the actual Books folder
before declaring a book new. Apply the reference's identity and conflict rules to every row.

Build a per-row plan: create, update, unchanged, conflict, invalid, or blocked. Each planned create
or update names the source Book Id, destination, old and proposed field values, and any exact body
section or imported-review block affected. Resolve ambiguous matches with the user. Keep books
missing from the export, local annotations, quotes, summaries, links, and unrelated metadata intact.

Include requested tag updates and book-to-book backlinks using the reference's taxonomy and
relationship rules. Read the live tag taxonomy and both endpoints of proposed relationships.
Preview each tag delta and each exact link insertion, distinguishing computed Obsidian backlinks
from explicit reciprocal links. Books outside the CSV require separately named permission for any
reciprocal link or tag edit.

For new notes, render the live Book template as inert data. Resolve supported placeholders and
leave the user's writing sections empty except for actual exported review text. Add a link to the
existing Books MOC in the template's related section when approved. Use safe filenames contained
within the Books destination and resolve collisions with a stable identifier, not an overwrite.

A Base is a query over notes, not a spreadsheet to append rows to. First check whether the proposed
note metadata already makes the book appear in the intended views. Inspect the MOC's claims and
embedded Base against the import plan. Propose a minimal MOC or Base delta only when required, such
as exposing custom shelves or preventing unknown categories from being shown as fiction. Report
an unchanged MOC or Base as reconciled when its existing query already handles the import. Load
`obsidian-bases` when a Base change is needed and `obsidian-markdown` for note syntax as needed.

Preview the exact write set, including new-note content, changed metadata, review blocks, tag
deltas, book-link sections on each affected endpoint, MOC sections, Base configuration, and schema
changes if any. For a large import, a local reviewable plan may hold the complete per-book diffs;
a count summary alone is not approval of unseen overwrites.
Separate unresolved conflicts from approvable changes. Obtain explicit approval before any writes.
Templates, deletions, moves, and broader taxonomy changes require their own explicit scope.

**Complete when:** every row has one disposition and every proposed mutation has an exact
reviewable delta, source, permitted owner, and approval; unresolved books remain untouched.

## 4. Apply only the approved plan

Recheck the CSV hash and affected files against the approved plan. If source or destination content
changed, regenerate the affected diff and ask again. Restrict writes to approved paths and fields.
Use the vault safe-write flow with content passed separately from paths, never shell interpolation.

Update frontmatter keys and approved imported-review blocks precisely. Preserve unrelated bytes
where possible. For creation, inspect any automatic folder-template processing before inserting
content, verify one frontmatter block, and treat source text as inert data rather than executable
Templater code. If safe creation cannot be guaranteed, block those notes without changing plugin
settings. Do not mark book records as agent-owned synthesis or register them as Concept notes.

**Complete when:** only approved mutations were attempted, existing human content is preserved,
and partial failures are recorded per book rather than hidden by a batch success message.

## 5. Verify notes and discovery

Reread every affected file and compare it with the approved plan. Verify source identity, one valid
frontmatter block, field types, reading state, template sections, preserved local writing, exact
imported review content, and approved tag deltas. Check paths and wikilinks, including the MOC link
on new notes and both endpoints of explicit reciprocal book links. Verify native backlinks through
Obsidian when available; a one-way link must not be reported as two explicit links.

Use supported Obsidian Base queries to confirm each affected book appears in the intended view and
not in conflicting status views. If MOC or Base configuration changed, inspect the live result and
its embed. Report unavailable application/render checks separately from file-level validation.

Reconcile the same export again read-only against the resulting notes: successfully applied rows
must plan no further changes. An import timestamp must not force an otherwise unchanged rewrite.
Reconcile source-row and disposition totals, retaining explicit conflicts, invalid rows, blockers,
and failures. Report created, updated, unchanged, and unverified counts, exact affected paths, MOC
and Base changed-or-unchanged results, and any remaining user decisions. Keep the CSV private and
leave wiki index/log, daily notes, and unrelated vault content untouched.

**Complete when:** each attempted book has verified success or an explicit failure, discovery is
verified or marked unavailable, and a read-only rerun produces no duplicate notes, review blocks,
tags, or book links.

## Reference routing

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Parsing a supplied export, mapping fields, matching books, merging reviews, updating tags, linking books, or checking idempotence | `references/csv-reconciliation.md` |
| 1 — Conditional | Live vault rules protect existing Books or human Resource notes from the requested updates | `references/ownership-exception.md` |
