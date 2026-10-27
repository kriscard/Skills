> **Read this when:** integrating Tailwind with Vite, PostCSS, or the CLI; preparing production output; or debugging missing utilities, stale CSS, monorepo sources, and third-party packages.

# Build and debug

## Match the installed integration

Do not install every integration package. Keep one build path that matches the host
framework and existing toolchain.

### V4 with Vite

For a Vite-owned CSS pipeline, Tailwind recommends the dedicated plugin:

```ts
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Install `tailwindcss` and `@tailwindcss/vite`, then import Tailwind from the active CSS
entry with `@import "tailwindcss";`. Preserve framework-specific integration when its
official guide requires a different path.

### V4 with PostCSS

Use the dedicated plugin:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Install `tailwindcss`, `@tailwindcss/postcss`, and `postcss`. V4 handles imports and
vendor prefixing for its pipeline, so remove `postcss-import` or `autoprefixer` only
when no other stylesheet or plugin still depends on them.

### V4 CLI

Install `tailwindcss` and `@tailwindcss/cli`, then call the dedicated executable:

```sh
npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
```

### V3

Use the v3 package as its CLI or PostCSS plugin. Keep `tailwind.config.*`, configure all
source paths under `content`, and use the three `@tailwind` directives in the input CSS.
Follow the v3 framework guide rather than adapting a v4 installation snippet.

The Play CDN is a development/prototyping path, not a production build integration.

## Production output

Run the repository's production build rather than inventing a separate Tailwind
command. Confirm that minification, hashing, asset loading, and CSS inclusion happen in
the owning framework/build tool. Do not prescribe manual critical-CSS extraction
without measured render evidence and an owner for cache invalidation.

V4 is designed to work directly with modern CSS and does not support Sass, Less, or
Stylus as a preprocessing stage in the same way as a traditional preprocessor. Before
removing a preprocessor from an existing project, inspect whether it owns non-Tailwind
styles or framework behavior.

Audit plugins during v4 migration. Remove a plugin only when v4 provides the same used
capability and generated output confirms the replacement. A package being described as
built-in is not proof that every project-specific option migrated unchanged.

## Debugging order

### 1. Confirm the active build

- Run the exact development or production script that owns the page.
- Confirm which CSS entry point is imported and whether the built asset reaches the
  rendered document.
- Check for duplicate Tailwind pipelines or stale generated files.
- Confirm integration package majors match `tailwindcss`.

### 2. Confirm the input stylesheet

- V4 needs `@import "tailwindcss"`; v3 needs the `@tailwind` layer directives.
- Confirm `@config`, `@plugin`, `@reference`, and relative source paths resolve from the
  stylesheet that contains them.
- In component-scoped or module CSS, add `@reference` before assuming a utility or theme
  value is missing globally.

### 3. Confirm source visibility

- In v3, inspect `content` globs, extensions, working directory, transforms, and any
  package paths.
- In v4, inspect automatic exclusions, the build working directory, `source()` base,
  explicit `@source` entries, and `source(none)` isolation.
- Register external UI packages explicitly when they are ignored as dependencies.
- Keep safelisting as a bounded fallback, not the first fix.

### 4. Confirm class tokens

Tailwind scans text; it does not execute application code. Search for the full expected
class string. Replace interpolation such as `` `text-${tone}-600` `` with a map whose
values contain complete utilities. Check spelling, prefix position, variant order,
arbitrary-value delimiters, and v3/v4 renamed utilities.

### 5. Inspect generated CSS

Search the built CSS for the escaped selector or expected declaration:

- absent selector: extraction, configuration, version, or plugin problem;
- selector present but absent from the page: asset/loading or stylesheet-order problem;
- selector present and loaded but losing: cascade, specificity, layer, or important
  problem;
- declaration applied but visually wrong: changed default, browser support, layout, or
  product-policy problem.

Use browser computed styles to distinguish these cases. Do not solve every failure with
`!important` or a safelist.

### 6. Check rebuild behavior

If watch mode misses changes or loops, inspect the build tool's dependency tracking,
source breadth, generated outputs inside scanned paths, and monorepo working directory.
Exclude generated or irrelevant trees rather than broadening scans indefinitely.

## Review checklist

- Package and integration majors agree.
- One active CSS entry imports the correct Tailwind version syntax.
- Source registration covers every class owner without scanning generated output.
- Dynamic variants map to complete class strings.
- Custom CSS uses the version-correct extension API.
- Production output is created and loaded by the owning build.
- Performance changes are supported by build size, timing, or browser evidence.

## Official sources

- [Installing with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Installing with PostCSS](https://tailwindcss.com/docs/installation/using-postcss)
- [Tailwind CLI](https://tailwindcss.com/docs/installation/tailwind-cli)
- [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Compatibility](https://tailwindcss.com/docs/compatibility)
- [Tailwind CSS v3 installation](https://v3.tailwindcss.com/docs/installation)
- [Tailwind CSS v3 content configuration](https://v3.tailwindcss.com/docs/content-configuration)
