> **Read this when:** a small browser, API, CLI, or safe-failure example would clarify a project-specific generated verification skill. Adapt only patterns supported by the target repository.

# Original examples

These examples show output shape, not universal commands. Replace every placeholder with discovered
repository facts and replace each generic runner reference with its exact supported invocation or
configuration. The concrete sample budgets assume a measured fixture and explicit approval; derive
target values from repository evidence and approved test needs. A generated skill may cover one
surface or combine several when the product actually supports them.

## Browser journey

```markdown
### WEB-CREATE-DRAFT — Create and reopen a draft

- Surface: browser at the approved local verification target
- Preconditions: disposable browser profile; authenticated test account through the project's
  existing login fixture; unique title `verify-${RUN_ID}`
- Bounds: use the discovered browser runner's supported 20-second journey deadline and 5-second
  cleanup deadline; on expiry cancel through that runner, retain bounded diagnostics, and clean up
  only the disposable profile and draft created by this run
- Action: open the product's documented New Draft entry point, enter the title and body, and save
- Observe: the UI reports Saved and the draft route shows the unique title within the journey budget
- Persisted effect: reload through normal navigation and observe the same title and body
- Evidence: semantic UI snapshot plus one narrowly scoped screenshot after save
- Cleanup: delete only `verify-${RUN_ID}` through the product's supported test cleanup path
```

Useful contract: success requires the action, resulting user-visible state, and read-back. A DOM
snapshot by itself does not prove persistence.

## HTTP/API server journey

This example assumes discovery confirmed the repository scripts, `PORT=0` support, and a host
process runner with documented deadline and cancellation behavior. The concrete values illustrate
an approved fast local fixture; derive different values from the target repository and test needs.

```markdown
### API-CREATE-WIDGET — Start, identify, create, and read a widget

- Surface: documented local HTTP API
- Port: start with explicit `PORT=0 npm run dev`; capture the reported chosen port only in the
  ephemeral run receipt, never in this skill
- Start/readiness budget: 10 seconds, enforced by the verified host process runner; on expiry cancel
  that exact run-owned process and enter the 5-second cleanup budget
- Doctor budget: 5 seconds total for the existing identity/readiness command, enforced by the same
  runner or the HTTP client's documented timeout; timeout is a blocked doctor result
- Preconditions: doctor confirms the service build identity and disposable namespace; credential is
  obtained through the repository's approved test mechanism
- Journey budget: 10 seconds for POST plus read-back, with each HTTP operation using the supported
  client timeout and cancellation path
- Whole-run budget: 30 seconds including start, doctor, journey, and cleanup
- Action: POST one widget with name `verify-${RUN_ID}` using the discovered endpoint and schema
- Observe: expected success status and response fields defined by the public API contract
- Persisted effect: GET the returned public identifier and observe the same name
- Evidence: sanitized start receipt, request summary, status, bounded response fields, read-back,
  timeout/cancellation status, and cleanup result
- Cleanup: within 5 seconds, delete only the created identifier through an approved path and stop
  only the exact process from the run receipt; report timeout or stranded owned resources
```

If the app does not support ephemeral ports, substitute a separately approved isolated supported
port and verify identity/ownership. If the host/project lacks supported deadline enforcement, keep
`PORT=0 npm run dev` and the doctor command in the proposal but mark runtime execution blocked until
a bounded runner or separately approved helper is available. If the API has no safe delete
operation, propose a disposable database/namespace or make the mutation a separately approved side
effect. Do not assume a reset command exists.

## CLI/process journey

This example assumes discovery confirmed `python3 cli.py --output <path>` and a host/project runner
that can enforce and cancel deadlines without changing the CLI's arguments.

```markdown
### CLI-EXPORT — Export one fixture to a temporary directory

- Surface: installed project CLI from the owning package directory
- Doctor budget: 3 seconds total for repository identity and `python3 --version`, enforced by the
  verified runner; timeout blocks the journey
- Preconditions: doctor passes; `mktemp` directory recorded by the run; fixture name comes from the
  repository's test data
- Command budget: 5 seconds for `python3 cli.py --output "$output_file"`, enforced and cancelled by
  the verified runner rather than an invented CLI flag
- Observation budget: 2 seconds for bounded stdout/stderr and read-only JSON inspection
- Whole-run budget: 15 seconds including doctor, command, observations, and cleanup
- Action: run the discovered export command with the temporary output directory
- Observe: exit status 0 and the documented completion line on stdout within the command budget
- Persisted effect: inspect the expected output file through a read-only command and verify its
  public format marker and fixture identifier
- Evidence: literal command, stdout/stderr, exit status, resulting file inspection, timeout status,
  and cleanup result
- Cleanup: within 3 seconds remove only the recorded temporary directory; report cleanup timeout
  rather than deleting elsewhere or concealing residue
```

If no supported runner can enforce the doctor, CLI, observation, and cleanup budgets, preserve the
actual command as proposed but mark execution blocked. Do not assume GNU `timeout`, add a fake
`--timeout` option, or silently generate a wrapper. A long-running process variant should record
the exact process handle it starts, wait for usable readiness under an explicit budget, cancel
through the verified owner, and terminate only that handle within bounded cleanup.

## Safe failure: wrong application on the port

```markdown
### BLOCKED-WRONG-TARGET

Doctor reached the configured URL, but the build marker and expected product identity were absent.
Status: blocked. No journey was driven. The existing process was not stopped because this run did
not start or own it.
```

A successful TCP connection or HTTP 200 is not permission to attach, drive, or clean up.

## Safe failure: missing capability

Use the same blocked shape when required authentication, browser support, test fixtures, or a
non-destructive target is unavailable:

```markdown
Status: blocked — the accepted journey requires an authenticated browser session, and the
repository exposes no approved test credential or fixture. Artifact generation and structural
checks passed; operational verification was not performed.
```

Do not install an alternate browser, bypass auth, or replace the user journey with a lower-level
mock merely to produce a passing result.

## Safe failure: destructive reset

When the only documented setup resets shared data, propose a disposable namespace or test target.
If neither exists, mark the affected journey blocked and ask for separate approval. A generator
approval never authorizes the reset.

## Existing harness

When discovery finds `scripts/smoke`, an integration runner, or an existing local verification
skill, generated guidance should call or update that owner:

```markdown
Verification owner: `scripts/smoke`
This skill supplies project context and named journey contracts, then invokes the existing focused
commands. It does not add a second runner. Proposed helper changes are limited to the missing
identity check and sanitized evidence output approved by the user.
```

This keeps one executable path for the recurring job and makes deliberate extension visible in the
proposal.
