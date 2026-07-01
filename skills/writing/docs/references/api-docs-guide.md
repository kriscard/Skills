> **Read this when:** documenting API endpoints, functions, parameters, return values, errors, or integration behavior.

# API Docs Guide

API docs describe behavior at the boundary. Do not explain implementation unless the caller must know it.

## Required Detail

For each endpoint/function include:

- behavior: what it does and when
- parameters: name, type, required/optional, default, constraints
- return value: type, shape, and meaning
- one realistic example close to real usage
- error cases: what fails, response shape, and recovery advice

## Parameter Format

```markdown
limit (number, optional, default: 20) — Results per page. Max 100.
name (string, required) — The user's display name. Max 50 characters.
```

## Completion Gate

API docs are ready when a caller can make one successful request and handle the likely failures without reading the implementation.
