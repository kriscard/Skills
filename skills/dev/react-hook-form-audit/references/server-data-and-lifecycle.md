> **Read this when:** initializing from fetched data, handling background refresh, submitting remotely, resetting, or updating the dirty baseline.

# Server data and lifecycle

## Choose ownership before initialization

This decision is data-library agnostic; it applies to SWR, TanStack Query, Apollo, loaders, and
custom fetching.

### Snapshot

Mount after data is ready or use async `defaultValues`, then let RHF own the editing snapshot.
Choose this when background updates should not alter the form. Suppress irrelevant refetches or
provide explicit conflict handling for long-lived/collaborative edits.

### Reactive values

Use reactive `values` only with an explicit reset/keep-dirty policy. Incoming values can overwrite
local edits; inspect installed RHF behavior and configure `resetOptions` deliberately.

### Derived server/client state

Keep untouched values sourced from server data and overlay only client edits. This requires
controlled fields and becomes complex for nested objects. Choose it only when background updates
must remain visible while editing; consider conflict highlighting rather than silent replacement.

## Boundary transformations

Validate the response shape, then map it into complete form defaults. Keep the inverse
form-to-payload mapping separate. Typical mappings include API `null` to UI `""`/`[]`, dates to an
input representation, and hidden branches to an explicit serialization policy.

## Submission

- Wrap async transport work in `try/catch`; `handleSubmit` does not swallow callback errors.
- Put field failures on their field path and form-wide failures on `root.*`.
- Keep edits intact after failure and expose a retry path.
- Disable duplicate submission using RHF or mutation pending state.
- For cache-backed data, await successful mutation and required invalidation before resetting to
  refreshed server data.
- Dirty-only payloads require PATCH semantics and nested extraction. They reduce overwrite surface;
  they do not resolve concurrent edits. Use a version, revision, or ETag when conflicts matter.

## Baseline

**Baseline** means the saved value snapshot used for dirty comparison.

- Initial defaults establish the first baseline.
- Whole-form `reset(values)` replaces current values and baseline; use it only when visible values
  should be replaced.
- In v8, use `resetDefaultValues(savedValues)` when installed types expose it and only the baseline
  should advance.
- In v7, choose deliberately: reset after a save only when replacing current values is safe, or keep
  an application-level saved snapshot when edits may continue during the request. Hide this version
  difference behind a small baseline adapter when the project supports both.

Source: [useForm](https://react-hook-form.com/docs/useform),
[handleSubmit](https://react-hook-form.com/docs/useform/handlesubmit),
[reset](https://react-hook-form.com/docs/useform/reset),
[resetDefaultValues](https://react-hook-form.com/docs/useform/resetdefaultvalues),
[TkDodo — React Query and Forms](https://tkdodo.eu/blog/react-query-and-forms).
