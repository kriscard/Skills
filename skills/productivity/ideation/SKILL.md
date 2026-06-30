---
name: ideation
description: >-
  Use when the user wants help shaping an idea through conversation: generating
  options, choosing between options, stress-testing assumptions, or turning an
  early idea into a lightweight spec. Also use when explicitly asked to run the
  ideation pipeline from messy input into contract, PRD, and implementation spec
  artifacts. Trigger on "ideate", "explore this idea", "poke holes in this",
  "help me choose", "turn this into a PRD/spec", or /ideation. Do not use for
  merely capturing an idea, processing inbox notes, or building the MVP directly.
user-invocable: true
---

# Ideation

Two modes. Detect which one the user needs.

**Mode A — Conversation:** Diverge, converge, stress-test, or spec in conversation. No files produced. Use when the user is exploring or analyzing.

**Mode B — Pipeline:** Full artifact generation (contract → PRD → spec). Use only when the user explicitly wants files such as a PRD, requirements, or implementation spec.

Boundary: use `obsidian/ideas` for merely capturing an idea, `prototype` when the user wants to build/scaffold/ship the MVP, and `dev/spec` when implementation scope is already chosen and needs a technical spec.

## Completion Criteria

For conversation mode, finish only after one of these is true:

- Diverge: 8–10 options are produced and the user has a clear next choice.
- Converge: one recommendation is named with trade-offs and rejected options.
- Stress test: strongest version, riskiest assumption, failure modes, and next validation step are stated.
- Spec: problem, solution, success metric, v1 scope, and next steps are concrete.

For pipeline mode, finish only after written artifacts are created, approved gate-by-gate, and the final response lists generated file paths.

---

## Mode A: Conversation

Thinking partner, not yes-machine. Challenge weak assumptions. Ask the uncomfortable question.

## Detect the Conversation Move

Read the user's opening message and match to one move. Ask if genuinely unclear — but usually the framing tells you.

| Signal | Move |
|---|---|
| "generate ideas for...", "what are ways to..." | Diverge |
| "which of these should I...", "help me choose..." | Converge |
| "what could go wrong", "is this a good idea" | Stress test |
| "turn this into a plan", "what's the spec" | Spec |

---

## Move: Diverge

Generate quantity first. Suspend judgment.

- Aim for 8–10 options before evaluating any.
- Include: obvious options, non-obvious options, one "that's crazy but...".
- Don't prematurely explain why each option would or wouldn't work.
- After generating: ask "Want me to narrow these down, or keep going?"

Done when the option space is expanded and the user has a clear next choice.

---

## Move: Converge

Score by feasibility × impact × excitement. Be direct about which is best.

For each serious option:

- **Feasibility**: can this actually be done with current resources?
- **Impact**: how much does it move the needle for the stated goal?
- **Excitement**: does the builder actually want to build this?

Give a recommendation. "Based on your constraints, Option B is the one — here's why" is more useful than "it depends."

If they push back: explain the reasoning, don't just capitulate.

Done when one option is recommended, trade-offs are named, and the rejected options have reasons.

---

## Move: Stress Test

Steelman first, then attack. Order matters — attacking a straw man is useless.

**Steelman**: restate the idea in its strongest form. If your restatement surprises the user ("I didn't realize that's what I was arguing"), you found a clarity problem.

**Attack vectors:**

- Riskiest assumption: what's the one thing that has to be true for this to work? How confident are you it's true?
- First thing that breaks at scale: 10x the users, 10x the data — what breaks?
- Existing alternatives: who already does this? Why would someone choose yours?
- Reverse incentives: who is harmed or threatened by this? Will they push back?

Don't soften findings. "This assumes X is true, and there's no evidence it is" is useful. "You might want to consider whether X..." is not.

Done when the strongest version, riskiest assumption, failure modes, and next validation step are explicit.

---

## Move: Spec

Turn the idea into a lightweight structured document.

```text
## Problem
[What pain, for whom — specific person/role, not "everyone"]

## Solution
[What you're building — and explicitly what you're NOT building in v1]

## Success Metric
[How you'll know it worked — one number or observable event]

## V1 Scope
[The absolute minimum a real user could use — list 3–5 features max]

## Next Steps
[Ordered by dependency — what must be done before what]
```

V1 scope discipline: if the user lists >5 features, ask "which 3 could you ship without the others?" Help them cut.

Done when the problem, solution, success metric, v1 scope, and next steps are concrete.

---

## Hard Rules (Mode A)

- Don't agree with a weak idea to avoid tension — say what's actually wrong.
- Don't generate spec without knowing the problem; ask first.
- If the user is excited, that's not a reason to skip the stress test.
- One move at a time — don't diverge and stress test in the same response.

---

## Mode B: Confidence-Gated Pipeline

Transforms brain dumps into structured implementation artifacts through approval gates. Ask for clarifications and approvals before crossing each gate.

```text
INTAKE → CONTRACT (confidence ≥ 95%) → PRD → SPEC
                       ↑
              ask questions if < 95%
```

### Phase 1: Intake

Accept whatever the user provides — scattered thoughts, voice transcripts, contradictions. Don't require organization. The mess is the input.

Done when the input is captured and contradictions or missing project-name information are surfaced.

### Phase 2: Contract Formation

Load `references/confidence-rubric.md`, score confidence conservatively, and ask only the questions needed to reach 95% confidence. When confidence is ≥95%, confirm project name, load `references/contract-template.md`, and write `./docs/ideation/{project-name}/contract.md`.

Get approval before proceeding to PRD.

Done when the contract file exists, lists confidence score and V1 Done When, and is explicitly approved.

### Phase 3: PRD Generation

For each implementation phase, load `references/prd-template.md` and write `prd-phase-{n}.md` with user stories, requirements, and acceptance criteria. Group phases by dependency and value delivery.

Done when each PRD file is reviewed and approved before spec generation.

### Phase 4: Spec Generation

For each approved phase, load `references/spec-template.md` and write `spec-phase-{n}.md` with technical approach, file changes, code patterns, and validation commands.

Done when each spec is detailed enough to implement without re-reading the PRD and the final response lists all generated file paths.

### Gotchas

- Confidence scores inflate — score conservatively; genuine 95% means every criterion is testable.
- Don't skip the question loop at 85–94 — "minor gaps" hide major ambiguity.
- Surface contradictions explicitly rather than silently resolving them.
- Don't generate PRDs before the contract is approved — each phase builds on confirmed outputs.

## References

| Priority | Load when | Reference |
|---|---|---|
| Required | Scoring confidence or deciding how many questions to ask | `references/confidence-rubric.md` |
| Required | Ready to write `contract.md` | `references/contract-template.md` |
| Required | Writing a `prd-phase-N.md` file | `references/prd-template.md` |
| Required | Writing a `spec-phase-N.md` file | `references/spec-template.md` |
