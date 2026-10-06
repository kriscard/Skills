> **Read this when:** RHF appears with React 19 actions, `useActionState`, or a Next.js Server Action.

# React actions boundary

Choose one clear owner for each concern:

- RHF may own client interaction, field subscriptions, and client validation.
- The server action owns authorization, authoritative validation, mutation, and returned server
  state.
- Pending and error state must have one visible source rather than duplicated competing state
  machines.

If RHF invokes an action from `handleSubmit`, send the parsed values intentionally and revalidate on
the server. Map returned field and form errors back into the chosen client error surface. Document
that a JavaScript-only bridge may sacrifice native progressive enhancement.

For simple server-owned forms, prefer the action APIs without introducing RHF. For a substantial
client-interaction form, RHF plus an action can be justified, but the ownership boundary must be
explicit and tested.

This reference is a boundary, not a Server Actions tutorial. Route deeper action design to the
project's React/Next.js guidance.
