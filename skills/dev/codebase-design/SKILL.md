---
name: codebase-design
description: >-
  Design and evaluate module interfaces, depth, seams, adapters, locality, and
  testability. Use when deciding what a module should hide, what callers should
  know, where dependencies should vary, whether an abstraction earns its cost,
  or how to make one subsystem easier to test and modify. Also use when another
  skill needs consistent deep-module vocabulary.
---

# Codebase Design

Concentrate complexity behind useful interfaces. A good module gives callers
substantial capability while keeping knowledge, change, bugs, and verification
local.

When another skill loads this one, apply the vocabulary and analysis below inside
that skill's workflow and output format. When invoked directly, complete the full
workflow and return the module-design report.

## Workflow

### 1. Frame the module

Identify the module under review, its responsibility, callers, dependencies, public
entry points, observable behavior, and constraints. A module may be a function,
class, component, package, service, feature, or tier-spanning slice.

Use the repository's framework terms for concrete artifacts and *module* for their
design role.

**Complete when:** the module, its callers, its current contract, and the desired
outcome are explicit.

### 2. Map interface burden

List everything a caller must know to use the module correctly:

- operations and data shapes;
- invariants and valid ordering;
- errors and recovery responsibilities;
- configuration and lifecycle;
- performance or concurrency characteristics;
- implementation details repeated or coordinated by callers.

Treat the interface as this full burden, not only its type signature or network API.
Trace each claim to callers, exports, tests, or runtime behavior.

**Complete when:** every demonstrated piece of caller knowledge is accounted for and
implementation knowledge leaking through the interface is identified.

### 3. Assess depth and locality

Judge the behavior centralized by the module against the interface callers must
learn. Apply the **deletion test**: if the module disappeared, would its complexity
spread into callers or vanish? Spreading complexity indicates useful leverage;
vanishing complexity suggests a shallow pass-through.

Look for repeated orchestration, change amplification, duplicated error handling,
scattered policy, and tests that bypass the public interface. Measure depth through
caller knowledge and centralized behavior rather than implementation size.

**Complete when:** the module's depth, leverage, and locality are supported by
specific caller and change evidence.

### 4. Inspect seams and adapters

A **seam** is a place where behavior can vary without editing the caller. An
**adapter** is a concrete implementation occupying a role at that seam. Reserve
**boundary** for domain, ownership, process, deployment, or trust boundaries.

Find where dependencies are accepted versus constructed, where tests and production
use different paths, and where callers select or coordinate implementations. Treat a
seam as earned when variation is demonstrated by multiple adapters, a test double, a
platform difference, or a known source of change.

**Complete when:** each proposed or existing seam has a demonstrated source of
variation and its placement is justified independently from its interface design.

### 5. Design a deeper alternative

Move stable policy and repeated knowledge behind the interface while preserving
necessary caller control. Prefer the smallest coherent interface that owns the full
responsibility. Compare the current design with the proposed design through:

- caller knowledge removed or added;
- behavior and policy centralized;
- changes localized;
- errors and invariants owned;
- testing through the same interface callers use;
- migration cost and compatibility.

Keep existing behavior and public APIs unless the user authorizes a contract change.
Avoid an abstraction when it only renames operations, forwards calls, or anticipates
variation without evidence.

**Complete when:** the recommendation states what moves behind the interface, what
remains caller-owned, and why the resulting module provides more leverage.

### 6. Define verification

Specify how to prove the design improvement. Prefer observable checks such as fewer
caller responsibilities, removal of repeated coordination, tests crossing the public
interface, localized future changes, or elimination of implementation-aware call
sites.

Route a cross-system or hard-to-reverse decision to `architect`. Route authorized
behavior-preserving implementation work to `refactor`.

**Complete when:** the proposed interface, migration boundary, and checks for behavior
and design improvement are concrete enough to implement or review.

## Vocabulary

- **Module:** an interface plus an implementation.
- **Interface:** everything callers must know to use the module correctly.
- **Implementation:** behavior hidden behind the interface.
- **Depth:** useful behavior provided per unit of interface burden.
- **Seam:** a place where behavior can vary without editing the caller.
- **Adapter:** a concrete implementation filling a role at a seam.
- **Leverage:** capability callers receive per unit of interface they must learn.
- **Locality:** concentration of knowledge, change, bugs, and verification.
- **Boundary:** a domain, ownership, process, deployment, or trust division.

## Report

When invoked directly, return:

1. **Module and callers** — scope, responsibility, dependencies, and evidence.
2. **Interface burden** — what callers currently must know.
3. **Diagnosis** — depth, locality, leaks, seams, and adapters.
4. **Recommended interface** — responsibilities moved, retained, or removed.
5. **Migration and verification** — compatibility, sequence, tests, and success checks.

Describe observations before judgments. Tie every recommendation to leverage,
locality, testability, or a demonstrated architectural constraint.
