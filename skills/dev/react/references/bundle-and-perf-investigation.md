> **Priority: CRITICAL** — A slow initial load loses users before they see any
> content. Bundle size directly impacts LCP (Largest Contentful Paint) and every
> user on a slow connection. Fix bundle issues before re-render optimizations —
> a 200 KB reduction beats 50 `useMemo` calls in user-perceived impact.
>
> **Read this when:** user mentions slow initial load, bundle size, "why is the
> app slow", Web Vitals (LCP, INP, CLS), flame graphs, profiling, code splitting,
> dynamic imports, tree-shaking, or asks "which library is causing this bloat?"
>
> **Not the right file?** React render performance (re-renders, useMemo) →
> `re-renders.md`. Data-fetching waterfalls → `waterfalls.md`.

# Bundle and Performance Investigation

A slow initial load is almost always a bundle problem. A janky interactive page
is almost always a main-thread problem. Diagnose first — the fix follows the
measurement.

---

## Step 1: Measure Before Guessing

**Lighthouse** (Chrome DevTools → Lighthouse tab) gives you:
- **LCP** — Largest Contentful Paint (< 2.5s is good)
- **INP** — Interaction to Next Paint (< 200ms is good, replaces FID)
- **CLS** — Cumulative Layout Shift (< 0.1 is good)
- Total JS size, main-thread blocking time (TBT), render-blocking resources

**Network tab** → check "Disable cache" → reload. Sort by size. Look for:
- Large JS chunks (> 200 KB uncompressed is a red flag)
- Duplicate requests
- Slow API calls that block render

---

## Step 2: Visualize the Bundle (Vite)

Add `rollup-plugin-visualizer` to get an interactive treemap of every module:

```typescript
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    visualizer({
      open: true,           // opens in browser after build
      gzipSize: true,       // show gzip sizes (what the network actually transfers)
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
});
```

```bash
pnpm build   # opens stats.html automatically
```

Look for unexpectedly large rectangles. Hover for the exact module path and size.
The biggest rectangle is usually the culprit.

**For Next.js:** use `@next/bundle-analyzer`:

```typescript
// next.config.ts
import bundleAnalyzer from '@next/bundle-analyzer';
const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default withBundleAnalyzer({});
```

```bash
ANALYZE=true pnpm build
```

---

## Common Heavy Culprits

### Moment.js — 231 KB

```typescript
// ❌ Moment is not tree-shakeable — entire library is in the bundle
import moment from 'moment';
moment(date).format('MMM D, YYYY');

// ✅ date-fns — tree-shakeable, pay only for what you use (~13 KB for format)
import { format } from 'date-fns';
format(date, 'MMM d, yyyy');

// ✅ dayjs — 2 KB, moment-compatible API
import dayjs from 'dayjs';
dayjs(date).format('MMM D, YYYY');
```

### Lodash (full) — 71 KB

```typescript
// ❌ Imports the entire library
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ lodash-es — tree-shakeable version
import { debounce } from 'lodash-es';

// ✅ Or use native equivalents (often shorter than the import)
// _.debounce → use-debounce package or write it inline
// _.cloneDeep → structuredClone() (native, zero cost)
// _.merge → { ...a, ...b } for shallow, or structuredClone for deep
// _.get → optional chaining: obj?.a?.b?.c
```

### Icon library barrel imports

```typescript
// ❌ Imports the entire icon set
import { Home, User, Settings } from '@ant-design/icons'; // 1.2 MB!

// ✅ Import from the specific module path
import HomeOutlined from '@ant-design/icons/HomeOutlined';

// lucide-react is tree-shakeable by default (used in shadcn/ui)
import { Home, User, Settings } from 'lucide-react'; // ✅ fine
```

---

## Tree-Shaking Requirements

For a module to be tree-shakeable, three conditions must hold:

1. **ESM format** — `import/export`, not `require/module.exports`
2. **`sideEffects: false`** in `package.json` — tells bundler that imports have
   no side effects (safe to discard unused exports)
3. **Named exports** — default exports are tree-shakeable but harder for bundlers
   to analyze; named exports are unambiguous

For your own packages:
```json
// package.json
{
  "sideEffects": false,
  // or list files with actual side effects:
  "sideEffects": ["./src/styles.css", "./src/polyfills.ts"]
}
```

