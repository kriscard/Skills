---
name: standup
description: >-
  Generates a casual, human-sounding daily standup from git activity in the
  requested period, defaulting to the last workday. Use when the user says
  "standup", "daily standup", "write my standup", "what did I do yesterday",
  "write my daily update", or invokes /standup — even if they just ask "can you
  write my standup?"
disable-model-invocation: true
---

# Daily Standup Generator

Transform git history into a human standup update. Nobody cares about commit messages — translate them into what you actually accomplished.

Completion criterion: git activity has been checked for the requested period (default: last workday), in the current repo or every repo the user names. If the evidence is insufficient, leave placeholders instead of inventing work.

## Step 1 — Fetch Git Activity

Use the user-requested period when provided; otherwise use the last workday rather than blindly assuming the last 24 hours.

```bash
# Replace <since> / <until> with the requested period, or the last workday window.
git log --since="<since>" --until="<until>" --author="$(git config user.email)" --oneline
```

If multiple repos are relevant, run in each named repo. If no commits are found, skip to Step 3.

Done when the repo path(s), date window, and commit evidence are known or marked unavailable.

## Step 2 — Transform Commits into Accomplishments

Map raw commit messages → casual language. The rule: write what you'd say out loud to a teammate, not what you typed in the terminal.

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

If no commits are found, do not invent work. Ask what they worked on, or return placeholders:

```text
Yesterday I:
- [Fill in non-git work: meetings, planning, reviews, debugging, support]

Today I plan to:
- [Fill in today's focus]
```

Never mention the absence of commits in the standup body unless the user asks for evidence.

## Step 4 — Infer "Today I Plan To"

In order of preference:

1. Current branch name: `git branch --show-current` → parse intent
   - `feat/payment-flow` → "Continue the payment flow"
   - `fix/auth-timeout` → "Fix the auth timeout issue"
2. If branch name is unclear, ask: "What are you working on today?"
3. If the user is reluctant, leave the Today section as a fill-in placeholder.

## Output Format

```text
Yesterday I:
- [Accomplishment — active verb, specific]
- [Accomplishment 2]

Today I plan to:
- [Inferred from branch, asked, or placeholder]

Blockers:
- [Specific blocker only if mentioned]
```

Omit the Blockers section when there are no blockers or the user did not mention any.

## Style Rules

- Casual, not corporate. "Shipped" not "Implemented". "Fixed" not "Resolved".
- 3–5 bullets total across Yesterday and Today.
- No bullet should exceed one line.
- Don't add preamble ("Here's your standup:") — just the standup.
