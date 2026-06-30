> **Read this when:** the user asks about component composition, compound
> components, render props, Tailwind classes, `cn()`, animations,
> `prefers-reduced-motion`, Framer Motion, accessibility (WCAG, ARIA, focus
> management, screen readers), design tokens, dark mode, or form patterns.
>
> **Not the right file?** Next.js-specific rendering → `nextjs.md`.
> TypeScript type-level patterns → `type-system.md`. XSS and CSP → `security.md`.

> **Priority: MEDIUM** — UI pattern issues are rarely bugs; they're readability,
> maintainability, and accessibility debt. Exception: accessibility violations
> (missing keyboard nav, wrong ARIA roles, no focus management) are correctness
> issues — a component a screen reader user can't operate is broken, not just
> suboptimal. Resolve accessibility issues at HIGH priority, visual/pattern
> issues at MEDIUM.
>

# UI Patterns — Composition, Tailwind, Animation, Accessibility, Forms

## Pattern Decision Tree — Pick the Right Tool

Before reaching for a pattern, follow this decision path. The most common
mistake is reaching for compound components or HOCs when a hook is enough.

```
What problem are you solving?
│
├─ Sharing stateful logic (data, effects, subscriptions) across components?
│   → Custom Hook. Always the default. Zero tree nodes, explicit, composable.
│
├─ Ambient state needed by a wide tree (theme, locale, auth, current user)?
│   → Context + Custom Hook. Provider at the root, useX() at consumers.
│     NOT for local state — don't reach for Context to avoid prop drilling when
│     lifting state and passing props is the simpler answer.
│
├─ Multiple related subcomponents that MUST share implicit state
│   AND the consumer needs layout/composition control?
│   → Compound Components. Signal: Tabs/Select/Menu/Accordion/FlyOut patterns
│     where Toggle + List + Item must all know the same `open` or `activeTab`.
│     If only ONE component needs the state, use a hook + config props instead.
│
├─ A wrapper MUST exist in the component tree AND the consumer authors its own JSX?
│   → Render Props. Valid when a hook can't work — DnD libraries, animation
│     orchestration, headless lib patterns where the wrapper owns a ref AND
│     consumers render different markup each time. Ask first: "would a hook do?"
│     If yes, use the hook.
│
└─ Cross-cutting concern applied IDENTICALLY at many call sites?
    → HOC. But only for:
       a) Error/Suspense boundaries (must be a component in the tree)
       b) Third-party library wrappers (withTranslation, connect from Redux v5-)
       c) Class component codebases
      Default to a hook otherwise — HOCs hide logic, add tree nodes, complicate
      TypeScript generics, and interfere with the React Compiler's analysis.
```

## Component Pattern Status (patterns.dev 2026)

| Pattern | Status | Use when |
|---------|--------|----------|
| **Custom Hooks** | ✅ Default tool | Sharing stateful logic — the answer in 90% of cases |
| **Hooks** | ✅ Built-in | State, effects, browser APIs, form submission |
| **Compound Components** | ✅ For component libraries | Multiple subcomponents sharing implicit state + consumer controls layout |
| **Render Props** | ⚠️ Narrow valid case | Wrapper must be in the tree AND consumer authors its own JSX (DnD, headless animation) |
| **Provider Pattern** | ✅ Cross-cutting concerns | Theme, locale, auth — not a performance hack or prop-drilling shortcut |
| **HOC** | ⚠️ Limited valid cases | Error/Suspense boundaries, third-party lib wrappers, class components — not for new logic |
| **Container/Presentational** | ❌ Superseded | React Query + a pure component is the 2026 version of this pattern |
| **`cloneElement`** | ❌ Avoid | Shallow merge causes prop collisions; only direct children get props. Use Context-based compound components instead |

---

## Component Composition Patterns

### Custom Hooks — Default First

When the problem is "sharing stateful logic", the hook is almost always the
answer. "Look for the verbs hiding inside a tangled component and lift them
into hooks." (patterns.dev)

