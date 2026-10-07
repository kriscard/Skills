> **Read this when:** reviewed changes affect rendered web UI, interaction, forms, responsive behavior, or accessibility.

# Frontend risk checks

Use these as candidate generators, not automatic violations. Report only changed-code issues with a
reachable user impact that pass the shared review validation gate.

## Semantics and keyboard access

- Actions use native buttons; navigation uses links with real destinations.
- Native controls rely on native keyboard behavior. Custom interactive elements expose the required
  role, focusability, keyboard activation, and visible focus.
- Icon-only controls and ambiguous links have an accessible name.
- Form controls have programmatic labels; related radio or checkbox groups use group semantics.
- Descriptions and errors are associated with their controls, and invalid state is exposed on the
  interactive element.
- Dialogs, menus, popovers, and drawers manage initial focus, focus return, Escape behavior, and
  background interaction appropriate to the component.
- Zoom remains available, and essential interactions do not depend on hover, color, or pointer input
  alone.

## Forms and asynchronous state

- Submit and mutation paths prevent accidental duplicate work while preserving retry after failure.
- Validation and transport failures remain visible, associated, and actionable without erasing user
  input.
- Button defaults cannot submit a form accidentally.
- Paste remains available for credentials, codes, and other text entry unless a demonstrated
  security requirement says otherwise.
- `name`, input type, input mode, and autocomplete tokens match the field's actual purpose when the
  browser or password manager consumes them.
- Pending, success, and failure updates are perceivable to assistive technology when they do not
  move focus.

## Rendering and state correctness

- Controlled inputs have a change path; uncontrolled inputs use stable defaults.
- Server and client output avoid deterministic hydration mismatches.
- Empty, loading, error, and unusually long-content states preserve the primary task.
- Conditional UI has an explicit value-retention and submission policy.
- User-generated HTML, URLs, and style values cross an explicit sanitization or validation boundary.
- Images that affect layout reserve dimensions; critical and deferred loading choices match their
  viewport role.

## Interaction and motion

- Focus indicators remain visible against the rendered background.
- Motion respects reduced-motion preferences when movement is non-essential or vestibularly risky.
- Drag, swipe, and gesture interactions have an equivalent non-gesture path when required to
  complete the task.
- Destructive actions provide recovery proportional to impact, such as confirmation or undo.
- Unsaved-work protection matches the actual risk of losing meaningful user input.

## Performance evidence

Treat performance as a finding only when the changed path demonstrates meaningful cost. Inspect:

- render-wide subscriptions or state updates triggered by local interaction;
- repeated layout reads/writes or forced synchronous measurement;
- unbounded DOM or list work on realistic data;
- repeated network, image, or font work attributable to the change;
- interaction latency on controlled inputs or animation paths.

Recommend virtualization, memoization, preloading, or URL-state changes only when evidence shows the
specific mechanism addresses the observed cost or correctness problem.

## Exclusions

Typography taste, title casing, copy voice, Tailwind preferences, arbitrary item-count thresholds,
and generic “best practice” substitutions are outside bug-first review unless repository guidance
or a concrete user impact makes them applicable.

Completion: every reported frontend finding identifies the affected user, interaction path,
platform or assistive context, concrete consequence, and smallest safe correction.
