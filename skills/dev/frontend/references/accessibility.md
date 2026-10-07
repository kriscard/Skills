> **Read this when:** implementing or auditing semantic controls, labels, keyboard
> interaction, focus behavior, announcements, dialogs, forms, or basic accessibility.

# Accessibility Baseline

Accessibility is a frontend correctness constraint, but this reference is deliberately
compact. Apply the baseline to the target workflow. Use a dedicated accessibility audit
when the user requests standards-level coverage.

## Native semantics first

- Use the native element whose behavior matches the interaction.
- Every control has an accessible name.
- Inputs have programmatic labels and errors are associated with the field.
- Links navigate; buttons perform actions.
- Images have meaningful alternative text or are explicitly decorative.
- Heading order and landmarks make the page structure understandable.

ARIA supplements native HTML when no native pattern fits. Match role, state, and
keyboard behavior as one contract.

## Keyboard and focus

- Every interactive control is reachable and operable without a pointer.
- Focus remains visible.
- Opening overlays moves focus intentionally; closing restores it to the trigger.
- Focus is not trapped outside a modal or lost after dynamic updates.
- Escape and arrow-key behavior follows the established primitive or platform pattern.

## Dynamic states

- Loading and pending behavior communicates what is happening without removing the
  user's place unexpectedly.
- Errors are visible, associated with their source, and recoverable.
- Important asynchronous updates are announced when visual context alone is
  insufficient.
- Disabled controls remain understandable; pending actions prevent accidental duplicate
  submission.

## Verification

Exercise the primary flow with keyboard navigation and inspect its semantic tree. When
browser access is available, invoke `agent-browser` for interaction and evidence. A
basic pass is complete when controls have correct semantics and names, focus follows the
workflow, keyboard operation succeeds, and errors or status changes are perceivable.
