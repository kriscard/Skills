> **Read this when:** evaluating invocation, reference routing, authority gates or repair-return behavior after editing this skill.

# Routing cases

These are evaluation inputs and expected decisions, **not claims of executed agent runs**.
Use a fresh host session with this skill loaded when tools and authority permit. Otherwise
walk the routes sequentially and label that limitation. Observe selected references, next
action, write set and stop/return point; keyword presence alone does not prove behavior.

| Case/input | Expected route and observable decision |
|---|---|
| User says implement `docs/specs/export/`; all files/hash values and current stage receipts match | Intake → approved-spec → one outcome. Verify decision identities and bytes, audit `R/D/T/V`, select an unblocked `T`, then capture actual `V` evidence. Approval without an implementation instruction still stops. |
| Same artifacts, but plan bytes changed, one decision is from another slug, or receipt is unavailable | Approved-spec gate blocks before edits; identify stale hash or unverifiable identity and ask for current approval. Never rewrite approval in implement. |
| Jira URL with no authenticated access | Intake names the inaccessible source, asks for pasted/exported content and stops; no guessed title, acceptance or access. |
| Retrieved clear authorized ticket: change a private label, known behavior/no design fork | Intake → feature; direct small execution with relevant checks. No ceremonial spec, invented artifacts or automatic commit/issue update. |
| New cross-module cache API with undecided expiry/concurrency/failure semantics | Feature → design-fit and applicable architecture/interface specialist. Show caller-essential unknowns before the body, ask user to invoke spec and stop. Never call user-only spec. |
| Current code-review coordinator assigns an accepted local repair with paths/checks/budget | Intake marks repair-return → appropriate outcome → evidence → return to coordinator. No automatic review call, new reviewer or recursive repair cycle. |
| Multi-task approved plan, host has read/write/shell but no agent tools | Select dependency frontier and execute sequentially within authority. Report no independent pass; block only an actually required independent gate. No invented tools or backend. |
| Browser acceptance with mocked component tests but no safe running browser/service | Select relevant frontend/test guidance; retain lower-level results as support, report real-surface proof blocked, not verified. |
| Migration finds an external old-client output still required | Migration retains compatibility until approved retirement proof; no automatic legacy deletion or scope expansion. |
| Request is only to recommend a plan; or execution discovers a required out-of-scope file | Recommendation stops without edits; drift stops before the new path and asks for planning/authority. |

For each run retain the prompt, available tools/skills, actual loaded references, decision,
mutations, evidence and deviations in an approved private receipt. A self-walkthrough is
not an independent routing evaluation.
