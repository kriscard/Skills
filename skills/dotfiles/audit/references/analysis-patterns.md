# Dotfiles Analysis Patterns

Detailed patterns and techniques for analyzing and optimizing dotfiles configurations.

## Security Analysis Patterns

### Credential Detection

**Common patterns to flag**:

```regex
# API Keys and Tokens
(API_KEY|APIKEY|API_SECRET|TOKEN|ACCESS_TOKEN|SECRET_KEY)\s*=\s*['"

][a-zA-Z0-9_-]{20,}['"]

# GitHub tokens
ghp_[a-zA-Z0-9]{36}
gh[pousr]_[a-zA-Z0-9]{36,251}

# AWS credentials
AKIA[0-9A-Z]{16}

# Private keys
-----BEGIN (RSA |DSA |EC )?PRIVATE KEY-----

# Generic secrets
(password|passwd|pwd)\s*=\s*['"][^'"]+['"]
```

**Where to check**:
- `zsh.d/00-env.zsh` - Environment variables
- `.zshrc`, `.bashrc` - Shell configs
- `.gitconfig*` - Git configurations
- `tmux.conf` - Tmux configs
- Any `.env` files (should be in .gitignore)

**Remediation**:
1. Move to `.env` file (add to .gitignore)
2. Use `.env.example` with placeholder values
3. Source `.env` in 99-local.zsh (never committed)
4. Recommend tools like `direnv` or `dotenvx` for management

### File Permission Issues

**Check these files** (should be 600 or 700):
- `.gitconfig-work` (may contain work credentials)
- `.gitconfig-personal` (may contain personal tokens)
- `.env` files
- `.ssh/config`
- `.netrc`, `.authinfo`
- Any file with `_token`, `_key`, `_secret` in name

**Commands to validate**:
```bash
# Check permissions
stat -f "%A %N" ~/.dotfiles/.gitconfig-work

# Fix permissions
chmod 600 ~/.dotfiles/.gitconfig-work
```

### History Security

**Check for**:
- `HISTFILE` location (should be secure)
- `HISTIGNORE` patterns (exclude sensitive commands)
- History size limits

**Recommended patterns**:
```zsh
# In zsh.d/10-options.zsh
setopt HIST_IGNORE_SPACE  # Ignore commands starting with space
HISTSIZE=10000
SAVEHIST=10000

# Exclude sensitive patterns
HISTORY_IGNORE="(ls|cd|pwd|exit|clear|history)*"
```

## Performance Analysis Patterns

### Shell Startup Time Profiling

**Measurement approach**:
```bash
# Profile zsh startup
time zsh -i -c exit

# Detailed profiling
zsh -i -c 'zprof' 2>&1 | head -20
```

**Target**: <500ms total startup time

**Common slow components**:
1. **NVM loading** (~200-400ms)
   - Lazy load solution: Only load when `node`, `npm`, `nvm` called
2. **Oh-My-Zsh plugins** (~100-300ms)
   - Load selectively, prefer zinit/zplug with lazy loading
3. **Completions** (~50-150ms)
   - Cache completion dumps
4. **Directory stack** (~20-50ms)
   - Limit `DIRSTACKSIZE`

### Lazy Loading Patterns

**NVM lazy loading template**:
```zsh
# In zsh.d/40-lazy.zsh
nvm() {
  unfunction nvm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm "$@"
}

node() {
  unfunction node
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  node "$@"
}

npm() {
  unfunction npm
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  npm "$@"
}
```

**Python (pyenv) lazy loading**:
```zsh
pyenv() {
  unfunction pyenv
  eval "$(command pyenv init -)"
  pyenv "$@"
}
```

**Generic lazy loading pattern**:
```zsh
# Lazy load any command
lazy_load() {
  local cmd=$1
  local load_cmd=$2

  eval "$cmd() {
    unfunction $cmd
    $load_cmd
    $cmd \"\$@\"
  }"
}

# Usage
lazy_load nvm 'export NVM_DIR="$HOME/.nvm"; [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"'
```

### Completion Optimization

**Caching strategy**:
```zsh
# In zsh.d/20-completions.zsh
autoload -Uz compinit

# Cache completion dump for 24 hours
if [[ -n ${ZDOTDIR}/.zcompdump(#qN.mh+24) ]]; then
  compinit
else
  compinit -C
fi
```

**Selective completion loading**:
```zsh
# Only load completions for installed tools
[[ -x "$(command -v kubectl)" ]] && source <(kubectl completion zsh)
[[ -x "$(command -v gh)" ]] && eval "$(gh completion -s zsh)"
```

