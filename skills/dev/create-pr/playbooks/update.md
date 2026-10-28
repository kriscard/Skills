> **Read this when:** a matching PR exists, an update is requested, or a creation result is uncertain.

# Reuse identity; reconcile before retrying

1. Read the known PR URL/number, or discover candidates in the base repository and match full
   head repository/owner/branch and base. Paginate if results may be capped; inaccessible or
   ambiguous results are not absence. Closed/merged PRs need an explicit next-action decision.
2. For a creation-only request with an exact open PR, return its URL/state unchanged. Otherwise
   confirm the requested fields/actions and read current content immediately before editing.
   Preserve unrelated human changes, required markers and existing draft/ready state. Retargeting,
   review requests, uploads or state changes are not implied by a description update.
3. Recheck refs and affected evidence. For an authorized title/body update, use the PR identity:

   ```bash
   gh pr edit "$pr_url" --repo "$base_repo" --title "$title" --body-file "$body_file"
   ```

   Read/edit is not atomic: reconcile moving content and coordinate with known concurrent editors,
   or use a supported conditional API. Never overwrite a human's newer work silently. Hand code
   fixes to `implement`/`code-review` within granted scope; do not start a new repair loop here.
4. Read back identity, refs/OIDs, state and intended changed fields. On timeout or non-zero exit,
   inspect the known URL or reconcile by full identity **before** another mutation. Creation or
   some uploads may have succeeded. If readback is unavailable, report uncertain/partial effects
   and stop; another attempt needs an explicit bounded retry grant.

With CLI, `gh pr view` takes a URL/number/branch, not `--head`. `gh pr list --head` takes a branch,
not `owner:branch`; filter candidate results by full identity and account for limits. Readback fields
include `url,state,isDraft,title,body,baseRefName,baseRefOid,headRefName,headRefOid,headRepository,
headRepositoryOwner` in supported versions. Inspect local help if uncertain; do not fabricate access.

Complete when the existing PR is returned unchanged, its authorized update is verified, or the
known effects and blocker are reported. A non-zero exit or a printed URL is not the whole verdict.
