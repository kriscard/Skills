---
name: analyze-repo
description: >-
  Spawns an Explore subagent to map architecture, layers, dependencies, and
  tech debt hotspots across the entire codebase, then generates a visual HTML
  report with a Mermaid architecture diagram and opens it in the browser.
  Finishes with a targeted grilling loop on the findings. Make sure to use this
  skill whenever the user says "analyze my repo", "what's wrong with my
  codebase", "architecture review", "technical debt audit", "how is this
  codebase structured", runs /analyze-repo, or asks for any codebase-level
  assessment — even phrased casually like "take a look at how this is organized".
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

### Step 2 — Generate HTML Report

Write the report to:
```
$TMPDIR/repo-analysis-$(date +%Y%m%d-%H%M%S).html
```

See `references/html-report-template.md` for the full HTML template. The
report sections are:
1. Header — repo name, date, summary sentence
2. Summary cards — file count, language breakdown, top-level modules, test
   coverage estimate
3. Architecture diagram — Mermaid `graph TD` showing layers and key edges
4. Findings table — category, severity (critical/warning/info), description,
   recommendation
5. Top recommendations — ordered by estimated impact

### Step 3 — Open the Report

```bash
open $TMPDIR/repo-analysis-$(date +%Y%m%d-%H%M%S).html
```

Run immediately after writing the file. The path must match exactly.

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

## References Routing Table

| Need | Load |
|---|---|
| HTML template for the report, Mermaid diagram structure, CSS/JS CDN links | `references/html-report-template.md` |
