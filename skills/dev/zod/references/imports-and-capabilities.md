> **Read this when:** The task selects a Zod 4 import, uses an ecosystem adapter, relies on Standard Schema, or proposes an API that may depend on the installed Zod 4 minor.

# Imports and capabilities

## Select one effective entrypoint

Use the import already established by the application unless the task measures and approves a change:

| Import | Effective Zod 4 contract |
|---|---|
| `zod` | Classic API exported by the resolved package root |
| `zod/v4` | Explicit Classic API |
| `zod/mini`, `zod/v4/mini`, `zod/v4-mini` | Mini's functional API |
| `@zod/mini` | Standalone package re-exporting its peer `zod/mini`; inspect both resolved versions |

A package label is not enough. Inspect the source import, package-manager resolution, package
`exports`, and the declarations reached by that exact import. Keep one entrypoint within a schema
graph so schema and adapter types come from the same contract. Application code should use Classic or
Mini, not `zod/v4/core`; Core is the substrate for library authors implementing against both APIs.

**Failure check:** typecheck a schema created by the chosen entrypoint through every adapter boundary.
Duplicate installations or an adapter compiled against another schema type often surface there first.

## Capability-check APIs added within Zod 4

Stable core practices—`parse`, `safeParse`, `z.input`, `z.output`, object policy, unions, refinements,
and structured issues—should be written against the installed API. For later additions, check the
exact declaration before offering syntax:

- codecs and native `z.toJSONSchema()` arrived after the initial Zod 4 surface;
- standalone `@zod/mini`, compilation, and boolean-only validation are newer capabilities;
- `z.fromJSONSchema()` is explicitly experimental in current documentation;
- adapter support can lag the Zod package even when the schema itself typechecks.

A capability check is concrete: search the resolved `.d.ts`, compile a minimal import, and execute one
success and one failure case. Do not infer availability from a blog date or from `^4` in a manifest.
Pin exact versions only in test receipts or a caveat tied to that version; keep general guidance about
the stable behavior being chosen.

## Treat an adapter as a second runtime contract

Use an adapter when it owns useful integration behavior, then verify:

1. accepted Zod entrypoints and peer ranges;
2. sync versus async parsing;
3. whether transforms produce the consumer's output or validation only reports validity;
4. how issue paths become field/API errors;
5. whether unknown-key and error customization options survive the adapter.

Standard Schema reduces library-specific coupling but does not promise identical integration
semantics. For example, a form library may validate a Zod schema through Standard Schema yet keep raw
form values until submission. Confirm the installed consumer's output and error contract rather than
assuming a successful validation hands back `z.output`.

For React Hook Form resolvers that expose the current three-generic contract, transformed schemas can
use:

```ts
useForm<z.input<typeof FormSchema>, unknown, z.output<typeof FormSchema>>({
  resolver: zodResolver(FormSchema),
});
```

Check the installed overloads and `raw` option. Zod owns the two representations; React Hook Form owns
default values, field registration, reset/dirty state, and submission lifecycle.

For generated schemas or clients, first identify the authoritative contract and synchronization
owner. A generator that emits TypeScript types or Query hooks does not necessarily perform runtime
validation. Test a malformed fixture at the generated boundary before removing a hand-written parse.
Native `z.toJSONSchema()` is the first option for publishing a Zod-owned JSON Schema; route/OpenAPI
frameworks remain separate contracts with their own dialect and metadata rules.

## Official sources

- [Zod packages and versioning](https://zod.dev/v4/versioning)
- [Zod Mini](https://zod.dev/packages/mini)
- [For library authors](https://zod.dev/library-authors)
- [Standard Schema](https://standardschema.dev/)
- [React Hook Form resolvers](https://github.com/react-hook-form/resolvers)
- [Zod ecosystem](https://zod.dev/ecosystem)
