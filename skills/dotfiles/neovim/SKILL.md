---
name: neovim
description: >-
  Maintain the Stow-managed Neovim config in ~/.dotfiles/home/.config/nvim for
  Neovim 0.12+, lazy.nvim, vim.lsp.config, and nvim-treesitter main. Use to
  validate or repair Neovim, change plugins, diagnose measured startup
  regressions, or fix keymaps and LSP. Route whole-dotfiles health checks to
  audit and non-Neovim terminal configuration to shell-env.
---

# Neovim configuration

The source is `~/.dotfiles/home/.config/nvim/`, linked into `~/.config/nvim/` by the repository's single `home` Stow package. Read `~/.dotfiles/README.md` and the current config before editing; the repository currently requires Neovim 0.12+, `vim.lsp.config`, and `nvim-treesitter` main.

## Layout

```text
~/.dotfiles/home/.config/nvim/
├── init.lua
├── lua/kriscard/       # core options, keymaps, autocmds, lazy bootstrap
├── lua/plugins/        # lazy.nvim plugin specs
├── after/ftplugin/     # filetype-local behavior
└── lazy-lock.json
```

Use `dotfiles sync --dry-run` from `~/.dotfiles` when link structure changes. Ordinary edits to an already linked source file do not need re-Stowing.

## Classify the branch

- Health failure or broken config → run the validation workflow; load `references/config.md` for structure, keymaps, or LSP.
- Plugin add, removal, replacement, or maintenance check → load `references/plugins.md`.
- Measured startup regression → load `references/performance.md`.
- Whole-dotfiles health issue → route to audit.
- Non-Neovim terminal config → route to shell-env.

Load only references reached by the branch.

## Validate config

Capture CLI-safe diagnostics first:

```sh
nvim --headless '+checkhealth' '+write! /tmp/nvim-health.log' '+qa'
nvim --headless '+Lazy! sync' '+qa'
```

Use interactive `:checkhealth`, `:Lazy`, and `:messages` when the headless output is incomplete.

Done when the exact failing provider, plugin, or Lua location is captured and each failure has a verified fix or a specific next diagnostic.

## Add or change a plugin

1. Inspect related specs under `lua/plugins/` and the lockfile.
2. Edit the Stow-managed source.
3. Use the plugin's real command, key, filetype, or event as its lazy boundary; keep plugins eager when their current API requires it.
4. Run lazy.nvim sync and the plugin's available health check.
5. Exercise one user-visible command or key path.

Done when lazy.nvim loads the spec, the lockfile change is intentional, health output is recorded, and the exercised behavior works.

## Diagnose performance

Use `:Lazy profile` for plugin timing and the workflow in `references/performance.md` for repeatable process-level measurements. Optimize only measured regressions.

Done when before/after medians are recorded and every recommendation names the measured event plus the applicable lazy boundary—or explains why the plugin must remain eager.

## Repair a broken plugin

Move from observation to the least destructive applicable repair:

1. Capture `:Lazy log`, `:messages`, and relevant health output.
2. Confirm the spec and pinned revision before changing state.
3. Run `:Lazy sync` when evidence indicates missing or stale plugin state.
4. Run `:Lazy clean` only after confirming removed specs.
5. Delete one plugin directory only when reinstall evidence justifies it.

Done when the original failure is reproduced or captured, the smallest justified repair has run, and a fresh startup plus health check records the result.

## Completion gate

Report the changed source path, Neovim version, validation commands, observed results, and any intentional lockfile change. A clean command exit without the relevant behavior check is incomplete.

## References

| Priority | Load when | Reference |
|---|---|---|
| High | Plugin recommendation, addition, removal, replacement, or maintenance status | `references/plugins.md` |
| High | Measured startup regression, lazy boundaries, or profiling | `references/performance.md` |
| Medium | Config structure, keymaps, health checks, or Neovim 0.12 LSP setup | `references/config.md` |
