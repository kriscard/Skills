> **Read this when:** parsing a Goodreads export, mapping fields or shelves, matching books, merging reviews, proposing tags or book links, or checking repeat imports.

# CSV Reconciliation

## Parse the actual file

Use a CSV parser such as Python's standard-library `csv.DictReader`, not line splitting. Handle
UTF-8 BOM, quoted commas, embedded newlines, escaped quotes, and Unicode titles. Validate headers
and row widths. Account for malformed rows without silently truncating the library. Accept CSV;
if supplied an XLSX or another format, ask for the Goodreads CSV or explicit conversion permission.

Inspect actual headers before using the mappings below. Require enough identity and shelf data to
make the requested claims. If a column is absent, mark that capability unavailable rather than
inventing a value. Keep Book Id and ISBN values as strings. Goodreads may represent an ISBN as
`="9781234567890"`; unwrap only that exact quoted-string form as text. Never evaluate spreadsheet
expressions. Safely serialize YAML strings and lists rather than concatenating raw cell values.

The export is a library snapshot, not proof that every Goodreads account feature, reading session,
highlight, or historical shelf change is included. Describe imported and unavailable data honestly.
Retain unmapped source columns in the untouched export; do not claim they were imported into notes.

## Identify before merging

Use this identity order, checking conflicting evidence at every tier:

1. Exact Goodreads Book Id or the same ID extracted from an existing Goodreads book URL.
2. Exact normalized ISBN-13 or ISBN with compatible title, author, and edition evidence.
3. Normalized title and author only as a candidate requiring inspection and user confirmation.

Search existing notes with shortened filenames, subtitles, series suffixes, aliases, and original
language titles. Normalization helps find candidates; it does not prove two editions are the same.
A conflicting stable ID, several candidate notes, duplicate export rows with differing data, or a
filename collision requires resolution before writing. Identical duplicate rows may share one plan;
account for their source-row count. Never merge distinct volumes because they share an author or
series. Never create a replacement note just because the old filename differs from the export title.

Use the live identity convention where present. Otherwise propose `goodreads_id` as a quoted string
and `goodreads_url` as provenance. Adding identity to an existing note is itself an approved edit.
Sanitize destination filenames and verify their resolved paths remain inside the Books folder.

## Map evidence, not assumptions

The live Book template and embedded Base determine destination names and types. These are candidate
mappings to reconcile with those live files, not a frozen copy of the template:

| Export column | Candidate destination | Rule |
|---|---|---|
| Title | `title` | Preserve original text; existing filenames and headings change only if separately approved. |
| Author | `author` | Retain the primary author. Preserve additional authors separately if approved. |
| Original Publication Year / Year Published | `year` | Inspect whether existing notes use work or edition year; preview the chosen source and conflicts. |
| Number of Pages | `pages` | Valid positive integer, otherwise missing or a reported invalid value. |
| My Rating | `rating` | User's rating only; 1–5, with 0 meaning unrated rather than a zero-star review. |
| Average Rating | Separate optional property | Never replace the user's rating with the community average. |
| Exclusive Shelf | `status` | `to-read` stays `to-read`; `currently-reading` stays `currently-reading`; `read` stays `read`. |
| Bookshelves | `goodreads_shelves` or live equivalent | Preserve custom shelf names as a list; they do not override the exclusive reading state. |
| Date Read | `date_finished` | Use a valid exported date; retain missing precision rather than inventing a day. |
| Date Added | Optional `goodreads_date_added` | This is not the start or completion date. |
| ISBN / ISBN13 | `isbn` and optional ISBN-13 field | Preserve string values and leading zeros; confirm edition before replacement. |
| My Review | Imported block under live review section | Preserve the user's exported review without summarizing it or replacing local writing. |
| Private Notes | Separately approved block | Treat as private user writing, not public review content. |
| Read Count / Owned Copies / Binding | Optional dedicated fields | Import only when present and included in the approved mapping. |

