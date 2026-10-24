> **Read this when:** concrete examples are needed for extracting policy from React,
> deterministic time inputs, data-owning sections, optional multi-query coordination,
> narrow Context, injected boundary clients, plain policy tests, or deciding to leave a
> small component alone.

# React Composition Examples

These snippets use one neutral reservation capability. They are intentionally partial
and use Zod 4 only to make the schema API concrete and copyable. Adapt the example to the
project's installed validator, data library, import conventions, and error model; the
example does not require adding Zod.

## BAD: policy buried in a data hook

```tsx
function useReservation(tenantId: string, offeringId: string) {
  const query = useQuery({
    queryKey: ["offering", tenantId, offeringId],
    queryFn: () =>
      client.get(`/tenants/${tenantId}/offerings/${offeringId}`),
  });

  const raw = query.data as OfferingResponse;

  return {
    ...query,
    canReserve:
      raw.remaining > 0 && new Date(raw.closesAt).getTime() > Date.now(),
    statusText: raw.remaining === 1 ? "Last place" : `${raw.remaining} places`,
  };
}
```

This hook promotes unchecked data, hides the clock, mixes transport, business policy,
and one screen's wording, and makes a pure decision depend on React.

### Time is a required policy fact

```ts
// BAD: omitting now makes supposedly pure policy read the ambient clock.
function isExpired(expiresAt: number, now = Date.now()) {
  return expiresAt <= now;
}

// GOOD: runtime integration reads the clock and passes the fact into policy.
function isExpired(expiresAt: number, now: number) {
  return expiresAt <= now;
}

const expired = isExpired(expiresAt, Date.now());
```

The issue is the hidden ambient read inside a business decision, not default parameters
in general. Requiring `now` makes the rule deterministic without injecting a clock
service or introducing a DI framework.

## GOOD: boundary, rule, section, composer, leaf

```tsx
import { z } from "zod";

const OfferingResponseSchema = z.object({
  id: z.string(),
  remaining: z.number(),
  closesAt: z.iso.datetime(),
});

type OfferingResponse = z.infer<typeof OfferingResponseSchema>;

type Offering = {
  id: string;
  remaining: number;
  closesAt: Date;
};

type HttpClient = {
  get(path: string): Promise<unknown>;
};

export async function loadOffering(
  client: HttpClient,
  tenantId: string,
  offeringId: string,
): Promise<Offering> {
  const input = await client.get(
    `/tenants/${tenantId}/offerings/${offeringId}`,
  );
  const response: OfferingResponse = OfferingResponseSchema.parse(input);

  return {
    id: response.id,
    remaining: response.remaining,
    closesAt: new Date(response.closesAt),
  };
}

export function reservationDecision(input: {
  remaining: number;
  closesAt: Date;
  now: Date;
}): "available" | "full" | "closed" {
  if (input.remaining <= 0) return "full";
  if (input.closesAt <= input.now) return "closed";
  return "available";
}

function ReservationSection(props: {
  client: HttpClient;
  tenantId: string;
  offeringId: string;
  now: Date;
}) {
  const query = useQuery({
    queryKey: ["offering", props.tenantId, props.offeringId],
    queryFn: () =>
      loadOffering(props.client, props.tenantId, props.offeringId),
  });

  if (query.isPending) return <ReservationSkeleton />;
  if (query.isError) return <ReservationError onRetry={() => query.refetch()} />;

  return <ReservationComposer offering={query.data} now={props.now} />;
}

function ReservationComposer(props: { offering: Offering; now: Date }) {
  const decision = reservationDecision({
    remaining: props.offering.remaining,
    closesAt: props.offering.closesAt,
    now: props.now,
  });

  const availabilityText =
    props.offering.remaining === 1
      ? "One place remaining"
      : `${props.offering.remaining} places remaining`;

  return (
    <ReservationView
      availabilityText={availabilityText}
      disabled={decision !== "available"}
    />
  );
}

function ReservationView(props: {
  availabilityText: string;
  disabled: boolean;
}) {
  return (
    <section aria-labelledby="reservation-heading">
      <h2 id="reservation-heading">Reservation</h2>
      <p>{props.availabilityText}</p>
      <button disabled={props.disabled}>Reserve</button>
    </section>
  );
}
```

