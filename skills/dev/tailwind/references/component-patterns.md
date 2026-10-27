> **Read this when:** Authoring or reviewing styled components, class/variant composition, theme usage, runtime values, or worked Tailwind patterns.

# Component authoring patterns

Use `frontend` and its UI-system guidance for token meaning, visual hierarchy,
responsive policy, accessibility, and state requirements. Use `react` when component
composition or state ownership changes. This reference implements those contracts with
Tailwind; it does not choose a new design system or require a variant library.

Start from the installed version and existing primitives. The examples below are
original, illustrative patterns: adapt names, colors, interfaces, and source paths to
the product. A syntax example is not proof of accessible contrast or runtime behavior.

## Choose complete classes for finite choices

Map supported choices to complete literal class strings. Tailwind scans source text;
it does not evaluate a template such as `bg-${tone}-700` to discover possible utilities.

```tsx
const toneClasses = {
  neutral: 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800',
};

type Tone = keyof typeof toneClasses;

function ActionButton({
  tone = 'neutral',
  children,
  disabled,
  onClick,
}: {
  tone?: Tone;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        'disabled:pointer-events-none disabled:opacity-50',
        toneClasses[tone],
      ].join(' ')}
    >
      {children}
    </button>
  );
}
```

The outline classes in this example target v4. In v3, use
`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`
to establish the outline style as well as its width/color. Theme colors and state
contrast must be checked in the consuming product. Icon-only callers need an accessible
name; CSS does not supply it. A busy state additionally needs the product's interaction
and announcement contract, not only a spinner or opacity.

A literal map is sufficient for one axis. Use the installed CVA/variant helper for
several recurring axes or meaningful compound combinations. Avoid exposing internal
utility knobs or adding a dependency for a single ternary. Keep unsupported combinations
out of the public API when the design system owns that constraint.

## Make class conflicts deliberate

CSS stylesheet order, layers, and specificity decide precedence—not the position of a
class in the HTML attribute. Prefer mutually exclusive choices:

```tsx
<div className={grid ? 'grid gap-4' : 'flex gap-4'} />
```

`clsx` conditions and joins strings; it does not resolve conflicting Tailwind utilities.
Where the existing primitive intentionally permits caller overrides, use its established
helper and ordering contract, for example:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This helper is optional, not Tailwind itself. Match `tailwind-merge` to the project's
Tailwind version; current releases target v4, while its documentation recommends
v2.6.0 for Tailwind v3. Check custom class groups, prefixes, plugins, and arbitrary
values before promising that caller classes always override internal styles. Do not
ship the whole build-time Tailwind configuration to the browser to configure merging.

A primitive can instead expose a small typed variant API and limit caller overrides to
an explicit layout slot. Choose from the existing component contract; avoid scattering
`!important` to compensate for an unspecified override policy.

## Reuse token roles; keep theme values swappable

Campsite and Dub demonstrate shared surface/text/border roles backed by CSS variables.
The reusable idea is role reuse, not their particular names or palettes. Use the
frontend-approved vocabulary; raw palette colors are still appropriate where the
contract deliberately permits them.

For v4, a runtime theme value can feed a generated utility through `@theme inline`:

```css
@import 'tailwindcss';

:root {
  --surface: white;
  --ink: #171717;
}

[data-theme='dark'] {
  --surface: #171717;
  --ink: #fafafa;
}

@theme inline {
  --color-surface: var(--surface);
  --color-ink: var(--ink);
}
```

```html
<section class="bg-surface text-ink">...</section>
```

`inline` makes generated utilities use the referenced value; it avoids unexpected
resolution when an underlying variable is scoped more locally. For an existing v3
project, map the same variables in its `theme.extend.colors` instead:

```js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: { surface: 'var(--surface)', ink: 'var(--ink)' },
    },
  },
};
```

The v3 example uses complete CSS colors; it does not promise slash-opacity support for
these variables. For palette/opacity contracts, use the detected version's supported
color representation. A color space is a project choice, not a universal prerequisite.
Theme selection, SSR flash prevention, storage, and accessibility remain with frontend.

## Share theme ownership and source visibility separately

Sharing theme values does not ensure that utilities used by a UI package are detected.
For this assumed workspace:

```text
apps/web/src/app.css
apps/web/tailwind.config.js
packages/theme.css
packages/ui/src/Button.tsx
```

A v4 app can import the shared theme and register the component source independently:

```css
/* apps/web/src/app.css */
@import 'tailwindcss';
@import '../../../packages/theme.css';
@source '../../../packages/ui/src';
```

`@source` paths are relative to the stylesheet. A v3 app expresses the same source
ownership in its configuration; a shared preset still does not add the consumer's
content paths automatically:

```js
// apps/web/tailwind.config.js
module.exports = {
  presets: [require('../../packages/tailwind-preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,html}',
  ],
};
```

Use paths from the actual build and package layout, not these illustrative names. Load
`v4-configuration-and-sources.md` for `@theme` options, automatic source exclusions,
`source()`, explicit `@source`, and safelisting.

