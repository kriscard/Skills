---
name: playwright
description: >-
  Version-aware Playwright Test engineering for implementation, configuration,
  review, debugging, and migration. Use when a repository uses @playwright/test
  or Playwright and the work involves specs, runner configuration, projects,
  fixtures, authentication or storage state, locators, waiting, network routing,
  browser isolation, traces or media, parallelism, sharding, failures, or upgrades.
  Detect the installed version before version-sensitive guidance. Use test for
  test strategy, agent-browser for one-off browser automation, and framework
  specialists for framework rendering and routing contracts.
---

# Playwright Engineering

Apply Playwright Test mechanics that match the repository's installed version. Compose
with the general workflow owner instead of replacing it: `test` decides what behavior
needs browser coverage and what evidence is sufficient; this skill owns how Playwright
implements and diagnoses that coverage.

## Workflow

### 1. Confirm Playwright owns the task

Use this skill for persistent Playwright tests, runner configuration, fixtures, browser
state, Playwright debugging, or migration. Use `agent-browser` for one-off website
interaction, scraping, exploratory automation, or operational browser work that does
not belong in a Playwright suite.

When a framework contract is involved, load its owner too. For example,
`nextjs-app-architecture` owns Next.js rendering, routing, caching, and loading behavior;
this skill owns the Playwright configuration, APIs, locators, and browser evidence used
to verify that behavior.

**Complete when:** Playwright-specific work and adjacent owners are explicit.

### 2. Detect the installed contract

Work from the package that owns the tests, not automatically from the repository root.
Inspect its manifest, workspace configuration, lockfile, Playwright config, imports,
installed package declarations, and nearby tests. Determine whether the suite uses
`@playwright/test`, `playwright`, `playwright-core`, or an experimental component-testing
package.

Run the local CLI through the owning package manager, for example:

```bash
pnpm exec playwright --version
npm exec playwright -- --version
yarn playwright --version
```

If dependencies are not installed, derive the resolved version from the lockfile and
record that the CLI could not confirm it. Check that directly related Playwright
packages use compatible versions and that CI installs the browser binaries expected by
the suite. Treat local types and declarations as the API boundary. Use current official
docs only for the detected version's supported behavior; verify newer APIs against
release notes and installed declarations before recommending them.

**Complete when:** package owner, package manager, runner package, exact resolved version,
config path, and browser-install path are known or explicitly unresolved.

### 3. Inspect the existing suite before prescribing structure

Read the focused config, relevant project, fixture exports, auth setup, helper layers,
nearby specs, scripts, and CI invocation. Preserve established conventions unless they
cause the reported failure or conflict with the requested behavior. Establish a focused
command with `--project`, file path, or `-g` before editing.

**Complete when:** the baseline command, current isolation/state model, and local
conventions are known.

### 4. Load only the applicable reference

| Priority | Load when | Reference |
|---|---|---|
| 1 — High | Runner config, projects, dependencies, fixtures, setup/teardown, authentication, or storage state | `references/runner-and-state.md` |
| 1 — High | Locators, assertions, actions, navigation readiness, timeouts, flaky waits, or helper/page-object design | `references/interaction-and-readiness.md` |
| 1 — High | Request observation, route interception, response mocking, HAR, service workers, contexts, or shared-state failures | `references/network-and-isolation.md` |
| 1 — High | Trace Viewer, screenshots, video, UI Mode, Inspector, CI artifacts, retries, flaky-test policy, workers, parallelism, or sharding | `references/diagnostics-and-scale.md` |
| 1 — High | Upgrade, deprecated or removed API, browser/package mismatch, unexplained runner failure, or version-sensitive review | `references/migrations-and-failures.md` |

**Complete when:** every Playwright-specific decision is covered by a loaded branch and
matches the detected version.

### 5. Implement the smallest resilient change

Use Playwright's locator and web-assertion model rather than sleeps or DOM-structure
selectors. Keep each test independently reproducible through browser-context isolation
and explicit external-state setup. Add fixtures, projects, auth reuse, network routing,
or abstraction only when the behavior requires them.

Retries may collect diagnostic evidence, but a test that passes only on retry remains
flaky. Diagnose the first failure and preserve the classification in CI rather than
raising retries until the suite appears green.

**Complete when:** the change proves the requested browser behavior without hidden order,
time, account, or worker dependencies.

### 6. Run focused evidence, then affected checks

Run the narrowest Playwright command first and inspect the first failure using the most
informative available artifact. Then run the affected project or suite plus repository
validation. For concurrency work, verify under the intended worker/shard settings rather
than only with one worker. For migration, confirm test discovery before and after, run a
representative test per project/browser, and verify browser installation in CI.

**Complete when:** commands, detected version, passing evidence, artifacts inspected,
and unresolved environment limits are recorded.

## Non-negotiable defaults

- Readiness comes from a user-visible state, URL, response, download, popup, or other
  behavior-specific signal. `networkidle` is not the default readiness signal.
- Fixed sleeps are debugging tools, not production synchronization.
- Retries reveal flaky tests; they do not make flakiness acceptable.
- Browser contexts and external test data preserve independence; test order does not.
- Page objects or large helper layers require demonstrated repeated complexity and a
  coherent interface, not merely the existence of a page.
- Auth state files are credentials. Keep them out of version control and separate
  accounts when parallel tests mutate shared server state.

## Completion gate

Before finishing, confirm:

- installed Playwright version and package owner were detected before version-sensitive
  advice;
- local declarations and official release notes support every used API;
- locators express user-facing semantics or an explicit test contract;
- waits observe the behavior that marks readiness;
- tests remain isolated across order, workers, projects, and retries;
- failures retain useful trace/media/log evidence without recording everything by
  default;
- the focused command and affected validation pass, or exact blockers are reported.
