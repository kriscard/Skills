> **Read this when:** comparing concrete frontend layouts for the same capability or
> explaining when feature-local, product-grouped, or product/domain-module ownership fits.

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

## Alternative C: Product/domain module with nested features

```text
src/
└── modules/
    └── reservations/
        ├── offering.schema.ts          # shared boundary contract and model
        ├── load-offering.ts            # shared validation and data integration
        ├── can-reserve.ts              # framework-free product rule
        └── features/
            ├── Reservation/
            │   ├── ReservationSection.tsx
            │   └── ReservationView.tsx
            └── OfferingBrowser/
                └── OfferingList.tsx
```

**Fits when:** one product domain owns a cohesive schema, data integration, and business
rules used by multiple interactions, while each nested feature still owns its UI state,
feedback, and presentation.

**Owners:** `modules/reservations` owns the stable reservation concepts and boundary.
`Reservation` owns the reserve interaction; `OfferingBrowser` owns browsing and its
screen-specific formatting. The module is an ownership boundary inside the existing
application, not a requirement for a workspace, build target, or published package.

**Import direction:** application composition → nested feature entry points → shared
module contracts and rules. Nested features do not import each other's internals, and
the shared policy and integration do not depend on feature UI.

## Choosing among them

Choose the smallest layout matching actual consumers:

- one owner and one consumer: feature-local;
- shared stable server model but product-specific policy: shared data layer;
- one product domain with several feature interactions: product/domain module.

Do not migrate a whole feature merely to resemble another alternative. A single plain
policy function can move when its ownership changes while nearby UI remains intact.
Async server loaders fit the same responsibilities; route concrete server/client and
cache mechanics to the installed framework specialist.
