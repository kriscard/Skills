> **Read this when:** selecting installed technical guidance for the affected implementation surface.

# Compose by evidence

Discover skills through the host and inspect invocation policy before use. Invoke only
installed, **model-invocable** skills using the host's supported mechanism. A user-only
skill is a handoff to the user, not an autonomous call. If unavailable, use repository
conventions, installed declarations and primary documentation when sufficient; otherwise
report the exact blocker. Never invent tool access, install a collection, or change global
configuration. Read the selected skill fully and only its triggered references.

Select rows from actual task evidence, not merely a dependency appearing in a manifest.
Specialists own their detailed methods and version checks; this skill owns execution and
authority. Advice remains inside the current task, not a separate automatic workflow.

| Current-task evidence | Skill | Responsibility |
|---|---|---|
| Observable defect, unexplained failing check or regression | `debug` | Reproduction and causal diagnosis before a fix |
| Behavior coverage, regression tests, test execution or missing proof | `test` | Observation boundary and executable behavioral evidence |
| Authorized behavior-preserving structural change | `refactor` | Preservation and focused simplification |
| Consequential service/module, persistence, ownership, protocol or compatibility decision | `architect` | Alternatives, trade-offs and reversal analysis; no approval authority |
| Interface burden, seams, split/join, shared knowledge or testability decision | `codebase-design` | Total caller and implementation burden, depth and locality |
| Version-sensitive library, framework, SDK or external API claim | `research` | Installed/target version evidence and primary sources |
| Browser contracts, accessibility, UI states, security or feature organization | `frontend` | Consumer-visible frontend constraints and proof |
| React composition, hooks, Effects, state, providers, Suspense or rendering | `react` | React-owned state and composition; not all frontend work |
| Type modeling, narrowing, generics, assertions or runtime type evidence | `typescript` | Language-wide type contracts; not browser/platform policy |
| Framework-specific routing, rendering or caching mechanics | Matching framework skill, such as `nextjs-app-architecture` | Actual framework/version contracts only |
| Playwright suite, fixtures, locators, runner or browser-test configuration | `playwright` | Playwright Test mechanics, not one-off browsing |
| One-off browser observation on an approved safe surface | `agent-browser` | Browser interaction and receipts |
| MSW request handlers, interception, lifecycle or passthrough | `msw` | Version-aware mocking contracts, not generic network work |
| Tailwind utilities, themes, source visibility or generated CSS | `tailwind` | Installed Tailwind behavior, not product design policy |
| TanStack Query keys, cache, mutation, retry, cancellation or hydration | `tanstack-query` | Installed adapter/core behavior, not generic client state |
| Zod parsing, transforms, structured errors, schema composition or codecs | `zod` | Installed schema runtime contract |
| Forms implemented with React Hook Form or required by project convention | `react-hook-form` | Form ownership, validation, fields, submission and dirty state |

A React form using Query, MSW tests and Zod may activate several rows, but only for the
parts that genuinely depend on those mechanisms. Plain text edits activate none of them.
For review ownership and repair-return, use [review and return](review-and-return.md).
