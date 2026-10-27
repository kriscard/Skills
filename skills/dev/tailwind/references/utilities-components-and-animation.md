> **Read this when:** implementing or reviewing Tailwind utilities, arbitrary values or variants, custom utilities, component CSS, CSS modules, animations, starting styles, or 3D transforms.

# Utilities, components, and animation

## Utility syntax

Prefer an existing project token and built-in utility. Use arbitrary values for genuine
one-offs, and promote repeated values only when they represent a stable system choice:

```html
<div class="top-[117px] bg-(--panel-bg) text-[length:var(--label-size)]"></div>
```

V4 parentheses are shorthand for CSS custom properties and insert `var()`
automatically. Square brackets still express arbitrary values. Add a CSS data-type hint
when the namespace is ambiguous.

Use slash modifiers for opacity and other modifier-aware utilities, for example
`bg-black/50` or `text-sm/6`. Put v4's important marker last, such as `flex!` or
`hover:bg-red-600!`, and reserve it for a demonstrated cascade conflict.

Use arbitrary variants for one-off selectors and at-rules:

```html
<li class="[&.is-dragging]:cursor-grabbing"></li>
<div class="[@supports(display:grid)]:grid"></div>
```

Register a repeated variant with `@custom-variant` instead of duplicating selector
strings.

## Custom utilities and component CSS

In v4, register utilities that must compose with Tailwind variants through `@utility`:

```css
@utility content-auto {
  content-visibility: auto;
}

@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

Functional v4 utilities can use `--value()` for theme, bare, literal, and arbitrary
values, and `--modifier()` for slash modifiers. Implement only the value forms the
utility's contract needs. Register positive and negative forms separately when negative
values are supported.

V3 uses `@layer utilities` and `@layer components` for custom classes that participate
in Tailwind's layer and variant processing. Do not replace this with `@utility` unless
the project is on v4.

Use ordinary CSS for third-party overrides and selectors that are not reusable utility
APIs. Use `@apply` narrowly when custom CSS must reuse Tailwind declarations, such as a
third-party widget override. Repeated markup should usually be extracted through the
project's component/template mechanism instead of creating a CSS class for every
combination of utilities.

V4 stylesheets compiled separately from the main stylesheet, including CSS modules and
Vue, Svelte, or Astro component style blocks, do not automatically see custom theme
variables, utilities, or variants. Reference the main stylesheet without duplicating
its output:

```css
@reference "../../app.css";

.title {
  @apply text-2xl font-bold;
}
```

Use `@reference "tailwindcss"` when only the uncustomized default theme is needed.

## Container and responsive syntax

V4 customizes the built-in `container` through `@utility` rather than the v3
`theme.container` options:

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

Tailwind supplies breakpoint, max-width, container-query, and arbitrary variants.
Choose among them from the product's content and layout requirements through
`frontend`; this skill owns their syntax, not a universal responsive strategy.

## Animation and transitions

Use built-in `animate-spin`, `animate-ping`, `animate-pulse`, `animate-bounce`, and
`animate-none` when their behavior fits. In v4, create named project animations with an
`--animate-*` theme variable and colocated keyframes:

```css
@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;

  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
}
```

V3 defines named animations in `theme.extend.animation` and keyframes in
`theme.extend.keyframes`. Both versions support arbitrary animation values such as
`animate-[wiggle_1s_ease-in-out_infinite]`.

Use `motion-safe:` and `motion-reduce:` according to the interaction contract. Reduced
motion behavior belongs to `frontend`; do not assume that removing every transition is
the correct fallback.

V4's `starting:` variant maps to `@starting-style` for entry transitions and transitions
from `display: none`, often combined with `open:` for dialogs and popovers. Confirm the
project's browser support before relying on this platform feature.

V4 includes 3D APIs such as `perspective-*`, `transform-3d`, `rotate-x-*`, `rotate-y-*`,
`translate-z-*`, and related origin utilities. Use them when the design calls for 3D
space and verify fallbacks. `transform-gpu` is an opt-in troubleshooting/performance
control, not a default companion to animation; compare rendering and memory behavior
before adding it.

## Migration-sensitive utility behavior

- V4 gradient directions use names such as `bg-linear-to-r`; migration can require
  `via-none` to clear a retained middle stop.
- Border and ring width do not imply the v3 colors. Add explicit colors when required.
- Individual transform utilities in v4 reset and transition through their individual
  CSS properties, not only the composite `transform` property.
- Order-sensitive stacked variants apply left-to-right in v4 and right-to-left in v3.

## Official sources

- [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Hover, focus, and other states](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Animation](https://tailwindcss.com/docs/animation)
- [Perspective](https://tailwindcss.com/docs/perspective)
- [Transform style](https://tailwindcss.com/docs/transform-style)
- [Tailwind CSS v3 adding custom styles](https://v3.tailwindcss.com/docs/adding-custom-styles)
- [Tailwind CSS v3 animation](https://v3.tailwindcss.com/docs/animation)
