---
name: goals
description: Create or revise monthly, quarterly, or yearly objectives in the Obsidian vault.
disable-model-invocation: true
argument-hint: '[monthly | quarterly | yearly]'
---

# Goals

Set and revise forward-looking objectives. Weekly retrospectives belong to `/weekly-review`; this
skill does not own weekly notes or weekly commitments.

## 1. Choose the horizon

Read `AGENTS.md` and use `$ARGUMENTS` when it names `monthly`, `quarterly`, or `yearly`. Otherwise ask
the user to choose one of those horizons.

Determine whether the user is:

- creating the next period;
- checking current progress;
- closing a period and setting the next one.

Completion: the horizon, operation, and exact date range are confirmed.

## 2. Resolve live context

Discover the current goal path, filename convention, template, and dashboard from the live vault.
Do not rely on cached spellings or create a parallel folder.

Read the relevant current and preceding goal notes, aligned projects, and source evidence supplied by
the user. Use a dashboard as discovery, not as proof that every result is active.

Completion: the target note and evidence for each objective are known.

## 3. Draft objectives or adjustments

For each objective, confirm:

- outcome;
- checkable success criteria;
- why it matters in this horizon;
- aligned projects or milestones;
- next review point.

During a check-in, label progress only from sourced milestones, elapsed dates, explicit blockers, or
user confirmation. Ask whether a struggling objective should be adjusted, retired, or retained;
never silently mark it failed.

Monthly objectives should advance current quarterly objectives. Quarterly objectives should support
yearly direction when a yearly note exists. Do not invent alignment to fill a hierarchy.

Completion: every proposed objective or adjustment is checkable and explicitly confirmed.

## 4. Preview, write, and verify

Show the target path and complete proposed change. After explicit approval, create from the resolved
live template or update named sections through the `vault` safe-write flow. Reread and verify the
written objectives, success criteria, and period.

Return the horizon, confirmed objectives or adjustments, aligned projects, next review point, and
unresolved evidence gaps.
