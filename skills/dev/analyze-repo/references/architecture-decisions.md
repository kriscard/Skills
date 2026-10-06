> **Read this when:** the repository contains ADRs or the audit discovers a
> consequential architectural choice whose rationale may need preserving.

# Architecture Decision Records

An audit identifies and links decisions; it does not invent their rationale.
Search common ADR/design locations and repository documentation before declaring
a decision undocumented.

## ADR qualification gate

A choice qualifies as an ADR candidate when it is consequential, hard to reverse,
or likely to be challenged later, and at least one category below applies.

### Architectural shape

Examples: monorepo versus multiple repositories, event-sourced write model,
projected read model, modular monolith, or service decomposition.

### Integration between contexts

Examples: domain events rather than synchronous HTTP, ownership of retries and
idempotency, consistency model, or cross-context data contracts.

### Lock-in technology

Record databases, message buses, identity providers, cloud/deployment targets,
and comparable choices that would take substantial work to replace. Ordinary
library selection does not qualify by itself.

### Ownership and scope

Record who owns authoritative data or behavior, how other contexts reference it,
and explicit exclusions. A deliberate “does not own” can be as important as the
positive ownership decision.

### Deliberate deviation

Record choices where a reasonable maintainer would expect another approach, such
as manual SQL instead of an ORM, when the deviation is intentional and the
reason matters.

### Invisible constraint

Record legal, compliance, partner, latency, deployment, organizational, or
operational constraints that cannot be recovered from code alone.

### Non-obvious rejected alternative

Record an alternative when it was seriously considered and the rejection reason
is subtle enough that future maintainers are likely to reopen the same debate.

## Evidence states

Classify each consequential choice as one of:

- **Recorded:** link the ADR/design document and summarize its status.
- **ADR candidate:** the choice passes the qualification gate, but no decision
  record was found.
- **Needs context:** the code reveals a choice but not whether it was deliberate
  or constrained. Ask rather than infer.
- **No ADR needed:** local, reversible, conventional, or low-consequence choice.

An absence of an ADR is not automatically technical debt. It becomes a finding
when missing rationale creates demonstrated change risk, repeated debate, or a
credible chance that maintainers will reverse an intentional constraint.

## Candidate output

For each ADR candidate, report:

```text
Decision: concise choice, not a problem statement
Observed state: files, configuration, and runtime evidence
Why it qualifies: one qualification category
Missing context: rationale or constraint that code cannot prove
Likely alternatives: only alternatives evidenced by docs/history or supplied by the user
Next step: confirm with an owner, then draft an ADR if deliberate
```

Do not fabricate decision dates, owners, rationale, alternatives, or status.
Offer ADR drafting after the report when the user can supply missing context.

## Existing ADR checks

- Does implementation still match the recorded decision?
- Is the ADR status clear: proposed, accepted, superseded, or deprecated?
- Are superseding links intact?
- Are constraints and rejected alternatives still true?
- Does the ADR describe ownership and explicit exclusions where relevant?

Report drift between an accepted ADR and implementation as evidence-backed drift,
not proof that either side is correct.
