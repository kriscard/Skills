> **Read this when:** user asks about startup time, slow Neovim, lazy-loading, profiling plugins, or wants to know which plugins are causing slowdowns.

# Neovim Performance

## Measuring Startup Time

### CLI measurement (most accurate)

```sh
# Single measurement
nvim --headless --startuptime /tmp/nvim.log +q && sort -k2 -n /tmp/nvim.log | tail -20

# Average over 10 runs (removes variance)
for i in $(seq 1 10); do
  nvim --headless --startuptime /tmp/nvim.log +q 2>/dev/null
done && sort -k2 -n /tmp/nvim.log | tail -20
```

### Inside Neovim

```vim
:Lazy profile          " per-plugin load time with visual breakdown
:Lazy                  " shows loaded/not-loaded status for all plugins
```

## Targets

| Context | Target | Acceptable |
|---------|--------|------------|
| Terminal-first workflow | <100ms | <150ms |
| General use | <150ms | <200ms |
| >300ms | Investigate immediately | — |

## lazy.nvim Lazy-Loading Strategies

Lazy-loading is **opt-in** in lazy.nvim — any plugin without a trigger loads at startup.

```lua
-- Load after UI is fully rendered (good for non-critical tools)
event = "VeryLazy"

-- Load only when these filetypes open
ft = { "python", "javascript", "typescript" }

-- Load when this command is first called
cmd = { "Telescope", "Neogit" }

-- Load when these keys are pressed
keys = {
  { "<leader>ff", "<cmd>Telescope find_files<cr>", desc = "Find files" },
}

-- Load after a file is read (good for LSP, treesitter)
event = "BufReadPre"

-- Load after file is opened and ready
event = "BufEnter"
```

**Rule of thumb:** if you don't need it on a blank `nvim` invocation, it should be lazy-loaded.

## Heavy Plugins to Always Lazy-Load

These plugins are commonly loaded eagerly by mistake — they cause the most startup time:

| Plugin | Recommended trigger |
|--------|-------------------|
| telescope.nvim | `cmd = "Telescope"` or keybinds |
| fzf-lua | keybinds |
| nvim-treesitter | `event = "BufReadPost"` |
| treesitter-playground | `cmd = "TSPlaygroundToggle"` |
| trouble.nvim | `cmd = "Trouble"` or keybinds |
| neogit | `cmd = "Neogit"` |
| diffview.nvim | `cmd = { "DiffviewOpen", "DiffviewFileHistory" }` |
| language-specific plugins | `ft = {"<lang>"}` |
| which-key.nvim | `event = "VeryLazy"` |
| conform.nvim | `event = "BufWritePre"` (or `VeryLazy`) |

## Common Culprits

**Plugins loading on VimEnter instead of events:**
`VimEnter` fires before the UI is ready — it's essentially eager loading. Replace with `VeryLazy` for non-critical plugins.

**Synchronous operations in `init.lua`:**
Avoid `vim.fn.system()` or file I/O at the top level of `init.lua`. Move to `vim.defer_fn()` or lazy-load.

**Missing bytecode cache:**
Add to the very top of `init.lua`:
```lua
vim.loader.enable()
```
This caches compiled Lua bytecode. Free ~20-40ms on most setups.

**Treesitter loading all parsers:**
`ensure_installed = "all"` is fine for install, but set `auto_install = false` in production config. Let lazy.nvim handle when treesitter itself loads.

**Large `rtp` (runtimepath):**
Each plugin added to rtp is searched on startup. Check with `:set rtp?`. lazy.nvim manages this well, but manually added paths (in `vim.opt.rtp:append()`) add overhead.

## Profiling Workflow

1. Run `nvim --headless --startuptime /tmp/nvim.log +q`
2. Check the last lines of the sorted output — those are the slowest events
3. Match slow events to plugin names
4. Add lazy-load triggers to the slow plugins
5. Re-measure to confirm improvement
6. Use `:Lazy profile` inside nvim for a visual breakdown with click-to-details
