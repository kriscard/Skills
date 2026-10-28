> **Read this when:** moving a dependency, API, data shape, platform, owner or compatibility contract.

# Migration

1. Establish current and target contracts/versions, consumers, producers, ownership and
   compatibility obligations from repository and approved design. Compose `research` for
   version-sensitive primary evidence and matching installed specialists for mechanics.
   Consequential target, rollback or retirement decisions require the user-invoked spec
   gate if not already approved; `architect` can inform but not approve them.
2. Read [design fit](../references/design-fit.md). Inventory the complete authorized
   category: implementations, callers, stored data, tests, examples and compatibility code.
   Define each checkable boundary, expected evidence, recovery path and final retirement
   criterion. A small atomic owned migration needs no artificial coexistence stages.
3. Where old clients need support, name the authoritative representation, permitted old/new
   producers and consumers, transition order and rollback. Verify required old-client
   outputs as well as accepted inputs. For fully owned internal APIs with no compatibility
   obligation, migrate callers and remove the legacy API in the same authorized wave,
   checking for remaining references before deletion. Keep genuine external adapters.
4. Execute in dependency order, checking the current unit before dependents. Temporary
   breakage is permissible only inside an explicitly approved, scoped, reversible phase
   with named verification boundaries; never silently disable active checks or commit a
   broken state. Preserve required old contracts during coexistence. Destructive data
   changes/deletion still require explicit action authority and safe recovery evidence.
5. Run focused target/compatibility/rollback checks then affected broad static and runtime
   checks. Inspect the inventory for unexplained active legacy paths. Apply
   [evidence](../references/evidence.md) and
   [review and return](../references/review-and-return.md).

**Return:** completed boundaries, versions/contracts, caller and legacy retirement evidence,
compatibility and recovery results, remaining migration work, and spec IDs when applicable.
An unfinished transition is partial, not target-only completion.
