> **Read this when:** the change creates or materially changes a non-obvious interface, mechanism, error model, responsibility, or established convention.

# Design within the task

Design effort belongs in delivery, but does not expand authority. Compare a clean local
patch with the smallest coherent improvement justified by today's requirement, callers
and constraints. Keep a genuinely local one-off local. For interface burden, seams or
split/join decisions, compose `codebase-design`; for consequential or hard-to-reverse
cross-owner, persistence or compatibility choices, compose `architect`. Advice does not
settle a user-owned decision or bypass the user-invoked `spec` gate.

## Contract before body

Before implementing a public, cross-module or otherwise non-obvious interface, describe
what callers need to use it correctly: responsibility and policy owner, valid inputs,
outputs, effects, meaningful failures, ordering, lifecycle, concurrency and invariants
where relevant. Separate established facts, authorized choices and unknowns. Preserve
necessary complexity; do not invent atomicity, cancellation or retry guarantees.

Keep the non-obvious contract canonical near the declaration or in the existing schema/API
documentation. Generated interfaces follow their authoritative generator/schema. Obvious
private helpers need no ceremonial prose. If the contract cannot be settled within existing
authority, stop before the body and ask the user to invoke `spec`.

## Complete current capability

When a mechanism is needed, shape its interface around its underlying responsibility,
not incidental details of one screen or workflow. Include complete **current** semantics
and lifecycle; keep feature policy with its owner and implementation detail hidden. Compare
the direct patch, useful capability, and over-general alternative when the choice matters.
Avoid speculative registries, adapters or configuration. Judge total caller **and**
implementation knowledge/change burden, not helper counts or shorter signatures.

## Meaningful failure

Before adding an exception, retry or caller obligation, check whether the postcondition
already holds, repetition is genuinely idempotent (including side effects), a normal domain
result fits, or an owning invariant can prevent the state. Retain explicit failures when
callers need to stop, recover, compensate, notify or preserve a protocol. Authorization,
corruption, outages and data loss must not become silent success. Prove any invariant at
its owning boundary rather than asserting away reachable states.

## Complete bounded convention change

Name the governed category and authorized boundary. Inventory producers, consumers, tests,
examples and compatibility code. Keep the established convention or complete an authorized
replacement throughout that category. Preserve intentional semantic and ownership differences;
matching syntax alone does not justify merging responsibilities. If completion needs more
paths or a new contract decision, retain the convention and stop for authority rather than
inventing a smaller category. Use refactor for atomic internal behavior-preserving replacement;
use migration for compatibility transitions. Report completion only for the actual boundary.

**Done when:** the current behavior has a fitting owner and usable contract, necessary
failures remain explicit, and the demonstrated total burden is reduced or the clean patch
is already sufficient. Record residual debt; design consideration need not produce a redesign.
