# CLAUDE.md

This is a Claude Code plugin marketplace repository.

## Requirements

Node.js ≥ 18, pnpm ≥ 9

## Repository Structure

```
kriscard-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json         # Marketplace manifest (auto-generated)
├── plugins/
│   ├── ai-development/          # LLM/RAG, prompt engineering
│   ├── architecture/            # System design, ADRs, C4 diagrams
│   ├── assistant/               # Personal assistant, status tracking
│   ├── content/                 # Blog posts, docs, conference talks
│   ├── developer-tools/         # Coding agents (TS, React, Next.js, debugger, reviewer)
│   ├── dotfiles-optimizer/      # Shell config audit and optimization
│   ├── essentials/              # Core workflow tools (commit, researcher, simplifier)
│   ├── ideation/                # Brain dump → contracts → PRDs → specs
│   ├── interactive-learning/    # /learn sessions with Excalidraw diagrams
│   ├── neovim-advisor/          # Neovim config validation and optimization
│   ├── obsidian-second-brain/   # PARA, OKR tracking, vault maintenance
│   ├── studio-startup/          # End-to-end startup workflow
│   ├── testing/                 # Unit, integration, E2E test agents
│   └── til/                     # Today I Learned capture
├── scripts/
│   └── sync-marketplace.ts      # Auto-sync script
└── package.json
```

## Plugin Structure

Each plugin follows this structure (per [Anthropic plugin spec](https://code.claude.com/docs/en/plugins-reference)):

```
plugins/<name>/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest (only file in here)
├── README.md                    # Plugin documentation
├── skills/                      # Skills as <name>/SKILL.md (preferred)
├── commands/                    # Slash commands for explicit user-controlled workflows (.md files)
├── agents/                      # Subagent definitions (*.md)
├── hooks/                       # Event handlers (hooks.json)
├── monitors/                    # Background monitors (v2.1.105+)
├── .mcp.json                    # MCP server configurations
└── settings.json                # Default settings (e.g., default agent)
```

### Frontmatter rules (verified against official docs)

**Skills (`SKILL.md`):**
- Required: `name`, `description`
- Recommended: trigger phrases in description ("Use when..." / "Make sure to use this skill whenever...")
- Optional: `paths` (glob auto-activation), `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `effort`
- Description budget: combined `description` + `when_to_use` truncated at **1,536 characters**

**Agents (in `agents/`):**
- Required: `name`, `description`
- Optional: `tools`, `disallowedTools`, `model` (default `inherit`), `color`, `effort`, `skills` (preload)
- **NOT supported on plugin-shipped agents:** `mcpServers`, `hooks`, `permissionMode` (silently ignored — security restriction)
- Default `model: inherit` respects user session preference. Use `model: haiku` only for genuinely lightweight read-only agents.

## Development Commands

```bash
pnpm install                                          # Install dependencies
pnpm run create-plugin <name> --description "..."     # Create new plugin
pnpm run sync                                         # Update marketplace.json from plugins
pnpm run typecheck                                    # Type check TypeScript files
pnpm run format                                       # Format all files
pnpm run format:check                                 # Verify formatting (CI)
```

## Adding Content

When adding new skills, commands, or agents:

1. Place files in the correct plugin directory
2. Follow existing patterns for file structure
3. Run `pnpm run sync` to update the marketplace
4. Test locally with `claude --plugin-dir ./plugins/<name>`

## Naming Conventions

- Plugin names: kebab-case (e.g., `developer-tools`)
- Command files: kebab-case.md (e.g., `analyze-repo.md`)
- Skill directories: kebab-case (e.g., `blog-writer/`)
- Agent files: kebab-case.md (e.g., `code-simplifier.md`)
- Skills and agents must not share names (e.g., don't have a `frontend-developer` skill if a `frontend-developer` agent exists)
- Avoid redundant suffixes (`skill`, `agent`) in names — the directory already conveys the type

## Skill Architecture

Skills use progressive disclosure: lean SKILL.md body + lazy-loaded references.

- **SKILL.md body** under 500 lines — universal/always-fire content inline, deep content in `references/`
- **`references/<topic>.md`** files — the model decides what to load via the routing table in SKILL.md
- **References do NOT auto-load** — the model must call Read on them; the routing table is what makes that decision
- **Each reference starts with `> **Read this when:** ...`** so the model can verify it picked the right file
- **Split large references by user intent (thematic)**, not by vendor or priority (e.g., `waterfalls.md`, not `vercel-rules.md`)
- **Canonical example:** `plugins/developer-tools/skills/react-patterns/SKILL.md`

## Orchestration Philosophy

This marketplace uses **context-appropriate orchestration** - different patterns for different plugin types.

### Orchestration Patterns

| Pattern | When to Use | Entry Point | Example Plugin |
|---------|-------------|-------------|----------------|
| **Skill-based** | Workflow should start implicitly on user intent | Natural language | `ideation`, `content` |
| **Command-based** | Users need explicit control over workflow | `/command` | `obsidian-second-brain` |
| **Hybrid** | Need both implicit and explicit entry points | Skills + Commands | `architecture`, `ai-development` |
| **Agent-only** | Components work independently, no coordination needed | Context-based | `developer-tools`* |

*Developer-tools is agent-only. Slash commands handle explicit multi-step workflows (`/react-patterns`, `/pr-review`); the model picks the right specialist agent for direct requests.

### Design Principles

1. **Single Responsibility**: Orchestrators coordinate, they don't do the work
2. **Progressive Enhancement**: Components work alone, orchestrator provides "happy path"
3. **Clear Entry Points**: Obvious what to invoke and when
4. **User Control**: Can always access components directly if preferred

### When to Add Orchestration

Add an orchestrator when:
- ✅ Multiple components must coordinate to complete a workflow
- ✅ Users need guidance on which component to use
- ✅ Complex multi-step processes benefit from automation
- ✅ Workflow has a clear "entry point" that makes sense to users

Skip orchestration when:
- ❌ Components work perfectly fine independently
- ❌ Orchestration adds complexity without value
- ❌ Users know exactly which specialist they need
- ❌ The "orchestrator" just routes to agents — the model picks specialists from clear descriptions, and routing skills add a layer of indirection (the Anthropic official marketplace ships zero orchestrator skills). Use slash commands for explicit multi-step chains instead.

See [docs/ORCHESTRATION-PATTERNS.md](./docs/ORCHESTRATION-PATTERNS.md) for detailed guidance and examples.

## Practices

- **Test before committing non-trivial changes** — file integrity check, cross-reference validation, `pnpm run typecheck`. For skill routing changes, run an eval (spawn 6-8 subagents with the skill loaded, verify each loads the expected reference).
- **When architectural debate gets complex, check the industry pattern.** The Anthropic official marketplace ships focused single-purpose plugins, not orchestrators. Top community plugins succeed at one job done well. Simpler is usually right.
- **Layer-appropriate tooling:** skills for auto-triggered domain expertise (audit, advisory), agents for execution specialists (build, debug, refactor), slash commands for explicit user-controlled multi-step workflows. Pick the right layer — don't stack.
