---
name: commit
description: Create a conventional commit and optionally push it safely.
disable-model-invocation: true
---

# Commit

## Workflow

**Step 1 — Inspect the worktree**

Record whether `git rev-parse --verify HEAD` resolves and capture its hash when
it does, then run in parallel:

- `git status --short`
- `git diff`
- `git diff --staged`

If there's nothing to commit, stop and say so. Review tracked changes and identify
untracked files before staging.

**Step 2 — Select one coherent change**

Honor files or scope named by the user. Otherwise, stage one coherent change and
leave unrelated work untouched. Ask when the intended grouping is ambiguous.
Add specific files by name rather than using `git add .` or `git add -A`.

**Step 3 — Review the exact commit**

Run `git status --short` and `git diff --staged`. Review every staged change,
including newly added files. Confirm that the staged content contains no
credentials, private keys, secret values, generated artifacts, or unrelated changes.
If it does, remove the affected paths or hunks from the staged set and review it
again. Stop if nothing remains staged.

**Step 4 — Write a conventional commit**

Format: `<type>: <subject>` or `<type>(<scope>): <subject>`

- Subject line: ≤ 72 chars, ideally ≤ 50. Imperative mood ("add X", not "added X").
- Body: **optional**. Only include if the *why* isn't obvious from the diff. 1–2 sentences max, never a bullet list.
- If the subject line is self-explanatory, omit the body entirely.

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`

```bash
# No body needed — subject is self-explanatory
git commit -m "fix(auth): handle expired token on page refresh"

# Body only when the why is non-obvious
git commit -m "$(cat <<'EOF'
feat(auth): add refresh token rotation

Single-use tokens prevent session hijacking after a token is stolen —
the old token is invalidated on first use.
EOF
)"
```

**Step 5 — Handle hook failures**

If a pre-commit or commit-message hook fails, inspect the failure. Apply a safe,
mechanical fix only when it is clearly within the selected change; otherwise,
report the blocker and ask before changing code. Re-stage only the intended files,
repeat Step 3, then create a new commit. A failed hook did not create the commit,
so preserve the existing commit instead of amending it.

**Step 6 — Verify the commit**

Confirm that `git rev-parse --verify HEAD` now resolves. For an existing history,
its hash must differ from Step 1; for an initial commit, Step 1 must have had no
`HEAD`. Confirm that `git log -1 --oneline` shows the intended subject and include
the new commit hash in the final response.

**Step 7 — Push when approved**

If the user already requested a push, continue. Otherwise, ask whether to push.
Before pushing, check the branch and upstream with `git status -sb`. If no
upstream is configured, ask before creating one. After pushing, verify with
`git status -sb`; report success only when the branch is not ahead of its upstream.

## Safety

- Keep credentials, private keys, and tokens out of the staged content
- Push normally; force push requires an explicit request
- Preserve existing commits on shared branches (`main`, `master`, `develop`)
- Write commit messages without AI or Claude attribution

## Verification Gate

Do not finish until:

- every staged change belongs to the selected change and was reviewed after staging
- the new commit changed `HEAD` and appears in `git log -1 --oneline`
- the final response includes the commit hash
- if pushed, `git status -sb` confirms the branch is not ahead of upstream

## Conventional Commit Types

| Type | When |
|------|------|
| `feat` | New capability |
| `fix` | Bug fix |
| `refactor` | Code change with no behavior change |
| `test` | Adding or fixing tests |
| `docs` | Documentation only |
| `chore` | Tooling, deps, config |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace |
