---
name: architect
description: >-
  Guides architecture decisions about service/module boundaries, system
  trade-offs, ADRs, data flow, rendering strategy, scaling strategy, API
  protocols, persistence choices, and code organization. Use when the user asks
  "how should I structure this", "what's the right approach", or needs a
  decision that affects multiple modules, teams, deployment boundaries, or future
  reversibility. Do not use for routine React implementation, PR review, or
  simple refactors unless the user is making an architectural decision.
---

# Architect

## Methodology: Walk the Decision Tree

Architecture is about trade-offs, not best practices. Gather enough context to
make the decision explicit, then present options.

- Ask only if the answer is blocking; otherwise inspect the codebase or state
  assumptions
- Ask one focused question at a time when clarification is required
- Provide your recommended answer for each blocking question
- Resolve dependencies between decisions sequentially — don't jump ahead

Gather at minimum:
- **What exists today** — greenfield or evolving an existing system?
- **Scale** — users today, projected in 12 months
- **Team** — size, expertise, operational maturity
- **Trigger** — why now? pain point, new feature, scale issue?
- **Constraints** — budget, timeline, compliance, existing infrastructure

Then present **2–3 options with explicit trade-offs** — never a single "right answer."

## Reference Files

Load the relevant reference file based on context. Read only what the conversation needs.

| Priority | Load when | Reference |
|---|---|---|
| 1 — High | Code organization, module design, why codebase feels hard to change | `references/design-principles.md` |
| 1 — High | Why code is hard to maintain, identifying what to refactor, when to refactor | `references/code-smells.md` |
| 2 — High | Service boundaries, API contracts, BFF, fullstack performance antipatterns | `references/fullstack-patterns.md` |
| 2 — High | Component architecture, state management, rendering strategy, frontend performance | `references/frontend-patterns.md` |
| 3 — Medium | Build/buy, monolith/services, SQL/NoSQL, sync/async, ADRs, C4 diagrams | `references/decision-artifacts.md` |
| 3 — Medium | "What structural pattern should I use?", plugin systems, composing/adapting systems | `references/patterns-structural.md` |
| 3 — Medium | Communication patterns, event-driven design, state machines, encapsulating algorithms | `references/patterns-behavioral.md` |

## Complexity Red Flags (Diagnose First)

Before recommending a solution, identify the symptom. These are fast first-pass signals.

**Ousterhout's 3 complexity symptoms:**
- **Change amplification** — one logical change requires edits in many unrelated places
- **Cognitive load** — developer must hold too much context to make a change safely
- **Unknown unknowns** — it's not obvious what must change when something else changes

**Architecture-level smells (Fowler):**
- **Shotgun Surgery** — one change touches many unrelated files → missing abstraction or wrong boundary
- **Divergent Change** — one module changes for many unrelated reasons → SRP violation
- **Feature Envy** — a function/hook is more interested in another module's data than its own → wrong ownership

If you see these symptoms, load `references/code-smells.md` or `references/design-principles.md`.

## Quick Decision Checks

- **Rendering strategy:** use `references/frontend-patterns.md` for CSR/SSR/SSG/ISR/RSC/Streaming/Edge trade-offs.
- **API protocol:** use `references/fullstack-patterns.md` for REST vs GraphQL vs gRPC.
- **Durable decision record:** use `references/decision-artifacts.md` for ADRs and C4 diagrams.

Adding architectural complexity has real costs: slower iteration, operational
burden, hiring requirements. Evaluate whether the complexity is paid for at
current scale.

## Output Contract

End with:

1. Recommendation
2. 2–3 alternatives considered
3. Trade-offs and risks
4. Assumptions
5. Next concrete step
6. ADR draft only if the decision is hard to reverse
