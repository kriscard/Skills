> **Read this when:** defining proof, completing a unit, resuming work or reporting final results.

# Evidence that can falsify the claim

1. Name the acceptance or preservation claim, its source, consumer-visible observation
   point, expected result and meaningful failure/edge cases. For spec work retain `V`
   IDs and their `R/D/T` links. Compose `test` for behavioral evidence strategy and the
   matching runner/library specialist only where mechanics require it.
2. Run the smallest relevant baseline before changes when feasible. Verify each unit with
   focused checks, then run the affected broader tests, typechecks, lint, build and repository
   checks before finishing. Read commands from the repository; record actual exit status and
   decisive output. Diagnose failures instead of weakening assertions or snapshotting them away.
3. If acceptance concerns real browser, CLI, service, process, device or integration wiring,
   exercise the closest safe applicable surface that can falsify it. Green types, mocks and
   unit tests support but do not replace this observation. A pure parser/invariant may be
   fully observable through its public programmatic API; do not invent an unrelated E2E flow.
4. Use disposable fixtures or explicitly authorized state. Check side effects and cleanup
   before running. Missing credentials, service, browser or agent tools are a named proof
   gap, never a pass or permission to install/change infrastructure. Capture reproducible,
   redacted receipts; do not retain tokens, cookies, authorization headers or private payloads.
5. Inspect actual changed files and direct callers against scope and contracts. Bind receipts
   to the exact full head/base SHAs and expected evidence set when judging a committed
   comparison. For uncommitted work, record base SHA and an immutable patch/content snapshot
   identifier using an approved private location; distinguish it from a committed revision.
   Re-read revision identity before claiming readiness. Rebase, amend, changed base/lower stack
   layer, changed evidence set or post-check edits make the old verdict stale. Retain history
   and rerun affected evidence; never transfer a verdict because a diff looks similar.

## Completion report

Return to the user or assigned coordinator:

- Outcome and scope, changed paths, actual revision/snapshot and comparison base.
- Accepted requirements/design/task/evidence IDs when supplied; unresolved decisions.
- Exact commands/actions, expected and observed results, receipt paths, focused and broader
  check status, and failure-path/real-surface observations where applicable.
- Review provenance: independent, sequential/self-review, unavailable, or repair-return.
- Remaining risks, skipped/blocked evidence, residual debt and the next user-only decision.
- Actions **not** performed when material, especially commits or remote mutations.

Use `complete` only for the scope actually delivered with its required proof; `partial`
for unfinished authorized units; `blocked` for a missing decision/capability that prevents
completion. Separate implemented-but-unverified from verified. A list of planned commands,
a worker's self-report, or an old screenshot is not an executed observation.
