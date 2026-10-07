> **Read this when:** the user explicitly requests TDD or regression coverage, or a bug has an obvious cheap executable test target that can demonstrate the failure before the fix.

# Red, green, refactor

TDD is an evidence loop, not a requirement to manufacture a test harness for every change.

## 1. Establish the contract

Identify intended behavior, current behavior, the affected path, and the smallest observable reproduction. Resolve uncertain product behavior before encoding it as a test.

Completion: the proposed test has one accepted outcome and a realistic path to observe it.

## 2. Choose the executable check

Prefer the closest existing unit, component, integration, contract, or browser test surface used by the affected code. The test must be capable of failing because of the reported defect or absent behavior.

When no practical path exists, record why before changing production code. Use the nearest executable check only when it provides meaningful evidence; do not build unrelated infrastructure solely to claim a red phase.

Completion: a focused command can execute the proposed check, or the missing red evidence and its reason are explicit.

## 3. Red

Write the smallest test that expresses the contract, then run it before the production change.

A valid red run:

- executes the intended behavior path;
- fails for the expected behavioral reason;
- does not fail from syntax, setup, fixture, import, or environment errors;
- would pass once the intended behavior exists.

If the test passes, determine whether the behavior already exists, the assertion is disconnected, or the reproduction is wrong. Correct the test or scope before implementation.

Completion: the focused command fails for the expected reason and the failure output is captured.

## 4. Green

Make the smallest authorized production change that satisfies the contract while preserving nearby behavior. Run the same focused command until it passes.

Avoid widening scope to cleanup that the test does not justify. A discovered requirement or design change returns to the owning planning or approval workflow.

Completion: the red test passes for the intended behavioral reason.

## 5. Refactor

Improve names, duplication, or structure only while the focused test remains green. Then run the affected broader suite and repository checks.

Completion: focused and affected checks pass after refactoring.

## When red evidence is impractical

Examples include hardware-only behavior, inaccessible third-party failure modes, prohibitively expensive environments, or legacy code with no executable seam. Report:

- why failing-before evidence could not be produced;
- the closest evidence used instead;
- what remains unverified;
- the smallest future seam that would make regression testing practical.

Never describe a test written after the fix as failing-before evidence unless it was actually run against the prior behavior.
