> **Read this when:** implementing Tailwind v4 CSS-first configuration, theme variables, source detection, safelisting, prefixes, compatibility config, or dark-mode variant syntax.

# V4 configuration and sources

## CSS-first configuration

Start from the active stylesheet, not a new config file:

```css
@import "tailwindcss";

@theme {
  --font-display: "Example Sans", sans-serif;
  --breakpoint-3xl: 120rem;
  --color-brand-500: #4f46e5;
}
```

Use `@theme` only for values that should create Tailwind utilities or variants. Use
ordinary CSS variables under `:root` or another selector when the value should remain a
runtime variable without creating a Tailwind API. Follow the product's existing token
vocabulary; `frontend` owns whether a token should be semantic, primitive, responsive,
or theme-specific.

Theme namespaces map variables to APIs, including `--color-*`, `--font-*`,
`--breakpoint-*`, `--container-*`, `--ease-*`, and `--animate-*`. Do not add variables
without a caller; each public theme variable expands the project's utility surface.

Use the options deliberately:

- `@theme inline` when a theme variable references another variable and generated
  utilities should embed the referenced value rather than the theme variable name.
- `@theme static` when all declared theme variables must be emitted even when no
  detected class currently uses them.
- `@theme { --namespace-*: initial; }` when replacing a default namespace.
- `@theme { --*: initial; }` only for an intentionally custom theme, because it removes
  the default theme-backed utility vocabulary.

Theme variables compile to normal CSS variables and can be used at runtime with
`var(--color-brand-500)`. This does not require any particular color space.

## Source detection

V4 scans project files as plain text and ignores files covered by `.gitignore`,
dependencies under `node_modules`, binary files, CSS files, and common lockfiles.
It does not parse JavaScript expressions.

Keep class names complete in source:

```tsx
const tones = {
  success: "bg-green-600 text-white",
  danger: "bg-red-600 text-white",
};

return <button className={tones[tone]} />;
```

Do not construct fragments such as `` `bg-${tone}-600` ``. A class that never appears
as a complete token cannot be detected reliably in either v3 or v4.

Use source controls only for observed gaps:

```css
@import "tailwindcss" source("../src");
@source "../node_modules/@acme/ui";
@source not "../src/legacy";
```

- `source("...")` sets the scan base, useful when a monorepo build runs from another
  working directory.
- `@source "..."` registers ignored or external source trees relative to the
  stylesheet.
- `@source not "..."` excludes a known source tree.
- `source(none)` disables automatic detection for stylesheets whose sources must be
  isolated explicitly.

Safelist exact utilities with `@source inline()` and brace expansion when necessary:

```css
@source inline("{hover:,focus:,}underline");
```

Use `@source not inline()` to block generated utilities. Prefer detectable source over
large safelists; safelists can hide an ownership or extraction problem.

## Prefixes and legacy compatibility

Set a v4 prefix on the import:

```css
@import "tailwindcss" prefix(tw);
```

Use it at the beginning of classes as a variant: `tw:flex tw:hover:bg-blue-600`.
Continue to declare unprefixed theme variable names; generated CSS variables receive
the configured prefix.

Load legacy assets explicitly when migration requires them:

```css
@config "../../tailwind.config.js";
@plugin "@tailwindcss/typography";
```

CSS-defined settings take precedence where the compatibility layer can merge them.
`corePlugins`, `safelist`, and `separator` from JavaScript config are unavailable in
v4.

## Variants and dark mode

Create recurring selector variants with `@custom-variant`:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

Apply an existing Tailwind variant inside custom CSS with `@variant`. Keep one-off
selectors as arbitrary variants until repetition justifies a named API.

V4 dark mode defaults to `prefers-color-scheme`. To bind `dark:*` to product-controlled
state, override the variant after the product policy is known:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

A data attribute works the same way. Storage, flash prevention, system preference, and
server rendering are browser/product concerns owned by `frontend`; this reference owns
only the Tailwind variant syntax.

## Official sources

- [Theme variables](https://tailwindcss.com/docs/theme)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Dark mode](https://tailwindcss.com/docs/dark-mode)
