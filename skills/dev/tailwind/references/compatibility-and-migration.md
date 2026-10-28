> **Read this when:** An existing project uses Tailwind v3, a mixed/legacy setup, older browser support, or an explicit migration whose installed contract changes syntax or generated behavior.

# Compatibility and migration

Ordinary guidance uses v4 examples. Compatibility work begins from installed evidence
and preserves working behavior until migration is requested and proved.

## Identify the installed contract

Use this evidence order:

1. resolved `tailwindcss` and integration versions from the package manager/lockfile;
2. active executable/plugin packages;
3. imported CSS entry and build configuration;
4. legacy files that may remain after a partial migration.

A `tailwind.config.js` file alone does not prove v3 because v4 can load one through
`@config`. A manifest range is weaker than the resolved lockfile. Check a minor-specific
capability only when the task uses it; do not convert a compatibility check into a patch
release catalog.

Keep v3 when the product browser contract or installed framework cannot support the
requested v4 behavior. Do not upgrade a neighboring package or remove a plugin merely
because a newer mechanism exists.

## Translate one behavior, not a file shape

For example, preserve a visible keyboard outline while moving from a v3 component to v4:

```html
<!-- Existing v3 form establishes outline style, width, offset, and color. -->
<button class="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
  Save
</button>
```

```html
<!-- V4 width utilities establish a solid outline; retain explicit offset/color. -->
<button class="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
  Save
</button>
```

This is a behavior-preserving translation, not a reason to rewrite every component.
Generated CSS can prove declarations; keyboard focus visibility, contrast, clipping, and
forced-colors behavior still require frontend/browser verification.

When a v3 project needs a runtime role alias, keep its installed configuration rather
than copying v4 directives backward:

```js
// Existing v3 project only.
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--surface)',
        'surface-content': 'var(--surface-content)',
      },
    },
  },
};
```

This does not promise slash-opacity support for every variable representation. Use the
installed version's supported color contract.

## Migrate through observable checkpoints

When migration is explicitly requested:

1. Record the current version, browser support, real build command, generated CSS, and
   representative rendered states.
2. Run the official upgrade tool in an isolated branch/worktree when its Node and
   repository requirements fit.
3. Review dependencies, CSS entry, retained config/plugins, templates, and generated
   output; do not accept the tool diff as visual proof.
4. Run development and production builds, then exercise representative states through
   the frontend workflow.
5. Search only the applicable behavior changes and preserve failures for review.

Check these categories when they occur:

- v3 `@tailwind` entry directives versus the v4 import and dedicated integration
  packages;
- retained config/plugins that need explicit `@config`/`@plugin` or a native replacement;
- renamed opacity, shrink/grow, ellipsis, decoration, shadow, blur, radius, outline, and
  ring utilities;
- changed border/ring defaults, gradient stops, `space-*`/`divide-*`, Preflight, hover,
  individual transforms, and outline transitions;
- important/prefix/custom-property syntax and stacked-variant ordering;
- source detection, external packages, browser compatibility, and optional modern CSS
  features.

Prefer generated/output comparison and representative screenshots over blind
search-and-replace. Restore old defaults only when they are part of the product contract.

## Failure checks

- The detected version and active integration agree.
- V4 syntax is not prescribed to an unchanged v3 project.
- A retained legacy file is confirmed active rather than assumed.
- Positive generated selectors and known changed-default cases are inspected.
- Representative focus, forms, dialogs, dense data, dark themes, hover/touch, and motion
  states are checked where used.
- Automated migration is reported as structural evidence, not browser/accessibility
  proof.

## Sources

- [Upgrade guide](https://tailwindcss.com/docs/upgrade-guide)
- [Compatibility](https://tailwindcss.com/docs/compatibility)
- [Functions and directives](https://tailwindcss.com/docs/functions-and-directives)
- [Tailwind CSS v3 documentation](https://v3.tailwindcss.com/docs)
