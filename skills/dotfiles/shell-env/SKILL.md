---
name: shell-env
description: >-
  Edit the Stow-managed shell and terminal environment in ~/.dotfiles/home,
  including zsh, aliases, tmux/sesh, Starship, Ghostty, yabai, Git, and link
  structure. Use for focused terminal configuration changes. Route Neovim work
  to neovim and whole-system health checks to audit.
---

# Shell and terminal environment

The repository uses one GNU Stow package at `~/.dotfiles/home/`. Edit sources under that directory; `~/.dotfiles/README.md`, `dotfiles --help`, and the current symlink targets are authoritative when layout differs from this document.

## Current source locations

| Tool | Source |
|---|---|
| Zsh | `~/.dotfiles/home/.zshrc` and `~/.dotfiles/home/zsh/zsh.d/` |
| Ghostty | `~/.dotfiles/home/.config/ghostty/config` |
| Tmux | `~/.dotfiles/home/.config/tmux/tmux.conf` |
| Starship | `~/.dotfiles/home/.config/starship.toml` |
| yabai | `~/.dotfiles/home/.config/yabai/yabairc` |
| Git | `~/.dotfiles/home/.gitconfig*` |

Confirm a target with `readlink` or `ls -ld` before structural work.

## Stow-first edit loop

1. Locate and inspect the source under `~/.dotfiles/home/`.
2. Edit the source rather than the home-directory link.
3. Run the narrowest syntax or behavior check for the changed tool.
4. If link structure changed, run `dotfiles sync --dry-run`, inspect every proposed operation, then run `dotfiles sync`.
5. Reload the smallest affected component.
6. Report the source path, verification result, and reload or remaining manual step.

Done when the source owns the intended home path, syntax and behavior checks pass, and the live configuration is reloaded or the remaining manual action is explicit.

## Link workflow

Use the repository CLI rather than inventing per-tool Stow packages:

```sh
cd ~/.dotfiles
dotfiles sync --dry-run
dotfiles sync
```

For conflicts or unclear behavior, inspect `dotfiles --help`, `README.md`, and the `home/` tree before changing links. The current layout has one `home` package, so link work goes through `dotfiles sync` rather than per-tool Stow commands.

## Tool verification

### Zsh

Validate the edited module and then the complete startup path:

```sh
zsh -n ~/.dotfiles/home/.zshrc
zsh -n ~/.dotfiles/home/zsh/zsh.d/<module>.zsh
zsh -i -c exit
```

Preserve the numeric module order and inspect dependencies before moving code between files.

### Ghostty

Inspect the current config for accepted syntax, theme, and font before editing. Reload through the installed Ghostty version or restart the app, then verify the changed setting visually or through available diagnostics.

### Tmux and sesh

```sh
tmux source-file ~/.config/tmux/tmux.conf
sesh list
```

Capture reload errors. Preserve the configured TPM directory and ensure the plugin manager initializes once.

### Starship

```sh
starship explain
starship timings
```

Use the current prompt to verify the affected module.

### yabai

```sh
yabai --restart-service
```

Verify the changed rule or behavior after restart rather than treating service restart as sufficient.

## References

| Priority | Load when | Reference |
|---|---|---|
| High | Adding aliases or evaluating modern CLI alternatives | `references/modern-cli-tools.md` |
| High | Changing Ghostty, tmux/sesh, Starship, yabai, or cross-tool theme configuration | `references/terminal-config.md` |
| High | Changing Git identity, signing, conditional includes, pager, or aliases | `references/git-config.md` |

## Quick checks

```sh
readlink ~/.zshrc
readlink ~/.config/ghostty/config
cd ~/.dotfiles && dotfiles sync --dry-run
find ~ -maxdepth 3 -type l ! -e 2>/dev/null
```
