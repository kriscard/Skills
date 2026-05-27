---
name: commit
description: >-
  Creates semantic git commits with conventional commit format, stages changes,
  and pushes to remote. Handles pre-commit hooks and writes meaningful commit
  messages. Make sure to use this skill whenever the user says "commit", "push
  changes", "save to git", "commit this", or wants to create a git commit —
  even if they just say "save my work." Also proactively offer after any
  implementation task wraps up.
user-invocable: true
---

# Commit

## Workflow

**Step 1 — Check for changes**

Run `git status` and `git diff` in parallel. If there's nothing to commit, stop and say so.

**Step 2 — Stage thoughtfully**

Add specific files by name rather than `git add .` or `git add -A`. Broad staging risks accidentally committing `.env` files, credentials, or build artifacts. Scan `git status` for anything that looks like a secret before staging.

**Step 3 — Write a conventional commit**

Format: `<type>(<scope>): <subject>`

Common types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`

The body should be 2–4 sentences of prose — not a bullet list. Bullet lists enumerate *what* changed; prose forces you to explain *why* it changed, which is what future readers actually need.

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add refresh token rotation

Access tokens were expiring during long user sessions, causing silent
logouts. Refresh token rotation invalidates the old token on each use,
so sessions stay alive without storing long-lived credentials. The old
single-token approach is removed — no migration needed since sessions
were already short-lived.
EOF
)"
```

**Step 4 — Handle pre-commit hook failures**

If a hook fails (lint, typecheck, tests), the commit did NOT happen. Fix the issue, re-stage the modified files, then create a NEW commit. Never use `--amend` after a hook failure — that would modify the previous commit, potentially losing work.

**Step 5 — Ask about pushing**

Use AskUserQuestion: "Push to remote?" — don't push silently.

## Safety

- Never commit `.env`, `*.pem`, `*credentials*`, `*secret*`, `*token*` files
- Never force push without an explicit request
- Never amend commits on shared branches (`main`, `master`, `develop`)
- Never add AI/Claude attribution to commit messages

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
