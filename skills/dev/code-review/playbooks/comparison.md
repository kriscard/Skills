> **Read this when:** reviewing a PR, branch-versus-base comparison, or changes since a fixed point.

# Comparison review

1. **Acquire.** Follow [comparison pinning](../references/review-core.md#comparison-pinning).
   Record repository, full base/head SHAs, merge-base, comparison semantics, commit list,
   metadata/spec receipts, complete diff, and exclusions. Stop cleanly on an empty diff;
   unresolved or ambiguous refs are a blocker, not an invitation to assume `main`.
2. **Frame.** Complete the core's guidance, spec, callers, and specialist maps. Inspect pinned
   code rather than accidentally reviewing a different checkout's files. Record inaccessible
   issues and continue Risk/Standards; the Spec axis stays unavailable where sources are absent.
3. **Review.** Apply all three axes and structural challenge. Use the core's two-reviewer
   topology only with authority and capability; otherwise provide the explicit limited fallback.
4. **Adjudicate and report.** Validate every candidate against real callers and constraints,
   record decisions, revalidate mutable refs/metadata, and issue the revision-bound report.
   End here. Fixes and platform review actions are separate authority.

Complete when every in-scope path and sourced requirement has coverage, validated findings
have decisions, and the report names the exact comparison and evidence gaps.
