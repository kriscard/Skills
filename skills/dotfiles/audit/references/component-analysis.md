# Component-Specific Analysis Reference

Detailed analysis guidance for each dotfiles component. Referenced by the dotfiles-optimizer skill during targeted or full-scope analysis.

## Shell (Zsh)

Analyze the modular configuration in `zsh/zsh.d/`:

| File | Purpose | Key Checks |
|------|---------|------------|
| `00-env.zsh` | Environment variables | Exposed credentials |
| `10-options.zsh` | Shell options | Validate settings |
| `20-completions.zsh` | Completion system | Performance, caching |
| `30-plugins.zsh` | Plugin loading | Slow plugins, lazy loading |
| `40-lazy.zsh` | Lazy loading patterns | Validate implementation |
| `50-keybindings.zsh` | Key mappings | Conflicts |
| `60-aliases.zsh` | Aliases | Modern tool alternatives |
| `70-functions.zsh` | Functions | Optimize complex functions |
| `80-integrations.zsh` | External integrations | Validate configurations |
| `99-local.zsh.example` | Local overrides | Security |

**Key checks**:
- Startup time profiling (should be <500ms)
- Plugin lazy loading opportunities
- Modern aliases (eza, bat, fd, ripgrep, zoxide)
- Secure environment variable handling

## Editor (Neovim)

Analyze `.config/nvim/`:
- LSP configurations (validate server setups)
- Plugin management (check for outdated or conflicting plugins)
- Performance (startup time, lazy loading)
- Keybindings (identify conflicts)

## Multiplexer (Tmux)

Analyze `.config/tmux/`:
- Plugin configuration
- Keybinding sanity
- Performance settings
- Integration with sesh session manager

## Git

Analyze git configuration files:
- `.gitconfig` - Main configuration
- `.gitconfig-personal` - Personal settings
- `.gitconfig-work` - Work settings
- Check for exposed credentials
- Validate signing configuration
- Suggest workflow improvements

## Terminal (Kitty/Ghostty)

Analyze `.config/kitty/` and `.config/ghostty/`:
- Theme consistency (Catppuccin Macchiato)
- Font configuration
- Performance settings
- Key mappings

## Modern Tool Recommendations

Reference these tool replacements (from user's existing setup):

| Traditional | Modern Alternative | User Has | Benefit |
|-------------|-------------------|----------|---------|
| `ls` | `eza` | Yes | Git integration, icons |
| `cat` | `bat` | Yes | Syntax highlighting |
| `find` | `fd` | Yes | Faster, simpler syntax |
| `grep` | `ripgrep` | Yes | Blazing fast search |
| `cd` | `zoxide` | Yes | Smart jumping |

Validate these are properly aliased and configured. Suggest additional modern tools if relevant.

## Security Validation

Always check for:
1. **Exposed credentials**: API keys, tokens, passwords in plain text
2. **File permissions**: Sensitive files should be 600 (user read/write only)
3. **History settings**: Ensure sensitive commands aren't logged
4. **Git safety**: Validate `.gitignore` patterns for secrets
5. **Environment files**: Check `.env` vs `.env.example` patterns

## Performance Optimization

Check for:
1. **Shell startup time**: Profile and identify slow components
2. **Lazy loading**: Defer loading of tools not used in every session
3. **Completion caching**: Validate completion cache strategies
4. **Plugin efficiency**: Identify slow or redundant plugins
