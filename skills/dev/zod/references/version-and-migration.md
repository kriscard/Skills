> **Read this when:** The task detects Zod v3/v4, changes imports, upgrades Zod, supports both majors, or reviews a mixed-version codebase.

# Version detection and migration

## Identify the API, not only the package

Use the resolved package version plus the actual import path and installed declarations. Since Zod
3.25 introduced stable v4 subpaths, these can coexist in one installed package:

| Import | Effective contract |
|---|---|
| `zod/v3` | Zod 3 |
| `zod/v4` | Zod 4 full API |
| `zod/v4-mini` | Zod 4 Mini compatibility subpath |
| `zod/mini` | Zod 4 Mini |
| `@zod/mini` | Standalone Mini re-export of peer `zod/mini`; inspect both versions (published in lockstep since 4.5) |
| `zod` | Package-root export; inspect the resolved package version |

Check adapter imports and peer ranges too. A resolver, framework adapter, or library compiled against
Zod 3 classes may not accept Zod 4 schemas even when application code looks structurally similar.
For libraries supporting both majors, follow the official library-author guidance and use public
cross-version surfaces; application code should not import `zod/v4/core` merely to look generic.
Core is a public substrate for library authors supporting full Zod and Mini, not an application
optimization. For a consumer advertising Standard Schema support, verify its installed version,
transform/output inference, async handling, and error contract before bypassing a Zod-specific
adapter. Standard Schema support is not proof that every integration preserves the same behavior.
If generated OpenAPI contracts are authoritative, inspect their runtime-validation guarantees before
adding a parallel schema; contract generation and feature placement remain with their owners.

## Migration sequence

1. Inventory Zod imports, adapters, custom error handling, object composition, transforms, defaults,
   coercion, refinements, and direct access to internals.
2. Confirm the TypeScript requirement and strict-mode configuration for the target Zod release.
3. Change the package/import contract deliberately; avoid mixing migrated and legacy imports inside
   one schema graph.
4. Apply each relevant semantic migration below.
5. Typecheck, then run representative valid/invalid parse cases and compare parsed outputs, issue
   codes, and issue paths.

## High-impact v3 to v4 changes

- Replace fragmented schema error options and `errorMap` with the unified `error` parameter where
  customization is still needed. Recheck schema-level versus per-parse precedence.
- Replace `error.format()` and `error.flatten()` with current top-level formatting helpers chosen for
  the consumer. Use `error.issues` for programmatic inspection.
- Prefer `z.strictObject()` and `z.looseObject()` over legacy `.strict()` and `.passthrough()`.
- Replace object `.merge()` with explicit shape spread, `.extend()`, or `.safeExtend()` according to
  overwrite and refinement requirements. Do not use intersections merely to merge object shapes.
- Recheck coercion input types, defaults versus `.prefault()`, defaults inside optional fields,
  number/integer behavior, enum/record exhaustiveness, and renamed or removed string formats.
- In v4, use `z.enum(enumLike)` instead of `z.nativeEnum()`. Enum-keyed `z.record()` becomes
  exhaustive; use `z.partialRecord()` for sparse maps. Discriminated unions gain composable and
  union/pipe-discriminator support; see [unions, records, and enums](unions-records-and-enums.md).
- Gate newer APIs such as codecs, standalone Mini, compile, and validate on the effective import's
  declarations. An older `zod/v4` export is not a promise of every current v4 feature.
- Remove dependencies on undocumented classes, utility types, `._def`, or other internals. Zod 4
  internals differ and are not an application extension surface.
- Recheck type-predicate refinements: Zod 4 does not use them to narrow the inferred output type.
- Treat incompatible intersection results in v4 as schema defects; merge conflicts can throw a
  regular `Error`, not a validation issue.

Do not make a migration appear successful by preserving deprecated syntax everywhere. Compatibility
methods can keep code running, but the migration is complete only when affected behavior uses the
target version's clearer contracts and observable outputs remain intentional.

## Official sources

- [Library authors and adapter compatibility](https://zod.dev/library-authors)
- [Standalone Mini](https://zod.dev/packages/mini)
- [Versioning in Zod 4](https://zod.dev/v4/versioning)
- [Zod 4 migration guide](https://zod.dev/v4/changelog)
- [Zod 4 release notes](https://zod.dev/v4)
- [Official Zod v3 documentation source](https://github.com/colinhacks/zod/tree/main/packages/docs-v3)