---

## Barrel Files — The Silent Bundle Killer

Barrel files (`index.ts` that re-export everything) make imports convenient but
destroy tree-shaking in many bundlers:

```typescript
// components/index.ts — barrel file
export { Button } from './Button';
export { Modal } from './Modal';
export { Table } from './Table';
// ... 50 more exports

// ❌ Bundler may pull in the entire barrel even if only Button is used
import { Button } from './components';

// ✅ Direct import — pulls only Button
import { Button } from './components/Button';
```

Barrel files in `node_modules` packages are fine — bundlers handle them.
Barrel files in your app code are not — they expand the import surface unnecessarily.

From midday and dub codebases: features import directly from sibling feature
modules, not through an index barrel. ESLint `import/no-barrel-files` rule
enforces this automatically.

---

## Code Splitting — Route-Based (Biggest Win)

```typescript
// app/routes.tsx (React Router / TanStack Router)
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Each route only loads its own code on first visit
<Routes>
  <Route path="/dashboard" element={
    <Suspense fallback={<PageSkeleton />}>
      <Dashboard />
    </Suspense>
  } />
</Routes>

// Next.js App Router handles this automatically per-page —
// no explicit lazy() needed for route-level splitting
```

### Dynamic imports for heavy components

```typescript
// ❌ Rich text editor loaded on every page that imports this component
import { RichTextEditor } from './RichTextEditor'; // ~180 KB

// ✅ Load only when user actually clicks "Edit"
const [EditorModule, setEditorModule] = useState<{ default: ComponentType } | null>(null);

async function handleEditClick() {
  if (!EditorModule) {
    const module = await import('./RichTextEditor');
    setEditorModule(module);
  }
}

const EditorComponent = EditorModule?.default;
```

### Named chunks for better caching

```typescript
// vite / webpack magic comments — split into named chunks
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './Dashboard'));

// Group related pages into one chunk
const adminChunk = () => import('./admin'); // AdminDashboard + AdminSettings
const Admin = lazy(() => adminChunk().then(m => ({ default: m.AdminDashboard })));
const AdminSettings = lazy(() => adminChunk().then(m => ({ default: m.AdminSettings })));
```

---

## Preloading and Prefetching

```typescript
// Prefetch next likely route on hover (import starts immediately)
function NavLink({ to, children }: NavLinkProps) {
  const prefetchRoute = () => import(`../pages/${to}`);
  return (
    <Link to={to} onMouseEnter={prefetchRoute}>
      {children}
    </Link>
  );
}

// Preload critical assets (fonts, hero images)
// In <head>:
<link rel="preload" as="font" href="/fonts/inter.woff2" crossOrigin="anonymous" />
<link rel="preload" as="image" href="/hero.webp" />
```

---

## Reading the Flame Graph

Chrome DevTools → Performance tab → record a page load.

- **Long tasks (red bars)** — JS execution blocking the main thread for > 50ms
- **Parse/Evaluate** — time to parse your JS. Reduce with smaller bundles.
- **Layout** — DOM layout recalculations. Reduce by avoiding layout thrashing.
- **Paint** — compositing. Check for unnecessary repaints.

Click a long task → Bottom-Up tab → sort by Self Time → this shows the actual
function spending the most time.

---

## Quick Investigation Checklist

- [ ] Measure first: run Lighthouse, note LCP, INP, TBT
- [ ] Add rollup-plugin-visualizer → build → identify the largest module
- [ ] Check if the large module has a tree-shakeable alternative
- [ ] Verify barrel file imports are not pulling more than needed
- [ ] Add route-based code splitting if not already present
- [ ] Move heavy components (rich text editor, date picker, charts) to dynamic import
- [ ] Check for duplicate packages: `pnpm why <package>` to see why it's in the tree
- [ ] Verify `sideEffects: false` in your own packages

---

## Further Reading

- [Vite — Build Optimization](https://vitejs.dev/guide/build.html)
- [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
- [web.dev — Core Web Vitals](https://web.dev/vitals/)
- [Addy Osmani — Import on Interaction](https://www.patterns.dev/vanilla/import-on-interaction)
