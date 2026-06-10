---
name: ingest
description: >-
  Processes items from the Obsidian Inbox into the knowledge base — reads the source, discusses the
  key ideas before writing anything, then files synthesized notes into 3 - Resources/ and moves the
  original. Also saves conversation answers as permanent wiki pages. Make sure to use this skill
  whenever the user says "process inbox", "ingest this article", "add to my wiki", "save this to my
  knowledge base", "save what we discussed", "save this answer to my notes", or runs /ingest. Also
  fires when the Inbox has items and the user wants to clear it. The value is the synthesis
  conversation, not the filing.
user-invocable: true
---

# Ingest

Process inbox items into the vault's knowledge layer. Ingesting without synthesis just creates noise
— the value is the conversation that happens before anything gets written.

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
   qmd query "<key concept>" --json -n 8
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

## Save Conversation Answer as Note

When the user wants to save this session's answer/synthesis as a permanent wiki page (trigger: "save
this to my notes", "save what we just discussed"):

1. Ask for title and target subfolder if not clear. Default subfolders:
   - `3 - Resources/Coding/` — engineering patterns, technical decisions
   - `3 - Resources/Concepts/` — general concepts and frameworks
   - `3 - Resources/Reflections/` — personal insights, mental models
   - `3 - Resources/Communication/` — leadership, writing, comms

2. Search before writing:

   ```bash
   qmd query "<topic>" --json -n 8
   ```

   Score ≥ 0.7 → append dated section. Score < 0.5 → create new page.

3. Write the note (use `source: claude-memory` frontmatter with `aliases`), then update `index.md`
   under `## Concept notes (claude-memory)` and append to `log.md`.

Body must be self-contained — no references to "the conversation above."

## What NOT to do

- Don't silently file without discussing — synthesis is the whole point
- Don't create duplicate pages — always search first
- Don't use diary voice in wiki pages — write for reference, not narrative
- Don't move the source before the knowledge is captured

## References

| Priority   | Load when                                                                 | Reference                          |
| ---------- | ------------------------------------------------------------------------- | ---------------------------------- |
| 1 — High   | Creating or linking wiki pages — block refs, aliases, evergreen structure | `references/advanced-workflows.md` |
| 2 — Medium | User wants Dataview queries or dynamic MOC views inside a note            | `references/dataview-patterns.md`  |
| 3 — Medium | Creating a MOC or deciding MOC vs standalone note                         | `references/moc-advanced.md`       |
