---
name: research
description: >-
  Fetches fresh documentation and implementation guidance for any library,
  framework, or API the user needs to work with. Use proactively whenever
  the user asks "documentation for", "how does X work", "look up", "find
  examples", "best practices for", or mentions a technology they need to
  learn or reference. Don't rely on training data when live docs are
  available — libraries release breaking changes regularly.
---

# Research

## Strategy (priority order)

Try these in order and stop at the first that returns useful results:

**1. Context7 MCP** — best for library/framework/SDK documentation
```
mcp__context7__resolve-library-id  →  mcp__context7__query-docs
```
Prefer this for npm packages, Python libraries, and popular frameworks. Training data goes stale; Context7 returns current docs.

**2. GitHub CLI** — for repos not indexed by Context7
```bash
gh repo view <owner>/<repo> --json description,readme
gh api repos/<owner>/<repo>/contents/docs
```

**3. WebFetch → WebSearch** — for everything else
- WebFetch a specific URL if you have it
- WebSearch when you need to find the right page first

## Output Format

Deliver actionable implementation guidance — not a raw docs dump.

**Key patterns** — show working code examples for the most common use cases

**Common pitfalls** — what trips people up, especially on first use

**Version notes** — call out anything version-specific, especially for fast-moving ecosystems (Next.js App Router vs Pages, React 19 changes, Python 3.12+ features)

**Authoritative sources** — link to the official docs page you drew from so the user can verify

## When to Search vs When to Answer From Memory

Search when:
- The user is actively writing code that uses a library
- The question involves specific API syntax, config options, or method signatures
- The library had major changes in the past 12 months (anything in the JS/Python ecosystem)

Answer from memory when:
- The question is about a fundamental concept (e.g., "what is a closure")
- The user is asking for a high-level explanation, not implementation details
- The library is very stable and the question is about basic usage (e.g., standard library functions)
