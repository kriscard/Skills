> **Read this when:** the behavior crosses a database, HTTP, queue, filesystem, process, provider, or service boundary and the test must decide what remains real.

# Integration boundaries

An integration test proves that owned components collaborate correctly across a real boundary. Define that boundary before choosing doubles or infrastructure.

## Name the scope

State:

- the entry point exercised;
- the owned components inside the test;
- external systems outside the test;
- the observable result;
- setup and cleanup ownership.

Examples:

| Target | Keep real | Usually outside scope |
|---|---|---|
| HTTP handler | Routing, middleware, validation, authorization, handler, response mapping | Remote providers |
| Repository | ORM or query layer, schema, constraints, transaction behavior | Unrelated services |
| Queue consumer | Deserialization, dispatch, idempotency, persistence, acknowledgement behavior | Broker infrastructure when its semantics are not the target |
| Filesystem adapter | Path handling, encoding, permissions, cleanup | Remote storage provider |
| Service client | Request construction, authentication headers, response/error mapping | Provider network |

Completion: every dependency is explicitly inside or outside the behavior under test.

## Preserve boundary semantics

Use the lightest environment that retains the semantics being claimed. An in-memory substitute is insufficient when the requirement depends on the production database's constraints, transaction isolation, collation, locking, or query behavior. A mocked HTTP client is insufficient when testing serialization over the real transport is the point.

Use contract fixtures or a local test server when the remote system is outside scope but its protocol matters. Keep request and response examples independently defined from production serializers.

Completion: substitutes preserve every boundary behavior named by the test.

## Isolate state

Give each test independent state through the mechanism appropriate to the system:

- unique records, namespaces, ports, queues, buckets, or temporary directories;
- transaction rollback when it matches production semantics;
- deterministic reset or cleanup when rollback cannot represent commits or asynchronous work;
- idempotent teardown that also runs after failure;
- bounded timeouts and observable readiness instead of arbitrary sleeps.

Parallel runs must not share mutable identifiers unless contention is the behavior under test.

Completion: order, retry, and parallel execution cannot change the result unintentionally.

## Cover the contract edges

Exercise applicable cases:

- authentication and authorization;
- malformed or incompatible input;
- constraints and conflicts;
- timeout, retry, duplicate delivery, and idempotency;
- partial failure and recovery;
- transaction or acknowledgement boundaries;
- version compatibility and unknown fields;
- cleanup after success and failure.

Choose cases from accepted requirements and demonstrated risks rather than filling a generic matrix.

Completion: the test covers the success or failure behavior that justified an integration boundary and reports any production semantics it could not reproduce.
