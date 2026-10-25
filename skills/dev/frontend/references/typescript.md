> **Read this when:** designing or auditing frontend component props, native or
> component wrappers, DOM event types, refs, children, or other browser-facing typed
> surfaces.

# Frontend TypeScript

Use the `typescript` skill for language-wide modeling, narrowing, generics, assertions,
compiler contracts, and generic runtime-boundary mechanics. This reference owns the
frontend-specific contract between components, platform elements, and browser APIs.

## Component APIs

Keep required and optional behavior visible in the prop model. When modes change which
props are legal, use the language-wide modeling guidance rather than a cluster of
interacting booleans and optional fields.

Type `children` according to what the component actually renders. Do not add arbitrary
children to a component with a fixed composition. Keep callback and event types specific
to the element and behavior being exposed.

## Native and component wrappers

Derive wrapper props from the wrapped element or component so native capabilities do
not drift from the public API. Use the React and framework helper that matches the
installed version and whether the wrapper exposes a ref.

A wrapper should deliberately resolve collisions between its own props and inherited
props. Preserve native accessibility and interaction props unless the component's
contract intentionally replaces them.

```typescript
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  tone?: 'primary' | 'quiet';
};

export function Button({ tone = 'primary', type = 'button', ...props }: ButtonProps) {
  return <button data-tone={tone} type={type} {...props} />;
}
```

Expose a ref only when consumers need direct DOM access or a deliberate imperative
contract. Match the installed React version and repository convention rather than
copying a ref pattern from a different version.

## Browser-facing values

DOM lookup, events, and browser APIs can produce absent or platform-dependent values.
Model those outcomes instead of asserting them away. Keep an assertion only when the
browser or framework invariant is established locally and declarations cannot express
it.

Load `runtime-validation.md` for forms, URL/search input, storage, and `postMessage`.
Use the `typescript` runtime-boundary reference for the generic parsing and evidence
rules behind those browser-specific cases.

## Verification

Frontend TypeScript work is complete when:

- consumers can express every supported component mode and no known-invalid one;
- wrappers preserve the intended native/component props and semantics;
- event, child, and ref contracts match actual behavior;
- nullable and platform-dependent browser results remain visible until handled;
- the project's established typecheck and relevant component/browser checks pass.
