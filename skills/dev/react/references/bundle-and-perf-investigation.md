> **Read this when:** a React application has a measured slow load or interaction,
> large bundle, poor Web Vital, suspected waterfall, or user-requested performance
> investigation.

# React Performance Investigation

Performance work starts with a reproducible signal. Preserve the same route, device,
network profile, data, and interaction before and after the change.

## Establish the signal

Choose the metric that matches the complaint:

- navigation or data latency;
- render or commit duration;
- interaction responsiveness;
- layout movement;
- initial JavaScript or route chunk size;
- memory growth or repeated browser work.

Use project tooling, browser traces, React Profiler, bundle analysis, or `agent-browser`
evidence as appropriate. Record the baseline before editing.

## Investigate in impact order

1. Sequential network or server work that can overlap.
2. Unnecessary client JavaScript and heavy eager dependencies.
3. State ownership that rerenders a broad subtree.
4. Expensive render, layout, paint, or hydration work.
5. Repeated computation on a demonstrated hot path.
6. JavaScript micro-optimization only after the prior layers are ruled out.

Inspect import paths and actual bundle output before banning barrel files or adding
dynamic imports. Split code at meaningful interaction or route boundaries, and account
for loading UX and prefetch behavior.

## Optimize one cause

State the hypothesis and expected metric change. Make one coherent change, rerun the
same measurement, and keep it only when the result or structural evidence supports the
claim. Account for variance rather than presenting one favorable run.

## Completion criterion

A performance change is complete when the initial symptom is reproducible, the causal
cost is supported by a trace or structural dependency, the same measurement improves
without unacceptable UX regression, and remaining uncertainty is reported.
