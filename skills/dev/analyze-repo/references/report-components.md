> **Read this when:** constructing repository-analysis report sections. It
> defines audit-specific components adapted from Plannotator's explainer
> patterns.

# Report Components

Use only components that carry evidence or help prioritize action. Omit empty
sections and decorative cards.

## Assessment header

Include:

- repository name and analyzed revision when available
- date and analysis scope
- one-sentence assessment
- provenance note: commands executed, artifacts inspected, and important limits

The assessment is an interpretation. Keep measured facts in the summary strip.

## Summary strip

Use three to five metrics. Every metric has a value, label, and provenance or
state such as `Measured`, `From config`, or `Not measured`.

Good metrics include source files, primary language share, architectural
boundaries, verified cycles, and configured test suites. Avoid invented health
scores and coverage estimates.

## Architecture figure

Wrap the visualization in `<figure>` and provide a `<figcaption>` that states:

1. what the figure models
2. what edges mean
3. which evidence is intentionally omitted

Use a legend when color or line style carries meaning. Highlight at most three
hotspots; the detailed finding explains why each is highlighted.

## TL;DR

A compact bordered block with:

- the repository's dominant architectural shape
- the highest-impact risk
- the most valuable next action

A reader who stops here should still understand the audit.

## Module-design assessment

Summarize organization and composition with the vocabulary from
`codebase-vocabulary.md`:

- modules and the interfaces they expose
- important seams and the adapters that occupy them
- deep modules that provide leverage and locality
- shallow or pass-through modules supported by the deletion test
- frontend and backend patterns the repository consistently follows
- accidental variation or migration overlap, distinguished from deliberate
  alternatives

Tie every judgment to callers, dependencies, exports, tests, or runtime evidence.
Do not score architecture with a synthetic grade.

## Decision record

List consequential choices by evidence state: `Recorded`, `ADR candidate`,
`Needs context`, or `No ADR needed`. Link existing ADRs and flag implementation
drift when verified. For a candidate, show why it qualifies and what context
must be confirmed before drafting.

Missing documentation is not automatically a warning. Elevate it only when the
missing rationale creates demonstrated change risk or repeated uncertainty.

## Finding row

Each finding contains:

```text
Severity · Confidence · Category
Finding title
Observed: factual evidence and exact paths
Impact: why it matters
Next action: one bounded recommendation
Evidence: command, artifact, or path list
```

Severity meanings:

- **Critical:** demonstrated security/correctness failure or a boundary that
  blocks safe change.
- **Warning:** supported maintenance or defect risk without current breakage.
- **Info:** lower-urgency opportunity.

Confidence meanings:

- **Verified:** directly measured, executed, or traced.
- **Supported:** multiple concrete signals support the interpretation.
- **Unverified:** plausible but not confirmed; never present this as fact.

Do not raise severity merely because a file is large. Connect size to mixed
responsibility, change frequency, defects, or dependency pressure.

## Risk map

Use a compact matrix or chip list to show risk concentration by subsystem. Every
entry links to a finding ID. Use semantic labels in addition to color.

Suggested axes:

- likelihood of change
- blast radius
- verification strength

## Hotspot file cards

Use `<details>` for evidence-heavy files or modules:

- summary: path, role, and applicable finding IDs
- why it is a hotspot
- concrete evidence
- related dependencies or tests

Expand the highest-risk items initially. Keep mechanical or low-risk details
collapsed. This is a focused tour, not an exhaustive file list.

## Before / after boundary

When a recommendation changes ownership or dependencies, show two small diagrams
or ordered lists:

- **Current:** observed responsibilities and edges
- **Proposed:** the minimum boundary change

Label the proposed state explicitly; never render it as current architecture.

## Where to focus

List the top three to five review targets. Each target names the file, module, or
boundary and the question a maintainer should resolve. Prefer decision prompts
over generic advice.

## Verification checklist

End with checkable follow-up work derived from findings, for example:

- [ ] reproduce or measure the unverified claim
- [ ] add a boundary test before moving responsibility
- [ ] run the repository's existing checks
- [ ] compare dependency edges after the change

The checklist is not evidence that verification already happened.

## Recommendation sequence

Order recommendations by dependency and risk reduction, not estimated duration.
For each recommendation include expected impact, prerequisite, verification, and
rollback or reversibility when relevant. Do not include hour/day estimates.
