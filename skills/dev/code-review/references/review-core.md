> **Read this when:** performing any code review; this is the shared authority for evidence acquisition, judgment, and reporting.

# Review core

## Pin the packet

Record goal, repository/worktree, included and excluded paths, comparison/snapshot identity,
requirements, applicable rules, real callers, tests/configuration, selected references, permitted
checks/effects, roles, maximum rounds, and time/cost budget. Keep full receipts outside the source
tree when permitted; expose only bounded, relevant evidence to reviewers. Include file modes,
renames, deletions, binary/submodule changes, and diff truncation limits in coverage.

### Comparison pinning

- For a PR, acquire title/body, URL, linked issues, files, commits, `baseRefOid` and `headRefOid`
  using the platform's read API (for example `gh pr view <pr> --json
  title,body,url,baseRefName,headRefName,baseRefOid,headRefOid,commits,files`). Cross-repository PRs
  require the correct repositories/objects, not a same-named local branch. Resolve the objects
  locally when available. Fetching missing objects requires the agreed network/write authority.
- For branches, resolve the supplied base/head with `git rev-parse --verify '<ref>^{commit}'`.
  If base is omitted, use explicit project guidance or the remote default branch (for example
  `git symbolic-ref --short refs/remotes/origin/HEAD`), and validate it. If neither resolves,
  ask rather than guess. A stale local remote-tracking ref is not proof of the current remote.
- Compute `git merge-base --all <baseSHA> <headSHA>` and require one merge-base. Inspect the complete
  `git diff --no-ext-diff --no-textconv --binary <mergeBaseSHA> <headSHA>` and
  `git log <baseSHA>..<headSHA>`; enumerate paths independently of a platform's possibly capped
  file list. Record merge-base semantics. A requested direct two-point comparison uses the two
  exact SHAs instead; state that choice. Multiple merge-bases require an explicit comparison
  decision rather than silently selecting one.
- Prefer immutable-object evidence over `gh pr diff` alone. If only mutable platform diff APIs
  are available, read base/head metadata before and after capture and before the final report;
  require equality and retain the diff receipt. If they change, discard the affected verdict
  and reacquire within budget. If consistency cannot be established, mark the comparison blocked.
- Read surrounding files, callers, rules, and tests at the same pinned revision, for example via
  `git show <headSHA>:<path>`. Record base versions where needed to establish introduction.
  Revalidate PR metadata or named refs at handoff and final reporting. Historical findings can
  remain valid for their SHA, but they cannot establish readiness of a changed head/base.
- Empty verified diff: report `no changes in this comparison` and exit. No reviewer fanout.

### Local snapshots

- Capture `git status --porcelain=v1 -uall`, `git rev-parse HEAD`,
  `git diff --cached --no-ext-diff --no-textconv --binary`, and
  `git diff --no-ext-diff --no-textconv --binary`. Read in-scope untracked files separately;
  neither diff includes them. Preserve staged and working versions, even if edits cancel in
  `git diff HEAD`. Do not stage, stash, reset, or create a commit merely to review.
- Make an immutable packet in an approved private location: retain the captured diffs, selected
  bytes, and a manifest of path/content hashes, modes, symlink targets, HEAD and index identity.
  Include governing instructions and relevant callers/config/tests, not only changed hunks.
  Capture manifests before and after reading; require equality. A hash without retained bytes
  is only a drift detector, not a reviewable snapshot. Avoid collecting secrets or unrelated files.
- Review retained bytes or a frozen, authorized checkout. Recheck the manifest at each handoff,
  after repairs, and before reporting. Drift invalidates affected evidence. A live diff command
  or branch label alone is insufficient for another reviewer to reproduce the packet.
- For selected code without a change baseline, pin the selection and context and label findings
  `existing/selected-code`; do not claim the selected defects were introduced by a diff.

### Governing rules and requirements

Read root and every applicable nested `AGENTS.md`, `CLAUDE.md`, and `REVIEW.md` through each path's
parent. Follow their scope/precedence and linked coding/contribution rules; do not apply a sibling
package's conventions indiscriminately. Map each path to governing rules, generation/vendor status,
and inclusion/exclusion reason. Excluded/generated paths remain explicit coverage limits; inspect
source generators, lockfile/runtime effects, or consumers when their change presents real risk.
Conflicting applicable rules need resolution, not a silent preference.

Locate origin requirements from the user, PR body/linked issue, issue references in commits, and
explicit or demonstrably matching `docs/`/`specs/` artifacts. An issue number or branch name is not
a requirement. Retain source/version and a requirement-to-code map. If inaccessible, record the
failed read and available partial source; continue Risk and Standards. Mark unavailable Spec
coverage, never fabricate compliance or demand tracker installation to provide a useful review.

## Review all axes

Each reviewer inspects every applicable axis; keep axis evidence separate even when one defect
crosses them. Read whole affected contracts and real callers, not just the diff.

### Risk and structural quality

Trace realistic inputs through guards, types, validation, transactions, concurrency, recovery,
cleanup, persistence, and deployment. Inspect security (attacker → trust boundary → asset/sink),
correctness/data loss, reliability, performance, compatibility, and structural quality. Follow
schema/API/dependency/config changes through rollout, migration, rollback, and existing consumers.
A missing test is a coverage gap unless a requirement or concrete unprotected risk makes it a finding.

Challenge added layers, state, branches, helpers, policy placement, and caller obligations:

1. Name the responsibility, public contract, callers, and constraints.
2. Show what callers must know: ordering, representation, recovery, configuration, lifecycle,
   duplicated policy, or coordination. Trace a representative change across actual call sites.
3. Compare the implementation with a concrete simpler alternative. What knowledge, branch, layer,
   or responsibility disappears? What complexity moves elsewhere? Preserve trust, ownership,
   deployment, and genuine variability boundaries. A useful abstraction can be worth keeping.
4. State benefit, cost, compatibility, and an observable quality criterion. A demonstrable
   structural cost may warrant correction without a runtime incident; label it structural,
   not a fabricated bug. Personal taste, line count, pattern names, or imagined future reuse
   alone cannot block. If evidence is insufficient, keep it optional or discard it.

### Standards

Apply only documented governing rules; cite file and exact rule. Project policy outranks generic
review heuristics within its scope, not security facts or higher authority. Passing automation is
reported as tooling evidence rather than duplicated findings, unless bypassed or an audit requests
it. Unrun automation is not a pass. Separate preferences and structural heuristics from violations.

### Spec

Map every sourced requirement to `implemented`, `partial`, `missing`, or `not verifiable`, with code
and proof level. Static implementation is not observed behavior. Cite the requirement for each
candidate. Unrequested work is a finding only with concrete risk or a violated scope requirement.
Absent spec: `not run — no spec available`; partial sources produce partial coverage, not a full pass.

## Select specialists from changed evidence

Discover installed skills and inspect their invocation policy before invoking. Apply matching
version-aware mechanics within this review's read-only boundary. If missing/user-only, use repository
contracts, installed types/docs and primary documentation, or request user invocation when needed.
Specialist conventions do not become repository standards merely because a skill was loaded.

| Changed surface | Lens to load when available and model-invocable |
| --- | --- |
| Browser UI or backing service/data path | [Frontend/full-stack risks](frontend-risk-checks.md); `frontend` |
| React props, hooks, state, effects, hydration | `react` |
| Next.js routes, actions, server/client or cache boundary | `nextjs-app-architecture`, matched to installed version; distinguish its architectural preferences from required mechanics |
| Type modeling, assertions, runtime narrowing | `typescript`; `zod` only for actual Zod contracts |
| Query cache/mutations, RHF forms, Tailwind generation | `tanstack-query`, `react-hook-form-audit`, `tailwind` respectively |
| Module depth, seams, ownership, caller burden | `codebase-design`; `architect` for consequential cross-system choices |
| Test evidence or browser suite | `test`; `playwright` for Playwright suites, `msw` for interception; `agent-browser` for authorized one-off observation |
| Native/mobile, database, language, infrastructure | Matching installed specialist, not browser assumptions |
| Agent instructions or prose within the change | `writing-for-agents` (including skill mechanics for skills), or matching prose reviewer |

## Independence and budgets

Use **two independent read-only reviewers**, each with the same pinned packet and all applicable
axes, only when delegation is authorized and the host supports it. This count is workflow policy,
not a finding from external sources. Discover the executor's actual controls; no native subagent
API is assumed. Give fresh contexts goal, revision, rules, selected references, callers, allowed
tools/effects, checks, budget, stop conditions, and result schema. Do not expose each other's first
findings. Read-only must constrain shell/platform effects too, not just remove editing tools.
Record actual role/session/model configuration when observable; mark unknown identities unknown.
Never substitute a prohibited model or executor.

Without authorized/capable agents, run useful sequential Risk/Standards/Spec and structural passes
with separate notes, label them self-review, and report the independence gap. If independent review
is a hard requirement, the result remains blocked pending authority/capability or a user-approved
reduction. Do not spawn workers to repair an unavailable-worker problem. Stop at the agreed round
and time/cost limits; no endless consensus or verifier chain.

## Validate and adjudicate

A surviving candidate needs a precise location, realistic path/caller, concrete consequence or
structural cost, evidence, and smallest safe correction/alternative. Check counterevidence: existing
guards, sanitizer configuration, types, fallbacks, transactions, conventions, and real constraints.
Establish whether it is introduced, directly relevant pre-existing, or selected-code-only. Prefer
silence to speculation; label unresolved hypotheses as questions/evidence gaps, not findings.

Use one severity and a separate confidence per finding:

- **P0 — Critical:** imminent/widespread severe compromise, irreversible data loss, or core outage;
  reserve for supported urgency, not every security or build issue.
- **P1 — High:** concrete serious correctness, security, reliability, or critical requirement failure
  that should block acceptance.
- **P2 — Medium:** meaningful but bounded correctness, accessibility, performance, UX, or structural
  cost worth addressing; blocking depends on the accepted criteria, not category alone.
- **P3 — Low:** limited impact or exact minor project-rule violation; normally non-blocking.
- **Confidence:** high (complete trace or decisive observation), medium (supported path with named
  uncertainty). Low-confidence conjecture belongs in questions, not a scored finding.

Static reasoning can justify a finding. Label evidence `static`, `executed test`, or `observed
integration/browser/process`, with actual command, revision, environment, result, and receipt when
executed. Never invent runtime proof, equate a screenshot with keyboard access, or a unit/mock pass
with an integration pass. Performance needs measured or structurally demonstrated cost, not slogans.

The lead deduplicates root causes while retaining affected axes, and checks each against source,
real callers, requirements, and concrete alternatives. Agreement is not proof. Keep a decision ledger:

| Decision | Meaning |
| --- | --- |
| Act on | Accepted correction within the authorized scope; in review-only, recommendation only |
| Consider | Valid optional alternative/trade-off; not a mandatory fix |
| Noted | Relevant context, pre-existing issue, or evidence limitation without current correction |
| Dismissed | Candidate disproven, duplicate, outside scope, or preference; retain reason/counterevidence |

Resolve consequential intent/contract disputes with the user. A finding's acceptance does not grant
write authority. Reviewers propose; the authorized author repairs.

## Report contract

Return a concise report with expandable receipts, not raw agent dumps:

1. **Scope and revision:** repository, exact base/head/merge-base or snapshot manifest, comparison
   semantics, included/excluded paths, and any drift.
2. **Quality conclusion:** concrete structural assessment and alternatives, or why current shape
   fits real callers. Keep optional suggestions distinct from blockers.
3. **Risk / Standards / Spec:** severity-ordered findings with ID, location, primary/cross axes,
   confidence, reachable impact, evidence label, correction, and decision. For Standards cite the
   rule; for Spec cite requirement and coverage counts. Represent all axes even when empty/unavailable.
4. **Adjudication:** accepted/optional/noted/dismissed decisions with reasons; distinguish relevant
   pre-existing findings from regressions. A no-findings result names inspected paths and callers.
5. **Verification and roles:** actual commands/results/receipts, static versus observed coverage,
   reviewer identities/independence limits, and (for a loop) verifier and lead evidence audit.
6. **Status and gaps:** `review complete — not independently verified`, `full loop ready`, or
   `blocked`, qualified by revision and exact residual risks/next user decision. Neither a local
   readiness claim nor absence of blockers submits platform approval or authorizes merge.

Recheck revision/snapshot before the report. Stale evidence can be reported historically, never as
current readiness. Keep platform state unchanged unless separately authorized.
