> **Read this when:** writing, changing, reviewing, or deciding to keep a test; use it to make the test prove observable behavior rather than implementation structure.

# Test behavior, not implementation

A durable test calls the system the way a consumer does and asserts what that consumer can observe. Internal refactors may change the route to the outcome without changing the contract.

## Define the contract

Write the behavior as:

```text
Given <observable preconditions>
When <public action>
Then <observable outcome>
```

The consumer may be a user, caller, operator, downstream service, or assistive technology. Observable outcomes include returned values, rendered semantics, persisted state, emitted protocol messages, externally visible side effects, and documented errors.

Completion: the test name and assertions describe the same consumer-visible contract.

## Exercise the public surface

Call exported functions, public methods, HTTP endpoints, commands, component interactions, or documented events. Reach into private state only when that state is itself the supported contract.

Assert literal expected outcomes or fixtures defined independently from the production calculation. Reusing the implementation's helper, query, serializer, selector, or algorithm to calculate the expected value can make the same defect appear on both sides of the assertion.

Prefer one decisive behavioral assertion over a list of incidental calls. Interaction assertions are appropriate when the interaction is the contract—for example, publishing a required event or invoking an external protocol exactly once—not merely because a spy is available.

Completion: implementation internals can be renamed or reorganized without changing the test while a broken public outcome still fails it.

## Keep the assertion connected

Trace a causal line from the action to every assertion. Apply these checks:

- If collaborators returned neutral or empty values, would the test still pass? If yes, the assertion may be disconnected from the exercised path.
- If the implementation were replaced with a trivial stub, would the test fail?
- If a private function were renamed or extracted without behavior change, would the test still pass?
- Could the test pass without executing the behavior named in its title?

Delete assertions that only confirm the mock was configured, the framework rendered, or a private helper was called unless that fact is the accepted outcome.

Completion: each assertion can fail because of a realistic violation of the named behavior.

## Use doubles by scope

The selected boundary determines what is real:

- Keep the subject and the behavior-bearing path real.
- Replace dependencies outside the chosen scope when they are slow, destructive, nondeterministic, unavailable, or controlled by another system.
- Give doubles the smallest contract needed for the scenario.
- Assert outcomes first; assert calls only for contractual interactions.

A unit test may replace a repository. An integration test for that repository must keep it real. An HTTP handler test may replace a remote payment provider while keeping routing, validation, authorization, and response mapping real.

Completion: doubles sit outside the declared observation boundary and cannot make the subject pass without producing the expected outcome.

## Resist false confidence

Reject tests whose only evidence is:

- a snapshot accepted without semantic review;
- a mock call unrelated to an observable contract;
- an assertion copied from the implementation;
- coverage of lines without coverage of outcomes;
- a happy path when the requirement is primarily about failure or recovery;
- a test that passes before the intended behavior exists for an unexplained reason.

Completion: the test would have caught the defect or missing behavior it claims to cover.
