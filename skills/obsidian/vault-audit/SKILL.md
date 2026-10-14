---
name: vault-audit
description: >-
  Audit the vault's PARA and Zettelkasten-inspired Atomic Note organization, linked knowledge,
  journals, metadata, LLM Wiki quality, and bounded statistics. Use when the user asks to audit, maintain, lint, clean up, or check
  the organization and health of their vault.
user-invocable: true
argument-hint: '[para | links | metadata | wiki | stats | all]'
---

# Vault Audit

Run a read-only, evidence-based audit. Diagnose first; change nothing unless the user later approves
a specific fix.

## 1. Establish scope and rules

Read `../vault/SKILL.md` and vault-root `AGENTS.md`. Extract:

- PARA, Knowledge, Journal, and naming conventions;
- immutable, LLM-managed, and human-managed boundaries;
- required metadata;
- index and log expectations;
- any local rules stricter than canonical PARA.

Use `$ARGUMENTS` to select `para`, `links`, `metadata`, `wiki`, `stats`, or `all`. If absent, ask which
dimension matters. The `para` argument includes the schema's Knowledge, MOC, and Journal extensions,
not just project organization. For potentially large checks, confirm folders, date range, topic, or sample size
before reading content.

Completion: the audit mode, boundaries, local rules, and bounded scope are explicit.

## 2. Gather live evidence

Inspect the current vault and use `obsidian help <command>` before relying on CLI syntax. Match each
finding to actual paths and content.

A command result is discovery, not interpretation. For example, a vault-wide orphan list must be
filtered against the writable wiki scope before it becomes a wiki-quality finding.

Record failed or skipped checks. Never imply exhaustive coverage for a sample.

## 3. Run the selected checks

### Hybrid organization

Load `references/para-rules.md`. Review the selected PARA categories against actionability, and
Knowledge, MOCs, Journal, and System against the local schema. Distinguish reusable explanations from
source-specific records; neither an unfinished idea nor a long practical guide is automatically
misclassified.

Report separately:

- **Canonical PARA:** likely mismatch between finite outcome, ongoing responsibility, reference, and
  inactive material.
- **Local schema:** missing metadata or naming required only by `AGENTS.md`.
- **Review candidate:** suggestive but inconclusive signals such as recent archive edits, dated Area
  notes, or inactivity.

Do not call a missing calendar deadline a universal PARA violation.

### Links

Check broken or unresolved links, dead ends, and orphans within the confirmed scope. Distinguish an
intentional leaf note from an accidental orphan by reading it and its index context. Include both
source and target evidence for a broken-link finding. Check MOC Base embeds and their actual result
membership separately from curated links; valid YAML alone does not establish that a note appears.

### Metadata

Compare notes only with metadata rules from `AGENTS.md` and conventions evidenced in their note
class. Do not invent tag limits, required ownership markers, or preferred taxonomies. Group repeated
violations into one pattern with representative paths. Read the live tag guide and affected Base
filters before recommending tag changes. Preserve functional plugin tags and report stale folder
filters or compatibility lists separately from note-metadata problems.

For template findings, distinguish active templates from archived subfolders and inspect current folder
rules. An automatic-template failure requires a creation test and inspection of the device-local
execution switch; configuration alone does not prove insertion. Propose tests separately if they
would create temporary notes, because this audit is read-only.

### LLM Wiki quality

Within the confirmed topic/date/sample, check:

- catalog entries that do not resolve;
- managed wiki pages missing from root `index.md`;
- raw sources missing required catalog entries;
- claims lacking schema-required citations;
- contradictions between pages that were both read;
- claims plausibly superseded by a newer cited source;
- missing cross-references supported by actual related content.

Contradiction and staleness checks are bounded investigations, not whole-vault guarantees.

### Statistics

Report reproducible counts by the schema's actual categories, including Knowledge and Journal, plus
Inbox size, unresolved links, and notes in the selected scope. Counts provide context; do not convert them into arbitrary health grades.

## 4. Report findings

For each finding include:

- severity: high, medium, or low;
- confidence: verified, sampled, or candidate;
- path and evidence;
- violated canonical or local rule;
- impact;
- recommended action.

Order by impact, then confidence. Include checks passed, checks skipped, and scope limitations. If no
verified issue exists, say what was checked rather than declaring the entire vault healthy.

## 5. Offer fixes without applying them

Group safe proposals, but let the user select individual items. Before any later mutation:

1. read affected files again;
2. show exact moves or content changes;
3. explain link/index consequences;
4. obtain explicit approval per destructive action;
5. use the `vault` safe-write rules;
6. verify the result.

## References

| Priority | Load when | Reference |
| --- | --- | --- |
| 1 — High | Auditing PARA classification or explaining why a note belongs in a category | `references/para-rules.md` |
