> **Read this when:** user asks about plugin recommendations, what to install, modern alternatives, whether a plugin is abandoned, or what to add/remove from their Neovim setup.

# Neovim Plugin Guide (2025/2026)

## lazy.nvim Plugin Spec Format

```lua
-- Minimal spec
{ "author/plugin-name" }

-- Full spec with options
{
  "author/plugin-name",
  event = "BufReadPre",          -- lazy-load trigger
  ft = { "lua", "python" },      -- filetype trigger
  cmd = "CommandName",           -- command trigger
  keys = { { "<leader>x", desc = "Do thing" } },
  dependencies = { "dep/plugin" },
  opts = {                       -- passed to setup() automatically
    option = true,
  },
  config = function(_, opts)     -- only needed for non-standard setup
    require("plugin").setup(opts)
  end,
}
```

Prefer `opts` over `config` when the plugin uses a standard `setup()` call — lazy.nvim calls `setup(opts)` automatically and it keeps specs lean.

## Modern Plugin Picks by Category

### LSP

- **nvim-lspconfig** — core LSP client configuration. Always pair with mason.
- **mason.nvim** — install/manage LSP servers, linters, formatters. Always use latest version; mason v2 broke many configs from older guides.
- **mason-lspconfig.nvim** — bridge between mason and lspconfig. Set `automatic_installation = true` to auto-install servers.
- **none-ls.nvim** (null-ls fork) or **conform.nvim** — formatting. conform.nvim is the 2025 recommendation; it's faster and more maintained.
- **nvim-lint** — async linting without LSP. Pairs well with conform.nvim.

### Completion

- **blink.cmp** — fastest completion engine as of 2025, written in Rust. Drop-in replacement for nvim-cmp with better performance and native snippet support. Recommended for new setups.
- **nvim-cmp** — still widely used, massive ecosystem of sources. Use if blink.cmp compatibility is a concern with existing config.

### Treesitter

- **nvim-treesitter** — syntax highlighting, indentation, text objects. Always pin `ensure_installed` to specific parsers, not `"all"` (too slow on first install).
- Check for deprecated APIs: `nvim_treesitter#foldexpr()` and old highlight queries change between versions. Run `:TSUpdate` after Neovim upgrades.

### Fuzzy Finding

- **telescope.nvim** — feature-rich, good ecosystem, slower on large repos.
- **fzf-lua** — significantly faster on large repos (uses native fzf binary), less configuration overhead. Recommended if the repo has >50k files or startup time matters.

### File Tree / Navigation

- **neo-tree.nvim** — full-featured file tree, multiple sources (filesystem, buffers, git).
- **oil.nvim** — edit the filesystem like a buffer (rename, delete, move via normal editing). Excellent for bulk file operations. Can replace netrw entirely.

### Git

- **gitsigns.nvim** — inline blame, hunk navigation, staging. Essential.
- **neogit** — Magit-style git UI. Better than vim-fugitive for interactive staging and commit workflows.
- **vim-fugitive** — still solid for `:G` commands and blame; lighter than neogit if you mostly use CLI.
- **diffview.nvim** — excellent diff viewer; pairs well with neogit.

### Theme

- **catppuccin/nvim** — matches Ghostty Catppuccin Macchiato terminal theme. Set `flavour = "macchiato"` to match exactly. Has first-class integration with most plugins (lualine, telescope, treesitter highlights).

### Status Line

- **lualine.nvim** — fast, highly configurable, native catppuccin theme. Use `options = { theme = "catppuccin" }`.

### Other High-Value Plugins

- **which-key.nvim** — shows pending keybind completions. Requires `{desc = "..."}` on keymaps to be useful.
- **nvim-autopairs** — auto-close brackets/quotes.
- **Comment.nvim** or built-in `gc` (Neovim 0.10+) — Neovim 0.10 added native commenting, may not need a plugin.
- **mini.nvim** — collection of small focused modules. Pick individual mini.* modules rather than loading all.

## Warning Signs for Abandoned Plugins

A plugin is likely abandoned if:
- Last commit > 2 years ago AND issues are not being responded to
- GitHub repo is archived
- Plugin author explicitly deprecated it (check README)
- The Neovim API it uses is removed in current Neovim version

**How to check health:**

```vim
:checkhealth <plugin-name>
```

Also look at:
- GitHub stars trajectory (flat or declining)
- Recent issues: are they answered or stacking up?
- Alternative plugins mentioned in issues

**Known deprecated/replaced plugins to avoid in new configs:**
- `null-ls.nvim` — archived, use none-ls.nvim or conform.nvim
- `nvim-compe` — replaced by nvim-cmp, then blink.cmp
- `nvim-lsp-installer` — replaced by mason.nvim
- `packer.nvim` — archived, use lazy.nvim
