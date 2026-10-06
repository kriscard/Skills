---
name: debug
description: >-
  Debug errors, test failures, incorrect output, browser failures, intermittent bugs,
  and performance regressions through a tight red/green diagnosis loop. Use when
  behavior is broken, failing, flaky, slow, or unexplained.
---

# Debug

Build a **tight**, red-capable feedback loop before changing code. Then minimize,
test falsifiable hypotheses, fix the root cause, and drive the same loop green.

## 1. Establish the symptom safely

Capture the user's exact observable symptom: error, wrong output, UI state, failed
request, or measured latency. Record the triggering input, environment, and expected
versus actual behavior.

Redact secrets before displaying or saving evidence:

- Replace credentials, tokens, cookies, authorization headers, and personal data with
  `<REDACTED>`.
- Record environment-variable names and presence by default, not values.
- Keep credentials in the environment when building reproduction scripts.

**Complete when:** the symptom and expected behavior are precise enough that the
final verification can distinguish fixed from unfixed without relying on judgment.

## 2. Build a tight red loop

Create one command or agent-runnable action sequence that exercises the user's exact
symptom and returns an unambiguous pass/fail result. Prefer, in order, an existing
failing test, a focused test, an HTTP or CLI script, a browser automation flow, or a
replay of captured input.

For browser-visible or interaction bugs, invoke the installed `agent-browser` skill.
Use it to drive the reproduction and capture relevant DOM state, console or page
errors, network evidence, screenshots, traces, or video. Keep authentication
human-controlled or in its auth vault.

Run the loop at least once and show the invocation and redacted failing signal. A
tight loop is:

- **Red-capable:** fails on the user's exact symptom, not a nearby error.
- **Deterministic:** returns the same verdict, or a measured and pinned failure rate.
- **Fast:** cheap enough to run after every experiment.
- **Agent-runnable:** runs unattended whenever automation can reach the behavior.

For intermittent bugs, measure a baseline failure rate and raise it through repeated
runs, controlled timing, concurrency, load, or replayed input. Record the conditions
and sample size so the same experiment can be repeated after the fix.

If no useful loop can be built, stop and list what was tried. Request the missing
environment access, a redacted HAR/log/trace/recording, or permission for temporary
production instrumentation. Use a structured human-driven loop only when automation
cannot perform an irreducibly human action such as 2FA, biometrics, or physical-device
interaction.

**Complete when:** one already-run command or action sequence is red-capable,
repeatable, and fast enough to guide diagnosis.

## 3. Reproduce and minimize

Run the loop until the failure is understood at the observable level. Shrink inputs,
steps, config, data, and dependencies one at a time; rerun after every cut and retain
only what keeps the loop red. For intermittent bugs, preserve the pinned conditions
and report the measured failure rate rather than claiming determinism.

**Complete when:** the smallest practical scenario still produces the exact symptom,
and its invocation, inputs, conditions, and failure signal are recorded.

## 4. Rank falsifiable hypotheses

Generate 3–5 plausible root-cause hypotheses before testing any one of them. For each,
record:

- supporting evidence;
- contradicting or missing evidence;
- the observation predicted if it is true;
- the cheapest experiment that distinguishes it from the alternatives.

Rank by explanatory power and test cost. Discard or sharpen any hypothesis that makes
no falsifiable prediction.

**Complete when:** the hypotheses are ranked and the next experiment has a predicted
result that can support or reject one or more of them.

## 5. Run one-variable experiments

Change one variable at a time and map every probe to a prediction from Phase 4. Use
focused logging, a debugger, config or input substitution, dependency isolation, or
history comparison as the hypothesis requires. Inspect recent changes, versions,
configuration, service state, and timing only when they distinguish live hypotheses.

Use `git bisect` only with a known-good revision and the red/green loop as its test;
restore the original repository state with `git bisect reset` afterward. Keep
instrumentation temporary and redact its output.

After each experiment, record the command, result, and which hypotheses gained or
lost support. Update the ranking before choosing the next experiment.

**Complete when:** evidence identifies the causal mechanism and explains the observed
symptom; correlation or a disappearing symptom alone is insufficient.

## 6. Prove, fix, and clean up

When a stable test seam exists, add a regression test before the fix and run it red on
the reported symptom. Otherwise, state why the reproduction loop is the appropriate
verification artifact. Apply the smallest change that addresses the causal mechanism.

Run the regression test or original loop green. For intermittent bugs, use the same
conditions and sample size as the baseline. Run the relevant broader checks, then
remove temporary logs, flags, fixtures, recordings, breakpoints, and instrumentation.

**Complete when:** the original symptom is green, the regression checks pass or their
failures are reported, temporary debugging artifacts are removed, and the evidence
connects the fix to the root cause.

## Report

Return:

- **Root cause:** causal mechanism and affected path.
- **Evidence:** decisive observations and falsified alternatives.
- **Fix:** changed files and why the change addresses the cause.
- **Verification:** red-to-green loop and broader checks with results.
- **Remaining risk:** unresolved uncertainty or unsupported environments, if any.
- **Prevention:** only when a concrete preventive change follows from the evidence.
