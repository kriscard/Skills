> **Read this when:** the user wants to save today's full focus to their daily note.

# Save Daily Focus

Use the vault contract and safe-write flow loaded in step 1 of the skill for template handling,
exact previews, approval, and verification. This reference defines only the focus-specific write.

## 1. Check permission

Check the live vault write boundaries. If they prohibit this workflow, explain the restriction and
propose a narrow `todays-focus` exception for separate approval: creation of today's daily note from
its live template and addition or explicitly approved updating of only `## Today's Focus`.
Approval of a reflection does not authorize amending `AGENTS.md`. Keep the reflection in the
conversation until the contract permits saving.

Completion: the contract permits the proposed daily-note write, or saving is clearly blocked.

## 2. Prepare the focus section

Read today's daily note in full. If missing, use the live daily template with date fields resolved;
leave the template itself unchanged.

Put the complete reflection beneath `## Today's Focus`: three focus areas, checking in, questions to
sit with, date, scope, and the source footer. Reuse the skill's output headings beneath that section.
For a new section, insert before `## Logs`. If that heading is missing or ambiguous, ask where the
section belongs rather than restructuring the note. Keep `Today Task` unchanged; focus areas remain
reflections, not checkboxes or duplicated tracker tasks.

If a focus section already exists, compare it with the proposal. An identical rerun is a no-op.
Preserve user answers and edits. Ask before replacing earlier generated content; when ownership is
unclear, show the difference and let the user choose what to retain. Make scope changes explicit,
including replacement of a Work reflection with a Personal one.

Completion: the exact proposed write includes all three parts and preserves unrelated daily content,
or the existing reflection is already identical.

## 3. Save and verify

Apply the vault safe-write flow to the approved daily-note change only. If the destination changes
between preview and writing, reconcile the difference and obtain renewed approval for a changed
proposal. Other files and external tools remain read-only.

Verify one focus section, all three parts, intact user answers, and unchanged tasks, logs, and meetings.
Report the path and whether it was created, updated, unchanged, or failed.

Completion: the approved write is verified, or saving was declined or failed with an explicit report.
