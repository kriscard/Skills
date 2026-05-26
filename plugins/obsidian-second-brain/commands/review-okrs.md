# Review OKRs Command

Entry point for OKR reviews. Loads context, selects review level, then delegates to the **okr-tracker agent**.

## Context (auto-loaded)

### Vault rules
!`obsidian read path="CLAUDE.md" 2>/dev/null || echo "(CLAUDE.md not found — confirm vault path)"`

### OKR Dashboard
!`obsidian base:query path="2 - Areas/Goals/OKR Dashboard.base" format=json 2>/dev/null || echo "[]"`

### Active projects
!`obsidian files folder="1 - Projects/" format=json 2>/dev/null || echo "[]"`

## Step 1: Select Review Level

Ask the user which review they want:

```
Which OKR review?
1. Quarterly — major goals and planning (every 3 months)
2. Monthly — progress check-in and adjustments
3. Weekly — task-level priorities and alignment
```

## Step 2: Hand Off to okr-tracker Agent

Once the user selects a level, delegate to the **okr-tracker agent** with the review type and the auto-loaded OKR context above. The agent handles:

- **Quarterly**: read current quarter note, review previous quarter, set new objectives, break into monthly milestones
- **Monthly**: read monthly note, assess quarterly progress, set monthly priorities, surface at-risk goals
- **Weekly**: read weekly planning note, check monthly goal coverage, set weekly priorities, surface inbox if needed

## Quick CLI Reference

```bash
obsidian files folder="2 - Areas/Goals/Quarterly/" format=json
obsidian files folder="2 - Areas/Goals/Monthly/" format=json
obsidian read path="2 - Areas/Goals/Quarterly/Quaterly Goals - Q1 2026.md"
obsidian base:query path="2 - Areas/Goals/OKR Dashboard.base" format=json
obsidian base:query path="MOCs/Active Projects.base" format=json
obsidian tasks todo path="2 - Areas/Goals/" total
obsidian property:set path="..." name="status" value="completed"
obsidian task done path="..." line=N
```

**Note:** Quarterly folder uses "Quaterly" spelling — preserve existing vault structure.
