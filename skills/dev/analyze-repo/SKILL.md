---
name: analyze-repo
description: >-
  Full-repo visual architecture and tech-debt audit. Spawns an Explore subagent
  to map layers, dependencies, hotspots, and patterns across the entire codebase,
  then generates an HTML report with a Mermaid architecture diagram and opens it
  in the browser. Use for full-repo audits such as "analyze my repo", "what's
  wrong with this codebase", "technical debt audit", or "how is this codebase
  structured". Do not use for single design decisions, PR review, or small
  refactors.
user-invocable: true
---

# Repo Analysis

Visual, end-to-end codebase audit. The core insight: seeing architecture
diagrammed (layers, data flow, dependency density) surfaces problems that are
invisible when reading file-by-file. This skill makes the invisible visible,
then asks the hard questions about what it found.

## Workflow

### Step 1 — Explore Agent

Use the Agent tool (`subagent_type="explore"`) to map the codebase. The Explore
agent has broad read access and should answer:

- **Architecture layers:** what calls what? Is there a clear separation
  (presentation → application → domain → infrastructure)?
- **File structure and organization:** does the layout match the mental model
  a new contributor would bring?
- **Key dependencies:** what's the dependency graph? Which modules are most
  imported? Any circular dependencies?
- **Tech debt hotspots:** files over 500 lines, modules with high cyclomatic
  complexity, areas with no test coverage, large TODO/FIXME density
- **Pattern consistency:** is one pattern used throughout, or do multiple
  competing patterns coexist (e.g., REST + GraphQL + tRPC in the same app)?
- **Language and runtime mix:** TypeScript? JavaScript? Both? Any orphaned
  migration artifacts?

Instruct the Explore agent to return structured findings in these categories:
`architecture`, `dependencies`, `hotspots`, `patterns`, `metrics`.

Done only when the returned findings include specific files/modules for each
non-empty category, not generic impressions.

### Step 2 — Generate HTML Report

Load `references/html-report-template.md` before writing the report. Assign the
path once and reuse it for both write and open:

```bash
REPORT_PATH="$TMPDIR/repo-analysis-$(date +%Y%m%d-%H%M%S).html"
```

Write the report sections:
1. Header — repo name, date, summary sentence
2. Summary cards — file count, language breakdown, top-level modules, test
   coverage estimate
3. Architecture diagram — Mermaid `graph TD` showing layers and key edges
4. Findings table — category, severity (critical/warning/info), description,
   recommendation
5. Top recommendations — ordered by estimated impact

Done only when `$REPORT_PATH` exists and contains a Mermaid diagram plus ranked
findings.

### Step 3 — Open the Report

```bash
open "$REPORT_PATH"
```

Run immediately after writing the file. The path must be the same `REPORT_PATH`
assigned in Step 2.

### Step 4 — Surface Findings and Grill

Present the top 3–5 findings in order of impact. Then enter a grilling loop:

- Ask **one targeted question at a time** about architectural decisions
- Surface trade-offs the user may not have considered
- Connect each finding to concrete impact (performance, maintainability,
  onboarding cost, deployment risk)
- Do not move to the next question until the current one is resolved

**Example grilling questions (adapt to actual findings):**

- "Your auth logic is spread across 4 modules. Is that intentional — do
  different callers need different auth behavior — or is this accidental
  duplication that's now inconsistent?"
- "You have 3 competing data-fetching patterns: raw `fetch`, SWR, and TanStack
  Query. What's the current standard? New contributors will guess wrong."
- "The `utils/` directory has 47 files. Is that a shared library or a junk
  drawer? Files that live there because they have nowhere else to go are
  tech debt in disguise."
- "Your largest file is 1,200 lines. Is that a god object, or a file that
  grew with the feature? Either way: what's the plan?"

## What Makes a Good Analysis

The Explore agent should be specific, not vague. Not "there are some large
files" but "these 5 files are over 500 lines: [list], and they appear to handle
more than one concern." Not "dependencies could be reviewed" but "module A
imports from module B which imports from module A (circular dependency)."

The report's value is in the Mermaid diagram showing the real dependency
structure and the findings table that forces prioritization. Both require
specifics from the Explore phase.

## Completion Gate

Do not call the analysis complete until:

- `REPORT_PATH` is assigned once and reused for write/open
- the HTML file exists and includes a Mermaid diagram
- the top 3–5 findings are ranked by impact
- at least one targeted follow-up question is asked

## References Routing Table

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Generating the HTML report | `references/html-report-template.md` |
