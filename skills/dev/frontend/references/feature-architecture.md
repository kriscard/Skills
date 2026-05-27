> **Priority: MEDIUM** — Architecture debt from a flat structure shows up as
> shotgun surgery: one feature change touches 8 files across the codebase. The
> feature-based pattern makes that one change touch one directory. Apply when
> the current structure is already causing pain, not as a preemptive refactor
> on a small project.
>
> **Read this when:** user asks how to structure a React project, mentions
> feature folders, asks "where should this file go", reports that changes to one
> feature break another, or is starting a new mid-to-large-scale React app.
>
> **Not the right file?** Barrel file bundle performance → `bundle-and-perf-investigation.md`.
> Component composition within a feature → `ui-patterns.md`.

# Feature-Based Architecture

Pattern from bulletproof-react, dub, and midday. Co-locate everything that
changes together. A feature owns its API calls, components, hooks, state, types,
and utilities — other features don't reach into it.

---

## The Structure

```
src/
├── features/
│   ├── auth/
│   │   ├── api/          ← fetch functions, React Query hooks (useUser, useLogin)
│   │   ├── components/   ← LoginForm, AuthGuard, UserAvatar
│   │   ├── hooks/        ← useAuth, useSession
│   │   ├── stores/       ← Zustand store if needed (authStore)
│   │   ├── types/        ← User, Session, AuthState
│   │   └── utils/        ← tokenHelpers, permissionChecks
│   ├── billing/
│   │   ├── api/
│   │   ├── components/   ← PricingTable, InvoiceList, UpgradeModal
│   │   ├── hooks/
│   │   └── types/
│   └── dashboard/
│       ├── api/
│       ├── components/
│       └── hooks/
├── shared/               ← used by more than one feature
│   ├── components/       ← Button, Input, Modal (generic, no feature logic)
│   ├── hooks/            ← useDebounce, useLocalStorage
│   ├── lib/              ← api client, date utils, validators
│   └── types/            ← common types shared across features
└── app/                  ← routes, layouts, providers — composes features
    ├── (dashboard)/
    │   └── page.tsx
    └── providers.tsx
```

---

## Rules

**No cross-feature imports** — features must not import from each other:

```typescript
// ❌ billing imports from auth internals
import { getUserPermissions } from '@/features/auth/utils/permissionChecks';

// ✅ shared/ for cross-cutting concerns
import { getUserPermissions } from '@/shared/lib/permissions';
// Or: pass the data as a prop from the app layer
```

**Unidirectional flow:** `shared/` → `features/` → `app/`. Nothing flows upward.

**No barrel files inside features:**

```typescript
// ❌ features/auth/index.ts re-exporting everything
// Creates circular dependency risk + prevents tree-shaking

// ✅ Import directly from the module
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
```

**Compose at the app layer:**

```typescript
// app/(dashboard)/page.tsx — assembles features, owns no logic itself
import { UserStats } from '@/features/dashboard/components/UserStats';
import { RecentActivity } from '@/features/activity/components/RecentActivity';
import { BillingBanner } from '@/features/billing/components/BillingBanner';

export default function DashboardPage() {
  return (
    <>
      <BillingBanner />
      <UserStats />
      <RecentActivity />
    </>
  );
}
```

---

## When to Use vs. When to Skip

| Use feature-based when | Skip it when |
|------------------------|--------------|
| 3+ developers working concurrently | Solo project or prototype |
| Features have clear domain boundaries | Features share most of their state |
| Shotgun surgery across files is already happening | App has < 5 features |
| You want to enforce "no cross-feature imports" at the ESLint level | The flat structure is navigable and causing no pain |
| Preparing for a team to scale | Upfront structure adds overhead you don't have time for |

---

## Enforcing the Rules with ESLint

```javascript
// .eslintrc.js — prevent cross-feature imports
rules: {
  'import/no-restricted-paths': [
    'error',
    {
      zones: [
        // features cannot import from other features
        {
          target: './src/features/auth',
          from: './src/features',
          except: ['./auth'],
          message: 'Feature modules cannot import from other features.',
        },
        // features cannot import from app layer
        {
          target: './src/features',
          from: './src/app',
          message: 'Feature modules cannot import from the app layer.',
        },
      ],
    },
  ],
},
```

---

## Further Reading

- [Bulletproof React — Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [dub codebase](https://github.com/dubinc/dub) — feature-based structure in production
- [midday codebase](https://github.com/midday-ai/midday) — mono-repo with feature isolation
