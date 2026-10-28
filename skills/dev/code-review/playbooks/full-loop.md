> **Read this when:** the user explicitly authorizes a bounded review → repair → verify loop, not merely a review.

# Authorized full loop

## 1. Agree execution

Record repository, allowed paths, preserved behavior/contracts, accepted quality criteria,
reviewer/model/executor policy, checks and real observation surfaces, permitted side effects,
maximum repair/review rounds, and time/cost budget. Missing consequential authority is a stop.
Discover actual tools and installed skill invocation policies. The coordinator remains here;
workers own their bounded stages. No worker is authorized merely because this document names it.

Use the [core](../references/review-core.md) to acquire either a PR/branch comparison or immutable
local snapshot, and complete its rules/spec/caller maps. The initial packet is done only when all
reviewers can inspect the same revision and context. Empty diffs exit without a repair loop.

## 2. Review and adjudicate

With authority and capability, obtain two fresh independent read-only all-axis reviews using the
core's packet and evidence gates. Challenge structural quality as well as risks and compliance.
The lead checks candidates and records Act on / Consider / Noted / Dismissed with rationale.
Only accepted findings inside the approved scope advance to repair.

Without agents, provide a useful sequential/self-review and explicit gaps. Do not rename self-review
independent. A required full loop remains blocked unless the user changes its independence criteria;
any reduced workflow must retain that limitation in its final status.

## 3. Repair and return

Give one authorized writer accepted findings, exact revision, allowed paths, preserved contracts,
observable quality improvements, checks, and remaining budget. Invoke installed `implement` only
if model-invocable and its contract supports this handoff. Set **repair-return mode**: perform only
the accepted bounded repair and checks, skip automatic `code-review`, and return the new revision,
changes, and actual evidence to the **current coordinator**. Do not launch another review coordinator
or recursive review/implementation chain. If the executor lacks that mode, give the explicit bounded
contract through an authorized alternative or report the capability gap; never assume it exists.

An author may simplify meaningfully within scope; wider migrations, new public contracts, disputed
design, or unapproved writes return to the user. Commit authority is separate from repair authority.
If no repairs are accepted, retain the current revision and continue required verification.

## 4. Re-pin and re-review

Capture the resulting base/head or complete snapshot, including relevant context. Invalidate affected
old findings/checks. Re-review repaired code and impacted callers against accepted correction criteria
and regression risks within the round limit. Failed or drifting work does not advance on an old pass.

## 5. Fresh verification

Use a fresh verifier distinct from the author **and from reviewers who proposed fixes**. Supply final
revision, requirements, rules, accepted quality criteria, required checks/real observations, bounded
receipts, permitted effects, and remaining budget, not the implementation deliberation transcript.
The verifier returns revision-bound pass/fail/blocked, exact commands/results and artifacts, tested
failure paths, structural/caller checks, and missing evidence. Tests that need mutable setup run only
in an authorized isolated environment. Unit/static success cannot stand in for a required real surface.
If a required fresh verifier or observation is unavailable, report the gap; readiness remains blocked.

## 6. Lead evidence audit

Read actual verifier commands, retained outputs, relevant tests/code, observation artifacts, and
revision. Check whether assertions derive expectations from the implementation, mocks bypass the
claimed boundary, checks target stale code, or failure/recovery paths are omitted. Verify structural
improvement at real interfaces/callers rather than by line count. A verifier's reassuring summary
is not evidence. Resolve gaps only within approved scope/budget; otherwise stop with exact gaps.

## 7. Report and stop

Revalidate the final revision and use the core report contract. `Full loop ready` requires every
agreed stage, accepted corrections and quality criteria, fresh independent verification, lead audit,
and no unresolved blockers, all bound to that revision. Report partial observations honestly even
when setup or cleanup failed. Stop on drift, unresolved design, unavailable capability, or exhausted
round/time/cost budget. Preserve work. Platform comments, commit/push, merge, release, and destructive
cleanup remain separately gated actions.
