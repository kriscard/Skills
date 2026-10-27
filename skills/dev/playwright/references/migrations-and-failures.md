> **Read this when:** Upgrading Playwright, reviewing version-sensitive APIs, or diagnosing runner/browser/package failures that are not explained by the test behavior alone.

# Migrations and failure modes

## Migration workflow

1. Record the current resolved versions of `@playwright/test`, `playwright`,
   `playwright-core`, component-test packages, and installed browser binaries.
2. Name the target version and read every intervening official release-note section,
   including breaking changes, deprecations, supported operating systems, browser
   revisions, and runner changes.
3. Inspect local type declarations and CLI help for the target contract. Do not infer
   support from the latest docs alone.
4. Keep directly related Playwright packages aligned unless official package guidance
   documents a different combination.
5. Update dependencies and lockfile through the repository's package manager.
6. Install the target browser binaries in local and CI environments using the same
   package version that runs the tests. Account for system dependencies and cache keys.
7. Run test listing/discovery, one representative test per project/browser, then the
   affected suite. Review snapshots and artifacts semantically before accepting updates.
8. Remove obsolete compatibility work only after the target version is proven.

For multi-version jumps, stage the reasoning by release boundaries even when the final
lockfile moves directly. Examples of historical breaks include explicit browser install
requirements and changed browser/channel behavior; use the release notes for the exact
versions rather than memorized cutoffs.

## Version-sensitive review

Flag code when:

- an option or API is absent from installed declarations;
- config values were copied from `/docs/next` or a newer release;
- package versions or cached browser binaries do not match;
- a deprecated API has a documented current replacement;
- CI OS support changed across the migration;
- generated snapshots changed because the bundled browser revision changed;
- component-testing advice assumes packages or models no longer maintained by the
  detected version.

Use the latest stable docs only when creating a new suite whose dependency will be latest
stable. Otherwise the repository's resolved version is authoritative.

## Failure classification

Classify before editing:

| Signal | Investigate first |
|---|---|
| Browser executable missing | browser install step, cache key, package version, CI image/system dependencies |
| Unknown config option or method | resolved version, package duplication, local types, release-note introduction |
| No tests found | `testDir`, `testMatch`/`testIgnore`, CLI path regex, project grep, transformed file extension |
| Works locally, fails in CI | base URL/web server, environment, browser/OS revision, resources, timezone/locale, artifact trace |
| Passes alone, fails in suite | external shared state, account/data collisions, route leakage, module globals, cleanup |
| Passes with one worker only | isolation defect or constrained dependency before worker tuning |
| Timeout | identify the exact timeout and missing behavior signal before increasing it |
| Retry passes | first-attempt trace, worker restart, external state, race; retain flaky classification |
| Route or request event missing | service worker, registration timing, matching pattern, context/page ownership, version support |
| Snapshot drift after upgrade | bundled browser/rendering change, fonts/OS, viewport/device descriptor, intended UI change |

When the intended product behavior is unclear, hand diagnosis back to `debug` or `test`.
This skill supplies Playwright-specific failure mechanics, not permission to rewrite the
expected outcome.

## Official sources

- [Installation](https://playwright.dev/docs/intro)
- [Release notes](https://playwright.dev/docs/release-notes)
- [Test configuration](https://playwright.dev/docs/test-configuration)
- [Command line](https://playwright.dev/docs/test-cli)
