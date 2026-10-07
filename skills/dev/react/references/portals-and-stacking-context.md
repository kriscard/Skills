> **Read this when:** implementing or debugging dialogs, popovers, tooltips,
> floating UI, portals, stacking context, overlay focus, or dismissal behavior.

# Portals and Overlay Composition

An overlay combines React ownership with browser layout, focus, and event behavior. Use
the project's installed primitive library when it already owns these contracts.

## Portal decision

Portal when the overlay must escape clipping, stacking, or layout constraints of its
trigger subtree. A portal changes physical DOM placement only: Context and synthetic
event propagation still follow the React tree. Account for that behavior in parent click
handlers, outside-interaction detection, and nested overlays.

A larger `z-index` cannot escape an ancestor stacking context. Inspect positioned
ancestors, transforms, opacity, isolation, containment, and clipping before changing
numbers.

## Interaction contract

Account for:

- trigger and controlled/uncontrolled open state;
- initial focus and focus restoration;
- focus trapping for modal behavior;
- Escape, outside interaction, and nested overlays;
- scroll locking and viewport changes;
- pointer and keyboard activation;
- accessible name, role, description, and modality;
- server rendering and hydration of the portal target.

Prefer established accessible primitives over recreating the full contract.

## Composition

Keep overlay state at the nearest owner that coordinates trigger and content. Expose
controlled state only when callers genuinely coordinate it. Use compound APIs when
multiple callers arrange trigger, content, title, and actions differently while sharing
the same overlay behavior.

## Verification

Test opening, keyboard traversal, nested interactions, dismissal, focus restoration,
portal event propagation, scroll behavior, and narrow viewports. Use `agent-browser`
when available to inspect the semantic tree and capture the failing or corrected state.

**Complete when:** the overlay escapes the intended layout constraint, stacking follows
the product hierarchy, focus and dismissal are correct, and pointer and keyboard flows
both succeed.
