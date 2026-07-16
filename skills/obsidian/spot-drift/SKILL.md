---
name: spot-drift
description: >-
  Drift check for Obsidian: compare stated intentions against 30 days of vault behavior and surface
  verified priority gaps or avoidance questions. Use when the user asks "what am I avoiding?", "am I
  drifting?", "check my priorities vs behavior", "what's getting neglected?", or runs /spot-drift.
user-invocable: true
---

# Spot Drift

Compare stated intentions against actual vault behavior over the past 30 days. Surface the gap
between what you say matters and where energy actually goes. Find what's being avoided.

## Ask, Don't Assume

Shared principle (canonical version in the `vault` skill): never guess, deduce, or fill gaps with
assumptions about the user's notes, priorities, or intent. If you don't know — a date range, what
counts as a win, which goals are active — **ask**. Before writing any synthesis or judgment into a
note, show your draft with its source and get explicit confirmation. Missing data is not permission
to invent.

## Obsidian Access

Use Obsidian CLI via Bash. On failure: "Obsidian CLI isn't working — update Obsidian with CLI
enabled."

## Step 1 — Gather Stated Intentions

### OKRs and Goals

```bash
obsidian files folder="2 - Areas/Goals/Quaterly/" format=json
obsidian files folder="2 - Areas/Goals/Monthly/" format=json
# Read the most recent quarterly and monthly goal notes
obsidian base:query path="2 - Areas/Goals/OKR Dashboard.base" format=json
```

Extract: stated priorities, self-commitments, items marked important/urgent, open questions flagged
for investigation, projects in active/current status.

### Daily Note Intentions (past 30 days)

```bash
TODAY="2 - Areas/Daily Ops/$(date +%Y)/$(date +%Y-%m-%d).md"   # then read backwards
obsidian read path="2 - Areas/Daily Ops/<year-from-YYYY-MM-DD>/YYYY-MM-DD.md"
obsidian property:read path="2 - Areas/Daily Ops/<year-from-YYYY-MM-DD>/YYYY-MM-DD.md" name="energy_sleep"
```

Completion: attempt all 30 dates, list missing or sparse notes explicitly, and do not treat gaps as
proof of inactivity.

Look for: "I need to..." / "I should..." / "I want to..." statements, carry-forward items from
reflections, recurring themes that keep appearing, things flagged as tomorrow's priority that never
get done.

## Step 2 — Gather Actual Behavior

### Vault Activity per Stated Priority

```bash
obsidian search:context query="<stated priority A>" format=json limit=10
obsidian search:context query="<stated priority B>" format=json limit=10
obsidian backlinks file="<priority project note>" counts
```

For each stated priority: measure how much vault activity it generated. Which projects have recent
activity? Which are stale?

### Active Projects Check

```bash
obsidian files folder="1 - Projects/" format=json
obsidian base:query path="MOCs/bases/Active Projects.base" format=json
obsidian property:read path="1 - Projects/<project>.md" name="status"
```

## Step 3 — The Drift Report

### Alignment Label

For each stated priority, rate intention vs. action with an evidence-backed label:

| Priority | Stated Importance | Actual Activity | Alignment | Drift |
| -------- | ----------------- | --------------- | --------- | ----- |
| ... | High | Low | Misaligned | Significant |

Rubric:

- **Aligned** — recent action, project movement, or tasks clearly match the stated priority
- **Thin evidence** — some notes mention it, but action evidence is sparse or ambiguous
- **Misaligned** — stated high importance plus low/no action evidence after missing-note gaps are checked
- **Unknown** — vault data is insufficient; ask before concluding

### What's Getting Unplanned Attention

Things consuming time not in any priority list. Where is energy leaking?

### What's Being Avoided

The uncomfortable list. For each avoided item:

- **What**: the thing being avoided
- **Evidence**: mentions vs. actions (cite specific dates and notes)
- **Possible explanations to verify**: ask whether it is blocked by ambiguity, priority mismatch,
  size, dependency on someone else, or a difficult conversation
- **The cost**: what happens if avoidance continues

**Avoidance Decision Tree** — run for each avoided item:

- **(a) Mentioned in past 7 days?** Yes = active avoidance. No = passive.
- **(b) Related items getting done?** If yes, avoidance is specific to THIS thing. Dig into why.
- **(c) Has a clear next step?** If no, avoidance may be ambiguity. Define one concrete action.
- **(d) Requires someone else?** If yes, the block may be relational. Name who and what the ask is.

### Recurring Push Pattern

Tasks or intentions that appear, get pushed, reappear, get pushed again. For each: how many cycles?
What breaks the loop?

### The Honest Assessment

Direct, compassionate summary — not judgmental, just clear. "Here's what you said mattered. Here's
what you actually did. Here's where they don't match."

**Important:** Daily notes capture reflection, not everything done. When vault data is absent, use
`AskUserQuestion` to verify before concluding avoidance. For each avoided item, list possible
explanations as questions to verify, not psychological conclusions.

### Recommended Corrections

For each significant drift, exactly one of:

- **Drop it** — keeps getting avoided → probably not a real priority. Remove.
- **Do it now** — genuinely matters → schedule in the next 48 hours.
- **Delegate it** — matters but won't get done → name who and when.
- **Reframe it** — next step unclear → define one concrete action.

## Output Guidelines

- Be honest but not harsh. This is a mirror, not a critic.
- Always cite specific dates, notes, and data points.
- The most valuable insight is often the simplest: "You said X matters. You haven't touched it in 3
  weeks."
- Don't conflate busyness with avoidance.
- Distinguish "dropped and should stay dropped" from "dropped and it's costing you."
- Absence of vault data ≠ absence of action. Verify with the user first.
- Complete only when all 30 dates were attempted, missing notes were listed, and avoidance conclusions were verified with the user.
