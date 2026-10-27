> **Read this when:** The task involves inferred input/output types, parsing, transforms, preprocessing, defaults, coercion, or asynchronous schemas.

# Types and parsing

## Preserve both sides of a schema

`z.infer<typeof Schema>` is the parsed output type. Use `z.output<typeof Schema>` when naming that
side improves clarity, and use `z.input<typeof Schema>` for the accepted pre-parse value. These can
differ after coercion, preprocessing, transforms, pipes, defaults, or codecs.

Derive types from the schema instead of separately declaring matching shapes. In generic helpers,
preserve the concrete schema relationship rather than accepting a broad schema and returning
`unknown` or laundering the result with an assertion. Let `typescript` own general generic design;
this reference owns the Zod input/output relationship.

For React Hook Form, the form's editable value normally follows the schema input while a transformed
submission follows the output. Confirm the installed resolver's generic contract instead of copying
a version-specific signature. Defaults, reset behavior, dirty state, and server-error lifecycle
remain owned by `react-hook-form`.

## Choose the parse result intentionally

- Use `parse` when invalid input should throw at that boundary.
- Use `safeParse` when failure is an expected branch and the caller should inspect the discriminated
  result.
- Use `parseAsync` or `safeParseAsync` when any nested refinement or transform is asynchronous.
  Async behavior is transitive through composed schemas; a synchronous top-level call is not safe
  merely because its own code is synchronous.

Keep the original input `unknown` until parsing succeeds. Parse once at an ownership boundary and
pass the typed result inward unless a new untrusted boundary is crossed.

## Coercion is conversion, not intent

Primitive coercion follows JavaScript conversion semantics. Test ambiguous values explicitly:
empty strings, whitespace, `null`, booleans, invalid numeric strings, and strings such as `"false"`
whose JavaScript truthiness may surprise users.

Prefer the narrowest honest contract:

1. use a native schema when the producer can send the right type;
2. validate an allowed raw representation, then transform or pipe it;
3. use `z.coerce.*` when JavaScript conversion is the desired policy.

In Zod 4, coercion inputs are `unknown` by default and can be narrowed with the supported generic
when the producer is known. Do not annotate a narrower input merely to hide values that still arrive
at runtime.

## Transforms, preprocessing, and defaults

Validate before transforming when possible. Transform and preprocessing functions should not throw;
represent expected invalid data through schema validation. Keep side effects and remote I/O out of
ordinary transforms unless the boundary is deliberately asynchronous and tested as such.

In v4, `.default()` short-circuits on `undefined` and returns an output-compatible value;
`.prefault()` supplies an input-compatible value that continues through parsing. In v3, defaults are
parsed as input. Recheck this semantic difference during migration rather than fixing only the type
error.

## Official sources

- [Defining schemas: parsing, coercion, transforms, and input/output](https://zod.dev/api)
- [Zod 4 migration guide: coercion and defaults](https://zod.dev/v4/changelog)
- [Official Zod v3 documentation source](https://github.com/colinhacks/zod/tree/main/packages/docs-v3)
