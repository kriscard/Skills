> **Read this when:** the spec involves frontend work — covers performance, bundle size, rendering, accessibility, and security criteria to verify before approving.

# Frontend Spec Checklist

Use when reviewing or creating frontend specifications.

## Performance

### Data Fetching
- [ ] No request waterfalls (parallel fetches, not sequential)
- [ ] Cache appropriately (SWR, React Query, or server cache)
- [ ] Avoid fetching in components that re-render frequently

### Bundle Size
- [ ] Dynamic imports for heavy components (`lazy()`)
- [ ] Tree-shakeable imports (`import { x } from 'lib'` not `import lib`)
- [ ] No barrel file re-exports in hot paths

### Rendering
- [ ] Lift state up only when necessary
- [ ] Memoize expensive computations (`useMemo`)
- [ ] Stable callback references where needed (`useCallback`)
- [ ] Keys on lists (stable, not index unless static)

### CSS/Animation
- [ ] Only animate `transform` and `opacity`
- [ ] No `transition: all` (specify properties)
- [ ] Respect `prefers-reduced-motion`
- [ ] Duration 150-250ms, use `ease-out` for enter/exit

## TypeScript

- [ ] Strict mode enabled
- [ ] No `any` (use `unknown` + type guards)
- [ ] Props interfaces explicit, not inferred
- [ ] Discriminated unions for state variants

## Component Design

- [ ] Single responsibility (one reason to change)
- [ ] Compound components for complex UI
- [ ] Controlled OR uncontrolled (not both without clear API)
- [ ] Forward refs when wrapping native elements

## Accessibility

- [ ] Semantic HTML (`button` not `div onClick`)
- [ ] ARIA labels on icon-only buttons
- [ ] Focus management (modals, drawers)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] 44px minimum tap targets

## Forms

- [ ] Labels linked to inputs (`htmlFor`)
- [ ] 16px minimum font on inputs (prevents iOS zoom)
- [ ] Disable submit during pending state
- [ ] Cmd/Ctrl+Enter to submit where appropriate
- [ ] Clear error states on input change

## UI Polish

- [ ] No layout shift on load
- [ ] `font-variant-numeric: tabular-nums` for changing numbers
- [ ] Consistent z-index scale (10, 20, 30...)
- [ ] Touch: disable hover effects (`@media (hover: hover)`)
- [ ] Dark mode via CSS variables, not conditional classes