```typescript
// ❌ Don't reach for HOC or render props for data sharing
function PricingPage() {
  const showRedesign = useFlag('pricing_redesign_2025');
  return showRedesign ? <PricingPageNew /> : <PricingPageLegacy />;
}
// This is just a hook call — no wrapper needed

// ✅ Extract the verb into a hook
function useScrollPosition() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}
```

### Compound Components — When Subcomponents Must Share State

Use when you have multiple related subcomponents that implicitly share state
AND the consumer needs control over their layout. This is the right pattern for
Tabs, Select, Menu, Accordion, FlyOut — not for every case where you want a
"nicer API".

```typescript
// Implementation — Context API approach (preferred over React.Children.map)
// React.Children.map breaks on non-direct children and causes prop collisions
const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('useTabs must be used inside <Tabs>');
  return ctx;
}

export function Tabs({ children, defaultTab }: { children: React.ReactNode; defaultTab: string }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div role="tabpanel">{children}</div>
    </TabsContext.Provider>
  );
}

Tabs.List = function TabsList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabs();
  return (
    <button
      role="tab"
      aria-selected={activeTab === id}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  );
};

// Usage — consumer controls layout, parent owns state
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="details">Details</Tabs.Tab>
  </Tabs.List>
</Tabs>
```

**When NOT to use compound components:** if only one component needs the state,
use a hook + config props. Compound components are for component library
authoring — don't introduce them in app-level code unless the pattern is
genuinely needed.

### Render Props — Narrow Valid Case

Render props are still valid in one specific situation: the wrapper component
must be in the tree (owns a ref, manages lifecycle) AND the consumer writes
different JSX each time. DnD libraries and some animation patterns fall here.

```typescript
// Valid: the wrapper needs to exist in the tree AND consumer authors JSX
function Disclosure({ children }: { children: (open: boolean, toggle: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <>{children(open, () => setOpen(o => !o))}</>;
}

// But ask first: would a hook work?
function useDisclosure() {
  const [open, setOpen] = useState(false);
  return { open, toggle: () => setOpen(o => !o) };
}
// If yes — use the hook. The hook adds zero DOM nodes.
```

"If you find yourself writing a wrapper whose only job is `return props.children(data)`,
that wrapper wants to be a hook." (patterns.dev)

### HOC — Legitimate Uses Only

HOCs still earn their keep in specific cases. Outside these cases, use a hook.

```typescript
// ✅ Valid HOC: error boundary wrapping (must be a class component in the tree)
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  { fallback }: { fallback: React.ReactNode },
) => {
  function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  }
  WithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName ?? Component.name})`;
  return WithErrorBoundary;
};

// ❌ Not a valid HOC use — this is a hook pretending to be a HOC
export const withAnalytics = (Component: React.ComponentType<Props>) =>
  function Wrapped(props: Props) {
    const { track } = useAnalytics(); // just call useAnalytics() inside the component
    return <Component {...props} track={track} />;
  };

// ✅ Hook version — no wrapper node, TypeScript is automatic, debugger-friendly
function MyComponent() {
  const { track } = useAnalytics();
}
```

**HOC pitfalls to know:** prop name collisions (decide spread order), static
methods don't pass through (use `hoist-non-react-statics`), refs don't forward
(use `forwardRef`), heavy layering interferes with the React Compiler's
static analysis.

---

## shadcn/ui and Radix Patterns

### `asChild` — render behavior on the child element instead of wrapping

Radix UI's `asChild` prop merges the component's behavior (styles, event handlers,
ARIA props) onto the child element rather than adding a wrapper DOM node.

```tsx
// ❌ Without asChild — wraps in an extra <button>, creating invalid HTML
<Button>
  <Link href="/dashboard">Go to dashboard</Link>
</Button>
// Renders: <button class="..."><a href="...">Go to dashboard</a></button>
// Invalid: interactive elements must not be nested

// ✅ With asChild — Button behavior applied directly to <Link>'s <a> element
<Button asChild>
  <Link href="/dashboard">Go to dashboard</Link>
