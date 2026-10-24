> **Read this when:** designing, writing, checking, exercising, or reporting a generated project-local verification skill and its approved helpers.

# Generated skill contract

The generated artifact is a project instruction for a recurring verification job. It should be
usable by a future agent from repository evidence without depending on the generator skill,
private session history, a global vault, or another repository.

## Required shape

Adapt headings to local conventions, but preserve these responsibilities.

### Invocation and ownership

- Give the skill a unique project-specific name and a description that triggers only for its
  recurring verification job.
- State which package or application it owns and which surfaces it verifies.
- Route ordinary tests, implementation work, and one-off tool operation to their existing owners.
- Resolve relative references and helper paths from the generated skill directory.

### Working directories and commands

For every command, name the repository/monorepo directory in which it runs. Use commands and flags
confirmed by repository configuration, installed versions, types, or command help. Tool-neutral
roles such as browser driver, HTTP client, process runner, and evidence collector are useful only
when paired with actual host-supported commands.

Use existing scripts and tools first. Add a helper only when it centralizes necessary project
knowledge that existing support cannot express. Helpers remain ordinary repository-owned scripts,
not a new daemon, state database, mandatory index, or agent-specific control plane.

### Setup

State prerequisites, dependency assumptions, build steps, fixtures, authentication mechanism, and
disposable isolation. Separate one-time setup from per-run setup. Setup must not embed secrets or
rely on current runtime values.

### Start and owned-process receipt

Describe the exact start/build command for each applicable surface and the observable signal that
it is usable. Record how the run tracks process, container, session, profile, port, and temporary
data ownership for cleanup.

For a short-lived CLI, start may mean building once and invoking each journey in a fresh temporary
directory or terminal session. Do not force a server lifecycle onto a CLI-only project.

### Doctor

Provide a read-only identity/readiness check. It should prove the intended repository build or
version, expected product identity, usable dependencies/fixtures, and valid authorization where
needed. Reject an unknown service that merely occupies the expected port.

If no project command can establish identity safely, document the observable checks an agent must
combine. Do not invent a `doctor` executable solely to satisfy the heading.

### Named journey contracts

Each journey should include:

- **ID and claim:** the user behavior it proves;
- **surface and entry point:** browser/app, API/service, or CLI/process path;
- **preconditions:** target, auth, fixture, data, and supported environment;
- **actions:** public operations through real supported interfaces;
- **observations:** exact visible/returned/process state that marks completion;
- **persisted effect:** a second read-only observation when acceptance requires durable state;
- **evidence:** sanitized artifacts and their approved location;
- **cleanup:** only data and resources created by the journey;
- **status:** supported, unsupported, or blocked, with reason.

Keep acceptance at the required boundary. A browser claim observes the browser and required backing
state; an API claim observes protocol and required side effects; a CLI claim observes command,
stdout/stderr, exit status, files/processes, or another public effect. Do not substitute a nearby
unit test for required wiring or add an end-to-end flow to a purely internal claim.

### Verification map

For more than a few journeys, include a compact map in the skill or an approved referenced file.
The map records journey ID, surface, entry point, claim, prerequisites, evidence, and support
status. It is an honest coverage ledger, not a mandatory database.

An unavailable journey remains listed as unsupported or blocked when the product requirement still
exists. Removing the row does not remove the requirement. Do not claim one convenient entry point
covers another unexercised entry point.

### Evidence

Evidence records the action and resulting state, plus an externally visible persisted effect where
required. Examples include:

- browser semantics or app state with a narrowly scoped screenshot when useful;
- request, response status/body, and a safe read-back for an API mutation;
- literal command, stdout/stderr, exit status, and resulting file or process state for a CLI;
- logs, traces, or screenshots only when sanitized and relevant.

Store reproducible commands and stable artifact locations, not secrets, private data, environment
dumps, current PIDs/ports, or session-specific values. Keep proof after owned-resource cleanup.

### Cleanup

Use exact handles recorded by the run. Make cleanup scoped, idempotent where possible, and safe
after partial failure. Never kill by process name, reset shared state, or delete user-owned data.
Report any resource that could not be cleaned up.

## Generation versus operation

Formatting, syntax, reference, and registration checks establish **generated** status only. To
claim **exercised**, run the generated instructions against the authorized real target and collect
the observations required by at least the claimed journeys. A stand-in environment proves only the
behavior actually observed there; record differences from the intended target.

If operational exercise was not approved or a required capability is missing, report **generated,
not exercised** or **blocked**. Never describe artifact creation as successful product verification.

## Maintenance

When maintaining an existing project-local verification skill:

1. rediscover repository commands, versions, ownership, and current entry points;
2. compare every journey claim with current product behavior and accepted requirements;
3. update the existing owner rather than creating a second skill;
4. preview the exact delta and repeat the approval gate;
5. structurally check the artifact, then exercise only separately approved safe journeys;
6. retain unsupported requirements and historical evidence honestly.

A generated skill should instruct future maintainers to follow the same distinction between
proposed, generated, exercised, and blocked.
