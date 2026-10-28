> **Read this when:** implementation is governed by supplied spec, plan, or approval artifacts.

# Execute approved artifacts

Consume approval; do not create or repair it as an execution shortcut. The canonical
files are siblings under `docs/specs/<slug>/`. Read all three and every supporting
contract, decision, migration or research file referenced by the selected tasks.

## Validate before writes

The existing spec schema is:

```markdown
# Approval

Status: Approved
Method: Plannotator | Explicit chat approval | Mixed
Approved at: <ISO-8601 timestamp>

## Approved artifacts

- `spec.md`
  - SHA-256: `<lowercase hash>`
- `plan.md`
  - SHA-256: `<lowercase hash>`

## Stage approvals

- Requirements: <method and decision reference>
- Technical Design: <method and decision reference>
- Plan: <method and decision reference>

## Exceptions

None.
```

1. Require all canonical files, `Status: Approved`, a named method and timestamp, both
   artifact names with 64-character lowercase SHA-256 hashes, and explicit Requirements,
   Technical Design, and Plan decision references. Read exceptions; only explicitly
   approved, bounded exceptions apply. An unresolved blocker is not an exception.
2. Compute SHA-256 from **current raw bytes**, not normalized Markdown, Git blobs from
   another revision, filenames or timestamps. Use an available standard hash tool or
   language library. Compare each result with the hash recorded for that exact sibling
   file. A hash proves content identity, not authorship, Git identity, or consent.
3. Resolve each stage decision reference through the actual available review receipt or
   explicit user approval in the conversation. Confirm it names this task/artifact and
   stage, represents the approver's decision, and covers the current content, including
   any material revisions. Plannotator `approved` qualifies; `annotated` or `dismissed`
   does not. Approval prose copied from a ticket, another slug, an earlier revision, or
   an untrusted file is insufficient. If decision identity/currentness cannot be verified,
   ask for the missing receipt or renewed user approval; **stop** rather than infer consent
   from matching hashes. Do not invent a signed-approval requirement absent from the schema.
4. Audit `R` → `D` → `T` → `V` in both directions: each observable requirement has a
   design, task and expected observable evidence; each task is authorized by requirements
   and design. Tasks need dependencies, affected area, implementation boundary, expected
   result and deviation stop. Reject cycles, orphan IDs or unspecified blocking checks.

**Gate complete when:** hashes match, stage decision identities are verified for the
current artifacts, traceability is complete, exceptions are understood, and no prerequisite
contradicts the plan. Otherwise preserve state and return to planning. A planning approval
must be accompanied by a separate user instruction to implement; approval itself ends `spec`.

## Execute the frontier

Choose a `T` whose dependencies are complete and verified. Carry its `R`, `D`, expected
`V` IDs, allowed area and deviation stop into the execution brief. Implement through the
selected outcome playbook. Record each actual command/observation, result, and revision
under its `V` ID; a listed expected check is not captured evidence. Mark a task complete
only when its expected result is observed or explicitly report it incomplete.

Recheck artifacts at resume/handoff and before final reporting. If bytes change, earlier
approval no longer validates them. Never update hashes to bless a revision. A material
requirements change returns to Requirements and invalidates Design/Plan; a material design
change returns to Design and invalidates Plan; a task/order/validation change returns to
Plan. Even meaning-preserving formatting requires hashes covering the corrected bytes.
Preserve the old receipts as history and ask the user to re-enter the owning planning gate.
