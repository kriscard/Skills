> **Read this when:** diagnosing unexpected Query behavior, reviewing an implementation, resolving capability uncertainty, or checking an adapter/version mismatch.

# Debugging and review

## Establish the executable capability surface

Before changing code, inspect:

1. imported adapter and exact package version;
2. separately resolved `@tanstack/query-core` version;
3. adapter framework peer range and resolved framework version;
4. exported client/hook helpers and their declarations;
5. installed Router, SSR, persistence, devtools, and ESLint integrations;
6. nearby client defaults, keys, options, error types, and tests.

Current primary docs describe the current line, but a project can resolve a different capability
surface. Adapter and core majors can differ, and an adapter can impose a framework peer requirement
not implied by core. Use installed declarations for syntax and current docs/source for semantics.
Treat an upgrade as separate scope.

Type improvements can ship in package patches, so run the project typecheck after package changes.
Prefer inference from typed query/mutation functions and `queryOptions`/`mutationOptions`. Global
`Register` augmentation for error, key, or meta structure is useful only when the project has a real
cross-cutting convention; inspect installed fields before adding it.

Inspect the installed Query ESLint preset rather than memorizing a list. Enable the project's chosen
correctness rules and treat stricter style rules such as preferring options helpers as project policy,
not evidence that every local query needs a factory.

## Reproduce, observe, trace

Make the smallest public symptom repeatable. Use Query Devtools/cache inspection when available, but
verify consumer-visible behavior and transport evidence rather than private internals.

Trace in this order:

1. **Client ownership:** Is the intended `QueryClient` stable and shared by the provider, router,
   hydration, and imperative caller? A second client means a second cache.
2. **Identity:** Do observed, updated, and invalidated keys agree in value and type, including tenant,
   optional filters, object fields, and normal versus infinite shape?
3. **Execution:** Is there a query function, is it conditionally enabled, online for its
   `networkMode`, and actually observed? A disabled query ignores normal invalidation refetches.
4. **Freshness:** Is data fresh, stale, inactive, garbage-collected, placeholder, initial, or
   hydrated? Separate `status` from `fetchStatus` and initial pending from background fetching.
5. **Transport:** Did retries delay the final error? Did the `AbortSignal` reach every request? Did
   transport return defined decoded data or throw the expected error class?
6. **Reconciliation:** Did a write update the intended shape, invalidate the intended family, await
   the required boundary, and avoid a stale response overwriting optimistic state?
7. **Subscription:** Does the component observe the relevant property/result? Did object rest, a
   changing expensive selector, or a hand-maintained notification list broaden or alter updates?
8. **Environment:** Are focus/reconnect events, Strict Mode, hydration timing, persistence restore,
   fake timers, or duplicate packages changing the schedule?

Change one policy at a time and rerun the same reproduction. A cache timestamp or network log should
explain why the changed policy fixes the symptom.

## Review by behavioral seam

Report concrete impact and a reproducible condition. Use these questions to generate findings, not as
a demand for wrappers or architecture ceremony.

### Resource and transport

- Does the key contain every input read by the query function, with no normal/infinite collision?
- Does the transport forward cancellation, reject non-success responses, decode/validate where the
  application requires it, and preserve errors the retry/UI policy needs?
- Is canonical transformation intentionally before the cache, while consumer projection stays in
  `select` or the UI/domain owner?

### Options and consumers

- When loader, hook, and imperative code refer to one resource, do they share the same typed options
  and inputs?
- Do callsite overrides remain after the options spread, and does `select` infer its result without
  broad generic wrapper types?
- Does a custom hook add behavior or a stable feature interface, or does it block Suspense/loaders/
  imperative reuse without benefit?

### Cache policy and state ownership

- Does freshness match the resource instead of hiding an identity, observer, or invalidation bug?
- Is dependent UI state derived from the server snapshot where appropriate, while editable drafts
  remain deliberately local?
- Are private entries removed or separated when identity changes? Keys organize caches; they are not
  authorization.

### Writes and concurrency

- Is an authoritative mutation response written only into shapes it fully represents?
- Does invalidation match resources made stale and wait only when refreshed truth is part of mutation
  completion?
- Is UI-only optimism sufficient? If shared cache optimism is used, are cancellation, absent data,
  overlap-safe rollback, generated identity, server reconciliation, and settlement races handled?
- Does a mutation scope serialize one real conflict rather than unrelated work?

### React and framework seams

- Are independent reads parallel, and is a Suspense waterfall handled only where it matters?
- Does an error retry reset Query as well as the React boundary?
- In Router/Start, do validation, `loaderDeps`, key inputs, loader options, and observer options agree?
  Is the same client used, and is there an active Query observer when Query owns the resource?
- In SSR, is the server client request-local, transfer safe, hydration identity stable, and streamed
  pending work excluded from persistent storage?

### Infinite, offline, and adapters

- Do infinite updates preserve `pages`/`pageParams`, cursor progression, and bounded overlap?
- Can paused persisted mutations resume with a registered default function after restoration?
- Does syntax belong to the installed adapter, with reactive inputs and peer versions handled by that
  framework rather than copied from React?

## Review anti-mandates

Accept the smallest correct local design. The absence of a key factory, options factory, custom hook,
schema library, selector, memoization, optimism, mutation scope, global invalidation, or route prefetch
is not a defect by itself. Conversely, cite a generic guardrail only when the implementation has the
specific failing condition and user-visible consequence.

## Sources

- [Query TypeScript guidance](https://tanstack.com/query/latest/docs/framework/react/typescript)
- [Query ESLint plugin](https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query)
- [Important defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults)
- [Query Devtools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [QueryClient reference](https://tanstack.com/query/latest/docs/reference/QueryClient)