The loader validates and maps. The plain function owns eligibility. The section owns its
data and recovery. The composer combines trusted facts and screen wording. The leaf
renders an explicit contract. If the composer only forwarded props, remove it.

The cache identity includes the resource, tenant, and identifier. Follow the installed
data library when it supports per-observer projections; those projections do not imply
that one observer overwrites another's cached value.

## Optional container for a coordinated review

Use a container when several results must be presented or acted on together. Independent
sections should keep their own owners instead.

```tsx
function ReservationReviewContainer(props: {
  offeringId: string;
  accountId: string;
}) {
  const offering = useOffering(props.offeringId);
  const account = useAccount(props.accountId);

  if (offering.isPending || account.isPending) return <ReviewSkeleton />;
  if (offering.isError || account.isError) {
    return (
      <ReviewError
        onRetry={() => {
          offering.refetch();
          account.refetch();
        }}
      />
    );
  }

  return (
    <ReservationReviewComposer
      offering={offering.data}
      account={account.data}
    />
  );
}

function ReservationReviewComposer(props: {
  offering: Offering;
  account: Account;
}) {
  const summary = buildReservationSummary(props.offering, props.account);
  return <ReservationReview summary={summary} />;
}

function ReservationReview({ summary }: { summary: ReservationSummary }) {
  return <dl>{/* display trusted summary fields */}</dl>;
}
```

The container coordinates readiness and recovery for one review. Two independent queries
do not by themselves provide an authoritative server snapshot, matching versions, or an
atomic save; those guarantees require backend and data-layer contracts. A shared save
still needs one owner for its draft and submit flow. This review owner does not justify
moving every reservation section under the same container.

## Narrow Context for a shared draft

```tsx
const ReservationDraftContext = createContext<ReservationDraftValue | null>(null);

function ReservationDraftProvider({ children }: { children: ReactNode }) {
  const draft = useReservationDraft();

  return (
    <ReservationDraftContext.Provider value={draft}>
      {children}
    </ReservationDraftContext.Provider>
  );
}

function GuestCountField() {
  const { state, actions } = useReservationDraftContext();
  return (
    <input
      aria-label="Guest count"
      type="number"
      value={state.guestCount}
      onChange={(event) => actions.setGuestCount(Number(event.target.value))}
    />
  );
}
```

The provider coordinates non-server draft state across descendants. Server data remains
in the installed cache, and plain policy remains importable. Callbacks and actions are
part of the context contract; a nested feature may consume it when the required provider
is explicit.

## Boundary and policy tests

```ts
it("maps a valid offering response", async () => {
  const client: HttpClient = {
    get: async () => ({
      id: "offering-1",
      remaining: 2,
      closesAt: "2030-04-05T12:00:00.000Z",
    }),
  };

  await expect(
    loadOffering(client, "tenant-1", "offering-1"),
  ).resolves.toEqual({
    id: "offering-1",
    remaining: 2,
    closesAt: new Date("2030-04-05T12:00:00.000Z"),
  });
});

it("rejects a malformed offering response", async () => {
  const client: HttpClient = {
    get: async () => ({ id: "offering-1", remaining: "many" }),
  };

  await expect(
    loadOffering(client, "tenant-1", "offering-1"),
  ).rejects.toBeInstanceOf(z.ZodError);
});

it("closes reservations at the deadline", () => {
  expect(
    reservationDecision({
      remaining: 2,
      closesAt: new Date("2030-04-05T12:00:00.000Z"),
      now: new Date("2030-04-05T12:00:00.000Z"),
    }),
  ).toBe("closed");
});
```

The injected client makes the boundary behavior replaceable without a generic DI
container. These tests cover mapping, malformed input, and plain policy. Also prove the
real applicable wiring through the public integration or product surface; mocks and unit
tests alone do not establish that connection.

## Leave a simple component simple

```tsx
function ReservationNote({ children }: { children: ReactNode }) {
  return <p className="reservation-note">{children}</p>;
}
```

This component already has a clear semantic role and contract. It needs no hook,
provider, composer, or factory until real behavior creates that pressure.
