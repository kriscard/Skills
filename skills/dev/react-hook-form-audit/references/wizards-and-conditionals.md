> **Read this when:** building a wizard, validating sections, coordinating cross-step rules, or hiding conditional fields.

# Wizards and conditional fields

## Choose the persistence boundary

- **Persistent same-page wizard:** one `useForm` instance keeps all steps, dirty state, and the final
  review in one model.
- **Routed or unmounted steps:** persist step data outside the unmounted form or deliberately
  rehydrate it. Do not assume unmounted local form state survives navigation.

## Compose a schema tree

Each screen or domain section may own a schema subtree. Compose those subtrees into one canonical
full-form schema. Export typed field paths owned by each step and call `trigger(stepPaths)` before
advancing.

`trigger(paths)` invokes the active resolver; it does not select a separate step schema. If the
active resolver cannot represent the composed full schema, choose one explicit alternative:

- make resolver behavior depend on mutable `useForm({ context })`;
- parse a step schema manually and map failures with `setError`;
- change the form boundary so each routed step owns its own validated form.

Run full-form validation before final submission.

## Cross-step dependencies

Step completion is derived, not permanent. When a later answer invalidates an earlier step:

1. recompute the affected step's completion;
2. mark it incomplete and explain the dependency;
3. preserve the current location rather than forcibly navigating;
4. block final submission until the invariant is restored.

Represent dependency metadata separately from field ownership so the wizard knows which completed
steps to recompute.

## Hidden-value policy

Visibility is not data ownership. Every conditional branch chooses one domain policy:

- **preserve** when hiding is reversible presentation state;
- **clear** when the value becomes semantically invalid;
- **omit at serialization** when the value may remain locally useful but must not be submitted.

`shouldUnregister` is one implementation mechanism, not the policy itself. Validate and serialize
according to the selected policy.

## Review screens

Use `getValues()` for a terminal, read-only snapshot. Use `useWatch` only when the review must update
while fields remain editable.

Sources: [advanced wizard usage](https://react-hook-form.com/advanced-usage),
[trigger](https://react-hook-form.com/docs/useform/trigger),
[useForm context](https://react-hook-form.com/docs/useform).
