> **Read this when:** a small browser, API, CLI, or safe-failure example would clarify a project-specific generated verification skill. Adapt only patterns supported by the target repository.

# Original examples

These examples show output shape, not universal commands. Replace every placeholder with discovered
repository facts. A generated skill may cover one surface or combine several when the product
actually supports them.

## Browser journey

```markdown
### WEB-CREATE-DRAFT — Create and reopen a draft

- Surface: browser at the approved local verification target
- Preconditions: disposable browser profile; authenticated test account through the project's
  existing login fixture; unique title `verify-${RUN_ID}`
- Action: open the product's documented New Draft entry point, enter the title and body, and save
- Observe: the UI reports Saved and the draft route shows the unique title
- Persisted effect: reload through normal navigation and observe the same title and body
- Evidence: semantic UI snapshot plus one narrowly scoped screenshot after save
- Cleanup: delete only `verify-${RUN_ID}` through the product's supported test cleanup path
```

Useful contract: success requires the action, resulting user-visible state, and read-back. A DOM
snapshot by itself does not prove persistence.

## HTTP/API journey

```markdown
### API-CREATE-WIDGET — Create and read a widget

- Surface: documented local HTTP API
- Preconditions: doctor confirms the service build identity and disposable namespace; credential is
  obtained through the repository's approved test mechanism
- Action: POST one widget with name `verify-${RUN_ID}` using the discovered endpoint and schema
- Observe: expected success status and response fields defined by the public API contract
- Persisted effect: GET the returned public identifier and observe the same name
- Evidence: sanitized request summary, status, bounded response fields, and read-back result
- Cleanup: delete that identifier only when the API exposes an approved disposable cleanup path
```

If the API has no safe delete operation, propose a disposable database/namespace or make the
mutation a separately approved side effect. Do not assume a reset command exists.

## CLI/process journey

```markdown
### CLI-EXPORT — Export one fixture to a temporary directory

- Surface: installed project CLI from the owning package directory
- Preconditions: build succeeds; `mktemp` directory recorded by the run; fixture name comes from
  the repository's test data
- Action: run the discovered export command with the temporary output directory
- Observe: exit status 0 and the documented completion line on stdout
- Persisted effect: inspect the expected output file through a read-only command and verify its
  public format marker and fixture identifier
- Evidence: literal command, stdout/stderr, exit status, and bounded file inspection
- Cleanup: remove only the recorded temporary directory
```

A long-running process variant should record the exact process handle it starts, wait for a usable
readiness signal, and terminate only that handle.

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
