---
name: audit
description: >-
  Audit the complete ~/.dotfiles system for credential exposure, shell and
  Neovim startup regressions, broken Stow links, missing tools, and stale
  configuration. Use for whole-dotfiles health checks and triage; route focused
  Neovim work to neovim and focused terminal or shell edits to shell-env.
---

# Dotfiles Audit

Audit the repository in security-first order. The repository uses one GNU Stow package at `~/.dotfiles/home/`; its `README.md` and `dotfiles --help` are authoritative for current layout and commands.

## Step 0: Security scan

Search tracked files without printing credential values:

```sh
cd ~/.dotfiles

scan_redacted() {
  local detector=$1 pattern=$2
  git grep -nI -E "$pattern" -- ':(exclude)*.example' ':(exclude)*.md' 2>/dev/null |
    while IFS=: read -r file line _; do
      printf '%s:%s [%s; value redacted]\n' "$file" "$line" "$detector"
    done
}

scan_redacted assignment '(API_KEY|ACCESS_KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY)[[:space:]]*=[[:space:]]*[^[:space:]]{8,}'
scan_redacted token-prefix '(gh[pousr]_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|BEGIN[[:space:]].*PRIVATE KEY)'
```

Treat matches as candidates until placeholders and false positives are ruled out. Keep credential values out of command output and the report. If a live credential is tracked, record its redacted location, revoke or rotate it, remove it from the current tree, and assess Git-history cleanup.

Check local secret permissions without reading their contents:

```sh
find ~/.dotfiles -maxdepth 2 -type f \( -name '.env' -o -name '.netrc' -o -name '.authinfo' \) -exec stat -f '%Sp %N' {} \;
```

Inspect `.gitignore` against the actual local-secret files. Load `references/security-patterns.md` when findings need remediation.

Done when each candidate is classified false positive, placeholder, or live secret; sensitive local-file permissions are recorded; and every live-secret response names rotation and cleanup actions without exposing the value.

## Step 1: Baseline diagnostics

Prefer the repository's own health check:

```sh
cd ~/.dotfiles
dotfiles doctor --verbose
```

If the command is unavailable, inspect `./dotfiles --help` and `README.md` before choosing fallback checks.

Done when every failed diagnostic is captured with its component and next action, or the unavailable command and chosen fallback are recorded.

## Step 2: Shell startup

Measure several fresh interactive shells and retain all timings:

```sh
for run in 1 2 3 4 5; do
  /usr/bin/time -p zsh -i -c exit 2>&1 | awk -v run="$run" '/^real / { print run, $2 }'
done
```

Use the median as the baseline. Treat a regression against a previous baseline as stronger evidence than a universal threshold. For a slow result, load `references/shell-performance.md`; profile the complete startup in source order rather than sourcing modules independently.

Done when the samples and median are recorded, compared with any prior baseline, and a regression names the next profiling step.

## Step 3: Stow link health

Preview the repository-supported sync, then inspect broken links:

```sh
cd ~/.dotfiles
dotfiles sync --dry-run
find ~ -maxdepth 3 -type l ! -e 2>/dev/null
```

A broken link needs its expected source determined before repair. Use `dotfiles sync` only after the dry run is understood.

Done when the sync preview is classified clean or lists conflicts, and every broken link has an expected source or an explicit unresolved reason.

## Step 4: Neovim health and startup

```sh
nvim --headless '+checkhealth' '+write! /tmp/nvim-health.log' '+qa'
nvim --headless --startuptime /tmp/nvim-startup.log '+qa'
sort -k2 -n /tmp/nvim-startup.log | tail -20
```

The repository currently targets Neovim 0.12+, `vim.lsp.config`, and `nvim-treesitter` main. Route repairs to the neovim skill.

Done when health failures and startup timing are recorded; any regression names the slow entries or next profiler.

## Step 5: Tool and config inventory

Read `Brewfile`, `home/`, and the management CLI instead of assuming package names map one-to-one to binaries:

```sh
cd ~/.dotfiles
find home -maxdepth 3 -type f | sort
rg -n '^(brew|cask|tap) ' Brewfile
```

For each configured tool, classify it as active, setup-required, intentionally retained, or orphan candidate. Confirm GUI applications through the package inventory or application bundle rather than `which` alone.

Done when every reviewed configuration has a classification backed by its source file and installation evidence.

## Completion gate

Produce the report only after every step has a captured result or an explicit reason it could not run. Rank live-secret response first, then broken setup, measured regressions, and cleanup opportunities.

## Report format

```text
DOTFILES AUDIT REPORT
=====================

Security
  [Clean | redacted candidate locations and classifications]
  [Permission or ignore gaps]

Repository diagnostics
  [doctor result and failed checks]

Startup
  Shell median: Xs [baseline comparison]
  Neovim: Xms [baseline comparison and slow entries]

Stow
  [dry-run result]
  [broken links and expected sources]

Inventory
  [active | setup-required | intentionally retained | orphan candidate]

Actions
  1. [security]
  2. [correctness]
  3. [measured performance]
  4. [cleanup]
```

## References

| Priority | Load when | Reference |
|---|---|---|
| High | A scan finds credential candidates, unsafe permissions, history risks, or ignore gaps | `references/security-patterns.md` |
| High | Shell measurements regress and need source-order profiling or lazy-loading analysis | `references/shell-performance.md` |
| Medium | The baseline identifies a component that needs deeper targeted analysis | `references/component-analysis.md` |

For Git identity, signing, aliases, pager, or multi-config findings, route the focused repair to shell-env, which owns the canonical Git guidance.
