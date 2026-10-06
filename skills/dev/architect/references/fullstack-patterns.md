> **Read this when:** deciding service boundaries, client-specific
> orchestration, API contracts, protocols, or request/data-flow architecture.

# Fullstack Architecture Patterns

Separate responsibilities before choosing a protocol or deployment unit. A BFF,
API gateway, graph layer, and domain service may coexist, but they solve different
problems.

## Responsibility map

| Responsibility | Typical owner |
|---|---|
| Client-specific aggregation and view models | BFF or application backend |
| Authentication enforcement, routing, quotas, coarse caching | Gateway or platform edge |
| Domain rules and authoritative state | Domain/application service |
| Cross-source graph contract and field resolution | GraphQL layer or federated graph |
| Workflow coordination across boundaries | Application/orchestration module |

Ownership follows the organization's operating model. Record who deploys,
observes, supports, and evolves each contract rather than assigning ownership by
technology name.

## Backend for Frontend

A BFF exposes an interface shaped for one client class and orchestrates downstream
capabilities on that client's behalf.

Use when evidence shows:

- web, mobile, or another client needs materially different contracts
- one user journey requires repeated client-side orchestration across services
- domain responses need stable client-specific projection
- the client cannot safely or efficiently coordinate required downstream work

A GraphQL server is a BFF only when it owns this client-specific responsibility.
An API gateway is a BFF only when it performs client-specific orchestration, not
merely routing, authentication, or rate limiting.

Costs include another contract, deployment, failure surface, observability path,
and potential duplication across clients. Keep domain invariants in their owning
module; the BFF composes rather than becomes a second domain layer.

## Protocol selection

Choose protocol after defining consumers, interaction shape, compatibility,
latency, caching, security, and evolution requirements.

### HTTP resource/message APIs

Strong fit for broadly consumable contracts, request/response interactions,
standard HTTP semantics, and intermediary caching. Payload shape, batching,
sparse fields, and purpose-built endpoints determine whether over-fetching or
request waterfalls occur; they are not inherent properties of REST.

### GraphQL

Strong fit when clients need varied projections over a governed graph and the
organization can own schema evolution, authorization, resolver cost, caching,
and observability. One browser request may still trigger internal waterfalls or
N+1 work; inspect the complete resolver and downstream graph.

### RPC and contract-first binary protocols

Strong fit for controlled service-to-service communication, generated clients,
high throughput, or streaming. Account for browser compatibility, debugging,
versioning, proxy support, and organizational language diversity.

### Events and asynchronous messages

Strong fit for decoupled notification, workload buffering, replay, and workflows
that do not require an immediate result. Define delivery guarantees, ordering,
idempotency, schema evolution, retries, dead-letter handling, and ownership.

### Realtime channels

WebSockets, server-sent events, and streaming RPC serve different directionality
and connection requirements. Choose from message flow, fan-out, reconnection,
backpressure, infrastructure, and authorization needs.

## Decision evidence

Trace at least one representative journey and record:

- callers and contract owners
- request/message count and dependency order
- payloads actually consumed
- latency and throughput targets with source
- consistency and failure semantics
- compatibility and migration requirements
- operational owner and observability

A protocol recommendation is incomplete until it explains how the whole journey
behaves, not only the client-facing request count.

## Common data-flow problems

### Request waterfall

Independent operations run sequentially. Verify the dependency before combining,
parallelizing, preloading, or moving orchestration server-side.

### N+1 work

One list operation triggers per-item downstream work. Address it with batching,
bulk interfaces, joins/projections, or resolver planning at the layer that owns
the data access.

### Extraneous transfer

The system transfers fields or records the consumer does not use. Compare payload
and consumption, then consider projection, sparse fields, pagination, compression,
or a client-specific interface.

### Busy client

Main-thread computation or excessive rendering blocks interaction. Measure the
work first, then reduce it, schedule it, move it to a worker, or move it closer to
the data. Server offload is beneficial only when transfer and server latency do
not exceed the saved client work.
