# PRD Template

Use this template when generating `prd-phase-{n}.md` for each implementation phase.

---

# PRD: {Project Name} - Phase {N}

**Contract**: ./contract.md
**Phase**: {N} of {total phases}
**Focus**: {One-line description of this phase's focus}

## Phase Overview

{2-3 paragraphs describing what this phase accomplishes, why it's sequenced here, and what value users get after completion}

## User Stories

1. As a {user type}, I want {capability} so that {benefit}
2. As a {user type}, I want {capability} so that {benefit}
3. As a {user type}, I want {capability} so that {benefit}

## Functional Requirements

### {Feature Group 1}

- **FR-{N}.1**: {Requirement description}
- **FR-{N}.2**: {Requirement description}

### {Feature Group 2}

- **FR-{N}.3**: {Requirement description}
- **FR-{N}.4**: {Requirement description}

## Non-Functional Requirements

- **NFR-{N}.1**: {Performance requirement}
- **NFR-{N}.2**: {Security requirement}
- **NFR-{N}.3**: {Accessibility requirement}

## Dependencies

### Prerequisites

- {What must be complete before this phase}

### Outputs for Next Phase

- {What this phase produces for subsequent phases}

## Acceptance Criteria

- [ ] {Criterion 1}
- [ ] {Criterion 2}
- [ ] All tests passing
- [ ] No critical bugs open

## Open Questions

- {Unresolved items - remove section if none}

---

## Template Usage Notes

1. **User Stories**: Focus on user value, not implementation.
2. **Functional Requirements**: Use unique IDs (FR-1.1) for traceability.
3. **Non-Functional Requirements**: Don't skip performance, security, accessibility.
4. **Dependencies**: Be explicit about prerequisites and outputs.
5. **Acceptance Criteria**: Write for QA to use as tests.
