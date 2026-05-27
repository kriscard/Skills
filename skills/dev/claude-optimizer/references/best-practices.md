> **Read this when:** optimizing CLAUDE.md structure, deciding what to include or exclude, or checking token budget rules and formatting best practices.

# Claude Code Best Practices

Quick reference for optimizing Claude Code workflows.

## CLAUDE.md Guidelines

### Keep It Concise
- Under 500 lines ideally
- Actionable instructions, not documentation
- Focus on project-specific context

### Essential Sections

```markdown
# Project Name

Brief description (1-2 sentences)

## Quick Commands
- `npm run dev` - Start development
- `npm test` - Run tests

## Architecture
Key patterns and conventions

## Guidelines
Project-specific rules for Claude
```

### What to Include
- Build and test commands
- Project structure overview
- Coding conventions specific to project
- External API or service context
- Environment variable requirements

### What to Avoid
- Full API documentation
- Detailed tutorials
- Information available in README
- Generic coding advice

## Settings Optimization

### Recommended settings.json

```json
{
  "autoAllowedTools": [
    "Read",
    "Glob",
    "Grep",
    "LSP"
  ],
  "env": {
    "CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR": "1"
  }
}
```

### Auto-Allowed Tools
Consider allowing based on trust level:
- **High trust**: Edit, Write, Bash
- **Medium trust**: Read, Glob, Grep, LSP
- **Low trust**: None (review each)

## Skill Patterns

### Skill Structure
```
.claude/skills/my-skill/
├── SKILL.md          # Instructions (60-100 lines)
├── scripts/          # Helper scripts
└── references/       # Supporting docs
```

### SKILL.md Template
```yaml
---
name: skill-name
description: One-line description
tools: Read, Edit, Bash
model: sonnet
---

# Skill Name

Purpose and when to use.

## Process
1. Step one
2. Step two

## Quick Reference
Key patterns or commands
```

### Model Selection
- `sonnet`: Execution tasks, coding, fast responses
- `opus`: Strategic reasoning, complex analysis
- `haiku`: Simple tasks, cost optimization

## Agent Patterns

### Agent vs Skill Decision
| Use Case | Agent | Skill |
|----------|-------|-------|
| Long-running task | Yes | No |
| Needs MCP servers | Yes | No |
| Simple workflow | No | Yes |
| Bundled resources | No | Yes |

### Agent File Structure
```yaml
---
name: agent-name
model: sonnet
tools: All
---

Instructions for the agent...
```

## Slash Command Patterns

### Command Location
`.claude/commands/command-name.md`

### Variables Available
- `$ARGUMENTS` - All arguments
- `$1`, `$2`, etc. - Positional arguments

### Example Command
```markdown
---
name: review
description: Code review current changes
---

Review the following changes:
$ARGUMENTS

Focus on:
- Code quality
- Potential bugs
- Performance
```

## Common Optimizations

### Reduce Context Usage
1. Use specific file paths instead of searching
2. Leverage LSP for code navigation
3. Run Explore agents for broad searches

### Speed Up Workflows
1. Auto-allow safe tools (Read, Glob, Grep)
2. Create skills for repeated tasks
3. Use agents for complex multi-step work

### Improve Output Quality
1. Provide clear project context in CLAUDE.md
2. Include examples of preferred patterns
3. Document project-specific conventions

## CLI Tool Preferences

When detected in your environment, prefer:

| Instead of | Use |
|-----------|-----|
| `find` | `fd` |
| `grep` | `ripgrep (rg)` |
| `cat` | `bat` |
| `ls` | `eza` |
| `cd` | `zoxide (z)` |

## Troubleshooting

### Slow Performance
- Check for large files in context
- Use `--current-project` flag in analyze.sh
- Clear old conversation history

### Missing Context
- Ensure CLAUDE.md exists
- Check settings.json configuration
- Verify project hash matches

### Tool Errors
- Check tool permissions in settings
- Verify required CLIs installed (jq, gh)
- Review sandbox restrictions
