---
name: shell-env
description: >-
  Manages and edits the terminal/shell environment: zsh config, aliases, tmux,
  sesh session manager, starship prompt, Ghostty terminal, yabai window manager,
  and GNU Stow dotfile management. Make sure to use this skill whenever the user
  mentions "zsh config", "shell alias", "dotfiles", "tmux config", "starship
  prompt", "ghostty", "sesh", "yabai", "add to my dotfiles", "update my shell",
  stow a package, or anything about configuring their terminal or shell
  environment — even if they just say "how do I add this to my config".
---

# Shell & Terminal Environment

All config is managed with **GNU Stow** from `~/.dotfiles`. Never edit files directly in `~` — always edit the source in `~/.dotfiles` and let Stow manage the symlinks.

## Config Locations

| Tool | Source path | Symlinked to |
|------|-------------|-------------|
| Zsh | `~/.dotfiles/zsh/.zshrc` | `~/.zshrc` |
| Zsh modules | `~/.dotfiles/zsh/zsh.d/` | `~/.zsh.d/` |
| Ghostty | `~/.dotfiles/.config/ghostty/config` | `~/.config/ghostty/config` |
| Tmux | `~/.dotfiles/.config/tmux/tmux.conf` | `~/.config/tmux/tmux.conf` |
| Starship | `~/.dotfiles/.config/starship.toml` | `~/.config/starship.toml` |
| Neovim | `~/.dotfiles/.config/nvim/` | `~/.config/nvim/` |

## GNU Stow Workflow

```sh
cd ~/.dotfiles

# Symlink a package (creates symlinks in home dir)
stow zsh
stow nvim

# Remove symlinks for a package (does NOT delete source files)
stow -D zsh

# Re-stow (unlink + relink, useful after restructuring)
stow -R zsh

# Dry run — see what would change without doing it
stow -n zsh
```

**When adding a new tool:**
1. Create a package directory: `mkdir ~/.dotfiles/<toolname>`
2. Mirror the target directory structure inside it (e.g., `.config/ghostty/` for `~/.config/ghostty/`)
3. Add the config file
4. Run `stow <toolname>` from `~/.dotfiles`

## Zsh: Modular Config

`~/.dotfiles/zsh/zsh.d/` holds modular files, sourced automatically by `.zshrc`. Add new functionality as separate files rather than growing `.zshrc`:

```
zsh.d/
├── aliases.zsh       # all aliases
├── exports.zsh       # PATH and environment variables
├── functions.zsh     # shell functions
├── completions.zsh   # completion config
└── tools.zsh         # tool-specific init (zoxide, starship, etc.)
```

## Ghostty

Config at `~/.dotfiles/.config/ghostty/config`. Current theme: **Catppuccin Macchiato**, font: **MonoLisa**.

```
# Key config fields
theme = catppuccin-macchiato
font-family = MonoLisa
```

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
|----------|-----------|-----------|
| 1 — High | Modern CLI tools or shell aliases (eza, bat, fd, rg, zoxide) | `references/modern-cli-tools.md` |
| 2 — High | Terminal emulator, tmux, Neovim, or Catppuccin theme config | `references/terminal-config.md` |
| 3 — Medium | Git identity setup, multi-config, or git aliases | `references/git-config.md` |

## Quick Reference

```sh
# Verify a symlink is correctly set up
ls -la ~/.zshrc              # should point to ~/.dotfiles/zsh/.zshrc

# Check all stow packages currently linked
ls ~/.dotfiles/              # each dir is a stow package

# Find broken symlinks in home dir
find ~ -maxdepth 3 -type l ! -e 2>/dev/null
```
