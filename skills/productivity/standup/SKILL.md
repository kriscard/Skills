---
name: standup
description: Draft a concise daily standup from Git evidence and user-provided non-code work. Use for standups, daily updates, or summaries of the requested work period.
---

# Daily standup

Translate evidence into teammate-readable outcomes. Git is one source, not proof that no other work happened.

## 1. Set the window and repositories

Use the requested period. Otherwise choose the previous workday in the user's local calendar and state the exact `since` and `until` values used. Include every repository the user names; ask when repository scope changes the result.

Complete when repository paths and the date window are explicit.

## 2. Gather evidence

Resolve the effective Git identity inside each repository, then match author email exactly rather than passing an unescaped email as a regex:

```sh
email=$(git config user.email)
git log --all --since="$since" --until="$until" \
  --format='%ae%x09%h%x09%s' |
  awk -F '\t' -v email="$email" '$1 == email { print $2 "\t" $3 }'
```

When available, include user-provided reviews, planning, pairing, incidents, support, meetings, or shipped artifacts. Label unavailable sources instead of inferring work from silence.

Complete when each named repository has been checked and non-commit evidence is included or explicitly unavailable.

## 3. Convert activity to outcomes

Group commits that contribute to one result. Lead with what changed for users, teammates, or the system; retain implementation detail only when it helps the audience.

Examples:

- `feat(modal): add purchase modal skeleton` → “Shipped the first purchase-flow UI.”
- `fix: resolve pagination bug` → “Fixed pagination dropping results between pages.”
- dependency or formatting churn → omit unless it unblocked or repaired something material.

Every bullet must be traceable to gathered evidence. Preserve uncertainty instead of upgrading “started” to “finished.”

## 4. Establish today's plan

Use an explicit user plan first. A descriptive branch name can suggest a candidate, but confirm it before presenting it as intent. Otherwise ask one question or leave a placeholder.

## Output

```text
Yesterday I:
- [Outcome]
- [Outcome]

Today I plan to:
- [Confirmed focus or placeholder]

Blockers:
- [Only evidence-backed blockers]
```

Omit empty sections, including Blockers. Keep three to five one-line bullets across Yesterday and Today. Return only the standup unless the user asks for evidence.

## Completion gate

The response is complete when the date window and repository scope were checked, every accomplishment is evidence-backed, non-Git work was accepted when supplied, and today's plan is confirmed or visibly incomplete.
