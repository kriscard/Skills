---
name: shell-env
description: >-
  Stow-first shell environment editing for zsh, aliases, tmux/sesh, Starship,
  Ghostty, yabai, Git, and dotfiles packages. Use when the user wants to add or
  change terminal config, aliases, shell startup, or Stow-managed symlinks.
  Route Neovim-specific work to neovim and whole-system health checks to audit.
---

# Shell & Terminal Environment

All config is managed with **GNU Stow** from `~/.dotfiles`. Never edit files directly in `~` — always edit the source in `~/.dotfiles` and let Stow manage the symlinks.

## Config Locations

| Tool | Source path | Symlinked to |
|---|---|---|
| Zsh | `~/.dotfiles/zsh/.zshrc` | `~/.zshrc` |
| Zsh modules | `~/.dotfiles/zsh/zsh.d/` | `~/.zsh.d/` |
| Ghostty | `~/.dotfiles/.config/ghostty/config` | `~/.config/ghostty/config` |
| Tmux | `~/.dotfiles/.config/tmux/tmux.conf` | `~/.config/tmux/tmux.conf` |
| Starship | `~/.dotfiles/.config/starship.toml` | `~/.config/starship.toml` |
| yabai | `~/.dotfiles/.config/yabai/yabairc` | `~/.config/yabai/yabairc` |

## Stow-first edit loop

1. Locate the source file under `~/.dotfiles`.
2. Inspect the current config before changing it; do not rely on remembered theme/font values.
3. Edit only the source file, never the symlink target in `~`.
4. Run the safest verification for the tool:
   - zsh: `zsh -n <file>` or open a new interactive shell
   - tmux: `tmux source ~/.config/tmux/tmux.conf`
   - Starship: `starship explain` or `starship timings`
   - Ghostty: inspect/reload config, then restart or use the app reload command when available
   - yabai: `yabai --restart-service`
   - Stow: `cd ~/.dotfiles && stow -n <package>` before relinking or restructuring
5. Report the source path changed, reload command, and verification result.

Done when the config change is live or the remaining manual reload step is explicit.

## GNU Stow Workflow

```sh
cd ~/.dotfiles

# Symlink a package (creates symlinks in home dir)
stow zsh

# Remove symlinks for a package (does NOT delete source files)
stow -D zsh

# Re-stow (unlink + relink, useful after restructuring)
stow -R zsh

# Dry run — see what would change without doing it
stow -n zsh
```

**When adding a new tool:**

1. Create a package directory: `mkdir ~/.dotfiles/<toolname>`.
2. Mirror the target directory structure inside it (e.g., `.config/ghostty/` for `~/.config/ghostty/`).
3. Add the config file.
4. Run `stow -n <toolname>` from `~/.dotfiles`, then `stow <toolname>` if the dry run is clean.

## Zsh: Modular Config

`~/.dotfiles/zsh/zsh.d/` holds modular files, sourced automatically by `.zshrc`. Add new functionality as separate files rather than growing `.zshrc`:

```text
zsh.d/
├── aliases.zsh       # all aliases
├── exports.zsh       # PATH and environment variables
├── functions.zsh     # shell functions
├── completions.zsh   # completion config
└── tools.zsh         # tool-specific init (zoxide, starship, etc.)
```

## Ghostty

Config at `~/.dotfiles/.config/ghostty/config`. Inspect the file for current theme and font before changing them.

Changes take effect on Ghostty restart (or `Cmd+Shift+,` to reload config on macOS).

## Tmux + sesh

Tmux config at `~/.dotfiles/.config/tmux/tmux.conf`. Session management via **sesh** — creates and attaches to named tmux sessions.

```sh
sesh connect <project>    # create or attach to a session
sesh list                 # list active sessions
```

When editing tmux config, reload without restart: `tmux source ~/.config/tmux/tmux.conf` or prefix + `r` if you have that binding.

## Starship Prompt

Config at `~/.dotfiles/.config/starship.toml`. Docs: `starship.rs/config`.

```sh
starship explain       # shows what each segment in current prompt means
starship timings       # shows how long each module took to render
```

## yabai

Window manager config typically at `~/.dotfiles/.config/yabai/yabairc`. Reload after changes:

```sh
yabai --restart-service
```

## References

| Priority | Load when | Reference |
|---|---|---|
| High | Modern CLI tools or shell aliases: eza, bat, fd, rg, zoxide, fzf, lazygit | `references/modern-cli-tools.md` |
| High | Terminal emulator, tmux/sesh, Starship, yabai, or theme consistency config | `references/terminal-config.md` |
| Medium | Git identity setup, multi-config, signing, or git aliases | `references/git-config.md` |

## Quick Reference

```sh
# Verify a symlink is correctly set up
ls -la ~/.zshrc              # should point to ~/.dotfiles/zsh/.zshrc

# Check all stow packages currently linked
ls ~/.dotfiles/              # each dir is a stow package

# Find broken symlinks in home dir
find ~ -maxdepth 3 -type l ! -e 2>/dev/null
```
