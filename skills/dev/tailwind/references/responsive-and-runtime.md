> **Read this when:** Implementing container-responsive components, handling long content, or applying validated runtime measurements through direct styles or CSS custom properties.

# Responsive composition and runtime values

`frontend` chooses the responsive and semantic contract. This reference implements that
contract with Tailwind v4 while keeping layout ownership and runtime data visible.

## Respond to the component's available space

Use a container query when the same component appears in differently sized parents at
the same viewport width. Put containment on the owner whose inline size should drive the
change:

```tsx
import type { CSSProperties } from 'react';

type ProgressCardProps = {
  title: string;
  identifier: string;
  value: unknown;
};

export function ProgressCard({ title, identifier, value }: ProgressCardProps) {
  const progress =
    typeof value === 'number' && Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : 0;
  const progressStyle: CSSProperties & { '--progress': string } = {
    '--progress': `${progress}%`,
  };

  return (
    <section className="@container">
      <article className="grid min-w-0 gap-4 rounded-xl border p-4 @md:grid-cols-[minmax(0,1fr)_auto] @md:items-start">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold">{title}</h2>
          <p className="mt-1 break-all font-mono text-xs text-slate-600">{identifier}</p>
          <p className="mt-3 text-sm">{progress}% complete</p>
          <div
            aria-hidden="true"
            className="relative mt-2 h-2 overflow-visible rounded-full bg-slate-200"
            style={progressStyle}
          >
            <div className="h-full w-(--progress) rounded-full bg-blue-700" />
            <span className="absolute top-1/2 left-(--progress) size-3 -translate-1/2 rounded-full bg-blue-950" />
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2 @md:justify-end">
          <button type="button" className="min-w-0 rounded-md border px-3 py-2">
            Download
          </button>
          <button type="button" className="min-w-0 rounded-md border px-3 py-2">
            Share
          </button>
        </div>
      </article>
    </section>
  );
}
```

Unprefixed utilities define the base state; `@md:*` changes only what needs more
available inline space. `min-w-0` lets grid/flex children shrink, `break-words` handles
translated prose, `break-all` contains an unbroken identifier, and action wrapping
preserves access instead of clipping controls.

A viewport breakpoint remains appropriate when page composition truly depends on the
viewport. Ordinary wrapping may be enough when no discrete switch is required. Named
containers are useful only when nested eligible containers make the intended owner
ambiguous.

**Failure checks:**

- generated CSS contains the `@container` owner and `@md` query;
- the same viewport renders the narrow and wide compositions when only the parent width
  changes;
- long localization, an unbroken identifier, action growth, and text zoom do not create
  horizontal page overflow or hide essential content;
- the query targets the intended nearest or named container.

## Keep runtime data out of utility construction

The example validates an `unknown` value, rejects non-numbers and non-finite numbers,
then clamps the result to `0–100`. The static utilities `w-(--progress)` and
`left-(--progress)` are discoverable; only the custom property changes at runtime.

React's standard `CSSProperties` type may require a local custom-property type in some
projects. Prefer the project's established helper when one exists; typing the style
object does not validate domain data.

For one CSS property, a direct style is simpler:

```tsx
<div className="h-full bg-blue-700" style={{ width: `${progress}%` }} />
```

Use a custom property when several declarations share the same validated value. Use a
finite class map when the values are enumerable. Do not generate
`` `w-[${progress}%]` `` or safelist an unbounded set of runtime measurements.

The visible text supplies meaning while the meter graphics are decorative. If the
product requires an interactive or semantic progress control, `frontend` owns its role,
name, value, announcements, and update behavior.

**Failure checks:**

- `undefined`, strings, `NaN`, and infinities produce `0`; negative and over-100 values
  clamp to the boundary;
- changing the value changes `--progress`, not the class string;
- generated CSS includes both static custom-property utilities and excludes the dynamic
  fragment negative control;
- computed width/position use the bounded value; this still does not prove layout,
  zoom, keyboard, or assistive-technology behavior.

## Sources

- [Responsive design and container queries](https://tailwindcss.com/docs/responsive-design)
- [MDN container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [Adding custom styles](https://tailwindcss.com/docs/adding-custom-styles)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