## Style the state the primitive already exposes

Use native selectors and the documented attributes from the installed primitive:

```tsx
<button
  type="button"
  aria-pressed={selected}
  className="rounded-md border px-3 py-2 aria-pressed:bg-slate-900 aria-pressed:text-white"
>
  Pin
</button>
```

For custom state, distinguish presence from value:

```html
<div data-state="open" class="data-[state=open]:border-blue-600">...</div>
<div data-selected="false" class="data-[selected=true]:font-semibold">...</div>
```

`data-[disabled]` matches presence, including `data-disabled="false"`; use a value
selector when the contract serializes booleans as strings. A data attribute does not
create disabled behavior, tab semantics, keyboard support, or focus management. Preserve
the native element/primitive behavior and style it rather than duplicating state in
JavaScript solely to drive a class. Use `group`/`peer` or arbitrary variants only for
real relationships; name repeated variants when a stable selector contract emerges.

## Keep runtime measurements out of class construction

For values not enumerable at build time, use a bounded style or a CSS variable with a
static utility. This fragment targets a finite number in the range 0–100:

```tsx
const percent = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;

<div className="h-2 overflow-hidden rounded-full bg-slate-200">
  <div className="h-full bg-blue-700" style={{ width: `${percent}%` }} />
</div>
```

For a value shared by several CSS rules, set a validated custom property and reference
it from static arbitrary utilities. Use `w-[var(--progress)]` in v3 or v4; the shorter
`w-(--progress)` is v4 syntax. Do not generate `w-[${value}%]` classes at runtime.
This fragment demonstrates width styling only: a real progress control needs the
semantics and accessible value/label contract from frontend.

## Compose around content, not a mandatory layout template

A small layout can preserve content pressure without a new abstraction:

```html
<div class="flex flex-wrap items-start gap-4">
  <div class="min-w-0 flex-1 basis-64">
    <h2 class="text-lg font-semibold leading-tight">Notification preferences</h2>
    <p class="mt-1 max-w-prose text-sm leading-relaxed">Choose which updates you receive.</p>
  </div>
  <button type="button" class="shrink-0 rounded-md border px-3 py-2">Manage</button>
</div>
```

The heading level follows document structure; visual size comes from utilities. The
example is a layout fragment, so compose the real button primitive with its focus and
interaction states. `min-w-0` permits flex shrinkage, not automatic overflow handling:
check long unbroken content and choose wrapping/truncation deliberately. Keep essential
information available instead of clipping it merely to make the layout fit.

Use breakpoint or container-query variants after frontend identifies the available-space
contract. V4 has native container queries; v3 may require its compatible plugin. Avoid
copying a v3 plugin list into v4 or treating device labels as the requirement.

## Extract responsibilities, not arbitrary class-count thresholds

Use loops for repeated data and components/templates for repeated markup, semantics,
behavior, and styling responsibilities. Keep one-off feature layout near its consumer.
Prefer a coherent primitive over a page-sized variant factory; prefer local repetition
over a wrapper that merely renames a utility string. Load
`utilities-components-and-animation.md` when custom CSS, `@apply`, arbitrary selectors,
transitions, or motion are actually involved.

Before finishing, verify the real build and relevant themes, widths, long content,
keyboard states, disabled/loading states, and reduced motion through the frontend
workflow. A compiled utility proves generated CSS, not the whole interaction contract.

## Sources and interpretation

The examples above are original adaptations, not copied components. Campsite and Dub
are implementation evidence, not standards: the reviewed snapshots use Tailwind v3.4.
Do not generalize their `transform-gpu`, complex shadows, optical font corrections,
`transition-all`, or focus-reset workarounds into default prescriptions.

Refactoring UI's public material supports hierarchy, bounded choice, spacing/type
systems and deliberate depth. Those design judgments belong to the frontend/design
owners; this reference only demonstrates their Tailwind expression. Techniques such
as grayscale-first work, fewer borders, or OKLCH remain contextual, not requirements.

- [Official utility patterns and class conflicts](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Official source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Official theme variables](https://tailwindcss.com/docs/theme)
- [Official state variants](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [Official responsive and container variants](https://tailwindcss.com/docs/responsive-design)
- [tailwind-merge compatibility and documentation](https://github.com/dcastil/tailwind-merge)
- [CVA variants](https://cva.style/docs/getting-started/variants)
- [Campsite Button, pinned source](https://github.com/campsite/campsite/blob/cc14551df7264c4adfdf6d0f6a549c713e0da7a8/packages/ui/src/Button/Button.tsx)
- [Campsite theme/config, pinned source](https://github.com/campsite/campsite/blob/cc14551df7264c4adfdf6d0f6a549c713e0da7a8/packages/ui/tailwind.config.js)
- [Dub Button, pinned source](https://github.com/dubinc/dub.link/blob/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e/packages/ui/src/button.tsx)
- [Dub theme values, pinned source](https://github.com/dubinc/dub.link/blob/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e/packages/tailwind-config/themes.css)
- [Refactoring UI public overview and contents](https://refactoringui.com/)
