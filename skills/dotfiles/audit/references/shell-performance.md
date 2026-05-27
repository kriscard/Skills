# Shell Performance Optimization

Strategies for keeping shell startup fast and responsive.

## Startup Time Best Practices

**Target**: Shell startup <500ms

**Key strategies**:

1. **Lazy loading for version managers**:
   - NVM loading eagerly adds 200-400ms
   - Defer loading until `node`, `npm`, or `nvm` is called
   - Pattern: Unfunction wrapper that loads on first use

2. **Selective completion loading**:
   - Only load completions for installed tools
   - Check with `[[ -x "$(command -v tool)" ]]` before loading
   - Cache completion dumps for 24 hours

3. **Plugin optimization**:
   - Audit plugins quarterly, remove unused
   - Use plugin managers with lazy loading (zinit, zplug)
   - Prefer native functions over plugins when possible

4. **PATH management**:
   - Check for duplicates: `echo $PATH | tr ':' '\n' | sort | uniq -d`
   - Use functions to add paths uniquely
   - Keep PATH minimal, use absolute paths when possible

## Lazy Loading Pattern

```zsh
# Generic lazy loader
lazy_load() {
  local cmd=$1
  local load_cmd=$2

  eval "$cmd() {
    unfunction $cmd
    $load_cmd
    $cmd \"\$@\"
  }"
}

# Usage for NVM
lazy_load nvm 'export NVM_DIR="$HOME/.nvm"; source "$NVM_DIR/nvm.sh"'
lazy_load node 'export NVM_DIR="$HOME/.nvm"; source "$NVM_DIR/nvm.sh"'
lazy_load npm 'export NVM_DIR="$HOME/.nvm"; source "$NVM_DIR/nvm.sh"'
```

## Profiling Tools

```bash
# Measure total startup time
time zsh -i -c exit

# Detailed profiling (add to .zshrc temporarily)
zmodload zsh/zprof
# ... rest of config ...
zprof  # Shows function call times
```
