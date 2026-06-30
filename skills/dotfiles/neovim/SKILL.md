---
name: neovim
description: >-
  Neovim config healthcheck for ~/.dotfiles/.config/nvim/ using lazy.nvim and
  GNU Stow. Use when the user wants to validate or repair Neovim, add/remove
  plugins, diagnose startup performance, fix keymaps/LSP, or modernize config.
  Prefer audit for whole-dotfiles reviews and shell-env for non-Neovim terminal
  config.
---

# Neovim Configuration

Config lives at `~/.dotfiles/.config/nvim/`, symlinked by GNU Stow, namespaced under `kriscard/`. Plugin manager is **lazy.nvim**.

## Config Location

```text
~/.dotfiles/.config/nvim/
├── init.lua                  # Entry point — sources all modules
├── lua/kriscard/
│   ├── core/
│   │   ├── options.lua       # vim.opt settings
│   │   ├── keymaps.lua       # vim.keymap.set with {desc = "..."}
│   │   └── autocmds.lua      # autocommands
│   └── plugins/              # lazy.nvim plugin specs (one file per plugin or group)
│       └── *.lua
```

Stow package: `cd ~/.dotfiles && stow nvim` (or whatever the package name is — check `ls ~/.dotfiles`).

## First: classify the branch

- Healthcheck or broken config → use Key Workflows; load `references/config.md` if needed.
- Plugin add/remove/replacement → load `references/plugins.md`.
- Startup/performance → load `references/performance.md`.
- Whole-dotfiles health issue → route to audit; non-Neovim terminal config → route to shell-env.

Do not load all references.

## Key Workflows

### Validate config

```vim
:checkhealth          " full diagnostic
:checkhealth lazy     " plugin manager health
:checkhealth nvim-treesitter
:Lazy                 " plugin status dashboard
```

Done when health output is captured, any failing provider/plugin is named, and each issue has a fix or next diagnostic command.

### Add a plugin

1. Create or edit a file in `lua/kriscard/plugins/`.
2. Return a lazy.nvim spec table.
3. Save — lazy.nvim auto-detects changes on next start, or run `:Lazy sync`.
4. Run `:checkhealth <plugin>` when the plugin provides health checks.

Done when the spec is in the Stow-managed source path, lazy.nvim can sync/load it, and any keymaps/commands include lazy-load boundaries.

### Diagnose performance

Run `:Lazy profile` to see per-plugin load times. For CLI measurement:

```sh
nvim --headless --startuptime /tmp/nvim.log +q && sort -k2 -n /tmp/nvim.log | tail -20
```

Done when before/after startup measurements are recorded, top slow plugins or config files are named, and each recommendation maps to a lazy.nvim `event`, `cmd`, `keys`, or `ft` boundary or is marked needs deeper profiling.

### Fix broken plugin

Move from least destructive to most destructive:

1. `:Lazy log` — inspect recent install/update errors.
2. `:messages` — capture Lua errors after startup.
3. `:Lazy sync` — retry install/update when the error indicates missing or stale plugin state.
4. `:Lazy clean` — remove unused plugins only after confirming they are no longer referenced.
5. Delete `~/.local/share/nvim/lazy/<plugin>` only as a last resort to force reinstall.

Done when the error is reproduced or log output is captured, the least destructive applicable repair has run, and the next startup/checkhealth result is recorded.

## Quick Checks (run on every audit)

- [ ] Plugins use `opts = {}` instead of `config = function() require("x").setup({}) end` where possible
- [ ] Keymaps include `{desc = "..."}` for which-key integration
- [ ] LSP plugins are not loaded eagerly (use `event = "BufReadPre"`)
- [ ] No duplicate keymaps (`:verbose map <key>` to check)
- [ ] `vim.loader.enable()` called in `init.lua` (bytecode cache, free perf)

Completion gate: do not declare Neovim work done until the changed source path, validation command, and result are reported.

## References

| Priority | Load when | Reference |
|---|---|---|
| High | Plugin recommendations, modern picks, what to add/remove, abandoned plugins | `references/plugins.md` |
| High | Startup time, lazy-loading strategies, profiling, which plugins are slow | `references/performance.md` |
| Medium | Config structure, best practices, common mistakes, keymaps, LSP setup | `references/config.md` |
