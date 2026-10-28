> **Read this when:** the PR involves a fork, stacked/unrelated history, ambiguous templates, maintainer-access changes or attachments. Read only the matching section.

# Handle only the case in front of you

## Forks and maintainer access

Identify the base repository and full head repository/owner/branch separately from the push remote.
A supported user-owned fork can use `--repo "$base_repo" --head "$head_owner:$head_branch"`.
The inspected CLI does not support an organization in that owner form; check installed capabilities
and use a documented authenticated alternative or return a prepared/manual handoff. Do not invent
API support, create a personal fork, push into the base repository or change permissions as a fallback.

Choose maintainer-edit access explicitly for forks. Without a grant, use supported
`--no-maintainer-edit` rather than silently enabling access. Workflow edits can expose fork secrets
and other branches; resolve conflicting repository policy instead of treating the checkbox as cosmetic.
Honor the target repository's actual contribution/fork/AI-description restrictions.

## Stacks, missing history or unrelated commits

Record full base/head SHAs and one merge-base. GitHub normally shows a three-dot comparison;
a clean two-point tree diff can hide an unrelated squash-merged series in the proposed PR history.
Read the commit list and complete merge-base-to-head diff. Unexpected commits, missing objects or
multiple merge-bases require resolution, not a guessed comparison or an automatic rebase/reset.

For a stack, confirm the intended parent branch/PR and landing order. Fetch missing objects only
within authorized network/Git scope, or use complete immutable API evidence. A stale tracking ref
is not proof of the current remote. Any changed base/history invalidates affected description and
check/review evidence; rerun the required proof before claiming readiness.

## Ambiguous or newly added templates

Check supported root, `docs/`, `.github/` locations and their `PULL_REQUEST_TEMPLATE/` directories,
including case variants and applicable default community files. Choose from scope or ask when more
than one template fits. GitHub's active template comes from the target's default branch; a new local
file is not necessarily active yet. Preserve required fields/markers and reconcile policy conflicts.

## Attachments

Obtain content/visibility approval before uploading. Inspect the actual image/video, metadata,
private URLs and alt text; drafts are not private storage. Use only supported attachment flags and
account for paths relative to the body file versus working directory. CLI versions differ; inspect
installed help instead of assuming support or opening a research trail by default.

A supported client may create the PR with some uploads, print its URL and still exit non-zero after
another upload fails. Use the update/recovery playbook to read back that known PR and distinguish
creation, upload and verification results. Do not create a duplicate or retry a missing upload blindly.
Allow intentional attachment-URL rewriting when verifying the body; it is not an unrelated human edit.
