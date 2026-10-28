> **Read this when:** Integrating Tailwind with the owning build, validating production output, or diagnosing missing utilities, stale CSS, monorepo sources, and third-party packages.

# Build and generated-CSS diagnosis

Use the repository's active integration and production command. Tailwind v4 commonly
uses `@tailwindcss/vite`, `@tailwindcss/postcss`, or `@tailwindcss/cli`; install or
replace an integration only when the host framework and existing toolchain require it.
Existing v3 or mixed setups belong in `compatibility-and-migration.md`.

## Trace one class from source to the page

When a utility is missing, choose one expected token and follow it through the whole
pipeline. For example, given:

```tsx
const toneClasses = {
  neutral: 'bg-white text-slate-950',
  danger: 'bg-red-700 text-white',
} as const;

export function Banner({ tone }: { tone: keyof typeof toneClasses }) {
  return <div className={toneClasses[tone]}>Status</div>;
}
```

trace `bg-red-700` in this order.

### 1. Active integration and CSS entry

- Run the exact development or production script that owns the page.
- Identify the imported CSS entry and one active Tailwind pipeline.
- Confirm the integration package is compatible with the installed `tailwindcss`.
- Check for stale generated files or a second pipeline producing another asset.

Vite projects normally use the dedicated Vite plugin; PostCSS-owned frameworks use
`@tailwindcss/postcss`; CLI workflows use `@tailwindcss/cli`. Preserve a framework's
official integration rather than layering every option together.

### 2. Detectable source

Search source text for the complete token. Tailwind does not execute expressions, so
`` `bg-${tone}-700` `` cannot establish the finite alternatives. For external packages,
verify automatic detection or add a stylesheet-relative `@source` at the owning CSS
entry. Keep broad safelists as a last resort.

### 3. Generated output

Search the built CSS for the escaped selector and expected declaration:

- selector absent → source visibility, token spelling, capability, plugin, or build-input
  problem;
- selector present but asset absent from the page → stylesheet import/loading problem;
- selector loaded but losing → layer, specificity, selector, or important conflict;
- declaration applied but visually wrong → layout, browser support, changed default, or
  frontend-policy problem.

Use computed styles when browser access is part of the authorized workflow. Do not
solve every branch with `!important` or safelisting.

### 4. Rebuild and production behavior

If watch mode misses changes or loops, inspect dependency tracking, the working
directory, source breadth, and generated output inside scanned paths. Exclude generated
or irrelevant trees instead of widening scans indefinitely.

Run the repository's production build. Confirm the owning framework handles CSS
inclusion, minification, hashing, and asset loading. Performance changes require bundle,
timing, or browser evidence; do not prescribe manual critical-CSS extraction without a
measured need and cache owner.

**Complete when:** the chosen token is present in source and generated CSS, the correct
asset reaches the page, and any remaining visual failure is assigned to its actual
cascade/browser/frontend owner.

## Prove positive and negative controls

A credible source-detection check includes both:

1. a complete literal utility that must appear;
2. a dynamic fragment or omitted external source that must remain absent.

For shared themes, separately verify a role utility from the imported theme and a
package-only utility from the explicit source. One passing selector cannot prove both
contracts.

Structural build proof does not establish keyboard behavior, accessible naming,
contrast, container layout, or first-paint theming. Report those as separate frontend
checks.

## Integration and preprocessing boundaries

Tailwind v4 handles imports and vendor prefixing in its supported pipeline. Remove
`postcss-import` or `autoprefixer` only when no other stylesheet/plugin still depends on
them. V4 is not designed to run behind Sass, Less, or Stylus as a traditional
preprocessor; inspect the non-Tailwind styles they own before changing that boundary.

Remove a plugin during migration only when the replacement covers the used behavior and
generated output proves it. “Built in” does not guarantee that project-specific options
migrated unchanged.

## Review checks

- One active CSS entry and compatible integration own the page.
- Every class-bearing source is detectable without scanning generated output.
- Finite variants use complete literal tokens.
- Theme imports and external source registration are checked independently.
- Custom CSS uses the installed extension mechanism.
- Production output is generated and loaded by the owning build.
- Browser-visible and performance claims name their separate evidence.

## Sources

- [Installing with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Installing with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Compatibility](https://tailwindcss.com/docs/compatibility)
