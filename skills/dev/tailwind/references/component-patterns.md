> **Read this when:** Authoring or reviewing finite/compound variants, component styling ownership, caller overrides, native or primitive state, or coordinated component parts.

# Component patterns

Use the existing product tokens and primitives. `frontend` owns visual roles,
accessibility, and interaction requirements; `react` owns props, composition, and state.
This reference shows Tailwind-facing seams with v4 syntax and no required variant or
merge library.

## Encode finite choices completely

Tailwind scans source text, not JavaScript results. Every supported choice must contain
complete utility tokens. Start with maps, including a complete compound table when axes
interact:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const toneClasses = {
  neutral: 'border-slate-300 bg-white text-slate-950 hover:bg-slate-100',
  danger: 'border-red-700 bg-red-700 text-white hover:bg-red-800',
} as const;

const densityClasses = {
  compact: 'min-h-8 px-2 text-xs',
  comfortable: 'min-h-10 px-3 text-sm',
} as const;

type Tone = keyof typeof toneClasses;
type Density = keyof typeof densityClasses;

const compoundClasses = {
  'neutral:compact': 'font-medium',
  'neutral:comfortable': 'font-medium',
  'danger:compact': 'font-bold',
  'danger:comfortable': 'font-semibold',
} satisfies Record<`${Tone}:${Density}`, string>;

type ActionButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'style'
> & {
  tone?: Tone;
  density?: Density;
};

export function ActionButton({
  tone = 'neutral',
  density = 'comfortable',
  type = 'button',
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-md border',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        toneClasses[tone],
        densityClasses[density],
        compoundClasses[`${tone}:${density}`],
      ].join(' ')}
    />
  );
}
```

The public API deliberately omits same-element `className` and `style`; it does not
pretend arbitrary CSS can coexist with protected tone/focus styling. It preserves native
button props and disabled behavior. The product still owns accessible names, contrast,
busy-state announcements, and touch-target requirements.

Use an installed variant helper when several recurring axes, defaults, or compound
conditions become clearer there. A helper is not warranted for one local ternary. If
some combinations are unsupported, constrain them in the React API rather than relying
on a missing class.

**Failure checks:**

- every supported pair returns exactly one font-weight utility: neutral pairs use
  `font-medium`, `danger:compact` uses `font-bold`, and `danger:comfortable` uses
  `font-semibold`;
- the exact returned class strings compile against the installed Tailwind CSS without a
  second equal-specificity weight changing that contract;
- no class is assembled as `` `bg-${tone}-700` ``;
- native `disabled`, `type`, event, and accessible-name behavior remain intact.

## Give layout and appearance different owners

A feature can control placement without changing the primitive's same-element visual
contract:

```tsx
function ReportActions() {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <ActionButton tone="neutral">Cancel</ActionButton>
      <ActionButton tone="danger">Delete report</ActionButton>
    </div>
  );
}
```

The parent owns wrapping, placement, and sibling gaps. The button owns its visual states
and native behavior. Keep a one-off layout local; extract a wrapper only when it owns a
real repeated arrangement, semantic boundary, or coordination responsibility.

For a multi-part component, coordinate only the parts that vary together:

```tsx
const noticeToneClasses = {
  info: {
    root: 'border-blue-200 bg-blue-50 text-blue-950',
    marker: 'bg-blue-600',
  },
  danger: {
    root: 'border-red-200 bg-red-50 text-red-950',
    marker: 'bg-red-700',
  },
} as const;

type NoticeProps = {
  tone: keyof typeof noticeToneClasses;
  title: string;
  children: ReactNode;
};

function Notice({ tone, title, children }: NoticeProps) {
  const classes = noticeToneClasses[tone];

  return (
    <section className={`grid grid-cols-[auto_1fr] gap-3 rounded-lg border p-4 ${classes.root}`}>
      <span aria-hidden="true" className={`mt-1 size-2 rounded-full ${classes.marker}`} />
      <div className="min-w-0">
        <h2 className="font-semibold">{title}</h2>
        <div className="mt-1 text-sm">{children}</div>
      </div>
    </section>
  );
}
```

Explicit per-part classes remain a good default. Use an installed slot-aware recipe only
when coordinated variants repeat enough to improve reviewability. React owns whether
parts become slots, children, or compound components.

**Failure checks:** optional/long content does not break the part relationship; every
part receives the same selected tone; extraction does more than rename a utility list.

## Make override behavior honest

Joining and conflict resolution are separate contracts:

- arrays, template strings, or `clsx` join conditional classes;
- mutually exclusive branches avoid conflicts before they exist;
- a compatible merge helper can resolve the Tailwind conflicts it models at an
  intentional public override boundary;
- arbitrary same-element `className` or `style` can change tone, focus, spacing, and
  other CSS regardless of a prop name or comment.

If an existing primitive accepts unrestricted `className`, document that visual freedom
and treat internal class refactors as a caller-compatibility concern. If the system must
protect appearance, expose typed choices and let a parent own layout instead. If only a
specific part is customizable, expose that part deliberately without promising that a
class string is mechanically restricted to “layout-only” CSS.

A merge helper is an escape hatch, not a default wrapper. Match it to the installed
Tailwind contract and test representative custom utilities, prefixes, important
modifiers, arbitrary properties, and arbitrary variants. It cannot understand every
project CSS relationship, and HTML class order is not a raw Tailwind override protocol.

**Failure checks:** compare the returned class string and generated/computed CSS
separately; include a custom or arbitrary conflict the helper does not model; verify a
caller can change every property the public override contract says it can.

## Style the state that owns the behavior

Use native ARIA state or attributes emitted by the installed primitive:

```tsx
<button
  type="button"
  aria-pressed={selected}
  className="rounded-md border px-3 py-2 aria-pressed:border-slate-950 aria-pressed:bg-slate-950 aria-pressed:text-white"
>
  Pin report
</button>
```

```tsx
<MenuItem
  className="data-[highlighted]:bg-slate-100 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
/>
```

`aria-pressed:*` targets the true ARIA value. `data-selected:*` is a presence selector;
when a primitive emits string booleans, use equality such as
`data-[selected=true]:font-semibold` so `data-selected="false"` does not match. Use
`group` or `peer` only when the DOM relationship is the real state relationship.

Attributes let Tailwind present state; they do not create disabled behavior, accessible
names, keyboard interaction, focus movement, or announcements. Preserve required props
and refs when wrapping a behavior primitive, and include any functional positioning or
overflow styles its contract requires.

**Failure checks:** inspect the rendered attribute/value, exercise every transition
through the primitive's public API, and verify styling follows the same source of truth.
A generated selector is not keyboard or assistive-technology proof.

## Sources

- [Styling with utility classes](https://tailwindcss.com/docs/styling-with-utility-classes)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Hover, focus, and other states](https://tailwindcss.com/docs/hover-focus-and-other-states)
- [CVA variants](https://cva.style/docs/getting-started/variants)
- [When and how to use tailwind-merge](https://github.com/dcastil/tailwind-merge/blob/main/packages/tailwind-merge/docs/when-and-how-to-use-it.md)
- [tailwind-merge limitations](https://github.com/dcastil/tailwind-merge/blob/main/packages/tailwind-merge/docs/limitations.md)
- [Pinned Campsite Button](https://github.com/campsite/campsite/blob/cc14551df7264c4adfdf6d0f6a549c713e0da7a8/packages/ui/src/Button/Button.tsx)
- [Pinned Dub Button](https://github.com/dubinc/dub.link/blob/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e/packages/ui/src/button.tsx)
