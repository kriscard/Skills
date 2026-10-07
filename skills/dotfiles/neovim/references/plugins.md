> **Read this when:** Neovim work adds, removes, replaces, or evaluates a plugin or updates plugin-maintenance guidance.

# Neovim plugin decisions

## Start from the installed system

Inspect the related specs, `lazy-lock.json`, required Neovim version, and upstream documentation before recommending a plugin or API. A recommendation is complete only when it explains the capability gap, integration cost, maintenance evidence, and removal or rollback path.

## lazy.nvim spec shape

```lua
{
  "author/plugin-name",
  cmd = { "PluginCommand" },
  keys = {
    { "<leader>x", "<cmd>PluginCommand<cr>", desc = "Do thing" },
  },
  dependencies = { "dependency/plugin" },
  opts = {},
}
```

Use only the triggers the plugin supports. Prefer `opts` for a standard setup call; use `config` when setup is nonstandard or ordering is part of the integration. Some foundational plugins must remain eager.

## Repository compatibility

- **LSP:** the repository uses Neovim 0.12 native `vim.lsp.config` / `vim.lsp.enable`; nvim-lspconfig supplies runtime defaults rather than the deprecated `require("lspconfig").server.setup()` path.
- **Treesitter:** the repository uses `nvim-treesitter` main and its current install/native APIs. Do not copy master-branch `configs.setup` examples into it.
- **Mason:** verify the installed major version and current option names before editing automation.
- **Completion and formatting:** inspect the existing engine and adapters before proposing a replacement; migration cost includes snippets, capabilities, keymaps, and source-specific behavior.

## Maintenance evidence

Check the upstream repository when maintenance status affects the decision:

- archived or explicit deprecation status
- compatibility with the required Neovim version
- release or commit activity relevant to the needed API
- unresolved breakage matching this integration
- documented successor or migration guide

Stars and generic popularity are weak evidence. Avoid year-stamped claims such as “fastest” unless the decision includes a reproducible local benchmark.

## Removal

Before removing a plugin, find its specs, dependencies, commands, mappings, autocmds, module requires, and lockfile entry. Run lazy.nvim clean only after those owners are accounted for.

## Completion gate

Done when the selected plugin or removal satisfies a named capability, matches the repository's API generation, has an intentional load boundary, passes sync/health and one behavior check, and leaves only intentional lockfile changes.