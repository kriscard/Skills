---
name: tailwind
description: >-
  Version-aware Tailwind CSS implementation, migration, review, and debugging. Use
  when work depends on Tailwind-specific utilities or directives; when configuring
  v3 content/config/plugins or v4 CSS-first @theme, @source, @utility, and build
  integrations; when migrating v3 to v4; or when Tailwind classes, variants,
  animations, generated CSS, or source detection do not work. Detect the installed
  major version before giving syntax. Do not use for choosing product design policy,
  semantic token names, responsive behavior, accessibility, or general UI-system
  conventions; route those decisions to frontend.
---

# Tailwind CSS

Apply Tailwind syntax that matches the installed major version. Own Tailwind's build,
configuration, utility, directive, migration, and generated-CSS mechanics. Let
`frontend` own what the product should look like and how it should behave.

## Workflow

### 1. Detect the Tailwind boundary

Inspect manifests and lockfiles for `tailwindcss` and integration packages, then inspect
the stylesheet entry point, Tailwind configuration, PostCSS/Vite configuration, and
build scripts. Use the resolved package version when dependencies are installed; do not
infer the major version from one familiar file.

Classify the project:

- **v4:** `tailwindcss` 4.x, often with `@import "tailwindcss"`, CSS-first directives,
  and `@tailwindcss/vite`, `@tailwindcss/postcss`, or `@tailwindcss/cli`.
- **v3:** `tailwindcss` 3.x, normally with `tailwind.config.*`, a `content` array,
  `@tailwind base/components/utilities`, and the `tailwindcss` CLI or PostCSS plugin.
- **Migration or mixed:** v4 is installed while legacy config, directives, plugins, or
  v3-era utilities remain. Treat compatibility APIs as migration evidence, not proof
  that the project is v3.

If no local version exists, state the version being targeted before supplying code.

**Complete when:** the Tailwind major version, integration path, CSS entry point, and
configuration owner are known.

### 2. Preserve the ownership boundary

Use the existing product tokens, components, class-composition helpers, and responsive
conventions. Load `frontend` for semantic token design, visual hierarchy, breakpoint
policy, container strategy, RTL behavior, dark-mode product policy, accessibility, or
interaction behavior. This skill supplies Tailwind syntax after those decisions exist.

Do not turn optional techniques into defaults. Choose color spaces from project
requirements, optimize CSS from measured build/runtime evidence, preserve repository
class-order policy, and use CPU/GPU transform controls only after observing a rendering
need.

**Complete when:** the request is separated into Tailwind mechanics and any product or
browser policy owned by `frontend`.

### 3. Load only the matching reference

| Priority | Load when | Reference |
|---|---|---|
| 1 — Critical | Detecting v3/v4, migrating, reviewing a mixed setup, renamed utilities, changed defaults, or browser/version boundaries | `references/version-and-migration.md` |
| 1 — High | v4 CSS-first configuration, theme variables, source detection, safelisting, prefixes, legacy config/plugin compatibility, or dark variant syntax | `references/v4-configuration-and-sources.md` |
| 2 — High | Utilities, arbitrary values/variants, custom utilities, component CSS, `@apply`, CSS modules, animation, starting styles, or 3D transforms | `references/utilities-components-and-animation.md` |
| 2 — High | Vite, PostCSS, CLI, production builds, missing classes, stale output, monorepos, third-party packages, or generated-CSS debugging | `references/build-and-debug.md` |

For v3 work, use v3 documentation and installed declarations. Never translate v4
syntax backward unless the task is a migration.

### 4. Implement or report

- **Implement:** make the smallest version-matched change and retain the project's
  current integration unless a documented incompatibility requires changing it.
- **Migrate:** use the official upgrade tool when its runtime requirements fit, review
  its diff, then check every applicable breaking-change category.
- **Review:** report only version-specific correctness, build, extraction, migration,
  and maintainability findings supported by project evidence.
- **Debug:** verify input CSS, integration package, source visibility, complete class
  tokens, generated output, and stylesheet loading in that order.

**Complete when:** the requested Tailwind behavior is present, the actual build command
passes, and browser-visible changes are verified through the owning frontend workflow
when applicable.

## Completion gate

Before finishing:

- guidance matches the detected Tailwind major version;
- v4 syntax is not prescribed to v3 projects, or vice versa;
- source-detection and dynamic-class risks are checked;
- migration work accounts for renamed utilities and changed defaults, not only config;
- build advice matches the installed integration rather than a generic recipe;
- design, accessibility, and responsive policy remain with `frontend`;
- no unsupported universal rule was introduced for color space, critical CSS, class
  sorting, or transform acceleration;
- official Tailwind documentation supports every version-sensitive claim.
