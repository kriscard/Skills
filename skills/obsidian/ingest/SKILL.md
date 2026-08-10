---
name: ingest
description: >-
  Source synthesis for Obsidian: ingest an article, URL, video, book note, or selected Inbox source
  into durable Resources notes after discussing the key ideas. Use when the user asks to ingest a
  source, add source material to the wiki, synthesize an article, or runs /ingest.
disable-model-invocation: true
---

# Ingest

Synthesize source material into the vault's knowledge layer. Ingesting without synthesis just
creates noise — the value is the conversation that happens before anything gets written.

Boundaries: use `process-inbox` for PARA triage of raw inbox notes, and `save-note` for saving the
current conversation answer as a standalone wiki page.

**Rule: always discuss before writing.** Never silently file a note.

## Step 1 — Find the Source

If the user specified a file or URL, use that directly.

Otherwise, list the inbox:

```bash
obsidian files folder="0 - Inbox/" format=json
```

If multiple items, ask which one to process (or process all in sequence).

## Step 2 — Read the Source

```bash
obsidian read path="0 - Inbox/[filename]"
```

For URLs or web content: fetch the content directly.

## Step 3 — Discuss Before Writing (required)

Surface for conversation — don't skip this step:

1. **2–3 most important ideas** from the source, in your own words
2. **Existing wiki pages this connects to** — search for related notes:
   ```bash
   qmd query "<key concept>" --json -n 8 2>/dev/null
   ```
3. **Any contradictions** with existing knowledge worth flagging

Present these and wait for Chris to confirm:

- Which ideas to capture
- Whether to update existing pages or create new ones
- Which subfolder in `3 - Resources/` to target

## Step 4 — Write/Update Wiki Pages

Based on similarity to existing notes:

**Update existing page** (score ≥ 0.7 match):

```bash
obsidian read path="3 - Resources/<subfolder>/<existing-page>.md"
# Then append a dated section:
obsidian append path="3 - Resources/<subfolder>/<existing-page>.md" \
  content="\n## Update — $(date +%Y-%m-%d)\n\n<synthesized content>"
```

**Ambiguous match** (score 0.5–0.7): show the candidate pages and ask whether to append, create a
distinct page, or cancel. Do not decide silently.

**Create new page** (score < 0.5, genuinely new territory):

```bash
obsidian create path="3 - Resources/<subfolder>/<new-page>.md" content="..."
```

New page frontmatter:

```yaml
---
source: claude-memory
created: YYYY-MM-DD
aliases: [<acronyms, alternate names, spelling/casing variants>]
tags: [claude-memory, <topic-tags>]
---
```

Generate 2–6 `aliases`: the off-title terms someone would search to find this page (acronyms,
alternate names, "X vs Y" framings). This is what makes the page recall-able from queries that don't
match the title verbatim. Skip only when the title is the sole term anyone would use.

Write in wiki style: neutral, reference-focused, no "I learned that..." framing. This is reference
material, not a diary. Target 3–10 pages per source — focus on durable concepts, not summaries of
the source itself.

**Source type → subfolder mapping:**

- article → `3 - Resources/Articles/`
- tweet → `3 - Resources/Tweets/`
- video → `3 - Resources/Videos/`
- book → `3 - Resources/Books/`

## Step 5 — Update Index and Log

**Add to index** under the right category heading (`Articles` / `Tweets` / `Videos` / `Books` /
`Concept notes`). The CLI has no `patch`, so the entry can't be inserted under a specific section
directly — ask the user: use the MCP `obsidian_patch_content` tool (target the heading,
`operation: append`) or `read` + `create ... overwrite`. Entry format:

```
- **<Title>** ($(date +%Y-%m-%d)) — [[<stem>]] (<path>) · from <hostname>. _<summary>_
```

**Append to log** (chronological — append is fine):

```bash
obsidian append path="3 - Resources/log.md" content="\n## $(date +%Y-%m-%d)\ningest | <title>"
```

## Step 6 — Move the Source

After confirming the write succeeded:

```bash
obsidian move path="0 - Inbox/[filename]" \
  to="3 - Resources/[Type]/[filename]"
```

Never delete inbox items — always move to the appropriate Resources subfolder.

## What NOT to do

- Don't silently file without discussing — synthesis is the whole point
- Don't process a whole inbox queue — use `process-inbox` for PARA triage
- Don't save the current conversation answer — use `save-note`
- Don't create duplicate pages — always search first
- Don't use diary voice in wiki pages — write for reference, not narrative
- Don't move the source before the knowledge is captured

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High   | Creating or linking wiki pages — block refs, aliases, evergreen structure | `references/advanced-workflows.md` |
| 2 — Medium | User wants Dataview queries or dynamic MOC views inside a note            | `references/dataview-patterns.md`  |
| 3 — Medium | Creating a MOC or deciding MOC vs standalone note                         | `references/moc-advanced.md`       |
