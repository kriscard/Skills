> **Read this when:** auditing where this execution design came from or why it differs from its inspirations.

# Provenance and deliberate choices

Primary repositories were fetched through GitHub API trees and raw files. The following
links pin the inspected revisions, not moving `main`. These are source claims and local
adaptations, not runtime dependencies or instructions to install those collections.

| Primary source | Observed source claim | Local adaptation or rejection |
|---|---|---|
| [Matt Pocock implement](https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/implement/SKILL.md) | Fetch and name tickets; use TDD where possible; run focused and full checks; invoke code-review; commit on current branch | Retain real ticket retrieval, focused-to-broad checks and canonical review ownership. Make TDD conditional and commits explicitly authorized. |
| [Matt Pocock implement-spec](https://github.com/mattpocock/skills/blob/59db609eb1e18aaf59b63284d0e52255aff0c63c/skills/engineering/implement-spec/SKILL.md) | Execute a dependency frontier via background implementers, integration branch/worktrees and merges; review, close work and clean up | Keep dependency-aware checkable tasks and sparse handoffs. Reject mandatory agents, integration branches, automatic merging/closure and worktree cleanup. Consume the local spec schema instead of requiring its tracker setup. |
| [pstack poteto-mode](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/poteto-mode/SKILL.md) | Outcome playbooks, direct artifact proof, prescribed agent/model topology and broad autonomy for reversible/external actions | Keep outcome routing and evidence discipline. Reject vendor/model defaults, function-boundary architecture ceremony, mandatory delegation, global leaf-principle dependencies and implied remote authority. |
| [Outcome-oriented execution](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-outcome-oriented-execution/SKILL.md) | Planned migrations may tolerate scoped reversible intermediate breakage at explicit verification boundaries | Permit this only when approved; never infer a right to break active contracts or disable checks. |
| [Sequence verifiable units](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-sequence-verifiable-units/SKILL.md) | Check a unit before advancing; order delivery so the evidence is replayable | Adopt per-unit evidence. Reject automatic rebase/commit/PR choreography; those need action authority. |
| [Prove it works](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-prove-it-works/SKILL.md) | Observe the actual artifact rather than proxies; prefer repeatable scripted checks | Match proof to the consumer-visible claim and record unavailable surfaces without claiming success. |
| [Migrate callers then delete legacy APIs](https://github.com/cursor/plugins/blob/c742dd61706fbacc1b95f1a20b7b988cf096ce6c/pstack/skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) | Coordinated internal API replacement applies when external compatibility is not needed | Adopt complete owned caller migration, but preserve genuine external compatibility and require retirement evidence before deletion. |

The local spec lifecycle supplies `R/D/T/V`, the three canonical artifacts, current-byte
SHA-256 checks and stage decision references. This skill consumes rather than reimplements
planning gates. Contract-first design, bounded current capabilities, meaningful failure,
complete bounded convention replacement, total caller/implementation burden, drift stops
and revision-bound evidence express the user's local delivery preferences. They are embedded
here as portable execution rules; no external mode, global principle skill, backend or
specialist installation path is required.
