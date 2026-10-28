> **Read this when:** The task consumes Zod issues, customizes messages, projects API/form errors, localizes output, or logs contract failures.

# Structured errors

## Preserve evidence until the consumer boundary

Use `safeParse` when invalid input is an ordinary branch and `parse` when the caller intentionally
throws. Program logic should inspect `ZodError.issues`, retaining at least `code`, `path`, and relevant
issue metadata. Converting the error to one string too early prevents nested field projection,
monitoring aggregation, and stable tests.

Choose a formatter for the consumer:

- `z.treeifyError(error)` for nested object/array traversal;
- `z.flattenError(error)` for shallow field/form errors;
- `z.prettifyError(error)` for human-readable CLI or diagnostic text;
- `error.issues` for programmatic handling and public-contract projection.

## Pattern: safe public projection and diagnostic logging

**Use when:** a contract failure must reach an API client, form adapter, or observability system without
exposing the payload.

```ts
import { z } from "zod";

type ValidationProblem = {
  type: "validation";
  issues: Array<{ code: string; path: string[]; message: string }>;
};

export function redactIssuePath(path: readonly PropertyKey[]): Array<string | number> {
  return path.map((segment) => (typeof segment === "number" ? segment : "<key>"));
}

export function toValidationProblem(
  error: z.ZodError,
  publicPath: (path: readonly PropertyKey[]) => Array<string | number> = redactIssuePath,
): ValidationProblem {
  return {
    type: "validation",
    issues: error.issues.map((issue) => ({
      code: issue.code,
      path: publicPath(issue.path).map(String),
      message: issue.message,
    })),
  };
}
```

Issue paths can contain private input-derived record keys even when input values are omitted. The
default projection masks string and symbol segments while preserving array indexes. Pass a
schema-owned `publicPath` projector only when the client needs approved static field paths; distinguish
fixed positions from dynamic keys rather than allowing a field name at every depth. Review custom
messages too: they can embed sensitive values.

At an internal transport boundary, log stable context with conservatively redacted paths:

```ts
const result = SubscriptionSchema.safeParse(payload);
if (!result.success) {
  logger.warn("subscription contract rejected", {
    endpoint: "/api/subscriptions/:id",
    schema: "SubscriptionSchema",
    issues: result.error.issues.map(({ code, path }) => ({ code, path: redactIssuePath(path) })),
  });
  throw new ContractError(toValidationProblem(result.error));
}
```

**Observable result:** the query/request fails, operators can group failures by schema and path, and
neither output includes the raw response. Define `ContractError` in the owning transport layer so its
retry/status behavior matches that system.

**Alternative:** `z.flattenError()` is convenient for shallow forms; `z.treeifyError()` preserves a
nested shape. Browser announcements, focus, field registration, and server-error lifecycle remain
frontend/form-owned.

**Failure check:** test the public shape, nested paths, a root-level issue (`path: []`), multiple issues,
and serialization. Include a failing record whose key is a sensitive identifier; assert that neither
public output nor logs contain that key. Verify numeric indexes survive and approved static paths can
be retained by the schema-owned projector. Assert that secrets and raw payload fields do not appear.

## Customize at the narrowest stable layer

Zod 4 uses the unified `error` parameter for schema/check and per-parse customization. Return
`undefined` from an error function to allow lower-precedence handling to continue. Prefer default
messages unless the product requires domain wording, localization, or a stable public contract.

Keep validation facts separate from presentation copy when a schema has multiple consumers. A field
schema can own wording specific to that field; a boundary projector can translate issue codes/paths
into API or UI copy. Avoid mutable global error configuration for request-scoped localization because
concurrent work can observe the wrong locale.

For tests, assert issue code/path or the stable external projection. Snapshot full messages only when
exact wording is itself the contract.

## Sensitive input stays out by default

Zod omits input values from issues by default to reduce accidental logging of secrets and personal
data. Enable `reportInput: true` only for a reviewed boundary with explicit redaction and retention
rules. Structured issue paths normally provide enough diagnosis; do not log the original payload just
because parsing failed.

## Specific version caveat

In exact `zod@4.6.7` probes, a failed `safeParse` applied error customization on first access to
`result.error`. Mutating global locale/configuration between parsing and that read changed messages.
Treat this as a version-specific receipt, not an all-Zod-4 rule: keep global configuration stable and
test the installed version if code depends on error-map timing.

## Official sources

- [Customizing errors and input reporting](https://zod.dev/error-customization)
- [Formatting errors](https://zod.dev/error-formatting)
- [Zod 4.6 error-map timing note](https://zod.dev/blog/zod-4-6#%EF%B8%8F-error-maps-run-on-the-first-read-of-error)
