> **Read this when:** detecting Tailwind v3 versus v4, migrating between them, reviewing a mixed setup, or checking renamed utilities and changed defaults.

# Version and migration

## Detect from installed evidence

Prefer this evidence order:

1. the resolved `tailwindcss` version in the package manager and lockfile;
2. installed integration packages and executable paths;
3. the CSS entry point and active build configuration;
4. legacy files that may remain after a partial migration.

A `tailwind.config.js` file does not prove v3. V4 can load legacy JavaScript config with
`@config`, but it does not discover that config automatically. Likewise, a package
manifest that requests `^4` is weaker than the resolved lockfile or installed package.

## Version boundary

| Concern | v3 | v4 |
|---|---|---|
| CSS entry | `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` | `@import "tailwindcss";` |
| Primary config | `tailwind.config.*` | CSS-first directives such as `@theme`, `@source`, `@utility`, `@custom-variant` |
| Source discovery | `content` paths in JavaScript config | automatic detection plus `source()`, `@source`, and `@source inline()` |
| PostCSS plugin | `tailwindcss` | `@tailwindcss/postcss` |
| CLI | `tailwindcss` package executable | `@tailwindcss/cli` |
| Vite | normally PostCSS/framework integration | dedicated `@tailwindcss/vite` integration is available and recommended by Tailwind for Vite projects |

V4 targets modern browsers. Before migrating, compare the official browser floor with
the product's support contract. Keep a project on v3.4 when that contract includes
older browsers that v4 cannot support.

## Migration sequence

1. Record the current Tailwind version, browser support, build command, CSS output, and
   representative rendered states.
2. Run `npx @tailwindcss/upgrade` in a separate branch when Node and repository
   constraints allow it.
3. Review dependency, config, stylesheet, and template changes. The tool performs most
   changes, not every project-specific correction.
4. Run the real development and production builds.
5. Inspect generated CSS and exercise representative UI states in a browser.
6. Search for the migration traps below and resolve only those that apply.

The upgrade tool currently requires Node.js 20 or newer. That requirement belongs to
the tool, not to every Tailwind project; use the installed package's engine declaration
for general runtime compatibility.

## Migration traps

### Integration and configuration

- Replace v3 `@tailwind` directives with `@import "tailwindcss"` in v4.
- Use `@tailwindcss/postcss` for v4 PostCSS builds and `@tailwindcss/cli` for v4 CLI
  commands. For Vite projects, assess the dedicated `@tailwindcss/vite` plugin.
- Remove `postcss-import` and `autoprefixer` from a v4 Tailwind PostCSS pipeline only
  when they were present solely for work v4 now performs. Preserve them when another
  input still requires them.
- Load retained JavaScript config explicitly with `@config`. V4 compatibility config
  does not support `corePlugins`, `safelist`, or `separator`; use v4 mechanisms instead.
- Load legacy plugins with `@plugin`. Prefer native v4 CSS APIs when changing the same
  area, but do not rewrite stable plugin usage without a reason.

### Removed and renamed utilities

Check exact visual intent instead of blind search-and-replace:

| v3 | v4 |
|---|---|
| `bg-opacity-*`, `text-opacity-*`, `border-opacity-*`, `divide-opacity-*`, `ring-opacity-*`, `placeholder-opacity-*` | slash opacity such as `bg-black/50` |
| `flex-shrink-*`, `flex-grow-*` | `shrink-*`, `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice`, `decoration-clone` | `box-decoration-slice`, `box-decoration-clone` |
| `shadow-sm`, `shadow` | `shadow-xs`, `shadow-sm` |
| `drop-shadow-sm`, `drop-shadow` | `drop-shadow-xs`, `drop-shadow-sm` |
| `blur-sm`, `blur` | `blur-xs`, `blur-sm` |
| `backdrop-blur-sm`, `backdrop-blur` | `backdrop-blur-xs`, `backdrop-blur-sm` |
| `rounded-sm`, `rounded` | `rounded-xs`, `rounded-sm` |
| old accessibility-preserving `outline-none` | `outline-hidden` |
| old 3px `ring` | `ring-3` |

The bare shadow, blur, radius, and ring names may still compile, but their visual scale
changed. Review screenshots rather than treating compilation as proof.

### Changed syntax and ordering

- Put the important modifier at the end in v4: `hover:bg-red-600!`. The v3 leading
  form is deprecated compatibility syntax.
- Use parentheses for CSS variable shorthand in v4: `bg-(--brand-color)`, not
  `bg-[--brand-color]`.
- Use underscores for spaces in affected arbitrary values, such as
  `grid-cols-[max-content_auto]`.
- Order stacked variants left-to-right in v4. Review order-sensitive child, typography,
  and arbitrary variants.
- V4 prefixes act like variants at the beginning, for example `tw:hover:bg-red-600`.

### Changed generated behavior

- Border and divide colors default to `currentColor`; add explicit colors where the v3
  default was part of the design.
- `ring` is 1px and `currentColor`; specify width and color where the v3 defaults were
  relied on.
- Gradient stops persist across variants; use `via-none` when intentionally reducing a
  three-stop gradient to two stops.
- `space-*` and `divide-*` selectors changed. Inspect inline children and any manual
  child margins, padding, or borders.
- Preflight changed placeholder color, button cursor, dialog margins, and `hidden`
  precedence. Restore old behavior only when the product contract requires it.
- `hover` now applies only when the primary input supports hover. Route interaction
  policy to `frontend`; do not make essential behavior hover-only.
- `translate-*`, `rotate-*`, and `scale-*` use individual transform properties. Reset
  them with matching utilities such as `scale-none`, and list individual properties in
  custom transition declarations.
- `outline-color` is included in transition utilities; set a stable outline color when
  an unintended color transition appears.

## Official sources

- [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Tailwind CSS v3 installation](https://v3.tailwindcss.com/docs/installation)
- [Tailwind CSS v3 content configuration](https://v3.tailwindcss.com/docs/content-configuration)
