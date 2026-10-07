---
name: vault
description: >-
  Foundational Obsidian vault context. Use whenever work touches the user's vault, notes, PARA,
  second brain, or personal knowledge system. Loads the live schema, ownership boundaries, and safe
  operating rules that every other Obsidian skill depends on.
---

# Vault Context

Load this before any vault operation. The live vault defines its own structure; this skill defines
how to discover and respect it.

## Establish the contract

1. Locate the intended vault. The current default is `/Users/kriscard/obsidian-vault-kriscard`, but
   confirm when the request or environment indicates another vault.
2. Read vault-root `AGENTS.md` before interpreting paths, ownership, templates, or workflows.
3. If `AGENTS.md` is missing, report that the vault schema is unavailable. Inspecting files is still
   safe, but do not infer write permissions or substitute another schema silently.
4. Inspect current folders and templates when an operation depends on them.
5. Run `obsidian help` or `obsidian help <command>` when exact CLI syntax matters.

Completion: the target vault, live schema, and permissions relevant to the request are known.

## Operating boundaries

- Treat raw-source directories declared immutable by `AGENTS.md` as read-only.
- Derive LLM-managed and human-managed boundaries from `AGENTS.md`; do not infer ownership from a
  hardcoded frontmatter marker.
- Ask when a destination, interpretation, active period, or ownership boundary is ambiguous.
- Missing or sparse notes are evidence gaps, not evidence that nothing happened.
- Present synthesized judgments and proposed mutations with their sources before writing.
- Require explicit confirmation before deleting, moving, publishing, or overwriting a note.
- Keep root `index.md` and root `log.md` in the LLM Wiki workflow when the schema requires them.

## Safe writes

Generated Markdown is data, not shell code. Never place user- or model-generated content inside an
executable shell command string.

For a new page, use a file-write capability whose content is passed separately from its path. For a
named-section update, prefer a heading-targeted edit capability. If none is available:

1. read the complete note;
2. prepare the exact replacement;
3. show the proposed change;
4. obtain approval;
5. overwrite through a file-write capability;
6. reread and verify the result.

Use the Obsidian CLI for discovery, navigation, metadata, moves, and other commands after checking
its current help. Do not cache command flags or plugin state in this skill.

## PARA interpretation

Use `AGENTS.md` for local conventions. When explaining canonical PARA, classify by actionability:

- **Project:** active, finite effort with a defined outcome.
- **Area:** ongoing responsibility or standard.
- **Resource:** potentially useful information without a current finite outcome.
- **Archive:** inactive material from the other categories.
- **Inbox:** undecided capture awaiting classification.

Label stricter local requirements as vault-schema rules rather than universal PARA rules.

## Completion

Before finishing any write operation, verify the destination exists, reread the affected content,
and report exactly what changed. Report failures without claiming success.
