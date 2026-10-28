> **Read this when:** Defining Tailwind-facing theme aliases, switching runtime role values, sharing theme CSS, or registering external class-bearing source files.

# Theme aliases and source visibility

Theme values and class detection are separate contracts. Importing a shared theme makes
its tokens available; it does not make utilities used by an ignored package appear in
the build.

## Expose stable roles over runtime values

Use ordinary CSS variables for switchable values and `@theme inline` for the stable
Tailwind utility API:

```css
/* /repo/packages/theme/theme.css */
:root {
  --surface: white;
  --surface-content: #171717;
  --action: #1d4ed8;
  --action-content: white;
}

[data-theme="dark"] {
  --surface: #171717;
  --surface-content: #fafafa;
  --action: #60a5fa;
  --action-content: #172554;
}

@theme inline {
  --color-surface: var(--surface);
  --color-surface-content: var(--surface-content);
  --color-action: var(--action);
  --color-action-content: var(--action-content);
}
```

Components can use `bg-surface text-surface-content` and
`bg-action text-action-content` while the runtime values change. `inline` is important
for aliases that reference other variables because generated utilities use the
referenced value without unexpected variable-resolution scope. Use `@theme static` only
when consumers need all declared theme variables emitted even without detected utility
use.

`frontend` owns role names, contrast, theme activation, persistence, server rendering,
and first-paint behavior. A color space is not required by this mechanism.

**Failure checks:** switch every supported theme and inspect paired content/surface,
focus, disabled, selected, and destructive states. Generated CSS or a changed color does
not prove contrast or prevent a first-paint flash.

## Import the theme and register component source independently

Assume this exact layout:

```text
/repo/apps/web/src/styles.css
/repo/packages/theme/theme.css
/repo/node_modules/@acme/ui/dist/index.js
```

The app stylesheet owns both paths, so both are resolved from
`/repo/apps/web/src/styles.css`:

```css
/* /repo/apps/web/src/styles.css */
@import "tailwindcss";
@import "../../../packages/theme/theme.css";
@source "../../../node_modules/@acme/ui/dist/index.js";
```

The theme import exposes role variables and generated role utilities. The `@source`
directive adds the ignored dependency file whose complete literal classes must be
scanned. Change these illustrative paths to match the real stylesheet and package
layout; do not prescribe this workspace shape to another project.

Use `source("...")` on the Tailwind import when the automatic detection base itself is
wrong. Use `@source` to add a specific ignored or external path. Keep safelisting as a
bounded fallback for classes that cannot live in detectable source, not a substitute
for registering their owner.

**Generated-CSS diagnosis:**

1. Build without the external `@source` line: shared role utilities can exist, while a
   package-only class such as `data-[state=open]:rotate-180` is absent.
2. Add the stylesheet-relative `@source`: the package-only selector appears.
3. Remove the theme import while retaining `@source`: package classes may appear, but
   role aliases and values are absent or unresolved.

These controls prove token/source wiring only. They do not prove first-paint theme
selection, contrast, package runtime behavior, or that every dependency file should be
scanned.

## Match state selectors to the external package contract

External packages may expose complete classes and runtime state independently. Verify
the actual distributed file and DOM attributes rather than guessing from source names:

```js
// /repo/node_modules/@acme/ui/dist/index.js
export const disclosureClasses =
  "text-surface-content data-[state=open]:rotate-180";
```

The source must contain complete utility tokens. The component runtime must still emit
`data-state="open"`; scanning the file does not create that state.

**Failure checks:** confirm the production artifact path exists, the file is not already
inside automatic detection, the selector is present after registration, and changing
working directories does not silently change resolution.

## Sources

- [Theme variables](https://tailwindcss.com/docs/theme)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Dark mode](https://tailwindcss.com/docs/dark-mode)
