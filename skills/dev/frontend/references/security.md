> **Read this when:** handling unsafe HTML or URLs, authentication material,
> browser storage, CSP, CORS, third-party scripts, cross-window messages, or another
> browser trust boundary.

# Frontend Security

Model the trust boundary before recommending a control. Client checks improve user
feedback; authorization and authoritative validation remain server responsibilities.

## Injection surfaces

React escapes interpolated text, but explicit HTML insertion, URL construction, DOM
APIs, CSS values, markdown renderers, and third-party widgets can reopen injection
paths.

- Prefer structured rendering over HTML strings.
- When product requirements require HTML, sanitize with the project's established,
  context-appropriate sanitizer before insertion.
- Allowlist URL schemes and construct URLs with platform APIs.
- Treat DOM sinks and scriptable attributes as security-sensitive.
- Preserve the sanitizer configuration beside the rendering boundary and test known
  malicious inputs.

## Authentication material and storage

Keep session credentials out of script-readable persistence when the architecture can
use secure, HttpOnly, SameSite cookies. Browser storage is appropriate for minimal,
non-sensitive, versioned preferences and caches—not secrets whose disclosure grants
account access.

Account for CSRF, token rotation, logout, session expiry, and cross-tab behavior in the
whole authentication design. A frontend storage change is not sufficient evidence that
an authentication flow is secure.

## Browser and network boundaries

- Validate `postMessage` origins and payloads.
- Restrict redirects and navigation targets to intended destinations.
- Treat CORS, CSP, cookie attributes, and security headers as server or deployment
  contracts; inspect their actual configuration rather than adding client workarounds.
- Use CSP as defense in depth and align nonces or hashes with the deployed rendering
  model.
- Limit third-party scripts, permissions, and data access; load them according to user
  consent and product need.
- Apply subresource integrity where immutable cross-origin assets and the delivery model
  support it.

## Reporting

A security finding must name the source, sink or protected asset, attacker-controlled
input, and plausible consequence. Separate demonstrated exploit paths from defense-in-
depth improvements.

## Completion criterion

Security work is complete when the relevant trust path is traced end to end, untrusted
input is constrained before the sensitive sink, authorization remains server-enforced,
storage matches the threat model, and deployed headers or browser behavior are verified
where available.
