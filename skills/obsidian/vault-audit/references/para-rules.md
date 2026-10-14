> **Read this when:** auditing PARA classification, recommending a move, or distinguishing canonical PARA from a local vault rule.

# PARA classification rules

PARA organizes information by current actionability, not by subject. Use the live vault's
`AGENTS.md` for local conventions, but label them separately from the canonical method.

Primary source: [Tiago Forte, “The PARA Method”](https://fortelabs.com/blog/para/).

## Categories

| Category | Canonical test | Typical evidence |
| --- | --- | --- |
| Project | Is this an active, finite effort with a defined outcome? | A finish line, current work, completion criteria |
| Area | Is this an ongoing responsibility or standard to maintain? | No natural finish; recurring stewardship |
| Resource | Is this potentially useful information without a current required outcome? | Reference, topic, example, source material |
| Archive | Is this inactive material from a Project, Area, or Resource? | Completed, paused indefinitely, obsolete, no longer owned |
| Inbox | Is its actionability still undecided? | Unprocessed capture or ambiguous intent |

A Project benefits from a time horizon, but a specific calendar due date is not the defining PARA
criterion. If `AGENTS.md` requires one, report its absence as a local-schema issue.

## Apply the local knowledge extension

Before using the broad Resource category, read the live schema's additional destinations:

- Reusable explanation, practical technique, principle, or open question → Knowledge.
- Context and selected connections across notes, with Base-backed discovery → MOC.
- Dated personal record or learning receipt → Journal, using its daily, weekly, or TIL convention.
- Templates, Bases, and vault operations → System.

These are local additions, not canonical PARA categories. A Knowledge note can be unfinished or longer
than one screen. An immutable source remains a source; a synthesis belongs in a separate permitted
note. Age alone does not make knowledge or a journal entry inactive.

## Decision order

1. Active finite effort with an outcome? → Project.
2. Ongoing responsibility or standard? → Area.
3. Does the local Knowledge, MOC, Journal, or System role fit? → Use that role.
4. Explicitly inactive work or a record the user wants archived? → Archive after approval.
5. Source-specific record or reference material? → Resource.
6. Still unclear? → Keep in Inbox and ask how the user expects to use it.

Classification describes purpose and present use. Keep Knowledge independent of project completion;
link to it from the Project rather than moving it into the project's archive.

## Evidence standards

### Verified mismatch

The content explicitly contradicts its location, for example:

- a completed or abandoned Project remains active;
- an active finite deliverable is stored only as general reference;
- a no-longer-owned Area remains active;
- an inactive item is mixed into current execution views.

### Review candidate

Ask before concluding when evidence is indirect:

- a Project has not changed recently;
- an Archive was edited recently;
- an Area contains dates or milestones;
- a Resource mentions a project;
- one note could support several categories.

Dates, edits, tags, and links are clues, not classification by themselves.

## Recommendation format

For each proposed move report:

1. current path;
2. observed purpose and evidence;
3. canonical category and reasoning;
4. separate local-schema issue, if any;
5. proposed destination discovered from the live vault;
6. affected links or indexes;
7. uncertainty requiring user confirmation.

Never move a note during the audit. Preview and explicit approval come first.
