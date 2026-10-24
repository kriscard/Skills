---
name: create-verification-skill
description: >-
  Create or maintain a repository-local skill for repeatedly verifying real project
  behavior through its supported browser/app, HTTP/service/API, or CLI/process
  surfaces. Use when the user explicitly asks for a project verification skill,
  verification capability, reusable verification journeys, or maintenance of an
  existing repo-local verification skill. Do not use for ordinary test writing,
  one-off app runs, or automatically scaffolding a harness because coverage is absent.
---

# Create a Project Verification Skill

Produce a reusable project-owned verification skill, not generic test advice. The result is an
actual `SKILL.md` plus only the approved helpers required to operate it. Prefer the project's
existing commands and harnesses over a new control layer.

## Workflow

### 1. Establish the owner

Inspect the repository before proposing files. Read `references/discovery-and-safety.md` and
complete its discovery pass.

Find the owning package, repository instructions, installed versions and tools, command help,
test support, existing local skills, and any established skill location. Reuse or deliberately
update an existing verification skill or harness rather than creating a parallel one.

If the repository has no established location, propose
`.agents/skills/<unique-project-verification-name>/SKILL.md`. Use a portable project-local path;
do not impose a host-specific directory.

**Complete when:** the project owner, skill owner/location, current verification assets, exact
working directories, and relevant commands are evidenced from the repository.

### 2. Define the recurring job

Name the precise job the generated skill will repeat. Select only the applicable product surfaces:

- browser or app interaction;
- HTTP, service, or API behavior;
- CLI, TUI, or process behavior.

Define named journey contracts with preconditions, public actions, observable completion, and any
externally visible persisted effect. For every applicable start, readiness wait, probe, command,
journey, whole run, and cleanup, require an explicit finite budget plus failure, cancellation, and
owned-resource cleanup behavior. A parser or unit-only claim stays at its programmatic boundary;
do not manufacture a browser journey for it.

Read `references/generated-skill-contract.md` before designing the artifact.

**Complete when:** every proposed journey states what real behavior it proves, at which boundary,
and what remains unsupported.

### 3. Present a bounded proposal

Before any durable write, package/config change, stateful journey, or unsafe action, show the user:

- the exact write set and owner of every artifact;
- substantive generated sections and exact repository commands;
- setup, start, doctor, actions, observations, evidence, and cleanup;
- every applicable finite time budget, the exact supported runner/client invocation or configuration
  that enforces it, cancellation behavior, cleanup deadline, and the blocked status used when no
  supported bounded runner exists;
- explicit isolated-port selection and how target identity and ownership will be verified;
- behavior claims each journey can and cannot prove;
- any new dependency, fixture, credential mechanism, process, port, data, or external side effect;
- which actions are safe to generate versus separately gated to execute.

Ask for explicit approval of that bounded proposal. Generator invocation is permission to inspect
and propose, not blanket permission to modify the target project or drive it.

**Complete when:** the user has approved the exact durable writes and any separately scoped
execution. Stop if a required file or action lies outside that approval.

### 4. Generate the smallest durable capability

Create or update the project-local `SKILL.md` and only necessary approved helpers. Use existing
scripts, runners, fixtures, and tools where possible. Give tool-neutral roles alongside actual
commands supported by the host and repository; never invent an interface or require one browser
library everywhere.

Resolve helper paths from the generated skill directory. State the correct repository or monorepo
working directory for every command. Bind each operational step to a verified project/host runner,
supported client timeout, or separately approved necessary helper that enforces its budget. If none
exists, generate an explicit execution blocker instead of operationally ready unbounded commands.
Do not invent `timeout` availability, unsupported flags, or a new framework. Keep the artifact
instructional: no new daemon, workflow database, control plane, or mandatory index.

Use `references/examples.md` only when a concrete browser, API, CLI, or blocked-case pattern would
help shape the project-specific result.

**Complete when:** every approved file exists, the skill has one clear invocation/job, each journey
has an observable completion contract, and every applicable operational step has an explicit
finite budget enforced by a verified capability or is marked blocked.

### 5. Check the artifact

Run the repository's focused formatting, skill syntax, reference, or registration checks. Inspect
the diff for unrelated changes and secrets. Confirm that no start, readiness check, probe, command,
journey, whole run, or cleanup is presented as operationally ready without its finite budget and
verified enforcement path. These checks prove that the artifact was generated and registered
correctly; they do not prove a user journey.

Classify the result as:

- **proposed** — described but not written;
- **generated** — written and structurally checked;
- **exercised** — run against the authorized target with the required observations;
- **blocked** — a named requirement could not be proved, with the missing capability recorded.

**Complete when:** structural checks pass or their exact failures are reported, and the status does
not overstate operational proof.

### 6. Exercise only authorized safe journeys

When the user separately approved execution, establish target identity and readiness before
driving. Apply the generated finite budgets, cancel through the verified runner when a budget is
exceeded, and run bounded cleanup for only owned processes and disposable data. Exercise the
generated workflow on the real authorized surface and capture action plus resulting state plus
required persisted effect.

Select ports explicitly. When repository evidence proves ephemeral-port support, set the documented
value such as `PORT=0` explicitly rather than inheriting an ambient value. Otherwise use a
separately approved isolated supported port and verify identity and ownership. Store the actual
chosen port only in the ephemeral run receipt.

If authentication, a browser, infrastructure, target identity, or another required capability is
unavailable, report **blocked**. Do not install replacements, weaken acceptance, or label the
artifact tested. Preserve sanitized evidence after cleanup.

**Complete when:** an exercised claim has real observations at the named boundary and all bounded
cleanup completed, or the precise timeout, cancellation, cleanup, capability, or other blocker and
unverified claims are explicit.

### 7. Report

Return the generated paths, owner, journeys and supported surfaces, structural commands/results,
exercise status, evidence locations, cleanup result, omissions, source provenance, and version
uncertainty.

**Complete when:** another agent can distinguish what was proposed, generated, exercised, and
blocked without inference.

## Completion gate

A generated skill is not operationally ready unless every applicable start, readiness wait, probe,
command, journey, whole-run sequence, and cleanup has:

- a concrete finite budget chosen from repository evidence or approved test needs;
- a verified enforcement mechanism supplied by the project, host runner, supported client, or an
  explicitly approved necessary helper;
- defined timeout/failure reporting, safe cancellation, and cleanup of exact run-owned resources;
- an explicit port strategy that cannot silently inherit an unrelated target.

When any required bound cannot be enforced, preserve the commands only as a proposal with the
bounded-runner prerequisite and report runtime execution as **blocked**. Generation is not
execution. Never invent GNU `timeout`, arbitrary shell/tool flags, or a compulsory supervisor to
clear this gate.

## Reference routing

| Priority | Load when | Reference |
|---|---|---|
| 1 — Required | Inspecting a target repository, choosing ownership/location, proposing writes, or preparing execution | `references/discovery-and-safety.md` |
| 1 — Required | Designing, generating, checking, or reporting the project-local verification artifact | `references/generated-skill-contract.md` |
| 2 — Conditional | A small browser, API, CLI, or safe-failure pattern would clarify the project-specific design | `references/examples.md` |

## Boundaries

`test` owns ordinary test creation, regression coverage, TDD, and executable test evidence.
Browser or runner specialists own one-off interaction and tool syntax. This skill owns the distinct
recurring job of creating or maintaining a repository-local verification skill and its approved
helpers. Missing tests alone do not trigger this skill.
