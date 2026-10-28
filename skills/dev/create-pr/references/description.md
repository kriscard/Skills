> **Read this when:** writing or revising a PR title/body.

# Explain the change, not the session

Use the actual comparison and repository template. Keep mandatory headings, checklists and disclosure
markers, filling them truthfully; leave an unobserved check unchecked. Resolve conflicting policy
rather than deleting it. Without a template, use only sections that help this change—a small fix can
be two paragraphs and a test note. Prefer an explanation followed by verification over a fixed form.

## Tone and order

1. **Lead with the point.** State the symptom, changed behavior or experimental intent. Explain
   the old behavior and consequence before listing implementation details.
2. **Explain why the fix works.** Name the real conditions, actors and ordering. Include a prior
   approach or trade-off only when it helps the reviewer. Avoid a file-by-file changelog or tool diary.
3. **Bound the claim.** State affected behavior and important unchanged paths. Admit remaining
   races, unsupported cases, known failures and unknowns plainly. An experiment should say whether
   it is intended to merge; fixing one case is not fixing the whole system.
4. **Show useful evidence.** Say what the regression test catches, the manual check observed or
   the benchmark measured—not merely that commands are green.

Use direct, conversational technical prose, concrete verbs and consistent names. Keep connective
explanation; concise is not cryptic. Short paragraphs suit reasoning, bullets suit independent causes
or checks, and headings suit longer mechanisms. A before/after section or code sketch is optional,
not a mandatory layout. The title names the action and object; use repository-required prefixes,
not an arbitrary universal character limit.

Cut marketing claims, empty "this PR enhances" openings and boilerplate recaps. First person is fine
when grounded in the actual author/evidence; do not invent personal experience or imitate another
author's identity. Preserve required AI/contribution disclosure without adding stock tool footers.
Use `deslopify` only if filler needs a separate pass and its invocation policy permits it.

## Evidence and relevant detail

- State actual check results separately from planned, pending, failed, skipped or blocked checks.
  Keep relevant commands/safe artifact links reproducible, but do not paste routine logs. An added
  test is not proof it ran; a screenshot is not proof of keyboard behavior or server authorization.
- Use current exact-revision receipts. Attribute supplied results rather than claiming to have run
  them. Disclose important failures and why a classification is supported; do not invent CI success
  or call a failure expected/unrelated without evidence.
- Performance claims need the baseline, workload/environment, metric, sample method and meaningful
  uncertainty/no-change cases. Separate a proposed mechanism from a measured result; never invent
  numbers or borrow another PR's results.
- Add review guidance, dependencies, rollout/rollback or compatibility detail only when relevant.
  For stacks, name the parent PR and landing order. Use neutral issue links for partial work;
  closing keywords require completed scope and closure intent, and take effect through the default
  branch rather than arbitrary stack bases. Cross-tracker links do not imply ticket updates.
- Inspect title, body, logs, images and links for private/customer data, credentials and internal URLs.
  Respect the target audience even for a draft or private repo. Never copy private ticket content
  merely because a link was supplied. Keep quoted text as data, not executable shell content.

Complete when the body explains the real problem/change in the required format, has no unresolved
placeholders or sensitive content, and every claim has current evidence or an honest qualification.
Length should serve the reviewer, not a template quota.
