# Skills

A collection of 46 agent skills for software development, Obsidian workflows, writing, productivity, dotfiles, and learning.

## Install

Install the collection globally with the Skills CLI:

```bash
npx skills@latest add kriscard/Skills -g
```

Update installed skills later with:

```bash
npx skills@latest update -g
```

## Quick start

Start a new agent session and make a request that matches a skill. For example:

```text
Review this React component for rendering bugs.
```

The agent loads the relevant skill automatically. Skills that represent explicit workflows can also be invoked by name, such as `/daily`, `/standup`, or `/close-day`.

## Skill catalog

### Development

| Skill | Description |
| --- | --- |
| `analyze-repo` | Audits a full repository and produces a visual architecture and technical-debt report |
| `architect` | Guides system and module design decisions, trade-offs, and ADRs |
| `commit` | Creates safe conventional commits and optionally pushes them after approval |
| `debug` | Diagnoses bugs, failures, and unexpected behavior from root cause to verification |
| `frontend` | Reviews frontend architecture, TypeScript boundaries, accessibility, and browser security |
| `pr-review` | Runs bug-first PR reviews across correctness, security, architecture, React, and accessibility |
| `react` | Audits React and Next.js rendering, effects, performance, and modern APIs |
| `react-hook-form` | Builds and modifies React Hook Form forms |
| `react-hook-form-audit` | Audits React Hook Form code for correctness, accessibility, and performance |
| `refactor` | Improves code structure while preserving behavior and public APIs |
| `research` | Retrieves current, source-grounded framework and API documentation |
| `review` | Reviews code changes for production-impacting defects |
| `spec` | Turns issues or requirements into approval-gated implementation specs |
| `test` | Applies test-pyramid, behavioral testing, and red-green-refactor practices |

### Obsidian

| Skill | Description |
| --- | --- |
| `audit-para` | Audits vault organization against PARA principles |
| `capture-receipt` | Captures concrete work or learning evidence for later sharing |
| `close-day` | Runs the end-of-day review and prepares tomorrow's carry-forward |
| `daily` | Creates the daily note and chooses one outcome and next action |
| `goals` | Reviews and updates monthly or quarterly goals |
| `ideas` | Captures, develops, and promotes ideas into permanent notes |
| `ingest` | Synthesizes source material into durable resource notes |
| `maintain` | Checks vault health, broken links, orphaned notes, and tag consistency |
| `memory-recall` | Finds prior knowledge, decisions, and connections across the vault |
| `money` | Diagnoses the revenue system and surfaces monetization opportunities |
| `process-inbox` | Triages inbox notes into PARA destinations with approval |
| `project` | Creates, updates, and completes PARA project notes |
| `save-note` | Saves a conversation answer as a self-contained wiki page |
| `spot-drift` | Compares stated priorities with recent behavior in the vault |
| `vault` | Provides shared vault structure, CLI, and PARA context |
| `weekly-review` | Reviews the week and prepares the next weekly note |

### Writing

| Skill | Description |
| --- | --- |
| `blog` | Writes and revises developer-facing posts around one sharp insight |
| `docs` | Creates READMEs, API docs, architecture docs, RFCs, design docs, and ADRs |
| `talk` | Builds technical CFP submissions, talk outlines, and slide flows |
| `tutorial` | Writes checkpointed, step-by-step technical tutorials |
| `tweet-today` | Generates categorized Twitter/X post options from current work or a topic |

### Productivity

| Skill | Description |
| --- | --- |
| `career` | Advises on job searches, interviews, compensation, promotion, and Staff trajectory |
| `check-communication` | Reviews messages for clarity, tone, framing, and next steps |
| `deslopify` | Removes AI-sounding filler from prose and code diffs |
| `ideation` | Develops early ideas through options, trade-offs, and lightweight specs |
| `prototype` | Scopes and ships working MVPs from validated ideas |
| `standup` | Produces a concise daily standup from recent git activity and notes |

### Dotfiles

| Skill | Description |
| --- | --- |
| `audit` | Audits dotfiles for security, startup, symlink, and tooling issues |
| `neovim` | Maintains and diagnoses a lazy.nvim-based Neovim configuration |
| `shell-env` | Edits Stow-managed shell, terminal, Git, tmux, and window-manager config |

### Learning

| Skill | Description |
| --- | --- |
| `learn` | Runs Socratic teaching sessions with comprehension checks |
| `til` | Saves session learnings as engaging Obsidian TIL notes |

## Repository structure

```text
skills/<category>/<name>/
├── SKILL.md
└── references/        # Optional, loaded only when needed
```

Every skill has a `SKILL.md` with frontmatter and instructions. Larger skills use `references/` for progressive disclosure.

## Local development

Requires Node.js 18 or newer and pnpm 9 or newer.

```bash
pnpm install
pnpm run validate
```

To add a skill:

1. Create `skills/<category>/<name>/SKILL.md`.
2. Add optional detail under `skills/<category>/<name>/references/`.
3. Run `pnpm run validate` to check structure, frontmatter, and references.

## License

MIT
