> **Read this when:** tests are requested, existing tests cover the changed form, or form behavior is complex enough to need regression evidence.

# Testing

Prefer behavioral tests with Testing Library/user-event:

- fill and submit through accessible roles and labels;
- await validation and form-state updates with `findBy*` or `waitFor`;
- assert invalid submission does not call the mutation;
- assert field and root server errors remain visible while entered values survive;
- assert duplicate submission is prevented;
- assert reset/baseline behavior after success;
- assert conditional preserve/clear/omit policy;
- assert field-array add, remove, and reorder preserve row identity;
- assert wizard cross-step dependencies invalidate prior completion and block final submission.

Avoid testing RHF internals or suppressing async warnings by wrapping initial render in unnecessary
`act`. Tests are optional unless the user requests them or project guidance requires them, but the
TypeScript typecheck is always required.

Source: [Advanced testing](https://react-hook-form.com/advanced-usage#TestingForm).
