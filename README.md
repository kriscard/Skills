# Skills

A collection of 42 agent skills for software development, Obsidian workflows, writing, productivity, dotfiles, and learning.

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
| `pr-review` | Reviews PR or branch diffs against production risk, repository standards, and the originating spec |
| `react` | Audits React and Next.js rendering, effects, performance, and modern APIs |
| `react-hook-form` | Builds and modifies React Hook Form forms |
| `react-hook-form-audit` | Audits React Hook Form code for correctness, accessibility, and performance |
| `refactor` | Improves code structure while preserving behavior and public APIs |
| `research` | Retrieves current, source-grounded framework and API documentation |
| `review` | Reviews selected or local code changes for production-impacting defects and project-rule violations |
| `spec` | Builds separately reviewed requirements, technical design, and an executable plan, then records approval and stops before implementation |
| `test` | Builds behavior-focused tests, selects credible boundaries, and records executable evidence across test runners |

### Obsidian

| Skill | Description |
| --- | --- |
| `capture-receipt` | Preserves sourced evidence for possible future sharing without losing task context |
| `close-day` | Records a resume state, triages receipts, and confirms carry-forward |
| `daily` | Creates the daily note and confirms one outcome and next action |
| `goals` | Creates or revises monthly, quarterly, and yearly objectives |
| `ideas` | Captures and promotes ideas through the vault Inbox |
| `ingest` | Discusses and synthesizes source material into the LLM Wiki |
| `memory-recall` | Finds prior knowledge, decisions, and connections across the vault |
| `process-inbox` | Triages Inbox notes into PARA destinations with approval |
| `project` | Creates, updates, and completes PARA Project notes |
| `save-note` | Files conversation synthesis into the LLM Wiki |
| `vault` | Loads live vault schema, ownership, and safe-operation context |
| `vault-audit` | Audits PARA, links, metadata, LLM Wiki quality, and vault statistics |
| `weekly-review` | Retrospectively reviews an existing completed weekly note |

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
| `career` | Produces evidence-based career decisions, artifacts, and promotion cases |
| `check-communication` | Reviews messages for clarity, tone, framing, and next steps |
| `deslopify` | Removes AI-sounding filler from prose and code diffs |
| `standup` | Produces an evidence-backed daily standup from Git and non-code work |

### Dotfiles

| Skill | Description |
| --- | --- |
| `audit` | Audits dotfiles for security, startup, symlink, and tooling issues |
| `neovim` | Maintains and diagnoses a lazy.nvim-based Neovim configuration |
| `shell-env` | Edits Stow-managed shell, terminal, Git, tmux, and window-manager config |

### Learning

| Skill | Description |
| --- | --- |
| `learn` | Runs Socratic teaching sessions with demonstrated comprehension |
| `til` | Saves demonstrated learning as a durable Obsidian TIL note |

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
