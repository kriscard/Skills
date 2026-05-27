> **Read this when:** user asks about config structure, best practices, common config mistakes, keymaps, LSP on_attach setup, or how to organize their Neovim config.

# Neovim Config Best Practices

## lazy.nvim Setup Pattern

The correct entry point in `init.lua`:

```lua
vim.loader.enable()  -- bytecode cache — put this first

-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Load core config before plugins
require("kriscard.core.options")
require("kriscard.core.keymaps")

-- Initialize lazy.nvim
require("lazy").setup("kriscard.plugins", {
  -- lazy.nvim options
  change_detection = { notify = false },
})
```

## Common Mistakes

**Using `config = function()` when `opts` works:**
```lua
-- Wrong — verbose and bypasses lazy.nvim's auto-setup
config = function()
  require("telescope").setup({ defaults = { ... } })
end

-- Right — lazy.nvim calls setup(opts) automatically
opts = { defaults = { ... } }
```

**Not returning the spec table:**
```lua
-- Wrong — file returns nothing, plugin silently not loaded
local M = {}
M[1] = "author/plugin"
return M

-- Right
return {
  "author/plugin",
  opts = {},
}
```

**Conflicting keymaps:**
Check what's bound before adding: `:verbose map <key>`. The `verbose` prefix shows which file set the mapping.

**Calling `setup()` in multiple places:**
Only call `setup()` once per plugin, either via `opts` in the spec or in a single `config` function. Calling it twice resets options.

## Keymap Best Practices

Always include `{desc = "..."}` — which-key.nvim uses these for its popup, and `:map` output becomes readable.

```lua
-- Good pattern
vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>", {
  desc = "Find files",
  silent = true,
})

-- Grouping with which-key (v3 API)
require("which-key").add({
  { "<leader>f", group = "find" },
  { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find files" },
})
```

**Mode conventions:**
- `"n"` — normal
- `"i"` — insert
- `"v"` — visual
- `"x"` — visual block only (not select)
- `{ "n", "v" }` — multiple modes

## LSP on_attach Pattern

```lua
-- In your LSP config (e.g., lua/kriscard/plugins/lsp.lua)
local on_attach = function(client, bufnr)
  local map = function(keys, func, desc)
    vim.keymap.set("n", keys, func, { buffer = bufnr, desc = "LSP: " .. desc })
  end

  map("gd", vim.lsp.buf.definition, "Go to definition")
  map("gr", vim.lsp.buf.references, "References")
  map("K", vim.lsp.buf.hover, "Hover docs")
  map("<leader>rn", vim.lsp.buf.rename, "Rename")
  map("<leader>ca", vim.lsp.buf.code_action, "Code action")
  map("<leader>D", vim.lsp.buf.type_definition, "Type definition")
end

-- Pass to lspconfig
require("lspconfig").ts_ls.setup({
  on_attach = on_attach,
  capabilities = capabilities,  -- from blink.cmp or nvim-cmp
})
```

## Config Modularization

Keep files focused — one concern per file:

```
lua/kriscard/
├── core/
│   ├── options.lua     # vim.opt.* settings only
│   ├── keymaps.lua     # non-plugin keymaps only
│   └── autocmds.lua    # vim.api.nvim_create_autocmd calls
└── plugins/
    ├── lsp.lua         # lspconfig + mason + conform
    ├── treesitter.lua  # nvim-treesitter
    ├── telescope.lua   # or fzf-lua
    ├── ui.lua          # theme, lualine, icons
    └── git.lua         # gitsigns, neogit
```

Don't put keymaps in plugin spec `config` functions — it makes them impossible to audit in one place. Use the `keys` field in the spec for plugin-specific bindings, and `lua/kriscard/core/keymaps.lua` for everything else.

## Health Checks

```vim
:checkhealth             " full system check
:checkhealth lazy        " lazy.nvim
:checkhealth nvim        " core Neovim requirements
:checkhealth lspconfig   " LSP setup
:checkhealth mason       " mason server installs
:checkhealth nvim-treesitter
```

Run `:checkhealth` after:
- Major Neovim version upgrade
- Adding new LSP servers
- Updating all plugins (`:Lazy update`)
- Anything is unexpectedly broken
