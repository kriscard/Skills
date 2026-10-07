> **Read this when:** The user is changing Ghostty, tmux/sesh, Starship, yabai, or cross-tool theme configuration. Route Neovim-specific work to neovim.

# Terminal configuration

Inspect current files under `~/.dotfiles/home/.config/` before choosing values. Fonts, theme names, plugin paths, bindings, and supported options belong to the installed versions, not a generic template.

## Ghostty

Edit `home/.config/ghostty/config`. Preserve the file's existing syntax and confirm option names against the installed Ghostty version. Reload or restart, then verify the changed rendering or behavior.

## Tmux and sesh

Edit `home/.config/tmux/tmux.conf`. The current setup keeps TPM under `~/.config/tmux/plugins`; preserve the configured `TMUX_PLUGIN_MANAGER_PATH` and initialize TPM once.

After changes:

```sh
tmux source-file ~/.config/tmux/tmux.conf
sesh list
```

Inspect reload output, key-table ownership, plugin load state, and session behavior relevant to the change. Resolve duplicate TPM initialization instead of adding another generic `~/.tmux/plugins/tpm/tpm` line.

## Starship

Edit `home/.config/starship.toml`. Verify syntax and rendered module behavior:

```sh
starship explain
starship timings
```

## yabai

Edit `home/.config/yabai/yabairc`, restart the service, then exercise the changed rule:

```sh
yabai --restart-service
```

## Theme consistency

Treat the current `THEME_FLAVOUR` flow and checked-in theme files as the source of truth. Before changing a shared flavor, find every consumer:

```sh
rg -n 'THEME_FLAVOUR|catppuccin|macchiato|frappe|latte|mocha' ~/.dotfiles/home
```

Classify consumers that interpolate a shared value separately from tools that require a fixed theme name or generated file. Verify each changed tool; a shared environment variable does not prove every application consumed it.

## Completion gate

Done when the installed tool accepts the source, the smallest affected component reloads without error, and the exact setting or interaction is verified live.