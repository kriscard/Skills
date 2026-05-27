# Modern CLI Tools

Modern alternatives for common Unix tools — faster, more ergonomic, better defaults.

## Core Replacements

**eza (replaces ls)**
- **Benefit**: Git integration, icons, better formatting
- **Configuration**: `alias ls='eza --icons --group-directories-first'`
- **Advanced**: `alias ll='eza -lah --icons --git'` shows git status inline
- **Why**: 3-5x faster, colored output, tree view built-in

**bat (replaces cat)**
- **Benefit**: Syntax highlighting, line numbers, git integration
- **Configuration**: `alias cat='bat --paging=never'`
- **Theme**: Match terminal theme (e.g., Catppuccin)
- **Why**: Readable code viewing, integrated pager

**fd (replaces find)**
- **Benefit**: 5-10x faster, simpler syntax, respects .gitignore
- **Usage**: `fd pattern` instead of `find . -name "pattern"`
- **Configuration**: `alias find='fd'` for transparent replacement
- **Why**: Intuitive defaults, parallel execution

**ripgrep (replaces grep)**
- **Benefit**: 10-100x faster, respects .gitignore, multi-line search
- **Usage**: `rg pattern` instead of `grep -r pattern`
- **Configuration**: Use config file at `~/.config/ripgrep/ripgreprc`
- **Why**: Blazing speed, smart defaults

**zoxide (replaces cd)**
- **Benefit**: Frecency-based jumping, interactive selection
- **Setup**: `eval "$(zoxide init zsh)"`
- **Usage**: `z project` jumps to frequently used directory
- **Why**: Eliminates repetitive directory navigation

## Additional Modern Tools

**starship** - Fast, customizable prompt
- Cross-shell compatible (zsh, bash, fish)
- 10-50x faster than Powerlevel10k
- Minimal configuration with great defaults

**delta** - Better git diffs
- Syntax highlighting for diffs
- Side-by-side comparison
- Integrates with bat themes

**lazygit** - Terminal UI for git
- Visual interface for complex operations
- Keyboard-driven workflow
- Better than raw git for interactive work
