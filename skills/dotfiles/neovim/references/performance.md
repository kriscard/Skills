> **Read this when:** Neovim has a measured startup regression or a plugin/config path needs profiling and lazy-boundary analysis.

# Neovim performance

## Measure process startup

Warm once, then collect one total from each independent log and report the median:

```sh
nvim --headless '+qa' 2>/dev/null
rm -f /tmp/nvim-startup-*.log
for run in 1 2 3 4 5 6 7; do
  nvim --headless --startuptime "/tmp/nvim-startup-$run.log" '+qa' 2>/dev/null
done
awk '/NVIM STARTED/ { print FILENAME, $1 }' /tmp/nvim-startup-*.log | sort -k2 -n
```

Use the fourth value from seven sorted totals as the median. Keep the individual logs for attribution. Compare with an earlier baseline on the same machine; fixed thresholds are secondary evidence.

## Attribute cost

Use `:Lazy profile` for plugin load timing. In startup logs, sort self-time when looking for expensive individual events:

```sh
sort -k2 -n /tmp/nvim-startup-4.log | tail -20
```

A slow timestamp alone does not prove a plugin is the cause; map the event to its parent source or require chain.

## Choose a valid boundary

Use a boundary that matches real entry behavior:

- `cmd` for a plugin entered through commands
- `keys` for user mappings that can load the plugin
- `ft` for language-specific behavior
- a documented event when the plugin must attach to every relevant buffer
- eager loading when the plugin's current API requires initialization before those boundaries

The repository's `nvim-treesitter` main integration is intentionally eager. Preserve that requirement unless current upstream behavior and a passing test demonstrate otherwise.

## Common measured causes

- synchronous filesystem or process work during module evaluation
- duplicate setup or duplicate plugin-manager initialization
- broad dependencies that force an otherwise lazy spec to load
- top-level requires that bypass a spec's intended boundary
- generated caches rebuilt on every startup

Treat `vim.loader.enable()` as version-aware rather than guaranteed savings; test its effect on the repository's required Neovim version.

## Completion gate

Done when independent runs produce a median, the dominant costs are linked to source locations, each change has before/after evidence, and startup plus the affected user behavior still pass.