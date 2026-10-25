> **Read this when:** the live vault schema makes filed Books or human-written Resource notes immutable and the import needs to update them.

# Proposed Goodreads Sync Exception

This is a proposal, not an active permission. Read the live `AGENTS.md` and show the exact insertion
and any conflicting lines before applying it. Obtain explicit approval for that schema change.
Re-read the resulting schema before using the exception. If approval is withheld, keep existing
book updates blocked; a separately approved creation or MOC/Base change may proceed only where the
live schema already permits it.

## Proposed schema text

Propose adding this under **Write boundaries**, beside the existing workflow exceptions. Preserve
the general protections and make this bounded exception explicit rather than weakening Books or
Resource ownership for every workflow:

```markdown
### Goodreads book synchronization (`/import-goodreads`)

After preview and explicit approval of an exact write set, `import-goodreads` may create Book
records from the live Book template and update existing records in `03 - Resources/Books/` from a
user-supplied Goodreads CSV. This is a bounded exception to the filed-Books and human-written
Resource-note read-only rules, not ownership of the whole note.

Allowed existing-note changes are limited to the approved bibliographic metadata, Goodreads
identity and provenance, reading status, reading dates, user ratings, custom shelves, tag deltas,
and clearly delimited Goodreads review or private-note blocks. Every nonempty conflict or clearing
of an existing value must be shown and approved. Preserve local prose, summaries, quotes, personal
reviews, unrelated metadata, and existing links. Changed imported blocks require approval; local
edits within them require explicit conflict resolution.

The approved write set may also add or update exact related-book links in named Related, author,
or series sections. Show the relationship evidence and both destination deltas for reciprocal
links. Tag changes must follow the live tag taxonomy and disclose affected Base/plugin dependencies.
Books outside the CSV may receive only explicitly named, approved tag or link edits; they are not
implicitly part of a library-wide rewrite.

Books MOC edits require an exact approved section delta. Base configuration changes require a
direct request and an approved diff; when existing filters already show the imported records,
leave the Base unchanged. Keep the live Book template unchanged unless separately requested.

Book records remain user-owned source/entity records, not agent-owned wiki synthesis. This
workflow does not grant general rewriting, deletion, moves, raw-source edits outside this bounded
exception, or index/log registration. Repeating the same export must preserve existing content
and create no duplicate notes, imported blocks, tags, or links.
```

## Applying the exception

Approval of the schema exception defines what this workflow can request. It does not approve a
particular import, field conflict, tag migration, reciprocal link, or Base modification. The import
still previews its complete write set and obtains approval before applying it. If the live vault
has a narrower or newer rule, follow that rule and adapt the proposal rather than replacing the
schema with this example.
