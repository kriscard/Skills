---
name: refactor
description: >-
  Performs behavior-preserving refactors to improve readability, reduce
  complexity, and enhance maintainability without altering functionality. Use
  when the user says "refactor", "simplify this code", "clean up", "reduce
  complexity", "extract method", "this is too complex", or asks to improve
  naming/structure without changing behavior. Preserves all public APIs unless
  explicitly authorized.
---

# Refactor

Behavior-preserving refactor: improve code quality without changing externally
observable behavior or public APIs unless explicitly authorized.

## Methodology

### Step 1 — Characterize Current Behavior

Done when public interfaces, side effects, error behavior, performance
assumptions, and available tests or characterization checks are listed. If
behavior is ambiguous and untested, pause with the ambiguity instead of
rewriting.

### Step 2 — Identify the Refactor Target

Read the code fully and name the specific problem: complexity, duplication,
naming, coupling, dead code, unclear data structure, or control flow. Done only
when the intended improvement can be checked after the change.

### Step 3 — Apply Simplification Techniques (in priority order)

1. **Reduce Complexity** — simplify nested conditionals, use early returns
2. **Eliminate Redundancy** — remove duplicate code, apply DRY principles
3. **Improve Naming** — descriptive names that reveal intent
4. **Extract Methods** — break large functions into smaller, focused ones
5. **Simplify Data Structures** — use appropriate collections and types
6. **Remove Dead Code** — eliminate unreachable or unused code
7. **Clarify Logic Flow** — make the happy path obvious, handle edge cases clearly

### Step 4 — Quality Checks Per Refactoring

For each change:
- Verify behavior is preserved with tests or characterization notes
- Confirm tests still pass, or report why they could not be run
- Check that complexity genuinely decreased
- Confirm the code is more readable than before

### Step 5 — Communication Protocol

- Explain each refactoring and its benefit
- Highlight risks or assumptions
- Provide before/after comparisons for significant changes
- If a public API change would significantly improve the code, ask for permission first

### Step 6 — Constraints and Boundaries

- Never change public APIs without explicit permission
- Maintain backward compatibility and documented behavior
- Don't introduce new dependencies without discussion
- Respect existing code style and conventions
- Keep performance neutral or better unless explicitly improving it
- One concern per refactor — don't mix renaming, extraction, and logic changes

### Step 7 — When to Seek Clarification

Pause and ask when:
- Behavior is ambiguous and no tests document it
- A potential bug would be exposed or fixed by the refactor
- A public API change would greatly simplify the code
- Performance trade-offs exist
- Architectural decisions affect the refactoring approach

## Completion Gate

Do not call a refactor complete until:

- behavior characterization is documented
- tests or characterization checks were run, or the gap is explicitly reported
- public API compatibility is confirmed
- before/after complexity or readability improvement is stated
- any behavior changes are separated and approved as non-refactor work

## Output Format

Every refactoring response includes:
- The refactored code
- Summary of changes made and why each improves the code
- Evidence that behavior was preserved
- Any caveats or areas requiring attention
- Suggestions for further improvements if applicable

## Anti-Patterns to Avoid

- Abstracting things that are only similar on the surface
- Adding layers of indirection that make code harder to follow
- Renaming without a clear semantic improvement
- Refactoring code you don't fully understand yet
- Mixing refactoring with bug fixes or feature additions in the same commit
