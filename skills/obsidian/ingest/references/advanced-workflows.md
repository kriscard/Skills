> **Read this when:** creating connections between wiki pages, selecting aliases, or citing a specific heading or block.

# Links that explain the connection

## Choose a precise target

Link the page for a general relationship, an existing heading for a section, and an existing block ID
for a particular passage. Use an embed only when displaying the source passage helps the reader.

```markdown
[[Source Note#Limitations]]
![[Source Note#^existing-block-id]]
```

Verify the target exists. Preserve immutable sources and human-owned notes: cite their existing
headings or the whole page rather than inserting a block ID. Add a new ID only to an approved writable
page and include that edit in the preview.

Completion: each link resolves to the intended evidence without changing protected content.

## Explain the relationship

Place links next to the claim they support or qualify. For a separate connection, state why it matters:

```markdown
- [[Event Loop]] — explains when this callback can run.
- [[Closure Lifetime]] — explains which captured values remain reachable.
```

A related page does not need a reciprocal edit merely to create a backlink; Obsidian discovers inbound
links automatically. Read both pages before proposing a substantive change to either one.

Completion: every proposed connection adds context or evidence, not merely a shared topic tag.

## Use searchable aliases

Follow the live schema's alias rules. Add genuine alternate names, such as an acronym, when they help
recall. Verify ambiguous aliases resolve to the intended page before using them in a link.

Completion: aliases describe this page and do not silently point the reader to another meaning.

## Extend knowledge without replacing its structure

Read the live Atomic Note template for new pages and preserve the existing structure when enriching
a page. There is no required link count or additional "Encounters" section. Add an example or learning
receipt only when actual evidence supports it and the user approves the edit.

Use MOCs and their embedded Bases to discover related material. Preserve their embeds and curated
anchors unless the approved write set names a specific change.

Completion: the enrichment stays within the page's subject and ownership boundary, and each new claim
has a traceable source.
