---
name: tailwind
description: >-
  Tailwind CSS implementation, review, and debugging for component patterns,
  responsive composition, runtime values, themes, source visibility, custom CSS,
  builds, and compatibility. Use when work depends on Tailwind utilities,
  variants, directives, generated CSS, or integration behavior. Examples target
  Tailwind v4; inspect installed capabilities before version-sensitive syntax and
  preserve existing v3 or mixed projects unless migration is requested. Route
  product design policy, semantic token naming, responsive behavior, and
  accessibility decisions to frontend.
---

# Tailwind CSS

Implement an existing visual and interaction contract with complete, inspectable
utilities. Prefer reusable decisions over utility catalogs. Tailwind owns syntax,
generated CSS, source detection, and build mechanics; `frontend` owns product behavior
and design policy, while `react` owns component APIs, composition, and state.

## Workflow

### 1. Read the styling boundary

Inspect the manifest and lockfile, active stylesheet, build integration, nearby
components, token sources, class-composition helpers, and source registration. Tailwind
v4 is the default for new examples. Check the installed version or capability when it
changes syntax, browser support, integration packages, or merge behavior; do not
silently upgrade an existing project.

**Complete when:** the active CSS entry, build owner, Tailwind capability, token source,
and component conventions are known.

### 2. Choose explicit contracts

Apply the checks that match the task:

1. **Finite choices:** map supported values to complete literal utilities; add compound
   choices only for real interacting axes.
2. **Styling ownership:** choose mutually exclusive classes first. Treat caller
   overrides as an explicit API; joining strings and resolving conflicts are different
   operations.
3. **Real state:** style native or primitive-provided ARIA/data state without inventing
   duplicate state solely for CSS.
4. **Runtime values:** validate data, then use a direct style or a static utility backed
   by a CSS custom property.
5. **Composition:** let features own placement and wrapping; let primitives own their
   appearance and behavior contract; coordinate multi-part styles only where parts vary
   together.
6. **Theme and source:** keep runtime role aliases, shared theme imports, and class-bearing
   source visibility as separate concerns.

Load `frontend` when token meaning, hierarchy, responsive thresholds, RTL, theme
activation, accessibility, or interaction behavior must be chosen. Load `react` when
component props, slots, state ownership, or extraction changes.

**Complete when:** each class, state, override, runtime value, and source path has a
named owner and observable failure condition.

### 3. Load only the matching reference

| Priority | Load when | Reference |
|---|---|---|
| 1 — High | Finite or compound variants, component styling ownership, caller overrides, native/primitive state, or coordinated component parts | `references/component-patterns.md` |
| 1 — High | Container-responsive composition, long-content handling, runtime measurements, CSS custom properties, or direct-style alternatives | `references/responsive-and-runtime.md` |
| 1 — High | Theme variables, runtime aliases, dark-theme selectors, shared theme CSS, external package source visibility, or safelisting | `references/theme-and-sources.md` |
| 2 — High | Arbitrary values/variants, custom utilities, component CSS, `@apply`, CSS modules, animation, or motion | `references/utilities-components-and-animation.md` |
| 2 — High | Build integration, production output, missing utilities, stale CSS, monorepos, or generated-CSS diagnosis | `references/build-and-debug.md` |
| 2 — Conditional | Existing v3 or mixed projects, migrations, changed defaults, legacy config/plugins, or browser compatibility | `references/compatibility-and-migration.md` |

### 4. Implement and prove the outcome

Make the smallest change that follows the installed stack. Run the owning build and
inspect generated CSS for expected selectors/declarations and negative controls. For
component examples, typecheck public props and test finite/runtime decisions through
their public surface. When authoring tests, load `test` and follow the repository's
existing runner and setup rather than duplicating test-framework rules here.

Generated CSS proves compilation, not layout, keyboard behavior, contrast, focus
management, assistive-technology behavior, or first-paint theming. Verify those through
the owning frontend workflow when they are part of the task.

**Complete when:** the requested behavior is generated and loaded, failure controls
behave as expected, repository checks pass, and unexecuted browser behavior is explicit.

## Completion gate

- v4 examples are used by default; installed-contract differences are stated only when
  they affect correctness;
- class choices are complete tokens and runtime data does not construct utilities;
- override behavior is honest about what same-element `className` or `style` can change;
- container/source/theme owners and stylesheet-relative paths are explicit;
- state styling preserves native or primitive semantics;
- optional libraries, color spaces, sorting, and abstraction layers remain conditional;
- sources support version-sensitive claims and checks distinguish generated CSS from
  real browser behavior.
