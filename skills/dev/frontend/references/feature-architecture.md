> **Read this when:** deciding frontend responsibility boundaries, file placement,
> feature ownership, data integration, domain policy, cross-feature imports, shared-code
> promotion, or how structure should evolve as an application grows.

# Frontend Feature Architecture

Responsibilities, not folder names, are the architecture. Preserve sound repository
conventions and use names that reveal each module's role. Structure should improve
locality, dependency direction, and change ownership rather than imitate a preferred
tree.

For three illustrative layouts of the same feature, read
[`architecture-examples.md`](architecture-examples.md). They are alternatives, not a
migration ladder.

## Start with the repository

Map the current routes, product concepts, data libraries, validation convention, shared
layers, import direction, and actual consumers. Identify demonstrated pain: shotgun
edits, unclear ownership, circular imports, duplicated policy, response shapes leaking
through UI, or shared folders that hide unrelated code.

Keep a small navigable project small. Create only files and folders needed by current
responsibilities. Do not require `api`, `queries`, or `domain` directories, workspace
packages, wrapper components, providers, or a whole-feature migration when the existing
structure already makes ownership clear.

## Assign responsibilities

A feature may contain several roles without assigning one file to each role:

- **Boundary integration** obtains untrusted data, validates it with the installed
  schema convention, maps the server shape into a stable frontend model, and represents
  boundary failures.
- **Business policy** receives the minimum trusted facts and returns a decision. It has
  no React, fetching, storage, global clock, translation service, or hidden service
  access.
- **Presentation policy** formats or labels data for one screen. Keep it near that
  screen rather than presenting it as reusable eligibility, pricing, or domain policy.
- **UI ownership** belongs to the React composition that loads, coordinates, and
  presents the behavior. Route component roles, hooks, providers, and state ownership
  to the `react` skill.

A domain is business meaning, even when only one caller currently uses it. A `domain`
folder is optional: `canReserve`, `quoteRenewal`, or `selectAvailableOptions` can reveal
policy more clearly than a generic `utils` directory. Scope follows the owner and actual
consumers, not the importance of the concept.

When module interface burden, seams, or adapters are the main decision, use the
`codebase-design` skill's depth and locality vocabulary.

## Keep the boundary honest

Follow [`runtime-validation.md`](runtime-validation.md) for trust policy. Reuse the
installed validation library and infer the trusted type from its schema when supported.
A failed parse returns a defined failure; it never returns unchecked input typed as the
validated model.

A data integration path normally performs this sequence:

1. fetch through the established transport;
2. validate the untrusted response;
3. map transport names and shapes into a stable frontend model;
4. return a typed success or defined failure to its owner.

Keep business eligibility and screen-specific formatting outside response mapping.
Transport and cache integration may be separate functions in the same module; separate
directories are not required. Cache identity must include the resource plus every tenant
or parameter that changes the result, using the installed library's contract. Legitimate
per-observer projections supported by that library are not cache overwrites.

Async server loaders can own the same boundary and mapping responsibilities. Keep
framework-specific server/client, route, streaming, and cache mechanics in the installed
framework specialist, such as `nextjs-app-architecture`.

## Preserve import direction

- Code used by one feature stays with that feature.
- Code used by multiple features moves only to the smallest honest shared owner.
- Shared code that returns to one consumer is demoted to that consumer.
- Features expose intentional interfaces rather than inviting deep imports.
- Sibling features collaborate through explicit contracts or a common owner, not by
  reaching into each other's internals.
- A nested feature may depend on a parent contract when the hierarchy and required owner
  are explicit.
- Route structure and feature ownership may differ; a reusable feature need not remain
  trapped in the route that first used it.

Apply the **delete-a-feature test**: removing a feature should remove its private UI,
state, integration, policy, and tests while breaking only explicit consumers.

## Use narrow seams

Pass facts such as the current date or translated templates into plain business
functions. For effectful orchestration, accept a narrow collaborator when tests and real
runtime wiring genuinely need different implementations—for example, a client with one
`get` operation.

Prefer direct imports for stable implementation details. Avoid generic dependency
injection containers, factories, class hierarchies, or injecting every component
dependency. A seam earns its cost through real variation, a platform boundary, or a
credible test boundary.

Test plain policy with ordinary unit cases. Test boundary integration with valid and
malformed responses through the same injected collaborator callers use. These tests do
not replace observable proof that production wiring reaches the real applicable surface;
use the `test` skill and its integration guidance for that evidence.

## Evolve from evidence

1. Begin with colocated files and role-revealing names.
2. Group a product capability when its files change together.
3. Add internal grouping only when the population makes navigation clearer.
4. Promote stable shared contracts after real reuse.
5. Introduce packages or enforced import rules when independent ownership or dependency
   pressure justifies them.

Avoid moving files solely to match an ideal tree. A migration should improve ownership,
import direction, or change locality while preserving behavior.

## Verification

A structure recommendation is complete when each file has a responsibility and owner,
import direction is explicit, shared placement is justified by actual consumers, trust
boundaries cannot return unchecked data as trusted, the delete-a-feature test is
credible, and the repository remains easy to navigate at its current scale.
