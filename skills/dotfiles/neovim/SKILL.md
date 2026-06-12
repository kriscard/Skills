---
name: neovim
description: >-
  Validates, audits, and improves Neovim configuration in ~/.dotfiles/.config/nvim/
  (GNU Stow managed, lazy.nvim, namespaced under kriscard/). Covers adding plugins,
  diagnosing broken configs, resolving performance issues, fixing keymaps, and
  applying 2025/2026 best practices. Make sure to use this skill whenever the user
  mentions "neovim config", "nvim plugin", "lazy.nvim", "add a plugin", "neovim not
  working", "neovim performance", "nvim keymaps", "validate my neovim setup", or
  anything about configuring or troubleshooting Neovim — even if they just say
  "my neovim is slow" or "how do I add X to neovim".
---

# Neovim Configuration

Config lives at `~/.dotfiles/.config/nvim/`, symlinked by GNU Stow, namespaced under `kriscard/`. Plugin manager is **lazy.nvim**.

## Config Location

```
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

## Key Workflows

### Validate config

```vim
:checkhealth          " full diagnostic
:checkhealth lazy     " plugin manager health
:checkhealth nvim-treesitter
:Lazy                 " plugin status dashboard
```

### Add a plugin

1. Create or edit a file in `lua/kriscard/plugins/`
2. Return a lazy.nvim spec table
3. Save — lazy.nvim auto-detects changes on next start, or run `:Lazy sync`
4. Run `:checkhealth <plugin>` to verify

### Diagnose performance

Run `:Lazy profile` to see per-plugin load times. For CLI measurement:

```sh
nvim --headless --startuptime /tmp/nvim.log +q && sort -k2 -n /tmp/nvim.log | tail -20
```

### Fix broken plugin

1. `:Lazy log` — view recent install/update errors
2. `:Lazy clean` — remove unused plugins
3. Delete `~/.local/share/nvim/lazy/<plugin>` to force reinstall
4. Check `:messages` for Lua errors after startup

## Quick Checks (run on every audit)

- [ ] Plugins use `opts = {}` instead of `config = function() require("x").setup({}) end` where possible
- [ ] Keymaps include `{desc = "..."}` for which-key integration
- [ ] LSP plugins are not loaded eagerly (use `event = "BufReadPre"`)
- [ ] No duplicate keymaps (`:verbose map <key>` to check)
- [ ] `vim.loader.enable()` called in `init.lua` (bytecode cache, free perf)

## References Routing Table

Load only the reference matching the user's intent — don't load all of them.

| Intent | Load |
|--------|------|
| Plugin recommendations, modern picks, what to add/remove, abandoned plugins | `references/plugins.md` |
| Startup time, lazy-loading strategies, profiling, which plugins are slow | `references/performance.md` |
| Config structure, best practices, common mistakes, keymaps, LSP setup | `references/config.md` |
