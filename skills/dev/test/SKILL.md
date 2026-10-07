---
name: test
description: >-
  Behavior-first testing workflow for adding regression coverage, writing tests,
  test-driving changes, or repairing tests across stacks. Use when the requested
  output includes tests or executable test evidence, including TDD, coverage
  gaps, or a failing test whose expected behavior is known. Also use when an
  implementation changes observable behavior without test evidence. Diagnose
  unexplained failures with debug before changing tests.
---

# Test

Treat tests as executable behavior contracts. Preserve the contract while allowing implementation details to change.

## Workflow

### 1. Frame the behavior

Identify the actor, preconditions, public action, and observable outcome from the request, accepted spec, bug report, current public contract, and callers. For a regression, separate intended behavior from the current failure and name the smallest reproduction.

Resolve contradictions before writing assertions. Existing tests are evidence, not authority, when they conflict with an accepted requirement or public contract.

Completion: the intended behavior, observation point, and source of truth are explicit.

### 2. Discover the test environment

Inspect repository guidance, manifests, lockfiles, scripts, runner configuration, nearby tests, setup files, installed package versions or types, and CI commands. In a workspace, inspect the owning package rather than assuming the repository root owns the test command.

Determine:

- the established runner and exact installed version;
- the command for one relevant test or file;
- local naming, fixture, assertion, and cleanup conventions;
- whether the current behavior already has coverage;
- any required service, browser, database, or environment setup.

When investigating a failure, run the smallest existing command that reproduces it before editing.

Completion: the runner, version, conventions, focused command, and baseline state are known.

### 3. Choose the observation boundary

Choose the narrowest boundary that can observe the behavior without replacing the subject under test with mocks.

| Boundary | Choose when the outcome is observed through |
|---|---|
| Unit | A pure function or isolated domain operation |
| Component | A rendered component's public interaction contract |
| Integration | A database, filesystem, queue, HTTP handler, or service boundary |
| Contract | A consumer/provider schema or protocol agreement |
| Browser/E2E | A user flow that depends on real navigation, browser behavior, or deployed wiring |

Prefer the repository's established boundary when it can prove the requirement. Cost alone does not make a lower layer sufficient.

Completion: the selected boundary is named and can fail when the observable behavior is wrong.

### 4. Load applicable guidance

Read `references/behavior.md` before writing, changing, reviewing, or relying on test evidence. Load other references only when their branch applies.

For runner-specific syntax, apply the runner-skill routing table below. Runner guidance supplies syntax; this skill owns behavioral scope, evidence, and completion.

Completion: behavior guidance and every applicable branch reference are loaded, and runner syntax matches the installed version.

### 5. Write the smallest credible test

Call the system through the interface its consumer uses and assert the outcome that consumer observes. Follow nearby conventions unless they weaken the behavior contract.

- For explicit TDD or a bug with an obvious cheap regression target, load `references/tdd.md` and establish red evidence before the production change.
- For database, HTTP, queue, filesystem, process, provider, or service boundaries, load `references/integration-boundaries.md`.
- For component browser behavior or end-to-end flows, load `references/browser-and-e2e.md`.

Keep setup proportional to the behavior. A test is complete only when its failure would identify a broken contract rather than an incidental refactor.

Completion: the test reaches the selected observation point, fails when the contract is broken, and contains no assertion disconnected from the behavior.

### 6. Execute the evidence loop

Run the focused command first. Classify failures as product behavior, test logic, environment/setup, or an unresolved contract. Correct the responsible layer; preserve unexpected evidence instead of updating assertions merely to make the run green.

After the focused check passes, run the smallest broader suite and static checks capable of detecting collateral breakage. Use repository commands rather than inventing a parallel test path.

Completion: focused and affected checks have run, and every failure is fixed or reported with its command and evidence.

### 7. Report

Report:

- the behavior and selected boundary;
- test files added or changed;
- focused and broader commands with results;
- failing-before and passing-after evidence for TDD or regression work;
- skipped evidence, unresolved failures, and residual risk.

Completion: another engineer can reproduce every reported result from the commands and paths provided.

## Reference routing

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Writing, changing, reviewing, executing, or deciding to keep any test evidence | `references/behavior.md` |
| 2 — Conditional | Explicit TDD, requested regression coverage, or an obvious cheap local bug reproduction | `references/tdd.md` |
| 2 — Conditional | Behavior crosses a database, HTTP, queue, filesystem, process, provider, or service boundary | `references/integration-boundaries.md` |
| 2 — Conditional | Testing rendered browser behavior, navigation, or an end-to-end user flow | `references/browser-and-e2e.md` |

## Runner skill routing

Use the host's skill mechanism by name rather than an installation path.

| Discovered runner | Invoke if installed and model-invocable | Fallback |
|---|---|---|
| Vitest | `vitest` | Installed types, configuration, then version-matched official documentation |
| Any other named runner | A matching runner skill advertised by the host | Installed types, configuration, then version-matched official documentation |

An unavailable runner skill is not a blocker when repository evidence and official documentation establish the required syntax. Load only the matching runner skill.

## Boundaries

A tests-only request changes tests and test support code only. Production changes require explicit implementation, bug-fix, or TDD scope. Snapshot or fixture updates require reviewing the semantic change they encode. An unexplained failing test is a diagnosis task first; route to `debug` when the intended behavior is not already established.
