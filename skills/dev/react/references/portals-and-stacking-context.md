> **Read this when:** user mentions modals, dialogs, tooltips, popovers,
> dropdowns, `z-index` not working, "appears behind", "covered by header",
> `createPortal`, or asks why their overlay renders under another element.
>
> **Not the right file?** Animation transitions → `re-renders.md`.
> Accessibility deep-dive → `ui-patterns.md`.

> **Priority: MEDIUM** — Stacking context bugs are invisible until a user reports
> "my modal is hidden behind the sidebar." They're not performance issues but they
> are correctness issues — a modal that isn't visible is broken. Resolve CRITICAL
> and HIGH issues first; load this when overlays, z-index, or portals are the topic.
>

# Portals and Stacking Contexts

The most common cause of "my modal renders behind the sidebar" is a CSS stacking
context on a parent element that clips z-index to a local scope. The fix is almost
always `createPortal` out of the problematic ancestor.

---

## What Creates a Stacking Context

Any element with these CSS properties creates a new stacking context, meaning all
`z-index` values on its descendants are relative to it, not to the document root:

```css
/* Each of these creates a stacking context on the element */
position: relative | absolute | fixed | sticky  +  z-index: (anything except auto)
opacity: < 1
transform: (any value, including transform: translateX(0))
filter: (any value, including filter: none in some browsers)
will-change: transform | opacity | filter
isolation: isolate
backdrop-filter: (any value)
mix-blend-mode: (not normal)

/* Also creates stacking context: */
/* Flex/grid children with z-index other than auto */
```

**The trap:** `transform: translateX(0)` is a common CSS trick for GPU compositing
and animation performance. It creates a stacking context even though it visually
moves nothing. Any portal-less overlay inside that element is now z-index scoped
to the parent.

```css
/* Common in animation libraries, sticky headers, side panels */
.sidebar {
  transform: translateX(0); /* <- creates stacking context! */
  position: relative;
}

.modal {
  z-index: 9999; /* Only 9999 within .sidebar's stacking context, not document */
}
```

---

## Diagnosing the Problem

Open Chrome DevTools → Elements → select the overlay element → Computed tab →
search "z-index". If z-index doesn't seem to be working:

1. Walk up the DOM tree in DevTools
2. For each ancestor, check: does it have `position + z-index`, `transform`,
   `opacity < 1`, or `filter`?
3. The first ancestor that matches is your stacking context boundary

---

## `createPortal` — Render Outside the DOM Hierarchy

```tsx
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

function Modal({ children, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    // Rendered into document.body — outside any parent stacking context
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 bg-white rounded-lg p-6">
        {children}
      </div>
    </div>,
    document.body,
  );
}
```

**Key behaviour:** the portal component stays in the React tree (events bubble
up through React's virtual hierarchy normally), but the DOM node is mounted under
`document.body`. This means:
- `onClick` bubbles to React parents correctly
- `useContext` still works — React tree, not DOM tree, determines context
- z-index is now relative to document root, not a trapped ancestor

---

## Custom Portal Root — Avoid `document.body` Directly

For production apps, render into a dedicated portal container rather than
appending directly to `document.body`. This keeps the DOM clean and avoids
conflicts with third-party scripts.

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="portal-root"></div>  <!-- ← dedicated portal mount point -->
</body>
```

```tsx
const PORTAL_ROOT = document.getElementById('portal-root')!;

function Modal({ children, isOpen }: ModalProps) {
  if (!isOpen) return null;
  return createPortal(<div role="dialog">{children}</div>, PORTAL_ROOT);
}
```

---

## Accessibility Requirements for Portals

A portal that is visually a modal must also behave like one for keyboard and
screen reader users.

### Focus trap

When the modal opens, move focus into it. When it closes, return focus to the
trigger. This prevents keyboard users from navigating behind the overlay.

```tsx
function Modal({ isOpen, triggerRef, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Move focus into modal on open
    const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    // Return focus to trigger on close
    return () => {
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  // ...
}
```

**Recommended:** use a library that handles this correctly rather than rolling it
yourself. `@radix-ui/react-dialog` implements the full ARIA dialog pattern.

### `inert` attribute — lock background content

The modern API for preventing keyboard navigation behind a modal:

```tsx
useEffect(() => {
  if (!isOpen) return;
  const mainContent = document.getElementById('root');
  mainContent?.setAttribute('inert', '');
  return () => mainContent?.removeAttribute('inert');
}, [isOpen]);
```

`inert` makes all focusable elements in the subtree non-interactive, without
removing them from the DOM. Supported in all modern browsers (Chrome 102+,
Firefox 112+, Safari 15.5+).

### Scroll lock

```tsx
useEffect(() => {
  if (!isOpen) return;
  const scrollY = window.scrollY;
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed'; // prevents scroll jump on iOS
  document.body.style.top = `-${scrollY}px`;

  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, scrollY); // restore scroll position
  };
}, [isOpen]);
```

### Required ARIA attributes

```tsx
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Confirm deletion</h2>
  <p id="modal-description">This action cannot be undone.</p>
  ...
</div>
```

---

## Tooltip / Popover Positioning

Tooltips and popovers face the same stacking context problem and additionally need
to stay within the viewport when the anchor is near the edge.

**Use Floating UI** (headless, composable, framework-agnostic):

```tsx
import { useFloating, autoPlacement, offset, shift } from '@floating-ui/react';

function Tooltip({ label, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: 'top',
    middleware: [
      offset(8),
      autoPlacement(), // flips to bottom if not enough space above
      shift({ padding: 8 }), // prevents overflow past viewport edge
    ],
  });

  return (
    <>
      <span ref={refs.setReference} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        {children}
      </span>
      {isOpen && createPortal(
        <div ref={refs.setFloating} style={floatingStyles} role="tooltip">
          {label}
        </div>,
        document.body,
      )}
    </>
  );
}
```

**Or use Radix UI primitives** — `@radix-ui/react-tooltip`, `@radix-ui/react-popover`,
`@radix-ui/react-dialog` all handle stacking context, positioning, focus trapping,
and ARIA correctly out of the box.

---

## Quick Diagnosis Checklist

- [ ] Overlay not appearing above other content? → Check ancestors for `transform`, `opacity < 1`, or `filter`
- [ ] Using `createPortal`? → Ensure portal root exists in DOM before first render
- [ ] Keyboard users stuck behind overlay? → Add focus trap + `inert` on background
- [ ] Mobile: page scrolls behind modal? → Add scroll lock with iOS scroll-jump fix
- [ ] Tooltip clipped at viewport edge? → Use Floating UI `shift()` middleware
- [ ] Building a modal component from scratch? → Use `@radix-ui/react-dialog` instead
