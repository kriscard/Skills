> **Read this when:** Neovim work involves config structure, keymaps, health checks, or LSP setup for the repository's Neovim 0.12+ baseline.

# Neovim configuration reference

Inspect the checked-in files before proposing structure. The current split is `lua/kriscard/` for core setup and `lua/plugins/` for lazy.nvim specs.

## Bootstrap and module order

Keep `init.lua` small and follow the repository's existing bootstrap in `lua/kriscard/lazy.lua`. Core options, keymaps, and autocmds must load in the order required by the existing entry point. Treat `vim.loader.enable()` as version-aware: verify whether the required Neovim version already enables the loader before adding or retaining an explicit call.

Use lazy.nvim `opts` when a plugin follows `require(module).setup(opts)`. Use `config` for nonstandard setup, ordering, or multiple setup calls that `opts` cannot express.

## Keymaps

Inspect existing mappings before adding one:

```vim
:verbose nmap <leader>x
:verbose imap <C-x>
```

Give user-facing mappings a `desc`. Put global mappings with the existing core keymaps; put plugin-specific lazy triggers in the plugin spec's `keys`; put buffer-local LSP mappings in the existing attach module.

Done when the mapping has one owner, its mode and scope are intentional, and `:verbose map` identifies the expected source.

## LSP for Neovim 0.12+

Use the native configuration path. Keep nvim-lspconfig on the runtime path for its `lsp/<server>.lua` defaults, merge shared capabilities into `"*"`, add per-server overrides, and let the existing Mason integration enable installed servers.

```lua
vim.lsp.config("*", {
  capabilities = capabilities,
})

vim.lsp.config("ts_ls", {
  settings = {
    typescript = {},
  },
})

vim.lsp.enable("ts_ls") -- only when the existing Mason path does not enable it
```

Attach buffer-local behavior through `LspAttach` or the repository's current attach module. Preserve server-provided defaults and verify effective clients with `:checkhealth vim.lsp` and `:LspInfo` where available.

## Treesitter main

The repository follows `nvim-treesitter` main. Use its current `require("nvim-treesitter").install(...)` and native Neovim Treesitter APIs. Preserve eager loading when the checked-in main-branch integration requires it; older `require("nvim-treesitter.configs").setup(...)` examples are a different API generation.

## Health checks

```vim
:checkhealth
:checkhealth lazy
:checkhealth vim.lsp
:checkhealth nvim-treesitter
```

Use the health names reported by the installed versions rather than assuming historical providers such as `lspconfig` or `mason` expose a check.

## Completion gate

Done when config loads under the repository's required Neovim version, relevant health output is captured, the changed behavior is exercised, and no older API generation was introduced.