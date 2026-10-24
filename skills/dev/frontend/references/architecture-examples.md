> **Read this when:** comparing concrete frontend layouts for the same capability or
> explaining when feature-local, product-grouped, or package-plus-feature ownership fits.

# Frontend Architecture Examples

These alternatives model the same **reservation** capability: load an offering, validate
and map its response, decide whether the current facts permit a reservation, and render
the result. Names describe roles; no tree is mandatory. Preserve a sound existing
structure and create only the files current behavior needs.

## Alternative A: Feature-local

```text
src/
└── features/
    └── reservation/
        ├── reservation-section.tsx   # owns loading, recovery, and feedback
        ├── reservation-view.tsx      # displays trusted props
        ├── load-offering.ts           # fetches, validates, maps
        ├── can-reserve.ts             # plain business decision
        └── reservation.test.ts
```

**Fits when:** one product feature owns the integration, policy, and UI, and no other
consumer needs those contracts yet.

**Owners:** everything remains local to `reservation`. `load-offering.ts` owns the trust
boundary; `can-reserve.ts` owns business meaning; the section owns the user-visible async
experience.

**Import direction:** route or page → reservation entry point → local integration and
policy. Nothing outside the feature deep-imports its internals.

## Alternative B: Product-grouped UI with shared data layer

```text
src/
├── data/
│   └── offerings.ts                  # shared schema, mapping, and loader
└── products/
    ├── reservation/
    │   ├── reservation-section.tsx
    │   ├── reservation-view.tsx
    │   └── can-reserve.ts
    └── offering-browser/
        └── offering-list.tsx
```

**Fits when:** several product areas consume the same stable offering model and boundary
integration, while reservation policy and presentation remain specific to reservation.

**Owners:** `data/offerings.ts` owns the shared transport-to-frontend contract.
`products/reservation` owns eligibility and UI. The browser owns its own formatting and
interaction rather than adding them to response mapping.

**Import direction:** product UI → shared data contract. Product areas do not import one
another. Keep transport and cache helpers in `offerings.ts` until their number or
independent responsibility makes a split useful.

## Alternative C: Package plus feature

```text
packages/
└── reservation-policy/
    ├── index.ts                       # public domain interface
    ├── can-reserve.ts                 # framework-free business policy
    └── can-reserve.test.ts
apps/web/src/
└── features/reservation/
    ├── reservation-section.tsx        # owns web data and feedback
    ├── reservation-view.tsx
    └── load-offering.ts               # web boundary integration
```

**Fits when:** reservation policy has independent consumers, release ownership, or a
meaningful dependency boundary—for example, more than one application must apply the
same decision.

**Owners:** the package owns the domain interface and has no React or transport
knowledge. The web feature owns its data library integration and presentation. The
package is a domain module; it need not be published externally or turned into a
workspace package unless the repository already uses that mechanism.

**Import direction:** web feature → package public interface. The package never imports
application UI, transport, storage, translation services, or framework code.

## Choosing among them

Choose the smallest layout matching actual consumers:

- one owner and one consumer: feature-local;
- shared stable server model but product-specific policy: shared data layer;
- independently consumed business policy: package plus feature.

Do not migrate a whole feature merely to resemble another alternative. A single plain
policy function can move when its ownership changes while nearby UI remains intact.
Async server loaders fit the same responsibilities; route concrete server/client and
cache mechanics to the installed framework specialist.
