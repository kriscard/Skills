---
name: spec
description: Builds reviewed requirements, technical design, and an executable implementation plan from an issue URL or requirements text, then stops at approval.
disable-model-invocation: true
argument-hint: "[issue-url or requirements]"
---

# Spec

Turn the supplied source into approved planning artifacts. This skill owns discovery and planning only; after approval, report the artifact directory and stop.

## Artifact contract

Every completed run writes:

```text
docs/specs/<slug>/
├── spec.md
├── plan.md
└── approval.md
```

Choose a stable, kebab-case slug from the accepted problem. Add supporting Markdown only when the work needs it, such as `research.md`, `decisions.md`, `data-model.md`, `migration.md`, or files under `contracts/`.

`spec.md` is authoritative for requirements and technical design. `plan.md` is authoritative for execution. `approval.md` certifies the exact approved versions of both. HTML may supplement review when visualization materially helps, but it never replaces the Markdown.

Use stable identifiers throughout:

- `R1` — observable requirement
- `D1` — technical design decision
- `T1` — implementation task
- `V1` — expected or captured verification evidence

## Lifecycle

Run these stages in order. Load a stage reference only when that stage begins.

1. **Discover.** Read `references/source-and-discovery.md`. Retrieve the source, inspect the repository, classify unknowns, and resolve decisions that block requirements.
2. **Requirements.** Read `references/requirements-stage.md`. Write only the Requirements layer of `spec.md`, then run its review gate.
3. **Design.** Read `references/design-stage.md`. Add the Technical Design layer without rewriting approved requirements, then run its review gate. A material requirements change returns to stage 2.
4. **Plan.** Read `references/planning-stage.md`. Derive `plan.md` from the approved `spec.md`, then run its review gate. A behavior or design change returns to the owning upstream stage.
5. **Approve and stop.** Read `references/approval-stage.md`. Verify the current approvals, hash `spec.md` and `plan.md`, write `approval.md`, report the paths, and stop.

At every gate, Plannotator is the default. Explicit approval of the current artifact in chat is the fallback when Plannotator is unavailable or the user chooses chat. Revisions require another review of the current file; use Plan Diff in Plannotator to make the change visible.

## Stage routing

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Starting source retrieval and repository discovery | `references/source-and-discovery.md` |
| 1 — Required | Writing or revising observable behavior and scope | `references/requirements-stage.md` |
| 1 — Required | Writing or revising internal system decisions | `references/design-stage.md` |
| 1 — Required | Converting approved design into executable tasks | `references/planning-stage.md` |
| 1 — Required | Opening any review gate or writing final approval state | `references/approval-stage.md` |

## Domain skill routing

After repository discovery, invoke only installed, model-invocable skills whose evidence condition matches. Use the host's skill mechanism by skill name; never depend on an installation path or host-specific command.

| Repository or spec evidence | Invoke | Contribution |
|---|---|---|
| Browser-facing UI, interaction, accessibility, responsive behavior, or browser trust boundary | `frontend` | Frontend requirements, design constraints, and browser evidence |
| React components, hooks, state ownership, Effects, Suspense, or rendering behavior | `react` | React-specific technical design and validation |
| Next.js App Router, Server Components, route caching, streaming, or Suspense architecture | `nextjs-app-architecture` | Next.js-specific technical design |
| Consequential service, module, data, protocol, persistence, rendering, or deployment boundary | `architect` | Decision analysis, trade-offs, and reversal path |
| Version-sensitive framework, library, SDK, provider, or API claim | `research` | Version-matched primary evidence |
| Verification layer or test strategy cannot be derived from repository conventions | `test` | Behavioral validation strategy and commands |

A routed skill advises the current planning stage; `/spec` remains responsible for artifact structure, traceability, and approval. Record accepted conclusions in `spec.md` or `plan.md` rather than copying another skill's workflow. Do not implement while consulting a domain skill.

If a matching skill is unavailable or user-only, continue from repository evidence when that is sufficient. Record a blocker only when the missing guidance prevents a safe, falsifiable artifact. Never load every skill preemptively.

## Planning boundary

During this skill:

- modify only the spec directory and review aids;
- leave application code, tests, configuration, dependencies, branches, tickets, and commits unchanged;
- keep unresolved blockers explicit instead of approving around them;
- treat edits to an approved stage as invalidating that stage and every dependent approval.

Completion requires all three canonical files, matching SHA-256 hashes in `approval.md`, and explicit approval of the current requirements, design, and plan. Implementation begins only through a separate workflow.
