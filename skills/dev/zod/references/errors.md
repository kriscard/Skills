> **Read this when:** The task customizes Zod messages, consumes issues, formats errors, localizes output, or projects validation failures into an API or form.

# Errors

## Keep validation evidence structured

Use `safeParse` when invalid data is an ordinary result and `parse` when the boundary intentionally
throws. Inspect `ZodError.issues` for program logic. Preserve issue `code`, `path`, and relevant
metadata until the presentation boundary; converting everything to one string too early loses the
evidence needed by nested forms, APIs, logs, and tests.

Do not expose raw validation details automatically across a public API. Map issues to the product's
stable error contract at that boundary. Browser announcements, field association, focus, and
recovery belong to `frontend`; form-wide versus field errors and submission lifecycle belong to
`react-hook-form`.

## Match the installed version

### Zod 4

Use the unified `error` parameter for schema-level or per-parse customization. Return `undefined`
from an error function when lower-precedence handling should continue. Do not introduce legacy
`errorMap`, `message`, `required_error`, or `invalid_type_error` options into new v4 code.

Choose the top-level formatter from the consumer:

- `z.treeifyError()` for nested traversal;
- `z.flattenError()` for a shallow field/form projection;
- `z.prettifyError()` for human-readable text such as CLI or logs;
- `error.issues` for programmatic handling.

The legacy instance methods `error.format()` and `error.flatten()` are deprecated. The top-level
`z.flattenError()` is the current shallow formatter; distinguish it from the legacy instance method
when reviewing code.

### Zod 3

Use v3's documented message/error-map and `ZodError` formatting APIs. Do not paste v4 top-level
formatters into a v3 project. During migration, snapshot or assert representative issue paths and
consumer projections because issue shapes and error-map precedence can change.

## Customize at the narrowest stable layer

Prefer default messages unless the product needs domain wording, localization, or a stable external
error contract. Keep schema validation facts separate from presentation copy when multiple consumers
share a schema. Avoid a global error customization when a schema-local or boundary projection is
sufficient; global policy increases coupling and test surface.

For tests, assert the issue code/path or stable external projection that matters. Full message
snapshots are appropriate only when exact wording is itself the contract.

## Official sources

- [Customizing errors](https://zod.dev/error-customization)
- [Formatting errors](https://zod.dev/error-formatting)
- [Zod 4 migration guide: error customization and formatting](https://zod.dev/v4/changelog)
- [Official Zod v3 documentation source](https://github.com/colinhacks/zod/tree/main/packages/docs-v3)
