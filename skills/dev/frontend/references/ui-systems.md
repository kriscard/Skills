> **Read this when:** working with design tokens, variants, styling contracts,
> responsive layout, theming, reusable UI primitives, Tailwind, CSS modules, or an
> installed component system.

# UI Systems

Follow the installed styling and component conventions before introducing another
layer. A UI system should constrain decisions enough to keep the product coherent while
leaving composition and layout flexible where variation is real.

## Detect the system

Inspect:

- token and theme sources;
- component registry or primitive library;
- class-composition and variant utilities;
- responsive conventions and container strategy;
- dark-mode and color-scheme handling;
- existing lint rules that enforce the design surface.

Treat configuration and existing primitives as the source of truth. Recommend a new
library only for a demonstrated missing capability.

## Tokens and variants

- Name tokens by product intent when callers should not choose raw values.
- Keep color pairs, spacing, radius, typography, and motion consistent with the existing
  vocabulary.
- Encode recurring component decisions as typed variants.
- Keep one-off layout composition close to the consuming feature.
- Make unsupported combinations unrepresentable when the design system owns the
  decision.

## Responsive behavior

Design around available space and content pressure before adding device labels. Check
text expansion, wrapping, overflow, zoom, touch targets, and narrow containers. Prefer
CSS layout capabilities over JavaScript viewport branching when CSS can express the
behavior.

## Component boundary

This reference owns visual contracts, tokens, and surface consistency. The `react`
skill owns component composition, state, and rendering behavior. A reusable styled
primitive should preserve native semantics and expose the underlying element contract
without leaking its internal styling machinery.

## Verification

A UI-system change is complete when it uses the detected token and variant vocabulary,
works across relevant container widths and themes, preserves semantics, and does not
create a parallel styling convention.