An unknown or missing exclusive shelf is a conflict, not an automatic `to-read`. A review or rating
alone does not establish `read`. Custom shelves such as TBR remain shelves alongside the current
status model. Interpret a custom exclusive state only after the user approves its mapping.

Missing or empty source values preserve existing values by default. On creation, 0/unrated yields
an empty rating; on update, clearing a previous rating requires explicit approval. The same rule
applies to removed reviews, dates, and shelves. Never delete a note because its row is absent.
Conflicting nonempty values require a visible old/new diff and an approved choice. If the user
selects Goodreads as authoritative for particular fields, apply that choice only within that scope.

Leave `date_started`, genre, and category unresolved unless the export or existing notes provide
them. A Goodreads shelf can support classification only through an approved shelf-to-field map.
In particular, missing category must not be treated as proven fiction because a Base uses
`category != "non-fiction"`. Preview an unknown-category view/filter correction if needed; do not
invent genre from the title or silently change the template.

## Preserve reviews and local writing

Keep the live template's headings and existing body. Fill an empty Review section with the actual
exported review only after approval. When local review text exists, preserve it and propose a
separate clearly attributed Goodreads block within that section. Show the complete text and markers
used to delimit the imported block so future runs can target it without touching the user's prose.
Use a stable Book Id in the block identity, for example paired `goodreads-review:<id>:start` and
`goodreads-review:<id>:end` HTML comments. These markers identify imported content, not ownership of
the surrounding note.

On later imports, compare source text with the matching block. Unchanged text is a no-op. Replace a
changed imported block only after preview and approval under the live schema exception. If the
block has local edits, flag the difference and ask whether to preserve, merge, or replace it. An
empty upstream review does not authorize deletion. Duplicate or broken markers block that edit.

Treat review HTML as source data. Use inert text or a safe HTML-to-Markdown conversion that preserves
paragraphs, emphasis, links, and wording without executing scripts or fetching remote content.
Preview conversion loss or ambiguity. Do not invent a Summary, Quotes, Review, or personal opinion
from the title, rating, or reading state.

## Tags and book-to-book links

Read the live tag taxonomy, affected Bases, existing book tags, and relevant plugin dependencies
before proposing tag changes. Preserve the book-discovery tag and other required tags. Show the
exact shelf-to-tag mapping and each tag addition, rename, or removal. Shelf names remain intact in
the shelves property even when selected shelves also map to approved topic tags. A custom shelf
is not automatically a tag, genre, or category; resolve the mapping explicitly. Keep unrelated tags
unless their removal is separately approved. Do not create a new taxonomy or retag the whole vault
as part of one import.

Read both book notes before proposing a book-to-book relationship. Use evidence from exported
shelves, existing notes, user-supplied context, or verified bibliography, and name the relation:
same author, same series with verified volume order, a user-described thematic connection, or an
explicit comparison. A generic shared shelf is candidate evidence, not enough to claim a meaningful
thematic connection. Preserve the user's distinctions and ask when the relationship is uncertain.

Place links in the live Related section or an existing author/series section. Match established
local style and explain the relation briefly when the section does not already name it. Resolve
wikilinks to existing notes or new notes included in the approved plan; do not create phantom book
notes merely to satisfy a link. Deduplicate across both notes and their existing relationship
sections. Avoid complete pairwise graphs, automatic links to every same-author book, and repeated
"More by" lists without a useful navigation purpose approved by the user.

A requested backlink may mean a reciprocal explicit link, while Obsidian also computes backlinks
from one-way links automatically. State which is proposed. For explicit reciprocal links, preview
the exact section delta in both notes and obtain permission for both destinations. Protected books
outside the CSV remain protected; linking a newly imported book does not authorize editing them.
A one-way approved link still provides a native computed backlink on the target.

## Idempotent result

The same export and approved mappings must produce no new notes, duplicate review blocks, repeated
tags, or repeated book links. Compare semantic values before writing. Keep source hash and run
counts in the report; add import metadata to notes only if approved, and change timestamps only
when actual imported content changes. Re-run reconciliation read-only after writes, preserving
unresolved conflicts rather than silently choosing a winner.
