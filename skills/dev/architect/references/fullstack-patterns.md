> **Read this when:** user is designing service boundaries, API contracts, or fullstack system architecture. Covers BFF pattern, API protocol selection, and frontend-relevant performance antipatterns.

# Fullstack Architecture Patterns

---

## BFF (Backend for Frontend)

### What it is
A backend layer owned by the frontend team that aggregates and transforms backend services into an interface optimized for a specific client type (web, mobile, desktop).

```
Web Client → BFF (Web) ─┐
                         ├─ User Service
Mobile Client → BFF (Mobile) ─┘ │
                                  └─ Product Service
                                  └─ Order Service
```

### Problem it solves
**Over-fetching:** A REST endpoint returns everything; the frontend renders 3 fields.
**Chatty I/O:** Loading one page requires 6 sequential API calls to get related data.
**Shape mismatch:** Backend models represent domain objects; frontend needs a view model optimized for one specific screen.

### Modern forms
- **GraphQL server** — client specifies exactly what fields it needs; server fulfills from multiple sources
- **Next.js API routes / Route Handlers** — thin aggregation layer that calls internal services
- **tRPC** — end-to-end type-safe RPC from TypeScript backend to TypeScript frontend; zero API schema duplication
- **API Gateway with aggregation** — AWS API Gateway, Kong for infrastructure-level BFF

### Ownership
The BFF interface is defined by what the UI needs, not by backend domain models. **Frontend team owns it.** This is the key architectural decision: the contract is frontend-driven.

### When to add
- Multiple microservices must be called to render one page
- Mobile and web need different data shapes from the same backend
- Backend API is too chatty or over-fetching is measurable
- You need to add auth, rate limiting, or caching without touching each microservice

### Trade-offs
| Benefit | Cost |
|---------|------|
| Frontend gets exactly the data it needs | Another service to deploy and maintain |
| Backend services stay focused on domain | Potential for logic duplication across BFFs |
| Easy to version per client type | Requires coordination when backend contracts change |

---

## API Protocol Decision

Choosing the wrong protocol for the wrong use case creates friction that compounds over time.

| Protocol | Strengths | Weaknesses | Use when |
|----------|-----------|------------|----------|
| **REST** | Stateless, HTTP-cacheable, widely understood, battle-tested tooling | Over-fetching, under-fetching, N+1 request patterns, versioning friction | Public APIs, simple CRUD, stable known clients, existing team knowledge |
| **GraphQL** | Client specifies exact fields, strongly typed schema, introspectable, solves over/under-fetch | Cache complexity, query cost management, N+1 resolver problem, steeper backend setup | Varied client data needs (web vs mobile), BFF implementation, rapid frontend iteration, complex nested data |
| **gRPC** | Binary (fast), bidirectional streaming, contract-first via protobuf, strongly typed | Not browser-native (requires proxy like grpc-web or connect), steep learning curve, tooling gap | Server-to-server internal communication, high-throughput internal APIs, streaming (chat, live data) |

### Decision signals
- **"Our frontend needs different data than our mobile app"** → GraphQL or separate BFFs
- **"We're making 5 API calls to render this page"** → GraphQL, BFF aggregation, or request batching
- **"Two microservices communicate at high frequency internally"** → gRPC
- **"We're building a public API for third-party developers"** → REST (widest tooling support, most familiar)
- **"We need real-time bidirectional streaming"** → gRPC or WebSockets

---

## Frontend Performance Antipatterns

These are architectural problems, not implementation details. Fixing them requires design changes, not just code tweaks.

### Busy Frontend
**What:** Heavy computation running on the browser's main thread, blocking rendering and interaction.
**Symptoms:** Janky animations, unresponsive UI during data processing, high TBT (Total Blocking Time) in Core Web Vitals, long tasks in Chrome DevTools.
**Examples:** Sorting/filtering large datasets on the client, complex CSV parsing, image processing in JS.

**Fixes:**
- Move CPU-bound work to a **Web Worker** (runs in background thread, zero main thread impact)
- **Offload to the server** — server can do it faster with less latency than sending data + processing in browser
- **Defer with `requestIdleCallback`** for non-urgent work
- **Virtualize long lists** (react-virtual, tanstack-virtual) instead of rendering 10,000 DOM nodes

**Measure with:** INP (Interaction to Next Paint), TBT (Total Blocking Time) in Lighthouse/Web Vitals.

---

### Chatty I/O
**What:** Many small sequential requests to fetch what could be one larger request.
**Symptoms:** Waterfall of API calls in DevTools Network tab, page feels slow despite good server response times, N+1 query pattern.
**Examples:** Load user → load their posts → load comments for each post (sequential chain). Loading 20 items and then making 20 individual requests for their details.

**Fixes:**
- **GraphQL** — one request, client specifies exactly what it needs including nested relations
- **BFF aggregation** — BFF fetches from multiple services and returns a composed response
- **Request batching** — DataLoader pattern; batch individual lookups into one bulk request
- **Prefetch** — load the next likely page/data before the user navigates to it
- **Pagination strategy** — don't load 1000 items to show 20; use cursor-based pagination

---

### Extraneous Fetching
**What:** Fetching more data than is actually rendered or used.
**Symptoms:** Large API response payloads, unused fields in every response, slow perceived performance despite fast API.
**Examples:** A user list endpoint that returns full user objects with 30 fields when the UI shows only name and avatar.

**Fixes:**
- **GraphQL field selection** — `query { users { id name avatarUrl } }` — never fetch unneeded fields
- **Sparse fieldsets (JSON:API)** — `?fields[user]=id,name,avatarUrl`
- **Server-side projection** — REST endpoint accepts a `fields` parameter
- **BFF** — the BFF selects and transforms only what the specific client needs

**Diagnostic question:** "Is there anything in this API response that this component never reads?" If yes, that's extraneous fetching.
