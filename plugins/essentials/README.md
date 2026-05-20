# Essentials Plugin

Core workflow tools for daily development - commits, research, deep thinking, PRs, and discipline enforcement.

## Installation

```bash
/plugin marketplace add kriscard/kriscard-claude-plugins
/plugin install essentials@kriscard
```

## What's Included

### Commands

| Command | Description |
|---------|-------------|
| `/commit` | Create semantic git commits with conventional format |
| `/spec` | Quick spec from ticket/prompt (1-2 questions) |
| `/deep-spec` | Thorough spec with 4 rounds of interviews |
| `/issue` | Analyze ticket, implement fix on dedicated branch |
| `/pr` | Quick PR creation with structured template |
| `/analyze-repo` | Comprehensive repo analysis — generates CLAUDE.md and REPO_ANALYSIS.md |
| `/de-slopify` | Remove AI-generated code slop from your branch |

### Agents

| Agent | Description |
|-------|-------------|
| `git-committer` | Semantic commits with pre-commit hook handling |
| `researcher` | Research docs, APIs, frameworks, best practices |
| `context-manager` | Manage context across agents and long-running tasks |
| `code-simplifier` | Refactor code without changing behavior |

## Usage Examples

### Semantic Commits
```
/commit
```
Analyzes changes, creates semantic commit message following conventional commits.

### Remove AI Slop
```
/de-slopify main
```
Compares your branch against main and removes AI-generated code patterns.

### Quick PR
```
/pr
```
Creates a pull request with structured summary, motivation, and notes.

## Philosophy

- **Proactive Intelligence** - Agents activate automatically when needed
- **Clear Skill Triggers** - Each skill has domain-prefixed descriptions for reliable activation
- **Context Preservation** - context-manager maintains coherence across sessions
