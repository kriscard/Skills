> **Read this when:** assessing repository organization, composition, module
> quality, or testability. Use this vocabulary consistently in findings and
> recommendations.

# Codebase Design Vocabulary

Evaluate whether the codebase concentrates complexity behind useful interfaces
at deliberate seams. The goal is leverage for callers, locality for maintainers,
and natural testability.

## Terms

**Module:** anything with an interface and an implementation: a function, class,
package, feature, or tier-spanning slice. Use the repository's framework terms
when naming concrete artifacts, but use *module* for the design role.

**Interface:** everything a caller must know to use a module correctly, including
operations, invariants, ordering, errors, configuration, and performance
characteristics. It is broader than a type signature or network API.

**Implementation:** behavior hidden behind an interface.

**Depth:** leverage at the interface. A deep module provides substantial behavior
through a small, coherent interface. A shallow module exposes complexity without
meaningfully hiding or resolving it.

**Seam:** a place where behavior can vary without editing the caller. Seam
placement and interface design are separate decisions.

**Adapter:** a concrete implementation that fills a role at a seam. Use
*adapter* for the role and *implementation* for what is inside it.

**Leverage:** capability callers receive per unit of interface they must learn.

**Locality:** concentration of change, knowledge, bugs, and verification within
one module rather than repetition across callers.

**Boundary:** reserve this word for a domain, ownership, process, deployment, or
trust boundary. Do not use it as a synonym for seam.

## Analysis checks

### Organization

- Does directory and package organization reflect domain ownership, runtime
  layers, or neither?
- Can a contributor locate a behavior from the product/domain concept?
- Are cross-cutting concerns owned by a module or scattered through features?
- Do public exports reveal the intended interfaces?

### Composition

- Which modules orchestrate, which implement domain behavior, and which adapt
  external systems?
- Are dependencies accepted at seams or constructed deep inside callers?
- Do callers coordinate details that one deeper module should own?
- Are frontend composition, state, and data-fetching patterns consistent with
  the framework and repository conventions?
- Are backend request, domain, persistence, integration, and transaction
  patterns explicit and consistently composed?

### Depth and locality

Apply the **deletion test**: if the module disappeared, would its complexity
vanish or spread into many callers? Spreading complexity indicates that the
module provides leverage; vanishing complexity suggests a pass-through.

Do not measure depth using lines of implementation. Judge the caller's required
knowledge against the behavior the module centralizes.

### Seams and adapters

One adapter may indicate a hypothetical seam. Multiple adapters, a test double,
or a demonstrated source of variation can justify a real seam. Avoid recommending
an abstraction solely because variation might exist someday.

### Testability

- Callers and tests should cross the same interface.
- Dependencies are easier to vary when accepted rather than created internally.
- Returning results usually exposes a clearer test surface than hidden side
  effects.
- A test that must bypass the interface may reveal the wrong module shape.

## Reporting language

Describe observations before judgments:

- “Five callers repeat retry and error mapping” before “extract a module.”
- “The interface requires callers to know transaction ordering” before “the
  module is shallow.”
- “Two payment adapters satisfy the same interface” before “this is a real seam.”

Tie recommendations to leverage, locality, testability, or a demonstrated
architectural constraint. Avoid generic requests to add layers, services, or
abstractions.
