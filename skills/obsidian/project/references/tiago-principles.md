> **Read this when:** the user asks *why* the validity gate exists, what "Hot or Cold" means, or how to apply Tiago Forte's PARA principles to a Project decision.

# Tiago Forte's PARA — Project Principles

This is a working reference for the design decisions in `SKILL.md`. Keep it
focused on Projects — not the full PARA system (that lives in
`obsidian-workflows`).

## The Project definition (non-negotiable)

A Project requires **both**:

1. **A discrete outcome** — a "done" state you can check off
2. **A deadline or target date** — internally or externally imposed

If either is missing, it's an **Area** (ongoing responsibility) or a
**Resource** (reference). Treating ongoing responsibilities as Projects is the
#1 PARA implementation error and creates the "perpetually stalled projects
list" problem.

**Heuristic test:** "Will this folder still be needed in 12 months?" If yes,
it's probably an Area, not a Project.

## Tiago's "Hot or Cold" method (2024)

Tiago published this simplification on LinkedIn in 2024 to address the stalled
list problem. Every active project gets a heat label:

| Heat | Meaning | When |
|------|---------|------|
| 🔥 **Hot** | Active focus — working on this *this week* | Pick 3–5 max |
| ❄️ **Cold** | Committed but simmering — no work expected this week | Everything else active |

**Why this works:** Most "stalled" projects aren't actually stalled — they're
*Cold* and the user is treating them as Hot, generating false guilt. Labeling
them Cold reframes them as "intentionally on hold" rather than "behind
schedule".

**Apply it:**
- New project default: ask the user. Don't auto-assign.
- During UPDATE: if Hot project shows no activity in 7+ days, prompt to demote
  to Cold or archive. *Don't* automatically demote — the user owns the call.
- Markly project (in Chris's vault) is a real example: it was Hot, drifted,
  acknowledged as Cold in W19 status — the skill should make this
  reclassification a first-class operation.

## The weekly check (PARA's equivalent to GTD weekly review)

The weekly maintenance ritual is what prevents PARA from decaying:

1. Does the Projects folder reflect actual active commitments?
2. Anything active without a folder? → Create one.
3. Any folders for things no longer active? → Archive.
4. Any Hot projects that should be Cold? → Reclassify.

This skill supports the ritual but does not run it — that's `/maintain-vault`.

## Just-In-Time (JIT) over Just-In-Case (JIC)

Don't ask the user 12 setup questions for a project that might fizzle in a
week. Capture the minimum to make it actionable:

- Objective (one sentence)
- Deadline
- 3 success criteria
- Why now (one sentence)

Everything else can be filled in later as needed. The Markly project's
"Notes & Context" section was added after the project was real, not at kickoff.

## Why "Why now?" matters

Future-you will read the project note in 3 months and ask: *"why did I think
this was important?"* Without the motivation captured at kickoff, you can't
make a good keep-or-archive decision. This is the single highest-leverage
field for retrospective value.

Tiago doesn't name this explicitly in the PARA book, but it's implied by his
"projects must serve goals" framing — the skill makes it explicit because the
template doesn't.

## Action-oriented naming

Bad project names: "Markly" (subject), "Website" (subject), "AI Marketplace"
(subject).

Better: "Launch Markly MVP Phase 0.5" (outcome + scope), "Ship Roofr AI
Marketplace beta" (outcome).

**But don't be dogmatic** — Chris's vault uses subject-style names (`Markly`,
`Roofr AI Marketplace`) because the *folder* IS the project boundary. The
title inside the file can be more action-oriented. Don't rename existing
projects without asking.

## The retrospective gap

Most PARA implementations skip the retrospective. The template has a
`## 🔄 Retrospective` section but it's almost always left blank. During
completion (project → archive), this skill should *strongly* prompt to fill
it. Retrospectives are the highest-value durable output of a project — they
become the source material for blog posts, talks, and the user's evolving
mental models.

## What this skill deliberately does NOT do

- **Doesn't enforce Tiago's exact taxonomy** — the user's vault has evolved
  conventions (subject-named folders, modified frontmatter). Respect those.
- **Doesn't auto-archive past-due projects** — the user owns the call. We
  flag, they decide.
- **Doesn't recommend specific tools** — Notion vs Obsidian vs ClickUp is not
  this skill's concern; the user has chosen Obsidian.
- **Doesn't enforce a project count limit** — Tiago suggests 5–10 active
  Projects, but Chris's `USER.md` lists 4 active, well within range.
