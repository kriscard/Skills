---
name: audit
description: >-
  Audits the entire dotfiles setup: shell startup time, zsh plugin weight, stow
  symlink health, Neovim startup, installed tool inventory, and orphan configs.
  Produces a prioritized cleanup report. Make sure to use this skill whenever the
  user says "audit my dotfiles", "clean up my dotfiles", "optimize my shell",
  "what's slowing my terminal", "review my dotfiles", or runs /audit. Also
  triggers when the user asks why their terminal or Neovim is slow and they want
  a full investigation rather than a targeted fix.
user-invocable: true
---

# Dotfiles Audit

Full health check of the dotfiles setup. Run all steps in order — each takes seconds and together they give a complete picture.

Security check runs first: it's always highest priority.

## Step 0: Security Scan

Scan for credentials before anything else.

```bash
# API keys, tokens, passwords in config files
grep -rE "(API_KEY|TOKEN|SECRET|PASSWORD)\s*=\s*['\"][^'\"]+['\"]" ~/.dotfiles/ 2>/dev/null
# Common token prefixes
grep -rE "(ghp_|sk-|AKIA|-----BEGIN.*PRIVATE KEY-----)" ~/.dotfiles/ 2>/dev/null
```

Flag any findings as **CRITICAL** — credentials in dotfiles can leak via git.

**File permission check** — these should be 600:
```bash
stat -f "%A %N" ~/.dotfiles/.gitconfig-work ~/.dotfiles/.gitconfig-personal 2>/dev/null
```

**Git safety** — verify `.gitignore` in the dotfiles repo includes:
- `.env`, `*_token`, `*_secret`, `99-local.zsh`, `**/*.local.*`

## Step 1: Shell Startup Time

```sh
time zsh -i -c exit
```

**Target:** <200ms. >500ms means something is blocking during interactive init.

If slow, isolate which zsh.d file is the culprit:

```sh
# Add timing to each zsh.d file temporarily
for f in ~/.zsh.d/*.zsh; do
  time zsh -c "source $f" 2>&1 | grep real
  echo "  ^ $f"
done
```

## Step 2: Zsh Plugins Audit

Check `~/.dotfiles/zsh/.zshrc` and `~/.dotfiles/zsh/zsh.d/` for plugin loading (zinit, antigen, oh-my-zsh, etc.).

Flag heavy plugins:
- Large completion frameworks loaded synchronously
- `nvm` / `rbenv` / `pyenv` with eager shell integration (use lazy variants)
- Any plugin that makes network calls or spawns subprocesses at init

## Step 3: Stow Symlink Health

```sh
# Find broken symlinks in home directory (depth 3 to avoid scanning everything)
find ~ -maxdepth 3 -type l ! -e 2>/dev/null
```

A broken symlink means the stow source file was deleted or moved without re-stowing. Fix: either restore the source file or `stow -D <package>` to remove the dead link.

## Step 4: Neovim Startup Time

```sh
nvim --headless --startuptime /tmp/nvim-startup.log +q && sort -k2 -n /tmp/nvim-startup.log | tail -20
```

**Target:** <150ms. >300ms needs investigation.

Check which plugins are loading eagerly: the top entries after sorting are the slowest. Cross-reference against the plugin list to find candidates for lazy-loading.

## Step 5: Tool Inventory Check

Verify tools referenced in dotfiles are actually installed:

```sh
which sesh tmux yabai starship lazygit gh bat fd rg zoxide fzf
```

Any `not found` means either:
- The tool was uninstalled but its config is still in dotfiles (orphan config)
- The tool isn't installed yet on this machine (new machine setup)

## Step 6: Orphan Config Detection

Cross-reference `ls ~/.dotfiles/` (stow packages) against the tools found in Step 5. A package with no corresponding installed binary is an orphan.

```sh
ls ~/.dotfiles/
```

Review each package: if the tool it configures isn't installed and you're not planning to use it, consider archiving the package or adding a note.

## Report Format

After running all steps, produce a report:

```
DOTFILES AUDIT REPORT
=====================

Security
  🔴 Critical: [N issues] / ✅ Clean
  [List any credential finds with file:line]
  [File permission issues]
  [Git safety gaps]

Startup Times
  Shell: Xms (target <200ms) — [OK | SLOW: investigate zsh.d/X.zsh]
  Neovim: Xms (target <150ms) — [OK | SLOW: top culprits: plugin1, plugin2]

Symlink Health
  Broken links: X found
  [list each broken link and its expected source]

Tool Inventory
  Installed: sesh, tmux, starship, ...
  Missing: [tool] — config exists at ~/.dotfiles/<package> (orphan or needs install)

Recommended Cleanups (priority order)
  1. [most impactful fix — security first, then startup time, then cosmetic]
  2. ...
```

Security issues always rank first regardless of other findings.

## References

| Priority | Load when | Reference |
|----------|-----------|-----------|
| High | Security scan finds issues or credential patterns need review | `references/security-patterns.md` |
| High | Shell startup is slow and needs profiling strategies | `references/shell-performance.md` |
| High | Deep component-by-component analysis needed | `references/component-analysis.md` |
| Medium | Broad pattern reference for security, perf, and tool integration | `references/analysis-patterns.md` |
| Low | Git config issues found (permissions, multi-identity) | `references/git-config.md` |
