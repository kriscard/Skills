> **Read this when:** Repeated shell startup measurements regress or zsh initialization needs source-order profiling.

# Shell performance

## Establish evidence

Measure several complete interactive startups and use the median. Compare against a previous baseline when available; machine load and disk cache make a single universal threshold unreliable.

```sh
for run in 1 2 3 4 5; do
  /usr/bin/time -p zsh -i -c exit 2>&1 | awk -v run="$run" '/^real / { print run, $2 }'
done
```

## Profile in source order

Temporarily load `zsh/zprof` before the normal module loop and call `zprof` after it. Preserve module order and environment dependencies.

```zsh
zmodload zsh/zprof
# existing .zshrc module-loading loop
zprof
```

Remove temporary instrumentation after capturing the profile. Attribute cost to measured functions or commands rather than sourcing each module in an empty shell.

## Optimization branches

- **External commands during startup:** cache stable output or move work behind first use.
- **Version managers:** use the repository's existing lazy-loader pattern; verify `node`, package managers, and completions after changing it.
- **Completions:** initialize once, reuse a valid dump, and measure before changing cache policy.
- **PATH construction:** deduplicate entries while preserving order and intentional precedence.
- **Plugins:** remove or defer only when profile evidence names them.

A lazy wrapper must preserve arguments, exit status, completion behavior, and command discovery. Prefer an existing repository helper over an `eval`-generated generic wrapper.

## Completion gate

Done when the profile names the dominant measured costs, each change has before/after median samples, and affected commands still pass a first-use smoke test.