## Modern Tool Integration Patterns

### Eza (ls replacement)

**Full configuration**:
```zsh
# In zsh.d/60-aliases.zsh
if [[ -x "$(command -v eza)" ]]; then
  alias ls='eza --icons --group-directories-first'
  alias ll='eza -lah --icons --group-directories-first --git'
  alias la='eza -a --icons --group-directories-first'
  alias lt='eza --tree --level=2 --icons'
  alias ltree='eza --tree --icons'
else
  # Fallback to traditional ls with colors
  alias ls='ls --color=auto'
  alias ll='ls -lah'
  alias la='ls -a'
fi
```

**Recommended flags**:
- `--icons`: Show file type icons
- `--git`: Show git status
- `--group-directories-first`: Directories before files
- `--classify`: Add type indicators

### Bat (cat replacement)

**Configuration**:
```zsh
# In zsh.d/60-aliases.zsh
if [[ -x "$(command -v bat)" ]]; then
  alias cat='bat --paging=never'
  alias bcat='bat'  # Original bat with pager

  # Set theme to match Catppuccin
  export BAT_THEME="Catppuccin Macchiato"
else
  alias cat='cat'
fi

# Man pages with bat
export MANPAGER="sh -c 'col -bx | bat -l man -p'"
```

**Theme file location**: `~/.config/bat/themes/Catppuccin-macchiato.tmTheme`

### Fd (find replacement)

**Aliases**:
```zsh
if [[ -x "$(command -v fd)" ]]; then
  alias find='fd'
fi
```

**Common use cases**:
```bash
# Find all TypeScript files
fd -e ts

# Find and execute
fd -e js -x prettier --write {}

# Exclude node_modules
fd --exclude node_modules
```

### Ripgrep (grep replacement)

**Configuration**:
```zsh
# In zsh.d/00-env.zsh
export RIPGREP_CONFIG_PATH="$HOME/.config/ripgrep/ripgreprc"
```

**Config file** (`~/.config/ripgrep/ripgreprc`):
```
# Smart case search
--smart-case

# Show line numbers
--line-number

# Follow symlinks
--follow

# Exclude patterns
--glob=!.git/*
--glob=!node_modules/*
--glob=!*.lock
```

**Aliases**:
```zsh
if [[ -x "$(command -v rg)" ]]; then
  alias grep='rg'
fi
```

### Zoxide (cd replacement)

**Setup**:
```zsh
# In zsh.d/80-integrations.zsh
if [[ -x "$(command -v zoxide)" ]]; then
  eval "$(zoxide init zsh)"
  alias cd='z'
fi
```

**Usage patterns**:
- `z project` - Jump to frequently used project
- `zi` - Interactive selection
- `z -` - Go to previous directory

## Configuration Organization Patterns

### Modular Zsh Structure

