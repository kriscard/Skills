> **Read this when:** untrusted data enters through an API, form, URL, storage,
> third-party SDK, uploaded file, message, or other runtime boundary.

# Runtime Validation

Validate untrusted data once when it enters a trusted domain. After successful parsing,
internal code should consume the validated type instead of repeatedly parsing or
asserting the same value.

## Locate the boundary

Classify the source:

- External API or webhook payload
- User-submitted form or uploaded file
- URL path, query, or hash data
- Browser storage or cross-window message
- Database or third-party SDK result without a trusted contract
- Internal value already produced from validated data

The first five require runtime evidence. The last usually needs TypeScript only.
Client validation improves feedback; authoritative validation still runs at the server
or trusted write boundary.

## Use the installed convention

Reuse the project's schema library and error model. Introduce Zod, Valibot, ArkType, or
another dependency only when the project lacks a capable convention and the boundary
justifies the cost.

Keep the schema beside the boundary or domain contract it protects. Infer the internal
type from the schema when the library supports that relationship.

```typescript
const result = UserSchema.safeParse(payload);
if (!result.success) return invalidInput(result.error);

const user = result.data; // trusted inside this domain
```

## Parse deliberately

- Normalize only behavior the product defines; avoid silently repairing malformed
  security-sensitive input.
- Return errors in a shape the caller can handle.
- Preserve submitted values when a form can reject them.
- Version persisted browser data and tolerate older shapes explicitly.
- Avoid exposing raw validation internals when a stable domain error is sufficient.

## Completion criterion

Runtime validation is complete when every untrusted entry path is parsed before trusted
use, success yields one stable internal type, failures have a defined user or caller
outcome, and the same value is not redundantly parsed throughout the feature.
