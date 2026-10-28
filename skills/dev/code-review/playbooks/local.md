> **Read this when:** reviewing working-tree changes, selected files, or a supplied snippet.

# Local review

1. **Acquire.** Follow [local snapshots](../references/review-core.md#local-snapshots).
   Capture staged, unstaged, and in-scope untracked evidence separately, including a path that
   has both staged and unstaged edits. For selected code, record whether the review is of the
   whole selected contract or only a change; a snippet cannot establish absent caller guards.
2. **Frame.** Complete the core's guidance/spec/caller maps. The user's request can supply
   requirements, but existing behavior alone is not an invented specification. Bound any
   snippet-only limitations and ask for missing context that decides a material finding.
3. **Review.** Apply every applicable axis and specialist route. Use authorized independent
   reviewers when possible; sequential passes by one agent remain self-review.
4. **Adjudicate and report.** Recheck the snapshot, preserve static/observed labels, and return
   findings and coverage. Review-only ends without changing source, index, or platform state.

Complete when the selected scope and full local evidence are accounted for, every surviving
finding passes the core gate, and snapshot drift or unavailable context is explicit.
