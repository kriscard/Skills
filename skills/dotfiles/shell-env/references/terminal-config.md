# Terminal Configuration

Terminal emulators, tmux, neovim, and theme consistency patterns.

## Kitty Best Practices

```conf
# Performance
repaint_delay 10
input_delay 3
sync_to_monitor yes

# Font (with ligatures)
font_family JetBrains Mono
font_size 14.0

# Theme
include catppuccin-macchiato.conf

# Tabs
tab_bar_style powerline
tab_powerline_style slanted
```

## Ghostty Best Practices

```conf
# Theme
theme = catppuccin-macchiato

# Font
font-family = "JetBrains Mono"
font-size = 14

# Performance
window-padding-x = 10
window-padding-y = 10

# Shell integration
shell-integration = true
```

## Tmux Best Practices

### Plugin Management

Use TPM (Tmux Plugin Manager):

```tmux
# In tmux.conf
set -g @plugin 'tmux-plugins/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'catppuccin/tmux'
set -g @plugin 'tmux-plugins/tmux-resurrect'

# Initialize TPM (keep at bottom)
run '~/.tmux/plugins/tpm/tpm'
```

### Sensible Defaults

```tmux
# Use Ctrl-a as prefix (easier than Ctrl-b)
set -g prefix C-a
unbind C-b

# Start windows at 1, not 0
set -g base-index 1
setw -g pane-base-index 1

# Vi mode
setw -g mode-keys vi

# Mouse support
set -g mouse on

# Faster escape time (for Vim)
set -s escape-time 0

# Increase scrollback
set -g history-limit 10000
```

## Neovim Configuration

### Lua-Based Modern Config

Use Lazy.nvim for plugin management:

```lua
-- lazy.nvim bootstrap
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup("plugins")
```

### LSP Setup

Modern LSP configuration with Mason:

```lua
-- In plugins/lsp.lua
return {
  "neovim/nvim-lspconfig",
  dependencies = {
    "williamboman/mason.nvim",
    "williamboman/mason-lspconfig.nvim",
  },
  config = function()
    require("mason").setup()
    require("mason-lspconfig").setup({
      ensure_installed = { "lua_ls", "tsserver", "pyright" }
    })
  end
}
```

## Theme Consistency

### Catppuccin Integration

Maintain consistent theming across all tools:

**Supported tools**:
- Terminal (Kitty, Ghostty, iTerm2)
- Bat (syntax highlighting)
- Tmux
- Neovim
- Starship (prompt)
- Delta (git diffs)

**Configuration pattern**:
```zsh
# In zsh.d/00-env.zsh
export THEME_FLAVOUR=macchiato  # or frappe, latte, mocha

# Bat
export BAT_THEME="Catppuccin Macchiato"

# Ensure all tools reference $THEME_FLAVOUR
```

**Benefits**:
- Consistent visual experience
- Single variable to change entire theme
- Reduces eye strain with cohesive colors
