# Spec Template

Use this template when generating `spec-phase-{n}.md` for each approved PRD.

---

# Implementation Spec: {Project Name} - Phase {N}

**PRD**: ./prd-phase-{N}.md
**Estimated Effort**: {S/M/L/XL}

## Technical Approach

{High-level implementation strategy: architecture approach, key decisions, patterns to use}

## File Changes

### New Files

| File Path | Purpose |
|-----------|---------|
| `{path/to/file.ts}` | {Description} |

### Modified Files

| File Path | Changes |
|-----------|---------|
| `{path/to/file.ts}` | {What to change and why} |

## Implementation Details

### {Component/Feature 1}

**Pattern to follow**: `{path/to/similar/implementation.ts}`

```typescript
// Key interfaces or types
interface {Name} {
  {property}: {type};
}
```

**Implementation steps**:
1. {Step 1}
2. {Step 2}
3. {Step 3}

### {Component/Feature 2}

{Same structure}

## Data Model

### Schema Changes

```sql
CREATE TABLE {table_name} (
  id UUID PRIMARY KEY,
  {column} {type}
);
```

### State Shape

```typescript
interface {StateName} {
  {property}: {type};
}
```

## API Design

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/{resource}` | {What it does} |
| `GET` | `/api/{resource}/:id` | {What it does} |

## Testing Requirements

### Unit Tests

| Test File | Coverage |
|-----------|----------|
| `{path/to/test.spec.ts}` | {What it tests} |

**Key test cases**:
- {Happy path}
- {Edge case}
- {Error case}

### Integration Tests

- {Scenario 1}
- {Scenario 2}

## Error Handling

| Scenario | Handling |
|----------|----------|
| {Error} | {Strategy} |

## Validation Commands

```bash
# Type checking
pnpm typecheck

# Tests
pnpm test

# Build
pnpm build
```

## Rollout Considerations

- **Feature flag**: {if applicable}
- **Monitoring**: {what to watch}
- **Rollback plan**: {how to rollback}

---

## Template Usage Notes

1. **File Changes**: Be exhaustive. Missing files = surprise work.
2. **Implementation Details**: Include code snippets for complex logic.
3. **Testing**: Describe KEY test cases, especially edge cases.
4. **Error Handling**: Be explicit. "Handle errors" is not a strategy.
5. **Validation Commands**: Copy-paste ready.
