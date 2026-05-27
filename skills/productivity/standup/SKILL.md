---
name: standup
description: >-
  Generates a casual, human-sounding daily standup from your git activity in
  the last 24 hours. Make sure to use this skill whenever the user says
  "standup", "daily standup", "write my standup", "what did I do yesterday",
  "write my daily update", or invokes /standup — even if they just ask "can
  you write my standup?"
user-invocable: true
---

# Daily Standup Generator

Transform git history into a human standup update. Nobody cares about commit
messages — translate them into what you actually accomplished.

## Step 1 — Fetch Git Activity

```bash
git log --since="24 hours ago" --author="$(git config user.email)" --oneline
```

If multiple repos are relevant, run in each. If no commits: skip to Step 3.

## Step 2 — Transform Commits into Accomplishments

Map raw commit messages → casual language. The rule: write what you'd say
out loud to a teammate, not what you typed in the terminal.

| Raw commit | Translated |
|---|---|
| `feat(modal): add purchase modal skeleton` | Shipped the purchase modal skeleton |
| `fix: resolve pagination bug` | Finally got that pagination bug squashed |
| `refactor: migrate to React Query` | Got the React Query migration working |
| `chore: update dependencies` | Bumped deps (skip — not worth a bullet) |
| `docs: update README` | Updated the README (skip unless it's notable) |

**Rules:**
- Active verb first: "Shipped", "Fixed", "Got X working", "Finished", "Wired up"
- Specific beats vague: "modal skeleton" not "UI changes"
- Skip pure chores (dep bumps, lint fixes) unless something broke
- If multiple commits touch the same thing, merge into one bullet
- Highlight if you unblocked teammates: "Reviewed and merged X's PR"

## Step 3 — Handle No Commits

If no commits in 24h, say:
```
Yesterday I:
- Focused on code reviews and planning
```

Never invent fake accomplishments. Don't mention the absence of commits.

## Step 4 — Infer "Today I Plan To"

In order of preference:
1. Current branch name: `git branch --show-current` → parse intent
   - `feat/payment-flow` → "Continue the payment flow"
   - `fix/auth-timeout` → "Fix the auth timeout issue"
2. If branch name is unclear, ask: "What are you working on today?"
3. If user is reluctant, offer: "I can leave the Today section for you to fill in"

## Output Format

```
Yesterday I:
- [Accomplishment — active verb, specific]
- [Accomplishment 2]

Today I plan to:
- [Inferred from branch or asked]

Blockers: [None, or specific blocker if mentioned]
```

Omit Blockers line if there are none.

## Style Rules

- Casual, not corporate. "Shipped" not "Implemented". "Fixed" not "Resolved".
- 3–5 bullets total across both sections
- No bullet should exceed one line
- Don't add preamble ("Here's your standup:") — just the standup
