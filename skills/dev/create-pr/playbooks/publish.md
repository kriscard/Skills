> **Read this when:** the user requests creation of a new GitHub PR.

# Inspect → write → check → publish → verify

1. **Inspect.** Read applicable guidance; check status, branch, remotes and full HEAD SHA.
   A PR includes published commits, not uncommitted files. Confirm the base repository/branch,
   source repository/branch and push destination; do not assume `origin` is upstream or the base
   is `main`. Use the user's choice, repository policy or actual remote default; resolve conflicts.
   Read the commit list and complete merge-base-to-head diff, including deletions/renames/binaries.
   Empty comparison exits. Missing objects, multiple merge-bases, unexpected history or a detached/
   unborn HEAD need a decision before publication; use special-cases guidance where applicable.
2. **Write.** Discover the applicable template on the target's default branch (root, `docs/`,
   `.github/`, including case variants and applicable default community files). Follow the
   description reference. Use supported authenticated tools; inspect CLI help only when behavior
   or syntax is uncertain. Query the base repo for an existing PR and match full head repo/owner/
   branch and base—not its title. A capped/failed lookup is not proof of absence. An exact open
   match switches to update/recovery; a closed/merged or different-base match needs a decision.
3. **Check.** Apply shared boundaries to scope, content, current proof, selected state and action
   grants. Show the target and intended actions; ask only for what is missing. If branch/commit/
   push work remains, follow its owner and re-pin the result. Verify any authorized normal push
   published the intended head OID. Never rely on an implicit push/fork prompt.
4. **Publish.** Recheck refs and duplicate status immediately before creation; reconcile any drift.
   Use explicit values and a private body file, not shell evaluation of PR text. For the usual
   same-repository draft:

   ```bash
   gh pr create --repo "$base_repo" --base "$base_branch" --head "$head_branch" \
     --draft --title "$title" --body-file "$body_file"
   ```

   Confirm variables first. Explicit `--head` avoids implicit push/fork behavior. Omit `--draft`
   only for a selected ready request with required prepublication gates satisfied. CI that starts
   on PR creation remains pending. `--dry-run` is not a read-only preview: it may still push.
5. **Verify.** Read the resulting PR by URL/number. Check base/head repository identities, refs/OIDs,
   open/draft state and intended title/body. A printed URL alone is insufficient; keep CI/review
   status separate. If creation failed, timed out or cannot be verified, use update/recovery before
   retrying. Default to one mutation attempt plus read-only reconciliation, not an unbounded loop.

Complete with the verified PR or known partial effects and blocker. Stop at the authorized action;
no automatic review-comment fixes, ready transition, merging or cleanup.