**Recommended naming** (matches user's setup):
```
zsh/zsh.d/
├── 00-env.zsh           # Environment variables (PATH, exports)
├── 10-options.zsh       # Shell options (setopt)
├── 20-completions.zsh   # Completion system
├── 30-plugins.zsh       # Plugin loading
├── 40-lazy.zsh          # Lazy loading functions
├── 50-keybindings.zsh   # Key bindings
├── 60-aliases.zsh       # Aliases
├── 70-functions.zsh     # Custom functions
├── 80-integrations.zsh  # External tool integrations
└── 99-local.zsh         # Local overrides (not committed)
```

**Loading order**:
```zsh
# In .zshrc
for config_file in "$ZSH/zsh.d"/*.zsh(N); do
  source "$config_file"
done
```

**Benefits**:
- Easy to locate specific configurations
- Can disable modules by renaming (01-env.zsh.disabled)
- Clear load order with numeric prefixes
- Separate concerns

### Git Multi-Config Pattern

**Structure**:
```
~/.dotfiles/
├── .gitconfig           # Main config with includeIf
├── .gitconfig-personal  # Personal settings
└── .gitconfig-work      # Work settings
```

**Main .gitconfig**:
```gitconfig
[user]
    name = Chris Cardoso

[includeIf "gitdir:~/personal/"]
    path = ~/.dotfiles/.gitconfig-personal

[includeIf "gitdir:~/work/"]
    path = ~/.dotfiles/.gitconfig-work
```

**Personal config**:
```gitconfig
[user]
    email = contact@christophercardoso.dev
    signingkey = PERSONAL_GPG_KEY
```

**Work config**:
```gitconfig
[user]
    email = chris.cardoso@company.com
    signingkey = WORK_GPG_KEY
```

### Environment File Pattern

**Structure**:
```
~/.dotfiles/
├── .env                 # Actual secrets (in .gitignore)
└── .env.example         # Template with placeholders
```

**.env.example**:
```bash
# GitHub
GITHUB_TOKEN=ghp_your_token_here

# OpenAI
OPENAI_API_KEY=sk-your_key_here

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Loading in zsh**:
```zsh
# In zsh.d/99-local.zsh (not committed)
[ -f "$HOME/.dotfiles/.env" ] && source "$HOME/.dotfiles/.env"
```

## Catppuccin Theme Integration

### Consistency Checks

**Ensure theme matches across**:
- Terminal (Kitty/Ghostty): Catppuccin Macchiato
- Bat: Catppuccin Macchiato
- Tmux: Catppuccin Macchiato
- Neovim: Catppuccin Macchiato
- Starship (if used): Catppuccin Macchiato

**Theme variable**:
```zsh
# In zsh.d/00-env.zsh
export THEME_FLAVOUR=macchiato  # or frappe, latte, mocha
```

### Tool-Specific Theme Configs

**Bat**:
```bash
# Set in .config/bat/config
--theme="Catppuccin Macchiato"
```

**Tmux** (`~/.config/tmux/tmux.conf`):
```tmux
set -g @catppuccin_flavour 'macchiato'
```

**Neovim** (Lua config):
```lua
require("catppuccin").setup({
    flavour = "macchiato",
})
vim.cmd.colorscheme "catppuccin"
```

## Common Issues and Fixes

### Issue: Slow Shell Startup

**Diagnosis**:
```bash
time zsh -i -c exit  # Measure total time
```

**Common causes**:
1. NVM/pyenv/rbenv loading eagerly
2. Too many plugins
3. Unoptimized completions
4. Large history files

**Fixes**:
1. Implement lazy loading for version managers
2. Audit plugins (remove unused, use lazy loading)
3. Cache completion dumps
4. Limit history size

### Issue: Duplicate PATH Entries

**Diagnosis**:
```bash
echo $PATH | tr ':' '\n' | sort | uniq -d
```

**Cause**: Multiple config files adding same paths

**Fix**:
```zsh
# In zsh.d/00-env.zsh
# Add unique path function
path_append() {
  case ":$PATH:" in
    *:$1:*) ;;
    *) PATH="$PATH:$1" ;;
  esac
}

path_prepend() {
  case ":$PATH:" in
    *:$1:*) ;;
    *) PATH="$1:$PATH" ;;
  esac
}

# Use it
path_prepend "$HOME/.local/bin"
path_append "$HOME/bin"
```

### Issue: Completion Not Working

**Diagnosis**:
```bash
# Check if compinit is loaded
which compinit

# Rebuild completion cache
rm ~/.zcompdump
compinit
```

**Common causes**:
1. compinit not called
2. Corrupted completion cache
3. Missing completion scripts

**Fix**:
```zsh
# In zsh.d/20-completions.zsh
autoload -Uz compinit
compinit

# Ensure completion system is on
zstyle ':completion:*' menu select
```

### Issue: Key Bindings Not Working

**Diagnosis**:
```bash
# Show all bindings
bindkey

# Test specific key
cat > /dev/null  # Then press the key
```

**Common causes**:
1. Terminal not sending correct codes
2. Conflicts between plugins
3. Wrong mode (emacs vs vi)

**Fix**:
```zsh
# In zsh.d/50-keybindings.zsh
# Explicitly set mode
bindkey -e  # Emacs mode
# OR
bindkey -v  # Vi mode

# Fix common keys
bindkey "^[[H" beginning-of-line  # Home
bindkey "^[[F" end-of-line        # End
```

## Performance Benchmarks

### Target Metrics

- **Shell startup**: <500ms
- **Command completion**: <100ms
- **History search**: <50ms

### Measurement Tools

```bash
# Startup time
time zsh -i -c exit

# Detailed profiling (add to .zshrc temporarily)
zmodload zsh/zprof
# ... config ...
zprof

# Plugin load times (with zinit)
zinit times
```

### Optimization Checklist

- [ ] Version managers lazy loaded (nvm, pyenv, rbenv)
- [ ] Completions cached
- [ ] Plugins loaded selectively
- [ ] Large files excluded from git status
- [ ] History size limited
- [ ] Unnecessary exports removed
