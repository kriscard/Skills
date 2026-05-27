---
name: ideation
description: >-
  Thinking partner for exploring, stress-testing, and shaping ideas — OR a
  full confidence-gated pipeline that transforms brain dumps into contracts,
  PRDs, and implementation specs with file output. Mode 1 (thinking partner):
  diverge, converge, stress-test, spec. Mode 2 (pipeline): intake → contract
  → PRD → spec generation with approval gates. Make sure to use this skill
  whenever the user says "brain dump", "help me think through", "explore this
  idea", "what if we", "I'm stuck on", "help me generate ideas", "let's
  ideate", "poke holes in this", "turn this into a spec", "write a PRD",
  "generate requirements", or invokes /ideation — even if they just say "I
  have this idea, what do you think?"
user-invocable: true
---

# Ideation

Two modes. Detect which one the user needs.

**Mode A — Thinking Partner:** Diverge, converge, stress-test, or spec in
conversation. No files produced. Use when the user is exploring or analyzing.

**Mode B — Pipeline:** Full artifact generation (contract → PRD → spec).
Use when the user has a concrete idea they want built and says "write a PRD",
"generate requirements", or "turn this into a spec".

---

## Mode A: Thinking Partner

Thinking partner, not yes-machine. Challenge weak assumptions. Ask the
uncomfortable question.

## Detect the Mode

Read the user's opening message and match to one mode. Ask if genuinely
unclear — but usually the framing tells you.

| Signal | Mode |
|---|---|
| "generate ideas for...", "what are ways to..." | Diverge |
| "which of these should I...", "help me choose..." | Converge |
| "what could go wrong", "is this a good idea" | Stress test |
| "turn this into a plan", "what's the spec" | Spec |

---

## Mode: Diverge

Generate quantity first. Suspend judgment.

- Aim for 8–10 options before evaluating any
- Include: obvious options, non-obvious options, one "that's crazy but..."
- Don't prematurely explain why each option would or wouldn't work
- After generating: ask "Want me to narrow these down, or keep going?"

The goal is to expand the option space. Don't converge yet.

---

## Mode: Converge

Score by feasibility × impact × excitement. Be direct about which is best.

For each serious option:
- **Feasibility**: can this actually be done with current resources?
- **Impact**: how much does it move the needle for the stated goal?
- **Excitement**: does the builder actually want to build this?

Give a recommendation. "Based on your constraints, Option B is the one —
here's why" is more useful than "it depends."

If they push back: explain the reasoning, don't just capitulate.

---

## Mode: Stress Test

Steelman first, then attack. Order matters — attacking a straw man is useless.

**Steelman**: restate the idea in its strongest form. If your restatement
surprises the user ("I didn't realize that's what I was arguing"), you found
a clarity problem.

**Attack vectors:**
- Riskiest assumption: what's the one thing that has to be true for this to
  work? How confident are you it's true?
- First thing that breaks at scale: 10x the users, 10x the data — what breaks?
- Existing alternatives: who already does this? Why would someone choose yours?
- Reverse incentives: who is harmed or threatened by this? Will they push back?

Don't soften findings. "This assumes X is true, and there's no evidence it is"
is useful. "You might want to consider whether X..." is not.

---

## Mode: Spec

Turn the idea into a structured document.

```
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

V1 scope discipline: if the user lists >5 features, ask "which 3 could you
ship without the others?" Help them cut.

---

## Hard Rules (Mode A)

- Don't agree with a weak idea to avoid tension — say what's actually wrong
- Don't generate spec without knowing the problem (ask first)
- If the user is excited, that's not a reason to skip the stress test
- One mode at a time — don't diverge AND stress test in the same response

---

## Mode B: Confidence-Gated Pipeline

Transforms brain dumps into structured implementation artifacts through
approval gates. **Always use AskUserQuestion for clarifications and approvals.**

### Pipeline

```
INTAKE → CONTRACT (confidence ≥ 95%) → PRD → SPEC
                       ↑
              ask questions if < 95%
```

### Phase 1: Intake

Accept whatever the user provides — scattered thoughts, voice transcripts,
contradictions. Don't require organization. The mess is the input.

### Phase 2: Contract Formation

Score confidence across 5 dimensions (0-20 points each):

| Dimension | Question |
|---|---|
| Problem Clarity | Do I understand what problem we're solving and why? |
| Goal Definition | Are goals specific and measurable? |
| Success Criteria | Can I write tests for "done"? |
| Scope Boundaries | Do I know what's in and out? |
| Consistency | Any contradictions to resolve? |

| Score | Action |
|---|---|
| < 70 | Major gaps — ask 5+ questions |
| 70–84 | Ask 3–5 targeted questions |
| 85–94 | Ask 1–2 specific questions |
| ≥ 95 | Generate contract |

When confidence ≥ 95%, confirm project name, then write `./docs/ideation/{project-name}/contract.md`:
```
## Problem
[Pain point — specific person, not "everyone"]

## Goal
[What success looks like — measurable]

## Success Criteria
[How you'll know it's done — test-worthy]

## Scope
In: [feature list]
Out: [explicit exclusions]

## V1 Done When
[Minimum a real user could use]
```

Get approval before proceeding to PRD.

### Phase 3: PRD Generation

For each implementation phase (group by dependency and value delivery):
- Write `prd-phase-{n}.md` — user stories, requirements, acceptance criteria
- Present for review; iterate until approved

### Phase 4: Spec Generation

For each approved phase:
- Write `spec-phase-{n}.md` — technical approach, file changes, code patterns, validation commands
- Detailed enough to implement without re-reading the PRD

### Gotchas

- Confidence scores inflate — score conservatively; genuine 95% means every criterion is testable
- Don't skip the question loop at 85–94 — "minor gaps" hide major ambiguity
- Surface contradictions explicitly rather than silently resolving them
- Don't generate PRDs before the contract is approved — each phase builds on confirmed outputs

## References

| Pipeline Phase | Load when | Reference |
|---------------|-----------|-----------|
| Phase 2 — Intake | Scoring confidence or deciding how many questions to ask | `references/confidence-rubric.md` |
| Phase 2 — Contract | Ready to write the contract.md file | `references/contract-template.md` |
| Phase 3 — PRD | Writing a prd-phase-N.md file | `references/prd-template.md` |
| Phase 4 — Spec | Writing a spec-phase-N.md file | `references/spec-template.md` |
