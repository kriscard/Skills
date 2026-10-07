> **Read this when:** diagnosing React rerenders, Context churn, broad state
> ownership, unstable identities, memoization, or React Compiler behavior.

# React Rerender Diagnosis

A rerender is not automatically a performance bug. Find an observable cost, identify
what scheduled the render, and reduce ownership or work before adding memoization.

## Diagnose

Use the React Profiler or another repeatable signal. Record:

- the interaction that feels slow;
- which component scheduled the update;
- which subtree rerendered;
- expensive render or commit work;
- whether the detected React Compiler already supplies memoization.

## Structural fixes first

- Keep state close to the subtree that changes.
- Pass stable children through a stateful wrapper when the wrapper should not own their
  rendering.
- Split Context by update frequency or responsibility.
- Subscribe to the smallest state slice the component uses.
- Derive values during render rather than synchronizing duplicate state.
- Keep component definitions at module scope so identity and state survive parent
  renders.
- Use stable data keys for dynamic collections.

## Identity and memoization

Manual `memo`, `useMemo`, and `useCallback` are justified when a measured expensive
consumer benefits from stable identity, an external API requires it, or the detected
compiler cannot optimize the boundary. Memoization adds comparison and dependency
costs; do not apply it as a universal style rule.

Fresh objects and functions are only a problem when identity crosses a boundary that
cares: a memoized child, a dependency list, Context, or an external subscription.

## Context

Context broadcasts its value to consumers. For stable or low-frequency values this is
often appropriate. For high-frequency data, split values, use selectors through an
installed store, or move state closer to consumers. A new provider value object is not
the root problem if the provider legitimately updates every field its consumers need.

## Completion criterion

A rerender optimization is complete when the original interaction is measured again,
the scheduling owner is understood, the change reduces demonstrated work, and manual
memoization remains only where its benefit is observable or contractually required.
