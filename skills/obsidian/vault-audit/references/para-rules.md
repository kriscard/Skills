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

## Decision order

1. Active finite outcome? → Project.
2. Ongoing responsibility or standard? → Area.
3. Useful without current action? → Resource.
4. Inactive material retained for reference? → Archive.
5. Still unclear? → Keep in Inbox and ask what future action it supports.

Prefer the most actionable current category. Moving a note later is normal; classification describes
its present relationship to action.

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
