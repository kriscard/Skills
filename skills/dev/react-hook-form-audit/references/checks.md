> **Read this when:** running any React Hook Form audit. Evaluate every applicable check; report only evidence-backed failures.

# Audit checks

## Model and defaults

- Registered field paths agree with the form type, schema input, resolver output, and payload mapper.
- Every field participating in dirty comparison or reset has a stable non-`undefined` default.
- API-to-form and form-to-API transformations preserve intentional null, empty, date, number, and
  hidden-field semantics.
- Fetched edit data follows an explicit snapshot, reactive-values, or derived-state ownership model.
- Incoming server refreshes cannot silently overwrite edits unless that behavior is intended.
- Dirty-only payloads match PATCH semantics and do not masquerade as conflict resolution.

## Registration and adapters

- Native-contract controls use one `register` path.
- Controlled widgets have one `Controller`/`useController` path and correctly translate value,
  change, blur, name, disabled state, and ref.
- Controlled fields are not double-registered or updated through competing `setValue` paths.
- Custom popovers/ref-less controls have an interaction boundary for touched state and validation.
- Disabled/read-only behavior matches whether the value must appear in submitted data.

## Validation and errors

- Validation timing matches the UX and cost; `onChange` is a finding only when work or rerenders are
  demonstrably excessive.
- Resolver schemas are stable or deliberately regenerated from dependencies.
- Dynamic resolver context is supplied through `useForm({ context })`.
- Cross-field and transformed schema types distinguish input and output when necessary.
- Server field failures map to fields; form-wide failures have a visible surface.
- Async submit failures are caught or intentionally delegated to an error boundary with usable UX.
- Client validation is repeated authoritatively on the server.

## Accessibility

- Labels target real control IDs.
- Descriptions and errors are associated through `aria-describedby` or an equivalent accessible
  relationship.
- `aria-invalid` is on the interactive control/trigger rather than styling-only wrappers.
- Grouped radios/checkboxes use fieldset/legend semantics where appropriate.
- Invalid controls can receive focus, or an accessible summary provides navigation.
- Pending, success, and failure states remain perceivable without relying only on color.

## Subscriptions and performance

- Root `watch` rerenders are proportional to form size and consumer location; suggest `useWatch`
  only when it creates a meaningful boundary.
- `useWatch`, `useFormState`, and context subscriptions occur near their consumers.
- Snapshot reads use `getValues` rather than a render subscription.
- Non-render effects use `subscribe` where supported instead of forcing React renders.
- The whole `useForm` return is not used as an unstable effect dependency; depend on the required
  stable method.
- Memoization/extraction advice follows a demonstrated rerender path rather than a blanket rule.

## Field arrays

- Rows use RHF-generated stable identity appropriate to the installed major version.
- Array operations receive complete objects and are not stacked into ambiguous structural updates.
- One `useFieldArray` instance owns each name; names are stable.
- `update` remount behavior does not discard local UI state.
- Row errors and collection-root errors both render.
- Reorderable arrays do not combine with unregister semantics that lose values.
- Add/remove controls cannot accidentally submit the form.

## Wizards and conditional fields

- Same-page versus routed persistence matches component lifetime.
- Step schemas compose into a canonical full-form schema.
- `trigger(paths)` is not assumed to swap resolvers or select an unrelated step schema.
- Final submission validates the complete form.
- Cross-step dependencies can invalidate previously completed steps and explain why.
- Hidden fields have an explicit preserve, clear, or omit-at-serialization policy.
- Review screens use snapshot or reactive reads intentionally.

## Submission and baseline

- Duplicate submission is blocked while the mutation is pending.
- Failure preserves entered values and provides recovery.
- Cache invalidation/refetch sequencing cannot reset to stale data.
- Success reset behavior matches visible-value intent.
- Baseline advancement is compatible with the installed RHF version and does not clobber edits made
  during an async save.

## Framework and version gates

- App Router files that call RHF hooks are Client Components; type-only imports and Pages Router are
  not falsely treated as runtime violations.
- RHF plus React actions has one owner for pending/error state and repeats validation on the server.
- v8-only APIs and field-array identity changes are confirmed by installed types and migration docs.
- Beta APIs are not recommended solely because they appear on the live documentation site.
