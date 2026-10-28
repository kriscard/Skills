> **Read this when:** reviewing completed implementation or returning an assigned repair to its coordinator.

# Review and return

## Repair-return takes precedence

When the current `code-review` coordinator assigned accepted findings to this run, repair
only the authorized findings and supporting changes. Preserve specified behavior and budget.
Return finding dispositions, changed paths, new revision/snapshot, exact checks/receipts and
remaining risk **to that coordinator**. Do not automatically invoke `code-review`, spawn a
reviewer, or begin another repair cycle. The coordinator owns re-pinning, adjudication and
re-review. A disputed finding or needed scope/design change is a blocker to report there,
not permission to choose replacement behavior. This prevents implement → review → implement
recursion.

## Ordinary implementation completion

The sole review workflow owner is **`code-review`**. Inspect its installed invocation policy:
if installed and model-invocable, use it for the bounded final change, with originating
requirements, full base/head or immutable snapshot, applicable guidance, affected callers,
and actual evidence. Respect its authority gates; a review request alone does not authorize
repairs, fan-out or remote posting. Do not substitute another review skill.

When trust/security, public contracts, persistent data or cross-module responsibilities
change, obtain an independent review if both authorized and supported. Ask for missing
review authority when required by the task. A host without agent tools can execute sequentially
and self-review the actual diff and callers, but must report that independence is unavailable.
If `code-review` is absent or user-only, ask the user to invoke/provide it when needed and
label any local self-review honestly. Never claim a separate reviewer or verifier existed.
A required independent gate remains blocked until satisfied or the user explicitly changes it.

Classify findings against requirements and real callers rather than treating reviewer agreement
as proof. Address only authorized findings; rerun affected proof after edits. Stop at the
agreed review/repair round or time limit and report unresolved findings. Leave commits,
publication and ticket updates to the explicit action grants in the main skill.
