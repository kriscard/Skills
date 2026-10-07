> **Read this when:** the project is confirmed to use React 19 or later and the task
> involves ref as a prop, `use`, action hooks, optimistic state, transitions, or form
> actions.

# React 19+ Integration

Confirm the installed React version, renderer support, framework support, and compiler
configuration before applying this reference. Use installed types and current React or
framework documentation for exact signatures.

## Migration posture

Adopt a newer API when it simplifies an active contract or removes compatibility work.
Avoid repository-wide churn merely to use a newer spelling. Preserve library support
requirements when shared packages still target older React versions.

## Refs and context

React 19 permits refs as ordinary component props. Expose a ref only when the caller
needs DOM or imperative access; derive wrapper props with the appropriate ref-aware
utility. Existing `forwardRef` code can remain until a deliberate migration is useful.

`use` can read supported resources and Context and has different control-flow rules from
ordinary Hooks. Apply it only where the detected renderer and framework support the
resource being read.

## Actions and optimistic state

Action-oriented APIs can coordinate pending, error, submitted, and optimistic state.
Keep the action contract with the owner of the mutation. Preserve submitted values when
validation rejects them, prevent duplicate work, and define rollback or recovery for
optimistic behavior.

Framework Server Actions or Server Functions are transport and security boundaries owned
by the framework skill. Authentication, authorization, validation, and deployment
compatibility still require explicit verification.

## Completion criterion

A React 19+ change is complete when version and renderer support are verified, the new
API simplifies a real ownership or interaction contract, compatibility requirements are
preserved, and tests cover pending, error, and recovery behavior where applicable.
