> **Read this when:** inspecting a target repository, selecting the project-local owner and location, proposing durable changes, or preparing to drive a verification journey safely.

# Discovery and safety

Discovery prevents a reusable skill from caching guesses about the project. Safety binds generated
instructions to an identified target and to resources the verification run owns.

## Discover the project before designing

Inspect the smallest complete ownership chain:

1. Read repository and nearest directory instructions.
2. Locate the repository root, workspace layout, owning package, and correct command working
   directory.
3. Inspect manifests, lockfiles, installed versions, scripts, build/run configuration, test setup,
   fixtures, and CI commands.
4. Run local command help when it is the authoritative source for available flags or subcommands.
5. Search for local skills, verification docs, browser/API/CLI helpers, smoke scripts, process
   managers, seeded environments, and artifact conventions.
6. Discover supported deadline and cancellation mechanisms in the project, host runner, HTTP
   client, browser driver, process API, and test tools. Verify their actual syntax from installed
   versions or command help; do not assume GNU `timeout` or arbitrary flags exist.
7. Determine supported port selection, including whether the application demonstrably accepts an
   explicit ephemeral-port value such as `PORT=0` and how it reports the chosen port.
8. Trace the real user entry points from routes, public endpoints, commands, menus, docs, or current
   tests.

Prefer repository evidence and installed declarations over generic latest-version examples. Record
version uncertainty instead of inventing syntax.

### Ownership decision

Use the repository's established local skill directory and naming convention. If a verification
skill or harness already owns the job, propose a deliberate update to it. Parallel implementations
are justified only when they have different named owners and non-overlapping jobs.

When no location exists, propose a unique portable path under
`.agents/skills/<project-verification-name>/SKILL.md`. Check repository and host-visible skill names
for collisions first. Do not silently choose `.cursor/skills`, a global directory, or another
host-specific registration path.

## Proposal gate

Before durable changes, present an exact bounded plan. Include:

- each file to create, modify, or remove;
- representative substantive content, not only filenames;
- command working directories and literal commands;
- the generated skill's owner and trigger;
- required setup, start, identity/readiness doctor, journeys, observations, evidence, and cleanup;
- how the proposal satisfies the complete operational contract in
  [`generated-skill-contract.md`](generated-skill-contract.md), including discovered enforcement
  mechanisms and blockers;
- process, port, profile, namespace, account, fixture, and credential assumptions, including the
  explicit isolated-port strategy and ephemeral run receipt;
- package/config changes and why existing support is insufficient;
- behavior proved, behavior intentionally unsupported, and known blockers;
- any action that needs separate approval because it starts services, authenticates, mutates data,
  contacts external systems, or is destructive.

Approval applies to that set. A later new file, dependency, reset, production target, private data
access, or external side effect requires another explicit gate.

Preserve unrelated user code. If a required artifact falls outside approved scope, stop and report
the boundary rather than smuggling it into another file.

## Discover bounded execution support

Use [`generated-skill-contract.md`](generated-skill-contract.md) as the source of truth for every
required operational bound, enforcement mechanism, cancellation path, cleanup rule, and blocked
status. Discovery identifies the concrete values and exact supported owners available in this
repository and host. Record missing capabilities as blockers rather than inventing command flags,
helpers, frameworks, or runner behavior.

## Establish target identity before driving

A listening port or successful HTTP response does not identify the intended application. Before an
operational run, establish all applicable facts:

- approved environment and target (local, disposable preview, test tenant, or another named target);
- repository revision or build/version identity;
- correct application/service identity;
- process ownership: started by this run, or separately approved and verified before attachment;
- usable readiness, including migrations, seed/fixture availability, and dependency health;
- authentication and authorization state;
- disposable data/profile/namespace and evidence location.

A doctor is read-only and answers whether the target is worth driving. It should combine available
identity signals such as a version endpoint, build marker, process metadata, startup receipt, CLI
version, expected page identity, authenticated capability, and fixture probe. Its waits and probes
use explicit finite budgets and supported cancellation. Port matching alone is insufficient.

Select the port deliberately. When repository evidence proves that the application supports an
explicit ephemeral-port setting, set it in the start environment (for example, `PORT=0`) so an
ambient variable or default cannot redirect the run. Otherwise use a separately approved isolated
port supported by the application, then verify identity and ownership before driving. Record the
actual selected port only in an ephemeral run receipt; never hardcode it into durable guidance.

Never kill by process name. Track exact process handles, container IDs, sessions, temporary
profiles, ports, and data created by the run. Cleanup only those owned resources. Attaching to a
user-owned process requires verified identity and explicit approval; it does not grant cleanup
ownership.

## Keep execution disposable and bounded

Use unique run identifiers for data names, namespaces, temporary directories, browser profiles,
queues, and ports where the project permits them. Wait for observable state: a readiness marker,
element state, response condition, process exit, event, or persisted record, under the explicit
budget and enforcement mechanism defined above. Arbitrary sleeps are not readiness evidence.

Use existing approved credential mechanisms. Never copy credentials into generated instructions,
artifacts, fixtures, screenshots, or logs. Do not preserve private transcripts, environment dumps,
current PIDs, live ports, session cookies, or ephemeral runtime values as reusable guidance.

Production access, private data, destructive/reset actions, and external side effects need separate
explicit approval. Prefer a disposable alternative. If the required capability is unavailable,
block the claim; do not install tools, bypass authentication, or downgrade the acceptance boundary.

Capture narrowly. Sanitize logs and screenshots, avoid collecting unrelated sensitive data, and do
not publish evidence without approval.

## Evidence and cleanup

Evidence should connect:

1. the public action performed;
2. the resulting observable state;
3. the externally visible persisted effect when the claim requires one.

Mocks, types, unit tests, and CI may support a claim but do not replace observation of required real
wiring. Conversely, a pure parser or unit contract does not need a fabricated UI run.

Cleanup removes only run-owned processes and disposable state. Retain sanitized proof in the
approved location and confirm it remains readable after cleanup. Record cleanup failures as
failures; do not conceal stranded resources.