</Button>
// Renders: <a href="/dashboard" class="button-classes ...">Go to dashboard</a>
```

Use `asChild` when you need a component's visual/behavioral contract on an element
you control — links that look like buttons, dialog triggers on custom elements.

### CVA — type-safe variant composition

`class-variance-authority` (CVA) replaces ad-hoc conditional class strings with
a typed variant system. This is the pattern used in shadcn/ui components:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes (always applied)
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

// Props type is inferred from the variants definition
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ variant, size, className, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'; // Slot is from @radix-ui/react-slot
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

### CSS variable theming — base + foreground pairs

shadcn/ui uses HSL CSS variables with a base + foreground pair for each color
so text always contrasts with its background:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;     /* text on --background */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%; /* text on --primary backgrounds */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
}
```

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      destructive: {
        DEFAULT: 'hsl(var(--destructive))',
        foreground: 'hsl(var(--destructive-foreground))',
      },
    },
  },
}

// Usage — works in both light and dark mode automatically
<div className="bg-primary text-primary-foreground" />
<div className="bg-destructive text-destructive-foreground" />
```

---

## Tailwind Best Practices

### Conditional classes with `cn()`

Never string-concatenate Tailwind classes — merging utilities from different
call sites breaks PurgeCSS and causes specificity conflicts.

```typescript
// Install: pnpm add clsx tailwind-merge
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

// Usage
<button
  className={cn(
    'rounded px-4 py-2 font-medium',
    variant === 'primary' && 'bg-blue-600 text-white',
    variant === 'ghost' && 'bg-transparent text-blue-600',
    disabled && 'cursor-not-allowed opacity-50',
    className // allow caller to override
  )}
>
```

### Avoid arbitrary values

```typescript
// ❌ Arbitrary values bypass the design system and won't be optimized
<div className="mt-[17px] text-[#1a2b3c]">

// ✅ Extend the theme instead
// tailwind.config.ts
theme: {
  extend: {
    spacing: { '4.25': '17px' },
    colors: { brand: { dark: '#1a2b3c' } },
  }
}
<div className="mt-4.25 text-brand-dark">
```

### Extract repeated patterns to components, not `@apply`

```typescript
// ❌ @apply defeats tree-shaking and adds a layer of indirection
.btn { @apply rounded px-4 py-2 font-medium; }

// ✅ Extract to a React component
function Button({ className, ...props }: ButtonProps) {
  return <button className={cn('rounded px-4 py-2 font-medium', className)} {...props} />;
}
```

---

## Animation

### Always respect `prefers-reduced-motion`

Users with vestibular disorders or epilepsy can be harmed by animation. This is
both an accessibility requirement and, in some jurisdictions, a legal one.

```typescript
// CSS approach — works with any animation library
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// Framer Motion — built-in hook
import { useReducedMotion } from 'framer-motion';

function AnimatedCard() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      animate={{ x: prefersReduced ? 0 : 100 }}
      transition={{ duration: prefersReduced ? 0 : 0.3 }}
    />
  );
}
```

### CSS transitions vs Framer Motion

- **CSS transitions** — best for simple state changes (hover, focus, toggle).
  Zero JS overhead. Use `transition-all` sparingly — it transitions every
  property and can cause jank.

- **Framer Motion** — best for layout animations, exit animations, gesture-
  driven motion, and orchestrated sequences. Worth the bundle cost only if you
  actually need it.

```typescript
// Framer Motion layout animation — automatic smooth repositioning
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

<LayoutGroup>
  <AnimatePresence>
    {items.map(item => (
      <motion.li
        key={item.id}
        layout                           // animates repositioning
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      />
    ))}
  </AnimatePresence>
</LayoutGroup>
```

---

## Accessibility Deep-Dive

### WCAG 2.2 AA — Minimal Checklist

| Category | Requirement |
|---|---|
| Color contrast | 4.5:1 for normal text, 3:1 for large text and UI components |
| Keyboard access | All interactive elements reachable and operable via Tab/Enter/Space/Escape |
| Focus visible | Focus indicators must be visible (don't remove outline without replacing it) |
| Touch target | Minimum 24×24 CSS pixels (AA), 44×44 recommended |
| Text alternatives | `alt` on all images; empty `alt=""` for decorative |
| Form labels | Every input has an associated `<label>` or `aria-label` |
| Error messages | Errors are associated with inputs (`aria-describedby`) and announced |
| Skip link | "Skip to main content" as the first focusable element |

### Semantic HTML first, ARIA second

ARIA doesn't add behavior — it adds meaning. The wrong ARIA is worse than none.

```typescript
// ❌ Custom interactive element with no semantics
<div onClick={handleClick}>Delete</div>

