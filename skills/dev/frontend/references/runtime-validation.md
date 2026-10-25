> **Read this when:** browser-controlled values enter through a form, URL,
> storage, `postMessage`, upload control, or client-side integration.

# Frontend Runtime Validation

Use the `typescript` runtime-boundary reference for generic parsing, schemas, narrowing,
and evidence rules. This reference owns where browser values enter the product and how
validation affects the user experience.

## Forms and uploads

Validate early enough to provide useful field or form feedback, preserve the submitted
value when correction is possible, and focus or announce the error through the
component's accessibility contract. Client validation improves feedback; the trusted
server or write boundary still enforces authoritative rules.

For uploads, treat metadata, MIME declarations, and client-side inspection as hints
unless the trusted boundary verifies the file. Keep size, type, and security failures
visible and recoverable.

## URL state

Path, query, and hash values are strings or absent at the browser boundary. Parse them
into the feature's real state before use. Define behavior for missing, repeated,
malformed, and unsupported values; update the URL without losing unrelated state.

Do not silently repair a security-sensitive value into a different meaning. A rejected
URL should lead to a stable fallback, error, or redirect owned by the product flow.

## Browser storage

Storage content can be stale, manually edited, written by an older release, or missing.
Version persisted objects, parse reads before use, and define migration or reset behavior
for unsupported versions. Storage availability and quota failures need a recoverable
path when persistence affects the workflow.

Do not store authentication secrets merely because a value has a TypeScript type. Load
the security reference for auth storage and other browser security decisions.

## Cross-window messages

For `postMessage` and similar integrations, verify the expected origin/source when the
protocol requires it, then parse the message payload into a named protocol variant.
Unknown message kinds should follow the compatibility policy rather than being asserted
into a known command.

## Third-party client integrations

Read the installed SDK declarations and documentation. A documented validating SDK may
establish runtime evidence; a generated interface alone does not. Adapt unstable or
loosely typed client values at one integration boundary instead of leaking them through
the feature.

## Completion criterion

Frontend runtime validation is complete when each applicable browser entry point is
parsed before trusted use, invalid input has an accessible and recoverable user outcome,
persisted versions and message compatibility are deliberate, authoritative server
validation remains intact, and validated values are not repeatedly parsed downstream.
