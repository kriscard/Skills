> **Read this when:** integrating native, design-system, UI-library, or custom controls, or wiring field accessibility.

# Adapters and accessibility

## Choose by contract

- **Native contract:** the component forwards the real input ref and native `name`, `onChange`, and
  `onBlur` behavior. Spread `register(name)`.
- **Controlled adapter:** the component owns its value or emits a non-native callback. Use
  `Controller` or `useController` and translate its contract.
- **Local UI state:** a controlled component may keep presentation-only state locally while
  `field.onChange` receives the normalized form value.

Follow an existing project abstraction only after confirming it preserves these contracts.

## Adapter matrix

| Widget behavior | Wiring |
| --- | --- |
| Native text/textarea/input | `{...register(name)}` |
| Event-based controlled input | `value`, `onChange(event)`, `onBlur`, `name`, `ref` |
| Value-change select/radio | `value`, `onValueChange={field.onChange}`, `onBlur`, `name`, `ref` when available |
| Checked-state switch/checkbox | `checked`, `onCheckedChange={field.onChange}`, `onBlur`, `name`, `ref` when available |
| Checkbox collection | derive the next immutable array, then call `field.onChange(next)` |
| Date/number/custom value | translate input and output explicitly; decide how empty values map |
| Popover/ref-less widget | provide an explicit touched/validation boundary when it closes or loses interaction |

`Controller` performs registration. Forward `field.onChange` instead of adding a parallel
`setValue` path, and preserve `field.ref` whenever the widget exposes a focusable input.

## Accessible field contract

Every field has:

1. a stable control `id` and matching label `htmlFor`;
2. `aria-invalid={fieldState.invalid}` on the interactive control or trigger;
3. description and error IDs connected through `aria-describedby`;
4. an error message rendered near the field and announced appropriately;
5. a usable ref for focus-on-error when the control supports one.

Use `fieldset` and `legend` for related radio buttons and checkboxes. For long forms, consider an
error summary that links to invalid controls. A wrapper named `Field` or `FormField` does not prove
these relationships exist—inspect the rendered contract.

## Avoid premature wrappers

Teach explicit adapters first. Extract a shared field abstraction only after the project repeats a
stable contract across real fields. One universal wrapper usually hides incompatible event,
focus, group, and error semantics.

Sources: [Controller](https://react-hook-form.com/docs/usecontroller/controller),
[useController](https://react-hook-form.com/docs/usecontroller),
[advanced accessibility](https://react-hook-form.com/advanced-usage),
[shadcn RHF examples](https://ui.shadcn.com/docs/forms/react-hook-form).
