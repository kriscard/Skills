> **Read this when:** deciding frontend file placement, feature ownership,
> cross-feature imports, shared-code promotion, folder depth, or how structure should
> evolve as an application grows.

# Frontend Feature Architecture

Organize code by product ownership when that improves locality. Preserve strong existing
repository conventions, but still surface demonstrated ownership or dependency
problems. Structure evolves from evidence; it is not a starter-kit ceremony.

## Start with the repository

Map the current routes, product concepts, shared layers, import direction, and teams or
features that change together. Identify actual pain: shotgun edits, unclear ownership,
circular imports, duplicated policy, or shared folders that hide unrelated code.

For a small navigable project, keep the structure small. Introduce feature or domain
layers when product ownership and change patterns are visible.

## Ownership rules

- Code used by one feature stays with that feature.
- Code used by multiple features may move to the smallest honest shared layer.
- Shared code that returns to one consumer is demoted to that consumer.
- Features expose intentional entry points rather than inviting deep imports.
- Cross-feature behavior is coordinated by a higher composition layer or an explicit
  shared domain—not by one feature reaching into another's internals.
- Route structure and feature ownership may differ; a reusable feature should not be
  trapped inside one route merely because that route first used it.

Apply the **delete-a-feature test**: removing a feature should remove its private UI,
state, queries, actions, and tests while breaking only explicit consumers.

## Evolution

1. Begin with colocated files and clear names.
2. Group a product capability when its files change together.
3. Add internal `components`, `hooks`, `queries`, or `utils` folders only when their
   populations make navigation clearer.
4. Promote stable shared contracts after real reuse.
5. Introduce domains, packages, or enforced import rules when team scale or dependency
   pressure justifies them.

Avoid moving files solely to match an ideal tree. A migration should improve ownership,
import direction, or change locality and preserve behavior throughout.

## Verification

A structure recommendation is complete when each moved or proposed file has an owner,
import direction is explicit, shared placement is justified by actual consumers, the
delete-a-feature test is credible, and the repository remains easy to navigate at its
current scale.
