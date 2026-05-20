# kriscard-claude-plugins

Personal Claude Code plugin marketplace - skills, commands, and agents for maximum productivity.

## Installation

Add this marketplace from GitHub:

```bash
claude plugin marketplace add kriscard/kriscard-claude-plugins
```

Install plugins you need:

### Essential (recommended for all environments but may require some local configuration)

```bash
claude plugin install essentials@kriscard           # Core workflow tools
claude plugin install developer-tools@kriscard      # Coding agents
claude plugin install testing@kriscard              # Test specialists
claude plugin install assistant@kriscard            # Staff Engineer workflow assistant
claude plugin install til@kriscard                  # TIL documentation
claude plugin install architecture@kriscard         # System design
claude plugin install obsidian-second-brain@kriscard # Knowledge management
```

### Optional (install based on your workflow)

```bash
claude plugin install ideation@kriscard             # Brain dumps → specs
claude plugin install content@kriscard              # Blog posts & talks
claude plugin install ai-development@kriscard       # LLM/RAG tools
claude plugin install neovim-advisor@kriscard       # Neovim optimization
claude plugin install dotfiles-optimizer@kriscard   # Dotfiles analysis
claude plugin install studio-startup@kriscard       # Project startup orchestration
claude plugin install interactive-learning@kriscard # Learning tutorials
```

### Updating Plugins

To get the latest plugin changes, manually clear the cache:

```bash
rm -rf ~/.claude/plugins/cache/kriscard
```

Then reinstall the plugins you need. This workaround is needed because Claude Code's automatic plugin updates don't always work correctly ([tracking issue](https://github.com/anthropics/claude-code/issues/17361)).

## Using with Pi

This repo is also a [Pi](https://github.com/mariozechner/pi-coding-agent) package. Install it directly:

```bash
pi install git:github.com/kriscard/kriscard-claude-plugins
```

Pi has some discrepancies with Claude Code and some tools needs to be polyfilled for full compatibility , Thanks Nick Nisi once again for `pi/extensions/claude-compat.ts` wich will allow Claude Code compatibility with PI for differents tools like `AskUserQuestion`, `WebFetch`, `WebSearch`, `TodoWrite`, and file-backed `Task*` tools.

For skills that rely on Claude Code's `Task`/`Agent` subagent workflow, you must install `pi-subagents` once:

```bash
pi install npm:pi-subagents
```

## Plugins

| Plugin | Description | How to Use |
|--------|-------------|------------|
| [essentials](./plugins/essentials) | Core workflow tools - commits, specs, PRs, and workflow enforcement | **Commands:** `/commit`, `/spec`, `/deep-spec`, `/issue`, `/pr`, `/analyze-repo`, `/de-slopify`<br>**Auto-enforces:** Skill usage across all interactions |
| [assistant](./plugins/assistant) | Engineer workflow assistant - standups, career tracking, quality checks, context management | **Commands:** `/standup`, `/weekly-summary`, `/quality-check`, `/context-save`, `/context-restore`, `/staff-progress`<br>**Auto-suggests:** Actions after commits/PRs, learning from your patterns |
| [ideation](./plugins/ideation) | Transform brain dumps into structured implementation artifacts | **Commands:** `/ideation`, `/validate-output`<br>**Workflow:** Confidence → Questions → Contract → PRDs → Specs |
| [content](./plugins/content) | Blog posts, documentation, and conference talks | **Commands:** `/write-blog`, `/create-talk`<br>**Natural language:** "Write a blog about...", "Help me document..." |
| [architecture](./plugins/architecture) | System design, technical leadership, and architecture documentation | **Commands:** `/arch-doc`, `/check-spec`, `/explain-codebase`, `/create-sprint-plan`<br>**Skills:** Senior architect, CTO advisor, product strategist |
| [ai-development](./plugins/ai-development) | LLM/RAG development and prompt engineering | **Commands:** `/deep-analyze`<br>**Skills:** AI engineer, prompt engineer |
| [developer-tools](./plugins/developer-tools) | Coding, frontend, and debugging specialists | **Commands:** `/react-patterns` (audit), `/pr-review` (PR audit chain)<br>**Natural language:** "Build a login form", "Fix this bug" — routes to the right specialist (frontend-developer, typescript-coder, nextjs-developer, debugger, coder, refactoring, security)<br>**Skill:** `react-patterns` auto-triggers on React audits (12 thematic references + universal checks) |
| [testing](./plugins/testing) | Unit, integration, and E2E testing | **Commands:** `/test-suite` (runs all layers)<br>**Agents:** Unit, integration, automation test developers |
| [neovim-advisor](./plugins/neovim-advisor) | Neovim configuration optimization and best practices | **Commands:** `/nvim-check-config`, `/nvim-perf`, `/nvim-plugins`, `/nvim-lsp`<br>**Natural language:** "Optimize my neovim config", "Why is startup slow?" |
| [dotfiles-optimizer](./plugins/dotfiles-optimizer) | Analyze and optimize dotfiles with security checks and modern tool recommendations | **Commands:** `/dotfiles-optimize`, `/dotfiles-audit`<br>**Natural language:** "Check my dotfiles", "Optimize my shell config" |
| [obsidian-second-brain](./plugins/obsidian-second-brain) | Obsidian vault manager - PARA, daily workflows, OKR tracking | **Commands:** `/daily-startup`, `/close-day`, `/process-inbox`, `/review-okrs`, `/maintain-vault`, `/extract-ideas`, `/weekly-learnings`, `/learned`, `/money`, `/spot-drift`, `/find-ideas`, `/connect-notes`<br>**Auto-runs:** Daily note reminder on startup |
| [studio-startup](./plugins/studio-startup) | Complete startup workflow orchestration from idea to MVP - coordinates product strategy, requirements, tech stack selection, architecture, and implementation across web, mobile, API, and CLI projects | **Commands:** `/studio-startup:new`<br>**Natural language:** "Start a project", "New startup", "Build an MVP", "Create an app"<br>**Workflow:** Strategy → Requirements → Tech → Validation → Design → Implementation |
| [til](./plugins/til) | Create TIL (Today I Learned) documentation notes in Obsidian from session learnings | **Commands:** `/til`, `/til "Project Name"`<br>**Auto-creates:** Engaging story-like notes with architecture diagrams, code snippets, and lessons learned |
| [interactive-learning](./plugins/interactive-learning) | Interactive tutorial system for learning technologies through guided Q&A with documentation fetching | **Commands:** `/learn <topic>`, `/learn done`<br>**Natural language:** "Learn React hooks", "Teach me TypeScript generics"<br>**Creates:** Obsidian learning notes with concepts and code examples |

**Legend:** Commands use `/command` syntax. Natural language triggers work automatically. ⭐ marks primary entry points.

## Development

Quick start for contributing:

```bash
pnpm install                                          # Install dependencies
pnpm run create-plugin my-plugin --description "..."  # Create new plugin
pnpm run sync                                         # Update marketplace.json
pnpm run typecheck                                    # Type check
pnpm run format                                       # Format code
```

### Plugin Structure

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json      # Manifest (required)
├── README.md            # Documentation (required)
├── commands/            # Slash commands (*.md)
├── skills/              # Skills (*/SKILL.md)
├── agents/              # Agents (*.md)
└── hooks/               # Event hooks (hooks.json)
```

The `pnpm run sync` command auto-discovers, validates, and updates the marketplace manifest.

## License

MIT
