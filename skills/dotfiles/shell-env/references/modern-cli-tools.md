> **Read this when:** The user is adding aliases or evaluating eza, bat, fd, rg, zoxide, fzf, lazygit, or another terminal-tool alternative.

# CLI tool integration

Modern tools are alternatives with different contracts, not transparent replacements. Inspect existing aliases and scripts before choosing a name.

## Safe integration pattern

Prefer explicit aliases that advertise changed behavior:

```zsh
alias l='eza --icons --group-directories-first'
alias ll='eza -lah --icons --git'
alias catp='bat --paging=never'
alias ff='fd'
alias rgg='rg'
```

Keep `find`, `grep`, `cat`, and `cd` available with their standard semantics. Existing scripts and muscle memory may rely on flags that alternatives do not accept.

## Tool checks

- **eza:** verify icon-font availability and behavior outside Git repositories.
- **bat:** verify theme discovery, binary-file behavior, piping, and pager settings.
- **fd:** account for ignored and hidden files; use explicit flags when exhaustive search is required.
- **ripgrep:** account for ignore rules and binary files; keep recursive search intent explicit.
- **zoxide:** initialize once in the existing module order and preserve ordinary `cd`.
- **fzf:** verify shell integration and keybindings against current completion bindings.
- **delta:** test normal diff, staged diff, log, and interactive add.
- **lazygit:** configure it as an optional interface rather than a replacement for scriptable Git commands.

## Evidence

Use local timing only when performance motivates the change. Compare equivalent commands over representative data and retain raw measurements. Generic multiplier claims are not decision evidence.

## Completion gate

Done when the selected command has a distinct contract, conflicting aliases and bindings are accounted for, the standard command remains reachable, and one representative invocation plus one edge case pass.