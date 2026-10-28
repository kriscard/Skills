> **Read this when:** checking this workflow's rationale, provenance, source applications, or currentness.

# Sources and adaptations

Research access date: **2026-10-28 UTC**, from the author's system clock. Pages were retrieved and
inspected then; this is an access date, not a claim that older guidance was published or revised in
2026. Live URLs and `main`/`master` branches can change. Recheck installed versions and primary pages
when a decision depends on current syntax or platform behavior. Reading a source is not execution
proof of this skill or a target application.

## Primary claims → application

| Source and supported fact | Application here |
| --- | --- |
| [Google review standard](https://google.github.io/eng-practices/review/reviewer/standard.html): improve code health, not perfection; technical facts outweigh preferences | Structural quality can matter without a runtime bug; taste alone does not block |
| [Google looking for](https://google.github.io/eng-practices/review/reviewer/looking-for.html): inspect design, functionality, complexity, tests, and broader context | Trace real callers and compare concrete simpler designs, including implementation and caller costs |
| [Google comments](https://google.github.io/eng-practices/review/reviewer/comments.html): explain why; distinguish required from optional feedback | Evidence-backed corrections and explicit optional/required adjudication; review the code, not the author |
| [GitHub reviewing proposed changes](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/reviewing-proposed-changes-in-a-pull-request): file review, comments, and submitting a review are platform actions; views may be filtered | Acquire complete evidence independently of filtered UI and keep posting/approval separately authorized |
| [GitHub dismissing a review](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/dismissing-a-pull-request-review): authorized users can dismiss a review with an explanation when circumstances change | Local readiness is not platform approval, and changed code needs a new evidence decision, not silent reuse |
| [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches): configured stale-approval rules can invalidate approvals on new commits or changed merge base | Re-pin base/head and affected evidence. Our stricter local revision policy does not imply every repository enables stale dismissal |
| [OWASP Code Review Guide](https://owasp.org/projects/code-review-guide): manual security review complements automated techniques; the guide is established guidance, not a new 2026 mandate | Keep a security lens alongside tooling; do not call automation alone a security pass |
| [OWASP ASVS 5.0 authorization](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x17-V8-Authorization.md), especially 8.3.1: trusted-service enforcement, not manipulable client controls | Trace object/tenant/field access at reachable authoritative entry points; UI hiding is insufficient |
| [OWASP ASVS 5.0 encoding/sanitization](https://github.com/OWASP/ASVS/blob/master/5.0/en/0x10-V1-Encoding-and-Sanitization.md): context-sensitive defenses against injection | Trace untrusted source to sensitive sink; inspect actual encoding, parameterization, and sanitizer configuration |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/): testable criteria include keyboard operation, labels, status messages, focus not obscured, dragging alternatives, target size, and accessible authentication | Assess the applicable criterion, conformance level, and exceptions at the real user task; no blanket conformance from a static review |
| [React rules](https://react.dev/reference/rules), [purity](https://react.dev/reference/rules/components-and-hooks-must-be-pure), [Hooks](https://react.dev/reference/rules/rules-of-hooks): render purity, immutable snapshots, and hook calling constraints | Review state/data paths against detected React capabilities, not arbitrary stylistic conventions |
| [React effects guidance](https://react.dev/learn/you-might-not-need-an-effect): effects synchronize external systems; derived values often need no effect | Challenge mirrored state and effect chains using concrete stale-state/caller-cost evidence, retaining legitimate synchronization |
| [Next.js data security](https://nextjs.org/docs/app/guides/data-security): server-side data access/auth checks, minimal DTOs, and externally reachable exported Server Actions | Follow callable action → validation/authorization → data/serialization boundaries; match installed Next.js behavior |
| [Playwright best practices](https://playwright.dev/docs/best-practices): test user-visible behavior, isolate state, prefer resilient locators and web-first assertions | Audit tests at their claimed boundary; avoid sleeps and mocks that replace the behavior being claimed |

Also inspected W3C's explanatory pages for [focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html),
[accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html),
[target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), and
[status messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html).
They clarify sticky-overlay focus failures, password-manager/paste assistance, size/spacing
exceptions, and programmatically determinable status without focus movement. These are
explanations of the criteria, not an additional conformance standard.

These sources support technical lenses and evidence discipline. **Our workflow policy**, not a
universal externally sourced standard: three review axes; exactly two independent all-axis reviewers
when authorized/capable; the four adjudication labels; P0–P3/confidence scheme; separate fresh final
verifier and lead audit; explicit budgets, authority gates, and repair-return mode. The user's/project's
accepted constraints decide applicability and blocking status. No source establishes a universal
“2026 code-review process.”

## Inspiration, not dependencies

The repository's existing `review` and `pr-review` cores and frontend-risk references are the local
foundation. This canonical skill consolidates and improves their risk/standards/spec separation,
scoped rules, caller validation, and frontend substance. It adds structural alternatives, immutable
packets, authority-aware independent execution, and revision-bound loop readiness. It does not require
the inspiration projects, their global configuration, or their principle collections.

- [Matt Pocock code-review](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review):
  adapted explicit fixed-point/merge-base acquisition and separate Standards/Spec evidence. Rejected
  mandatory tracker setup, unconditional subagents, splitting reviewers by axis, and treating a fixed
  smell list as repository standards. Smells generate hypotheses; real caller burden decides merit.
- [Cursor pstack](https://github.com/cursor/plugins/tree/main/pstack): the inspected skills listing
  contained **no named `code-review` skill**. Relevant inspiration was its
  [poteto-mode](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md),
  [correct](https://github.com/cursor/plugins/blob/main/pstack/skills/correct/SKILL.md),
  [arena](https://github.com/cursor/plugins/blob/main/pstack/skills/arena/SKILL.md), and
  [show-me-your-work](https://github.com/cursor/plugins/blob/main/pstack/skills/show-me-your-work/SKILL.md).
  Adapted deliberate role packets, concrete alternatives, inspectable evidence, and lead ownership.
  From `correct`, prefer enforceable invariants and behavior tests when an authorized repair addresses
  a demonstrated class; rejected automatic repo-wide rule edits and history mining during a review.
  From `arena`, use independent evidence before synthesis; rejected competitive writer fanout, automatic
  runner fallback, fixed model families, and global model-config dependencies.
- Inspected linked [interrogate](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md),
  [prove-it-works](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md),
  and [laziness protocol](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-laziness-protocol/SKILL.md).
  Adapted checking the real artifact and comparing simpler mechanisms. Rejected `interrogate`'s
  run-only survival rule: static security traces and structural costs can be valid findings, with
  honest proof labels. Rejected blanket “fewer lines wins” and auto-starting repro environments.
- `show-me-your-work` inspired evidence pointers and a decision ledger, not a mandatory TSV artifact,
  transcript access, cross-model invocation, or publication. No wholesale external text was copied;
  this document paraphrases and links ideas rather than importing external instructions or notices.

Currentness limitations: public branches are mutable, a guessed ASVS injection filename and a guessed
pstack review playbook URL returned 404 during research; the actual ASVS directory was inspected to
resolve the encoding chapter. The pstack sources are inspiration, not official platform guarantees.
The workflow's portability and behavioral routing still need agent evaluation on each intended host;
source retrieval and author walkthroughs do not establish those results.
