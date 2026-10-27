> **Read this when:** Debugging Playwright locally or in CI, configuring traces/screenshots/video, reviewing retries or flaky-test policy, or changing workers, parallelism, sharding, and report merging.

# Diagnostics and scale

## Debug from the first useful artifact

Reproduce with the narrowest file, project, and grep. Use the tool that preserves the
needed signal:

- UI Mode for interactive local exploration and time-travel through steps;
- `--debug` / Inspector for headed step-by-step execution and locator inspection;
- Trace Viewer for CI and intermittent failures because it combines actions, DOM
  snapshots, console, network, source, errors, and attachments;
- screenshots for a compact visual failure state;
- video when motion, timing, or a multi-step visual sequence matters;
- HTML/blob/JUnit reports for run-level and shard-level evidence.

Prefer failure- or retry-scoped recording such as trace on first retry and screenshot on
failure. Recording every trace/video increases storage and run cost and can make the
useful evidence harder to find. If retries are disabled but first-failure evidence is
required, choose a supported retain-on-failure mode for the detected version instead of
copying a newer config value.

Redact or avoid secrets in traces, screenshots, videos, HARs, and reports. Retain
artifacts long enough to diagnose the exact CI revision.

## Parallelism model

Playwright runs test files in parallel workers by default; tests within one file are
ordered unless configured otherwise. Workers are independent OS processes and a failed
worker is discarded. Before increasing concurrency, prove tests and external resources
are independent.

- Use one worker temporarily to diagnose shared-state failures, not as the permanent fix.
- Use serial mode only for an intentionally indivisible workflow; independent tests
  should not inherit order dependence.
- Use `fullyParallel` only when individual tests are safe to distribute independently.
- Size workers from measured CI capacity, browser cost, backend limits, and test duration.
- Keep account pools, ports, files, and records unique by `parallelIndex` or another stable
  worker/test identity when appropriate.

## Sharding

Shard only after the suite is independently runnable. Verify every shard uses the same
Playwright/package/browser versions and configuration. With `fullyParallel`, Playwright
can balance at test granularity; without it, distribution is generally at file granularity,
so a few large files can create uneven shards.

Use the blob reporter when reports from multiple shards must be merged, then run the
version-supported `merge-reports` command after collecting all shard artifacts. Preserve
shard identity and exact commit in artifact names.

## Retries and flake policy

Playwright classifies a test that fails first and passes on retry as flaky. Keep that
signal visible. Use retries to collect evidence or absorb an explicitly tolerated
external instability only with ownership and follow-up. When supported by the installed
version, `failOnFlakyTests` / `--fail-on-flaky-tests` can prevent a retry-pass from
silently making CI green.

Inspect the first attempt, retry differences, worker restart, server logs, trace, and
external state. Do not diagnose only the final passing attempt.

## Official sources

- [Debugging tests](https://playwright.dev/docs/debug)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer-intro)
- [Parallelism](https://playwright.dev/docs/test-parallel)
- [Sharding](https://playwright.dev/docs/test-sharding)
- [Retries](https://playwright.dev/docs/test-retries)
