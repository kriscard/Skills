# Tailwind skill: patterns-first refinement

## Approved direction

The user approved recording this change and then implementing it:

- Teach good, reusable patterns rather than organizing guidance around Tailwind versions.
- Use Tailwind v4 for concrete examples and current tooling decisions.
- Mention an installed version or capability only when it materially changes correctness or compatibility.
- Learn from Campsite, Dub, official documentation and the cited notes without copying their historical setup or imposing their conventions.
- Keep the entrypoint lean; useful conditional examples should replace shallow/repeated prose, not become an API catalog.

## Baseline and boundaries

- Worktree: `/Users/kriscard/.herdr/worktrees/Skills/feat-tailwind-skill`.
- Starting commit: `8555660c12a270ace137ad8c214da57b5b47e3db`.
- Allowed source changes: `skills/dev/tailwind/**` and this requested `plan.md`.
- Preserve frontend ownership of design, semantic roles, responsive policy and accessibility; preserve React ownership of component APIs/state. Show concrete Tailwind-facing seams rather than generic deferrals.
- No mandatory CVA, Tailwind Variants, `cn`, `tailwind-merge`, class sorting, Storybook, color space, folder layout, or unrestricted/forbidden `className` policy.
- No repository dependency additions or changes to other skills/catalog rows.
- Implementation and verification are complete. The user subsequently authorized committing and pushing this refinement to PR #13 for review. Merge requires separate explicit approval.

## Research basis and honest limits

The complete captured conversation contains three exchanges: Refactoring UI synthesis, modern Tailwind v4 resources, and independent engineering practices. All 50 visible URL IDs have resource reviews; a canonical homepage alias and two moved maintainer documents are recorded explicitly.

Research and source mappings: `/tmp/pr13-exact-conversation-audit/`.

Collapsed citation lists remain unenumerated. Do not claim every hidden note was read. Implement only the approved patterns already supported by accessible primary/maintainer evidence. Public book material is not the complete paid book. Proposed browser/accessibility checks are not completed evidence.

Pinned Campsite/Dub snapshots provide pattern evidence, not a mandate to retain their Tailwind v3 configuration, dependencies, optical tweaks, or directory organization.

## Implementation

- [x] Refocus the root on implementation choices and observable outcomes, with v4 examples and conditional installed-contract checks. Keep it at or below its current 106 lines.
- [x] Remove version matrices, patch-specific release history and migration-first organization from the ordinary workflow. Retain only necessary compatibility guidance for explicitly affected projects; do not silently upgrade them.
- [x] Preserve complete literal class choices; add a compact interacting-variant/compound example without requiring a new library.
- [x] Repair the independently found font-weight conflict so each public `ActionButton` tone/density pair selects exactly one weight utility.
- [x] Demonstrate explicit styling/override ownership. Join-only composition and deliberate compatible conflict merging are alternatives. Do not promise protected tone/focus styling while granting arbitrary same-element class overrides.
- [x] Demonstrate parent layout versus primitive appearance and multi-part coordination where useful, without requiring wrappers or a universal slot API.
- [x] Add a real container-responsive example with long-content handling, plus the complete runtime CSS-variable path. Keep direct style as the simpler one-property alternative.
- [x] Keep semantic runtime aliases, theme sharing and component source visibility distinct. Source paths are relative to their containing stylesheet.
- [x] Style actual native/primitive data and ARIA state, with explicit limits around disabled behavior, names, focus and keyboard ownership.
- [x] Place failure checks beside the patterns. Split the former 299-line component reference by user intent rather than blindly appending material.
- [x] Update routed filenames/links and keep citations tied to actual claims. Leave unsupported ecosystem/tool adoption out.
- [x] Add only a conditional root pointer to the existing `test` owner when authoring tests; keep runner/setup rules in that owner.

## Verification

