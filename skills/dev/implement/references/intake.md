> **Read this when:** starting implementation from requirements, a tracker, an approved spec, or a review repair.

# Intake and preflight

1. **Identify the source.** Accept a bounded user request, a canonical
   `docs/specs/<slug>/{spec.md,plan.md,approval.md}` handoff, or retrieved Jira, GitHub,
   or Linear content. For a tracker, use an available authenticated integration and
   retrieve title, description, acceptance criteria, material scope-changing comments,
   linked decisions and attachments. State its title and identifier before starting.
   An ambiguous reference needs clarification. If access fails or tools are absent,
   name the inaccessible item, ask for pasted/exported content, and stop source-dependent
   work. Never fabricate ticket contents, access, or approval. A URL alone is not design.
2. **Inspect the owner.** Read applicable `AGENTS.md`/`CLAUDE.md`, source and direct
   callers, tests, contracts, configuration, and decision records. Determine installed
   versions and repository check commands only for the affected responsibility.
   Read-only discovery does not authorize running scripts with unreviewed side effects.
3. **Pin the starting state.** Record repository, branch, full HEAD SHA, comparison base
   when relevant, and existing working-tree changes. Identify ownership conflicts before
   edits. Keep user work intact; do not create branches or worktrees automatically.
4. **Make a compact execution brief.** Record the intended outcome, allowed paths,
   constraints/non-goals, preserved behavior, acceptance/failure cases, selected outcome,
   prerequisites, checks, and separately granted actions. Distinguish sourced facts,
   accepted decisions, non-blocking assumptions, and blockers. Keep it in the conversation
   unless a durable execution log is requested; do not create unapproved repository files.
5. **Classify readiness.** A small ticket with explicit behavior, local ownership, known
   failure semantics and no consequential design fork may proceed under the user's
   implementation request. Scope size alone is not safety: a one-line authorization or
   data-loss change can require planning. Supplied spec artifacts must pass the approved
   spec gate even when the task seems small. A read-only planning/recommendation request
   ends at the recommendation, not an edit.
6. **Check repair origin.** If assigned by the current `code-review` coordinator, capture
   accepted finding IDs, preserved behavior, allowed files, checks, round/budget limit,
   and return destination. This marks the run **repair-return**. Apply the appropriate
   outcome playbook, then return evidence to that coordinator without starting review.

**Ready when:** source and authority are real, prerequisites exist, acceptance is
falsifiable, scope has an owner, and no consequential decision is being guessed. Otherwise
report the exact missing information or request user-invoked `spec` and stop.
