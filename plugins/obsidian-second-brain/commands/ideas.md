# Ideas — Surface and Promote Vault Ideas

Two modes for working with ideas in the vault.

Usage:
- `/ideas surface` — find ideas the vault implies but never explicitly states (emergence detection)
- `/ideas promote` — find ideas from recent daily notes worth graduating to permanent notes
- `/ideas` (no argument) — ask which mode to use

## Obsidian Access

Use Obsidian CLI commands directly via Bash. If a CLI command fails, tell the user "Obsidian CLI isn't working — update Obsidian with CLI enabled."

---

## Mode: Surface (Emergence Detection)

Find ideas implied by the vault's contents but never written down — conclusions the evidence points to, patterns the structure reveals, beliefs behavior demonstrates.

**An emergent idea IS:**
- A conclusion from premises scattered across the vault, where the conclusion was never drawn
- A pattern recurring across 3+ domains but never named
- A belief that behavior reveals but was never articulated
- A direction multiple threads point toward but never identified

**An emergent idea is NOT:** a connection between two existing ideas, a restatement of vault content, a creative invention.

**The test:** "Oh, I think that's right but I've never said it" = emergence. "I already know that" = not emergence.

### Step 1: Structural Detection

```bash
obsidian search query="[[" format=json   # unresolved links = ideas felt but never developed
obsidian files folder="3 - Resources/" format=json
```

Look for: unresolved `[[links]]` clusters, orphaned notes that imply connections never made.

### Step 2: Thematic Detection

Find unnamed patterns recurring across 3+ PARA areas:

```bash
obsidian files folder="1 - Projects/" format=json
obsidian files folder="2 - Areas/" format=json
obsidian files folder="3 - Resources/" format=json
```

Look for: same approach used everywhere but never named, same tension in work/personal/creative domains, same value driving decisions without being stated.

**Minimum threshold:** 3 separate domains. Two occurrences is coincidence. Three is a pattern.

### Step 3: Behavioral Detection

```bash
obsidian search query="decided" format=json
obsidian search query="chose" format=json
obsidian search query="not going to" format=json
```

Look for: decisions consistently favoring one option type, things consistently avoided, patterns of what gets energy vs. procrastination.

### Step 4: Fabrication Check (MANDATORY)

```bash
obsidian search query="<the emergence stated plainly>" format=json
```

If it's already stated somewhere — discard. Not emergent.

### Confidence Levels

- **High** (5+ data points across 2+ methods): Strong evidence
- **Medium** (3–4 data points): Suggestive
- **Low** (1–2 data points): Speculative

### Output Format

```
Emergence [#]: [Title]
  The idea: [One sentence, plainly stated]
  Detection: [Which method found it]
  Evidence:
    - [Note, date] supports this because [why]
    - [Note, date] supports this because [why]
  Why emergent: [Why it hasn't been stated despite evidence]
  Confidence: High / Medium / Low
  What to do:
    - New belief to articulate?
    - Question to investigate?
    - A name for something already lived?
    - Leave alone (some things are better felt than formalized)
```

**Anti-patterns:**
1. **Fortune Cookie** — vague universals ("you value authenticity"). Must be specific to THIS vault.
2. **The Obvious** — restating what the vault already says.
3. **Creativity Trap** — inventing ideas and attributing them to the vault. Emergences are discovered, not invented.
4. **Over-interpretation** — require 3+ data points minimum.

---

## Mode: Promote (Daily Note Graduation)

Scan recent daily notes, surface ideas worth making permanent notes, help graduate them into the PARA system.

### Step 1: Scan Recent Daily Notes

Read the past 14 days:
```bash
obsidian read path="2 - Areas/Daily Ops/YYYY/YYYY-MM-DD.md"  # repeat for each day
```

**Explicit signals:** `#idea`, `#expand`, "I should write about", "worth investigating", named concepts, unresolved `[[links]]`

**Implicit signals:** high-energy paragraphs (longer, stronger language), original frameworks/claims, recurring themes across 3+ days, questions that keep appearing

**Not candidates:** tasks/to-dos, meeting logistics, things with existing standalone notes

### Step 2: Cross-reference Existing Vault

For each candidate:
```bash
obsidian search query="<candidate concept>" format=json
```

Categorize:
- **New concept** — no note exists → best candidate
- **Underdeveloped** — thin note exists → candidate for enrichment
- **Already covered** — substantial note exists → skip unless daily note adds something new
- **Recurring unresolved** — `[[unresolved link]]` multiple times → high priority

### Step 3: Present Candidates

Ordered by priority (recurring and high-energy first):

| # | Idea | Source | Days Mentioned | Status | Recommendation |
|---|------|--------|----------------|--------|----------------|
| 1 | ... | Feb 17, Feb 18 | 2 | Unresolved link | Create standalone note |
| 2 | ... | Feb 14 | 1 | New concept | Create standalone note |
| 3 | ... | Feb 6, Feb 12 | 2 | Thin note exists | Enrich existing |

For each: 1–2 sentence summary, exact quote from daily note, what it connects to in the vault.

### Step 4: Graduate Selected Ideas

Ask which to graduate, then for each:

**Creating a new note:**
- Place in `3 - Resources/Coding/` (tech concept), `3 - Resources/` (general), `1 - Projects/` (actionable idea with deadline), `2 - Areas/` (ongoing interest)
- Write as mini-essay (3–8 paragraphs): core claim, context from daily notes, `[[backlinks]]` to related vault notes, open questions
- Go back to source daily notes and add `[[links]]` to the new note

**Enriching existing:**
- Read the note, add new content with date header, add backlinks, update source daily note links

**Always ask before creating or modifying files.**

### Step 5: Summary

```
Graduated Today: [list of notes created/enriched]
Still in Queue: [ideas surfaced but not graduated — note if recurring]
Scan: X ideas found | X graduated | X skipped
```