- [x] Format changed Markdown and run `pnpm run validate` plus `git diff --check`.
- [x] Compile concrete examples with an actual Tailwind v4 toolchain in disposable fixtures outside the repository. Record exact package versions in receipts, not as general patch-lock guidance.
- [x] Assert generated classes for finite/compound choices, runtime variables, state variants, themes, external source registration and container rules; retain a negative dynamic-fragment and missing-source case.
- [x] Typecheck concrete TypeScript/React examples. No merge helper is implemented, so merge-runtime testing is not applicable.
- [x] Run the original frozen realistic output cases once: A failed because its generated negative assertion misplaced `@ts-expect-error`; B initially failed because the verifier bootstrap omitted DOM cleanup; C and D passed. The original generated fixtures remain preserved. Parent cleanup-control evidence shows unchanged B output passes 14/14 when the verifier bootstrap owns `afterEach(cleanup)`. Fresh post-repair A/B/C/D each ran once and passed; see `/tmp/pr13-pattern-first-repair-review.md`.
- [x] Independently review the frozen candidate and preserve failures. The original review correctly failed the source font-weight conflict. The repaired candidate passes source/readiness and fresh strict A/B/C/D checks without editing generated answers or resampling; companion-owner loading retains the low-severity qualification below.
- [x] Add a focused red/green regression using the exact public `ActionButton` surface and actual Tailwind v4 CSS for all four tone/density pairs.
- [x] Distinguish generated-CSS/type/runtime proof from real browser, assistive-technology and end-to-end proof. Do not claim the latter without running it.
- [x] Record changed paths, root/reference sizes, evidence paths and remaining limitations here before handoff.

## Outcome

Implemented the pattern-first skill, fixture-backed author checks, and the independent-review repair. The root is 96 lines. Reference sizes are: build/debug 117 lines, compatibility/migration 115, component patterns 221, responsive/runtime 120, theme/sources 117, and utilities/custom CSS/motion 121. `v4-configuration-and-sources.md` and `version-and-migration.md` were replaced by intent-routed references.

Changed source paths are `plan.md`, `skills/dev/tailwind/SKILL.md`, and all files under `skills/dev/tailwind/references/` (three existing references rewritten, two old references deleted, and three references added). Original author evidence remains under `/tmp/pr13-pattern-first-author/`. Focused repair evidence is under `/tmp/pr13-pattern-first-repair-author/`; the repair report is `/tmp/pr13-pattern-first-repair-author.md`.

Tailwind 4.3.3, `@tailwindcss/cli` 4.3.3, TypeScript 5.9.3, and React types 19.2.2 were
used in disposable fixtures only; repository dependencies were unchanged. Type checks, runtime assertions, generated-CSS positive controls, dynamic-fragment negative control, and missing-source negative control passed. The repair fixture demonstrates the original `danger:compact` conflict red against actual v4 CSS and the corrected exact public component green for all four pairs.

The original frozen A negative assertion still has its generated `@ts-expect-error` placement failure and was not edited. Original B output is also preserved; `/tmp/pr13-pattern-first-B-cleanup-control.json` shows its unchanged suite passes 14/14 with verifier-owned cleanup. The final independent report, `/tmp/pr13-pattern-first-repair-review.md`, accepts the repaired source and all four fresh frozen outputs. Evidence is under `/tmp/pr13-pattern-first-repair-independent/`; its before/after source manifests match. The reviewer documented three fixture-binding corrections without changing generated code or rerunning model samples.

One low-severity limitation remains: companion-owner advertisements were available, but the fresh samples did not read the frontend/React/test/TypeScript companion bodies. Their concrete outputs passed; this does not establish reliable companion loading. No real-browser, assistive-technology, or end-to-end result is claimed. Hidden citation lists remain an explicit source-access gap. Historical failures remain preserved.

Only this plan's completion metadata was finalized after independent review; the tested Tailwind source remains unchanged. Implementation is complete and verified. Commit and push to PR #13 are authorized for review; no merge is authorized.
