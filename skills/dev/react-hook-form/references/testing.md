> **Read this when:** tests are requested or affected, or the change alters async submission, baseline, conditional/wizard, or field-array behavior.

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

Test through user-visible behavior rather than RHF internals. Use async queries for observable
updates instead of adding `act` around the initial render. Complete verification only when each
changed behavior that triggered this reference has a focused regression assertion, or a missing
test harness is reported as a remaining risk.

Source: [Advanced testing](https://react-hook-form.com/advanced-usage#TestingForm).
