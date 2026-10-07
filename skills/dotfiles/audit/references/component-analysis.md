> **Read this when:** A whole-dotfiles audit identifies one component that needs deeper analysis after the baseline is complete.

# Component analysis

Inspect the current tree before applying these checks. The repository source lives under `~/.dotfiles/home/`; `README.md`, `Brewfile`, and the `dotfiles` CLI are the current inventory.

## Shell

Inspect `home/.zshrc` and the modules it actually sources from `home/zsh/zsh.d/`.

Classify every sourced module by responsibility, startup cost, external commands, and dependency on earlier modules. Validate changes with `zsh -n`, then measure the complete interactive startup. Source-order profiling is authoritative because isolated modules can depend on prior environment setup.

## Neovim

Route implementation to the neovim skill. Check:

- Neovim version against the repository requirement
- `:checkhealth` failures
- lazy.nvim status and lockfile changes
- `vim.lsp.config` / `vim.lsp.enable` usage
- `nvim-treesitter` main-branch API usage
- duplicate keymaps and measured startup regressions

## Tmux and sesh

Inspect `home/.config/tmux/tmux.conf` and current sesh configuration. Check plugin-manager initialization paths, duplicate initialization, bindings, session restore, and reload output. Preserve the configured TPM directory rather than introducing a generic `~/.tmux` path.

## Git

Route identity, signing, aliases, pager, and conditional includes to shell-env. Resolve include paths as Git sees them and verify effective values inside representative personal and work repositories with `git config --show-origin --get-regexp`.

## Terminal and prompt

Inspect current Ghostty, Kitty, Starship, and theme files before recommending values. Check syntax with the tool's own command when available, then reload the smallest affected component.

## Classification gate

Done when each finding names the inspected source path, observed evidence, impact, focused owner skill, and next verification command. Recommendations based only on a generic tool checklist remain unclassified.