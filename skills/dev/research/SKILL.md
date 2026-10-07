---
name: research
description: >-
  Current, source-grounded implementation research for libraries, frameworks,
  SDKs, and APIs. Use when coding depends on version-specific syntax, configuration,
  behavior, examples, release changes, or migration guidance, or when the user asks
  to verify documentation. Answer stable conceptual questions directly.
---

# Research

Resolve implementation questions with evidence that matches the project's actual version and
runtime.

## Process

### 1. Frame the claims

Turn the request into the smallest set of facts needed to proceed. Identify the target library or
API, runtime, installed or requested version, and required artifact: direct answer, code example,
migration guidance, or repository Markdown file.

Completion: every material question is explicit, and the target version and artifact are known or
recorded as unresolved.

### 2. Establish local version evidence

Inspect manifests, lockfiles, configuration, imports, installed declarations, and nearby code
before researching external material. Treat the installed package and types as the compatibility
boundary. Ask for a version only when the repository and request do not determine one.

Completion: the implementation environment and exact version are known, or the answer is explicitly
scoped to a named latest/stable version.

### 3. Gather primary evidence

Use available documentation and web tools. Prefer sources in this order:

1. versioned official documentation, specifications, and API references;
2. maintainer repositories, release notes, migration guides, source, types, and tests;
3. trusted secondary sources for explanation or examples that primary sources do not provide.

A documentation index or search result may locate a source; verify the claim on the source page.
Fetch a known page directly before broad search. Continue until every material claim is supported,
rather than stopping after the first page that mentions the topic.

Completion: every material claim has a source authoritative and current enough for the target
version; conflicting sources are reconciled; unsupported points are labeled as uncertainty.

### 4. Synthesize the artifact

Return the smallest actionable result for the requested branch:

- **Implementation:** version-matched syntax or configuration, a focused example, and relevant
  pitfalls.
- **Migration:** current and target versions, breaking changes, ordered steps, and verification.
- **Fact lookup:** the direct answer, its version boundary, and supporting source.
- **Repository note:** a self-contained Markdown file at the agreed path with the same evidence.

Separate documented facts from inference. Cite primary sources beside the claims they support and
include exact commands or code only when the evidence establishes them.

Completion: the requested artifact exists, examples match the target version, every material claim
is traceable to a source, and remaining gaps are explicit.

## Source Discipline

- Record the relevant version, release, or publication date when a source can drift.
- Prefer installed declarations over live latest-version docs for project compatibility.
- Use secondary sources to clarify, not to override primary documentation.
- Cite the destination page rather than search-result snippets or unsourced summaries.
