> **Read this when:** Choosing among built-in utilities, arbitrary values/variants, custom utilities, ordinary CSS, `@apply`, separately compiled component CSS, or motion utilities.

# Utilities, custom CSS, and motion

Start with the project's token and built-in utility. Introduce a new styling API only
when the value or selector has a stable reusable contract.

## Choose the smallest extension

Use an arbitrary value for a genuine one-off and a token for a repeated system choice:

```html
<div class="top-[117px] bg-(--panel-bg) text-[length:var(--label-size)]"></div>
```

The v4 custom-property shorthand inserts `var()`; square brackets remain the general
arbitrary-value syntax. Add a CSS data-type hint when Tailwind cannot infer the intended
namespace. Repetition is evidence to inspect, not an automatic token: promote the value
only when callers should share its meaning.

Use an arbitrary variant for one local selector or at-rule:

```html
<li class="[&.is-dragging]:cursor-grabbing"></li>
<div class="[@supports(display:grid)]:grid"></div>
```

When a selector becomes a stable repeated state contract, name it with
`@custom-variant`. Prefer native `aria-*`, `data-*`, `group`, or `peer` variants when
they already express the relationship.

**Failure checks:** every arbitrary token appears literally in detected source; repeated
values have the same meaning, not merely the same number; the selector matches the real
DOM relationship.

## Register a utility only for a reusable utility contract

A v4 `@utility` participates in variants and should implement only the supported value
forms:

```css
@utility content-auto {
  content-visibility: auto;
  contain-intrinsic-size: auto 20rem;
}
```

Use ordinary CSS when the selector belongs to third-party markup or is not a reusable
utility API. Use `@apply` narrowly when such CSS must consume project utilities:

```css
@reference "../../styles.css";

.vendor-dialog__title {
  @apply text-lg font-semibold text-surface-content;
}
```

`@reference` exposes the main stylesheet's theme, utilities, and variants to separately
compiled CSS without duplicating its output. Use `@reference "tailwindcss"` only when
the uncustomized default theme is sufficient.

Repeated JSX is usually a component/template responsibility, not a reason to create a
CSS class for every utility combination. Conversely, a React wrapper that only renames
`flex items-center gap-2` has not created a component contract.

**Failure checks:** the custom utility composes with the variants it promises; component
CSS resolves the intended reference; production output contains one copy of the needed
rules; third-party overrides remain scoped to the integration.

## Resolve conflicts before escalating specificity

Choose mutually exclusive utilities before reaching for an important modifier. In v4,
the important marker is trailing, such as `hover:bg-red-600!`. Use it only for a
demonstrated cascade/specificity boundary whose owner is understood.

Raw HTML class order does not define precedence between conflicting Tailwind utilities.
A merge library can model some utility conflicts at a deliberate API boundary, but it
does not replace cascade inspection for custom CSS, arbitrary properties, layers, or
third-party rules.

**Failure checks:** inspect generated and computed CSS; identify the winning layer,
selector, and declaration; remove accidental conflicts rather than accumulating
`!important`.

## Make motion state-driven and bounded

Use targeted transition properties and the state the primitive already exposes:

```html
<div
  data-state="closed"
  class="opacity-0 transition-opacity duration-150 data-[state=open]:opacity-100 motion-reduce:transition-none"
></div>
```

For named project motion, define a v4 `--animate-*` theme variable with colocated
keyframes. Use `starting:` only when the installed browser contract supports
`@starting-style`. `motion-safe:` and `motion-reduce:` implement the product's motion
contract; they do not decide what the reduced path should be.

`transform-gpu` is a measured rendering control, not a default companion to animation.
Compare paint, memory, and visual output before retaining it.

**Failure checks:** open/closed state drives the expected declarations; reduced-motion
behavior matches the frontend contract; focus, dismissal, and announcements still work;
no performance claim is made without measurement.

## Compatibility seam

These examples target v4. For an existing v3 or mixed project, load
`compatibility-and-migration.md` before using v4 directives, custom-property shorthand,
important syntax, or stacked-variant ordering. Preserve working installed conventions
unless migration is part of the request.

## Sources

- [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Hover, focus, and other states](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Animation](https://tailwindcss.com/docs/animation)
