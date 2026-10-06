> **Read this when:** choosing a durable output for an architecture decision,
> design, unresolved question, or diagram.

# Decision and Design Artifacts

Choose by the information that must survive, not by adopting a universal planning
framework. The recommendation memo in `SKILL.md` is the default response and
index. It may remain in the conversation; it does not require a second persisted
file. When a specialized artifact is warranted, link it from the response instead
of repeating its contents. Persist both only when the user or repository workflow
requires both. Add an artifact only when it has a clear reader and owner.

## Artifact chooser

| Need | Artifact | Completion signal |
|---|---|---|
| Communicate the recommendation now | Recommendation memo | Decision, options, assumptions, next step, validation, and reversal are explicit |
| Preserve one consequential technical trade-off | ADR | Context, decision, alternatives, consequences, and confirmation survive |
| Specify a cross-module design before implementation | Technical design/spec | Interfaces, flows, data, failures, migration, and verification are implementable |
| Expose unresolved decisions and research | Uncertainty map | Each unknown has an owner, evidence path, and promotion criterion |
| Clarify topology, ownership, or sequence | Architecture diagram | Scope, nodes, edges, current/proposed state, and caption are unambiguous |

Lifecycle frameworks that maintain project state, phases, tasks, stories, or
multi-role delivery belong downstream of the architecture decision. The
repository's established planning workflow owns that work.

## Architecture decision record

### Qualification

Use an ADR when a decision is consequential, difficult to reverse, or likely to
be challenged later, especially when it establishes:

- architectural shape or deployment topology
- integration and consistency between contexts
- technology with material lock-in
- ownership, scope, or explicit exclusions
- a deliberate deviation from the expected approach
- legal, compliance, partner, performance, or operational constraints not
  visible in code
- rejection of a non-obvious alternative

A local, conventional, easily reversible choice usually needs no ADR. A
reversible choice may still qualify when it is surprising, externally
constrained, or likely to be repeatedly challenged. Missing an ADR is not itself
technical debt.

### Format selection

Choose the smallest form that preserves the reasoning:

- **Full option record (MADR-style):** drivers, options, outcome, consequences,
  and confirmation when later reviewers need the full comparison.
- **Concise record (Nygard-style):** status, context, decision, and consequences
  when the trade-off is settled and compact.
- **Memory record:** surprising choice plus reason when that is the only context
  future maintainers cannot recover.

### Triage classification

These labels select the next action; they are not ADR status values:

- **Recorded:** link the existing record and check implementation alignment.
- **ADR candidate:** the decision qualifies but lacks a durable record.
- **Needs context:** code shows a choice but cannot prove intent or rationale.
- **No record needed:** the choice is local, reversible, or obvious from the
  environment.

Use only the repository template's lifecycle values inside an ADR, such as
`Proposed`, `Accepted`, `Superseded`, or `Deprecated`.

Draft the ADR after the direction is resolved and the user requests the
artifact. `Proposed` means one chosen direction awaiting formal acceptance, not
several unresolved alternatives. Open decision-blocking questions belong in an
uncertainty map.

Use the repository's ADR convention. When none exists, load the shared ADR
template routed from `SKILL.md`; it is the single source for lifecycle, sections,
and failure modes. Preserve facts that cannot be recovered from code and never
invent dates, owners, rationale, or alternatives.

## Technical design/spec

Use when an accepted direction still needs enough precision for multiple modules
or contributors to implement consistently. Include only applicable sections:

- goals, non-goals, and decision links
- current and proposed architecture
- interfaces, contracts, ownership, and invariants
- data model, consistency, migration, and compatibility
- request, event, sequence, and failure flows
- security, privacy, reliability, observability, and accessibility constraints
- rollout, rollback, testing, and acceptance signals
- unresolved questions with owners

A design spec explains the implementation contract. Decision-blocking unknowns
belong in an uncertainty map; a design may retain peripheral implementation
questions with owners. It does not need to become a task list; hand accepted
design to the planning workflow for decomposition.

## Uncertainty map

Use when evidence is insufficient for a recommendation. Separate:

- known facts with evidence
- decisions that can be made now
- agent-research questions
- questions requiring human/product/domain input
- work that is not precise enough to schedule

Each unknown needs an owner, next evidence source, and criterion for becoming a
decision or task.

## Architecture diagrams

Choose the view that answers the decision:

- **System context:** actors, the system, and external dependencies
- **Container/deployment:** independently running or deployed units and their
  responsibilities
- **Module/component:** interfaces and dependencies relevant to the decision
- **Sequence/data flow:** ordering, protocols, state transitions, and failures

Use the lowest level that clarifies the trade-off without cataloging the entire
codebase. Label nodes by responsibility; include technology only when it changes
the decision. State what edges mean and distinguish current from proposed
architecture. The rendering tool is optional.
