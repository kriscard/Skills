---
name: commit
description: >-
  Creates semantic git commits with conventional commit format, stages selected
  changes safely, and optionally pushes to remote after explicit approval.
  Handles pre-commit hooks and writes meaningful commit messages. Use when the
  user says "commit", "push changes", "save to git", "commit this", or wants
  to create a git commit — even if they just say "save my work."
disable-model-invocation: true
---

# Commit

## Workflow

**Step 1 — Check for changes**

Run in parallel:

- `git status --short`
- `git diff`
- `git diff --staged`

If there's nothing to commit, stop and say so. Review both unstaged and already
staged diffs before writing the message.

**Step 2 — Stage thoughtfully**

Add specific files by name rather than `git add .` or `git add -A`. Broad staging risks accidentally committing `.env` files, credentials, or build artifacts. Scan `git status` for anything that looks like a secret before staging.

**Step 3 — Write a conventional commit**

Format: `<type>(<scope>): <subject>`

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

**Step 4 — Handle pre-commit hook failures**

If a hook fails (lint, typecheck, tests), the commit did NOT happen. Fix the issue, re-stage the modified files, then create a NEW commit. Never use `--amend` after a hook failure — that would modify the previous commit, potentially losing work.

**Step 5 — Verify the commit**

Do not claim success until `git log -1 --oneline` shows the new commit. Include
the commit hash in the final response.

**Step 6 — Ask about pushing**

Use AskUserQuestion: "Push to remote?" with options:

- "Push now"
- "Do not push"

Before pushing, check branch/upstream with `git status -sb`. If no upstream is
configured, ask before setting one. After an approved push, verify with
`git status -sb`; do not claim the push succeeded if the branch is still ahead.

## Safety

- Never commit `.env`, `*.pem`, `*credentials*`, `*secret*`, `*token*` files
- Never force push without an explicit request
- Never amend commits on shared branches (`main`, `master`, `develop`)
- Never add AI/Claude attribution to commit messages

## Verification Gate

Do not finish until:

- staged and unstaged diffs were reviewed
- the commit exists in `git log -1 --oneline`
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