// ✅ Semantic HTML — keyboard events, focus, and ARIA role built in
<button type="button" onClick={handleClick}>Delete</button>

// ❌ Redundant ARIA on native element
<button role="button">Save</button> // role="button" is implicit on <button>

// ✅ ARIA only when native HTML can't express the pattern
<div
  role="combobox"
  aria-expanded={open}
  aria-haspopup="listbox"
  aria-controls="options-list"
>
```

### Focus Management

For modals, drawers, and dynamic content:

```typescript
// Move focus to the modal when it opens
useEffect(() => {
  if (open) modalRef.current?.focus();
}, [open]);

// Trap focus inside the modal (use a library like focus-trap-react)
import FocusTrap from 'focus-trap-react';

<FocusTrap active={open}>
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={modalRef} tabIndex={-1}>
    <h2 id="modal-title">Confirm Delete</h2>
    {/* ... */}
  </div>
</FocusTrap>

// Return focus to the trigger when the modal closes
const triggerRef = useRef<HTMLButtonElement>(null);
useEffect(() => {
  if (!open) triggerRef.current?.focus();
}, [open]);
```

### Live regions for dynamic content

```typescript
// Announce status updates to screen readers without moving focus
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {statusMessage}
</div>

// For critical alerts (use sparingly — interrupts immediately)
<div role="alert">Payment failed. Check your card details.</div>
```

### Screen reader testing toolchain

1. **VoiceOver (macOS):** Cmd+F5 to toggle. Test with Safari for best
   compatibility.
2. **NVDA + Firefox (Windows):** free, most common screen reader/browser pair.
3. **axe DevTools:** browser extension, catches ~57% of WCAG issues
   automatically.
4. **eslint-plugin-jsx-a11y:** static analysis; catches missing labels, bad
   roles, and missing alt text at write time.

---

## Design Tokens and Dark Mode

### CSS custom properties as design tokens

```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-primary: #2563eb;
  --space-1: 0.25rem;
  --radius-md: 0.375rem;
  color-scheme: light;
}

[data-theme="dark"],
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-text: #f8fafc;
    --color-primary: #60a5fa;
    color-scheme: dark;
  }
}
```

### Tailwind dark mode with CSS variables

```typescript
// tailwind.config.ts — use 'class' strategy for user-toggled dark mode
export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
      },
    },
  },
};

// Component — single class, adapts to token
<div className="bg-bg text-text" />
```

---

## Form Patterns

### Controlled vs Uncontrolled

- **Controlled** (`value` + `onChange`): use when the form value needs to be
  validated on every keystroke, transformed, or synced to external state.
- **Uncontrolled** (ref-based, React Hook Form): use for large forms where
  re-rendering the whole form on each keystroke is expensive. React Hook Form is
  uncontrolled by default.

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(async data => { await login(data); })}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email')}
        aria-describedby={errors.email ? 'email-error' : undefined}
        aria-invalid={!!errors.email}
      />
      {errors.email && (
        <span id="email-error" role="alert">{errors.email.message}</span>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
```

Key points:
- `aria-describedby` links the error message to the input for screen readers
- `aria-invalid` signals invalid state to assistive technology
- `role="alert"` on the error announces it immediately when it appears
- Zod schema provides both runtime validation and TypeScript inference

---

## Further Reading

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Inclusive Components](https://inclusive-components.design/) — Heydon Pickering
- [Radix UI](https://www.radix-ui.com/) — accessible unstyled primitives
- [Framer Motion](https://www.framer.com/motion/)
- [React Hook Form](https://react-hook-form.com/)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
