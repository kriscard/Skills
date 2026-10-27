> **Read this when:** Configuring Playwright Test projects, fixtures, setup/teardown, authentication, or storage state.

# Runner configuration and state

## Configuration ownership

Keep runner options at the correct level:

- top-level config for suite-wide runner behavior such as `testDir`, `timeout`,
  `expect`, `retries`, `workers`, reporters, and `webServer`;
- `use` for browser-context and artifact options shared by tests;
- projects for meaningful execution matrices: browser/device, authenticated role,
  environment, package, or a setup dependency;
- per-test or per-describe overrides only when the behavior genuinely differs.

Start from the existing config and scripts. A project should name a useful execution
contract, not multiply the matrix without product or CI value. Use project dependencies
when setup must appear in reports, traces, and the dependency graph. Use `globalSetup`
only when its process-level semantics are actually required by the installed version and
suite.

## Fixtures

Fixtures provide capabilities and lifecycle, not a hidden dumping ground.

- Prefer test-scoped fixtures for mutable state and resources that must be fresh.
- Use worker scope only for resources safe to reuse within one worker.
- Declare dependencies explicitly through fixture parameters.
- Pair setup with teardown around `use()` and make teardown safe after partial setup.
- Use automatic fixtures only for true cross-cutting behavior that every applicable test
  needs.
- Keep fixture APIs narrow: return the capability the test consumes, not the whole setup
  mechanism.

Remember that workers can restart after a failure. `beforeAll`, worker fixtures, and
module state may run again. Do not make correctness depend on one uninterrupted worker.

## Authentication and storage state

Choose the state model from server-side mutation behavior:

- one shared account can serve tests that do not mutate conflicting server state;
- use one account/state per parallel worker when tests mutate shared server state;
- use separate projects or explicit states for different roles;
- authenticate through API setup when it proves the same contract and avoids irrelevant
  UI repetition; keep dedicated UI coverage for the login experience itself.

Store generated state under a gitignored path such as `playwright/.auth/`. Treat the file
as a secret because cookies and headers may impersonate the account. Refresh expired
state deliberately and avoid committing generated credentials, even to a private
repository.

A storage state does not isolate backend records. Create unique users, tenants, records,
or namespaces when tests can collide outside the browser context.

## Review questions

- Does each project represent a product/CI contract or accidental duplication?
- Is mutable setup test-scoped unless worker reuse is proven safe?
- Can setup and teardown survive retries and worker replacement?
- Does auth reuse match the suite's mutation and parallelism model?
- Are secrets and generated state excluded from source control and artifacts?
- Are directly related Playwright packages version-aligned?

## Official sources

- [Configuration](https://playwright.dev/docs/test-configuration)
- [Projects](https://playwright.dev/docs/test-projects)
- [Fixtures](https://playwright.dev/docs/test-fixtures)
- [Authentication](https://playwright.dev/docs/auth)
