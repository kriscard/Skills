# Skills

Personal Claude Code skills — a curated collection used daily across development, knowledge management, writing, and productivity workflows.

## Install

**Via `npx skills`** (recommended — installs globally):

```bash
npx skills@latest add kriscard/kriscard-claude-plugins
```

**Via symlink** (local dev — changes take effect immediately):

```bash
bash scripts/link-skills.sh
```

This symlinks each skill directory into `~/.claude/skills/` so Claude Code picks them up without reinstalling.

## Skills

### Development

| Skill | Description |
|-------|-------------|
| `architect` | System design and architecture decisions — monolith vs services, API protocols, rendering strategy, GoF patterns, code smells |
| `frontend` | Frontend architecture — component patterns, state management, type system, security, Next.js |
| `react` | React code review — universal checks for hooks, state, performance, and modern React 19 patterns |
| `debug` | Root-cause debugging — systematic diagnosis, error tracing, fix verification |
| `refactor` | Code refactoring — readability, complexity reduction, extract patterns |
| `review` | Code review — security, performance, correctness, production reliability |
| `test` | Testing strategy — unit, integration, E2E, Vitest API reference (18 refs) |
| `commit` | Semantic git commits with conventional commit format |
| `pr-review` | Pull request review with parallel agent orchestration |
| `spec` | Turns Linear/GitHub issues or plain text into structured specs |
| `research` | Documentation research — APIs, frameworks, best practices |
| `analyze-repo` | Codebase analysis — architecture, dependencies, quality report |
| `claude-optimizer` | Audits and improves CLAUDE.md files for compliance and token efficiency |

### Obsidian (Second Brain)

| Skill | Description |
|-------|-------------|
| `vault` | Vault context and Obsidian CLI reference — load before any vault operation |
| `ingest` | Processes inbox items into synthesized wiki pages in Resources/ |
| `save-note` | Files a session answer as a permanent wiki page |
| `project` | Creates and updates project notes following PARA methodology |
| `daily` | Daily note creation and startup workflow |
| `close-day` | End-of-day capture — wins, blockers, tomorrow's focus |
| `weekly` | Weekly review and reflection |
| `goals` | OKR and goal tracking across quarterly/monthly/weekly notes |
| `ideas` | Captures and develops ideas from the vault |
| `process-inbox` | Clears the Obsidian inbox — reads, discusses, files, and moves items |
| `ingest` | Ingests articles, tweets, videos into the knowledge base |
| `maintain` | Vault maintenance — broken links, orphaned notes, tag hygiene |
| `audit-para` | Audits vault structure against PARA principles |
| `memory-recall` | Surfaces relevant notes from past sessions |
| `spot-drift` | Identifies areas drifting from intention in the vault |
| `money` | Revenue advisor — scans vault, diagnoses revenue system, surfaces monetization opportunities |

### Writing & Content

| Skill | Description |
|-------|-------------|
| `blog` | Blog post writing — story structure, post templates, voice, SEO |
| `talk` | Conference talk builder — narrative arc, iA Presenter slides |
| `docs` | Technical documentation — ADRs, RFCs, architecture proposals, design docs |
| `tutorial` | Step-by-step technical tutorials with progressive disclosure |

### Dotfiles & Shell

| Skill | Description |
|-------|-------------|
| `shell-env` | Shell environment — zsh, tmux, starship, Ghostty, yabai via GNU Stow |
| `neovim` | Neovim config, performance optimization, and plugin management |
| `audit` | Dotfiles security audit and modern tool recommendations |

### Productivity

| Skill | Description |
|-------|-------------|
| `ideation` | Brain dump → contract → PRD → spec pipeline |
| `standup` | Daily standup generation from git history and notes |
| `career` | Career tracking, progression, and staff engineer workflow |
| `check-communication` | Communication quality review — clarity, tone, framing |
| `prototype` | Rapid prototyping with clear scope and fast feedback loops |
| `deslopify` | Removes AI slop from text — improves clarity and directness |

### Learning

| Skill | Description |
|-------|-------------|
| `learn` | Interactive learning sessions with documentation fetching |
| `til` | Captures session learnings into TIL notes in Obsidian |

## Local Development

```bash
# List all skills
bash scripts/list-skills.sh

# Symlink skills to ~/.claude/skills/
bash scripts/link-skills.sh
```

## License

MIT
