> **Read this when:** The user asks whether they are on track for Staff Engineer, needs promotion evidence, or wants quantitative career signal tracking.

# Staff Engineer Progress Tracking

When the user asks about Staff Engineer trajectory, analyze the four signals quantitatively. If Obsidian goals exist and the user points to them, read them for context but do not modify them.

## The Four Staff Engineer Signals

### 1. Technical Writing

ADRs, RFCs, design docs, technical specs.

```bash
git log --all --grep="ADR" --grep="RFC" --grep="design doc" --oneline
find . -name "*adr*" -o -name "*rfc*" -o -name "*design*" | grep -v node_modules
```

Target: 2+ docs/quarter after Q1. Quality indicator: doc influences team decisions and contains trade-off analysis.

### 2. Code Review Quality/Quantity

Total reviews, substantive reviews (>3 comments with reasoning).

```bash
gh search prs --reviewed-by @me --limit 100
```

Target: 20+/month, 30%+ substantive rate.

### 3. System Ownership

Percent of commits in specific dirs/modules over time.

```bash
for dir in $(find src -maxdepth 2 -type d); do
  total=$(git log --oneline -- "$dir" | wc -l)
  yours=$(git log --author="$(git config user.email)" --oneline -- "$dir" | wc -l)
  [ "$total" -gt 20 ] && echo "$dir: $((yours * 100 / total))% ($yours/$total)"
done
```

Threshold: >50% of commits in an area for 3+ months.

### 4. Cross-Team Impact

PRs touching multiple team dirs, cross-functional projects.

```bash
gh pr list --author @me --json files | \
  jq '.[] | select(.files | map(.path | split("/")[1]) | unique | length > 1)'
```

## Report Format

```text
Staff Engineer Progress ([Period])

Technical Writing: X docs (Goal: Y/quarter) — [On track / Behind]
Code Reviews: X reviews, Y substantive (Goal: Z/month) — [Trending up/down]
System Ownership: X areas at >50% — [Established / Emerging]
Cross-Team Impact: X active projects — [Scope: which teams]

Top 3 actions for next 30 days:
1. [Specific action with expected signal impact]
```

Completion criterion: every available signal is marked measured, unavailable, or needs user-supplied data, and the report ends with the top 3 actions for the next 30 days.

## Warning Signs to Flag

- No technical writing in 60+ days → suggest converting recent code review feedback into an ADR.
- Substantive review rate <20% → suggest adding reasoning to next 3 reviews.
- No clear ownership (all areas <30%) → suggest focusing commits.
- All work in one team → suggest cross-team opportunity.
