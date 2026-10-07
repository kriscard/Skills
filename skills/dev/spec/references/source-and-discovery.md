> **Read this when:** beginning `/spec`, retrieving its source, and inspecting the repository before drafting requirements.

# Source and discovery

Discovery separates research the agent owns from decisions the user owns.

## 1. Resolve the input

Classify the argument as one of:

- a Linear, Jira, GitHub issue, or other issue URL;
- pasted or directly stated requirements;
- a path to source material the user supplied.

For an issue URL, use the best available authenticated integration for that system. Retrieve the title, description, acceptance criteria, material comments, linked issues, and relevant attachments. Comments that change scope or acceptance are part of the source, not optional background.

If access fails, name the exact inaccessible source and ask for pasted or exported content. Stop before drafting requirements. A URL alone is not evidence of its contents.

For direct text or a local source, preserve the user's wording as source evidence and identify any referenced material that remains unavailable.

Completion: the full available source is retrieved, or the run is blocked on a specifically named inaccessible source.

## 2. Inspect repository evidence

Read repository guidance and trace the affected behavior through the current implementation. Inspect the relevant code, tests, schemas, contracts, configuration, migrations, and prior decision records. Prefer evidence from the repository over assumptions about its stack or conventions.

Establish:

- current behavior and ownership boundaries;
- existing interfaces and data flow;
- compatibility and operational constraints;
- tests or checks that already define behavior;
- prior decisions that constrain the solution;
- likely affected areas without turning them into a task list.

Use `research` for claims whose correctness depends on a current external version. Use `architect` when a consequential boundary must be decided before the design can proceed.

Completion: every material claim about the current system has repository evidence, and relevant existing constraints are accounted for.

## 3. Classify what is known

Create a compact synthesis with these classes:

| Class | Meaning |
|---|---|
| Sourced fact | Stated by the issue, user, linked source, or repository evidence |
| Existing decision | Already established by accepted behavior, guidance, or a durable record |
| Assumption | A provisional belief that does not currently block the next stage |
| Unresolved decision | A product or design choice only the user or decision owner can settle |
| Blocker | Missing access or information that prevents a responsible draft |

Cite issue URLs and repository paths beside the claims they support. Do not ask the user to rediscover facts available from those sources.

Completion: every unknown is an assumption, unresolved decision, or blocker rather than an unmarked inference.

## 4. Resolve decisions

Present the source-and-repository synthesis before questions. Grill only unresolved choices that can change observable behavior, scope, risk, or design. Group dependent questions in order, state the consequence of each option, and recommend one when evidence supports it.

Record settled answers as decisions. If the user accepts an assumption, promote it to a decision. If a product decision remains open, keep it visible and block the Requirements gate rather than silently choosing.

Completion: the source is confirmed, blockers are absent, and every remaining unknown is either a non-blocking labeled assumption or a decision with an owner.

## 5. Create the artifact directory

Choose a stable kebab-case slug from the accepted problem, create `docs/specs/<slug>/`, and keep all canonical and supporting artifacts there. If a directory for the same work already exists, continue it rather than creating a competing source of truth.

Completion: one artifact directory is the durable home for this run and its path has been reported to the user.
