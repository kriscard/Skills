---
name: analyze-repo
description: Generate an evidence-backed visual architecture and technical-debt audit for an entire repository.
disable-model-invocation: true
---

# Repository Analysis

Produce a standalone HTML audit that makes the repository's architecture,
dependency pressure, and highest-impact debt visible. Every claim must trace to
measured output or named files; uncertainty stays explicit.

## Workflow

### 1. Build the evidence ledger

Inspect repository guidance and the environment before choosing commands. Exclude
generated, vendored, cache, and dependency directories from source metrics.
Collect:

- repository shape: source files, languages, top-level modules, entry points
- organization: feature/layer/package ownership and whether the directory layout
  matches the runtime and domain model
- composition: how modules collaborate, where interfaces and seams live, and
  whether complexity is concentrated or repeated across callers
- architecture: runtime boundaries, data flow, persistence, external systems
- dependencies: high fan-in modules, dependency direction, seam violations, and
  cycles when tooling can verify them
- patterns: established frontend, backend, integration, state, persistence, and
  design patterns; competing implementations and incomplete migrations
- hotspots: large or complex files, mixed responsibilities, TODO/FIXME clusters
- decisions: existing ADRs and consequential choices whose rationale is absent
  from repository documentation
- verification: test locations, test runner configuration, coverage artifacts,
  and CI checks

Use deterministic commands or project tooling for counts and graph claims. Record
an evidence ledger with these fields:

| Field | Requirement |
|---|---|
| Claim | One falsifiable statement |
| Evidence | Command output, configuration, or exact file/module paths |
| Method | How the evidence was collected |
| Confidence | `verified`, `supported`, or `unverified` |

Coverage is a measured value only when a coverage artifact or executed coverage
command provides it. Otherwise report test signals and label coverage `Not
measured`.

Load `references/architecture-decisions.md` when consequential architecture is
present. Search existing ADRs and design docs before calling a decision
undocumented. Record observed choices separately from inferred rationale; missing
business constraints remain questions, not findings.

Delegate broad repository exploration through the available subagent mechanism
when useful. Give the explorer the ledger schema and require specific paths for
every non-empty category. The parent agent owns verification of returned claims.

Done when every candidate finding has evidence and a confidence label.

### 2. Synthesize findings

Load `references/codebase-design.md` and use its terms consistently. Assess
modules through their interfaces, implementations, seams, adapters, depth,
leverage, and locality. Reserve *boundary* for a domain or deployment boundary;
use *seam* for a place where behavior can vary.

Group verified evidence into `architecture`, `organization`, `composition`,
`dependencies`, `patterns`, `hotspots`, `decisions`, and `verification`. Identify
established frontend/backend patterns before treating variation as inconsistency.
Merge duplicate symptoms that share one root cause. Rank findings by:

1. production or security risk
2. change amplification and defect risk
3. developer friction and onboarding cost
4. low-urgency cleanup

Each finding must name the affected scope, explain its impact, and recommend a
bounded next action. Separate observed facts from interpretation. Apply the
deletion test to suspected pass-through modules, and call a seam real only when
multiple adapters or another demonstrated variation justify it.

For consequential undocumented choices, add an **ADR candidate** rather than
inventing rationale. Link recorded decisions to their existing ADR. Hand an
unresolved candidate to the `architect` skill to compare options and recommend a
decision; draft the ADR only after that decision is resolved and the user asks
for the durable artifact.

Done when the top findings are evidence-backed, use the shared vocabulary,
distinguish established patterns from accidental variation, and are ordered by
impact.

### 3. Choose the visualization

Every report needs an architecture visualization, but no renderer is mandatory.
Choose the smallest format that communicates the evidence:

- **Inline SVG:** preferred for a curated architecture, data-flow, or hotspot
  diagram. Load `references/svg-patterns.md`.
- **Zoomable diagram:** use when labels or edges cannot remain legible at report
  width. Load `references/diagram-shell.md`; its shell accepts inline SVG,
  including SVG pre-rendered by a graph tool.
- **HTML/CSS structure:** use for a simple layer stack or small relationship map
  that needs no freeform edges.

Generated report text must be HTML-escaped. SVG text and attributes must be
XML-escaped. If a graph renderer is used, encode labels for that renderer before
rendering and embed the resulting SVG rather than repository-controlled markup.

Done when the chosen visualization exposes real repository boundaries and every
highlighted problem maps to a finding.

### 4. Generate the report

Read these references before writing:

1. `references/codebase-design.md`
2. `references/report-design-system.md`
3. `references/report-components.md`
4. `references/html-report-template.md`
5. `references/architecture-decisions.md` when ADRs or ADR candidates exist
6. the visualization reference selected in Step 3

Assign the path once and reuse it:

```bash
REPORT_PATH="${TMPDIR:-/tmp}/repo-analysis-$(date +%Y%m%d-%H%M%S).html"
```

The report must contain:

1. repository identity, analysis date, scope, and one-sentence assessment
2. measured summary with provenance and explicit unknowns
3. architecture visualization and explanatory caption
4. module-design assessment using the shared vocabulary
5. ranked findings with severity, confidence, evidence, impact, and next action
6. decision record linking existing ADRs and listing qualified ADR candidates
7. hotspot/file tour focused on the evidence, not an exhaustive file list
8. prioritized recommendations and a verification checklist

Done when the file exists, contains no unresolved template variables, and every
finding rendered in the report has a matching ledger entry.

### 5. Render-check and deliver

Open the report through available browser automation when possible; otherwise use
the platform opener (`open`, `xdg-open`, or `start`). Inspect the rendered page at
desktop and narrow widths. Verify:

- no script, style, font, or network errors are required for core content
- architecture labels, edges, legends, and captions remain legible
- tables/cards do not overflow or hide evidence
- keyboard focus is visible on interactive controls
- light and dark color schemes preserve contrast
- zoom controls, when present, keep the caption outside the clipped viewport and
  work at maximum zoom and every pan extreme

Fix failures and repeat the check. Deliver the report path and summarize the top
3–5 findings with their confidence. Offer a follow-up architectural grilling
session; begin it only when the user opts in.

## Completion Gate

The analysis is complete only when:

- every reported claim has evidence and a confidence label
- organization, composition, and established frontend/backend patterns were
  inspected using the shared codebase vocabulary
- consequential choices link to an existing ADR, qualify as an ADR candidate, or
  state why no decision record is needed
- coverage and complexity are measured or explicitly marked unmeasured
- the report contains a renderer-appropriate architecture visualization
- repository-controlled text is encoded for its output context
- the rendered report passes desktop, narrow-width, and diagram checks
- the top 3–5 findings are ranked by impact and surfaced to the user

## References Routing Table

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Assessing organization and module design | `references/codebase-design.md` |
| 1 — Required | Generating any report | `references/report-design-system.md` |
| 1 — Required | Building report sections | `references/report-components.md` |
| 1 — Required | Assembling the final HTML | `references/html-report-template.md` |
| 2 — Conditional | Existing ADRs or consequential undocumented choices appear | `references/architecture-decisions.md` |
| 2 — Conditional | Rendering a curated inline SVG | `references/svg-patterns.md` |
| 2 — Conditional | The diagram needs zoom or pan | `references/diagram-shell.md` |
