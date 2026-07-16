# CLAUDE.md

This is a Claude Code skills repository.

## Requirements

Node.js ≥ 18, pnpm ≥ 9

## Repository Structure

```
kriscard-skills/
├── .claude-plugin/
│   └── plugin.json              # Skills manifest (lists all skill paths)
├── skills/
│   ├── dev/                     # Development skills
│   ├── dotfiles/                # Shell and dotfiles skills
│   ├── learning/                # Learning and knowledge capture
│   ├── obsidian/                # Obsidian vault management
│   ├── productivity/            # Productivity and workflow skills
│   └── writing/                 # Writing and content skills
├── scripts/
│   └── list-skills.sh           # List all SKILL.md paths
└── package.json
```

## Skill Structure

Each skill is a directory with a `SKILL.md` file:

```
skills/<category>/<name>/
├── SKILL.md                     # Required — frontmatter + instructions
└── references/                  # Optional — lazy-loaded reference files
    └── <topic>.md
```

### Frontmatter rules (verified against official docs)

**Skills (`SKILL.md`):**
- Required: `name`, `description`
- Recommended: trigger phrases in description ("Use when..." / "Make sure to use this skill whenever...")
- Optional: `paths` (glob auto-activation), `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `effort`
- Description budget: combined `description` + `when_to_use` truncated at **1,536 characters**

## Development Commands

```bash
pnpm install                     # First-time setup
bash scripts/list-skills.sh      # List all SKILL.md paths
pnpm run typecheck               # Type check TypeScript files
pnpm run format                  # Format all files
pnpm run format:check            # Verify formatting (CI)
```

## Adding a Skill

1. Create `skills/<category>/<name>/SKILL.md`
2. Add the path to `.claude-plugin/plugin.json` under `"skills"`
3. Run `bash scripts/list-skills.sh` to verify it is discoverable
4. Install or update the collection with `npx skills@latest add kriscard/Skills -g`

## Naming Conventions

- Category directories: kebab-case (e.g., `developer-tools`)
- Skill directories: kebab-case (e.g., `blog-writer/`)
- Skill names must be unique across the entire `skills/` tree and across globally installed skills

## Skill Architecture

Skills use progressive disclosure: lean SKILL.md body + lazy-loaded references.

- **SKILL.md body** under 500 lines — universal/always-fire content inline, deep content in `references/`
- **`references/<topic>.md`** files — the model decides what to load via the routing table in SKILL.md
- **References do NOT auto-load** — the model must call Read on them; the routing table is what makes that decision
- **Each reference starts with `> **Read this when:** ...`** so the model can verify it picked the right file
- **Routing tables use Priority columns** — `Priority | Load when | Reference` so triggers are unambiguous
- **Split large references by user intent (thematic)**, not by vendor or priority
- **Canonical example:** `skills/dev/react/SKILL.md` (7 universal checks + references)

## Practices

- **Test before committing non-trivial changes** — run `bash scripts/list-skills.sh` to verify all skills are discoverable. For skill routing changes, run an eval (spawn subagents with the skill loaded, verify each loads the expected reference).
- **Keep SKILL.md bodies lean** — if you find yourself over 300 lines, extract into `references/`.
- **Skill names are global** — two installed skills with the same name collide. Check before creating.
- **Use the Skills CLI for installation** — install with `npx skills@latest add kriscard/Skills -g` and update with `npx skills@latest update -g`.
