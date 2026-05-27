> **Read this when:** using the Vitest CLI, running tests from the terminal, setting up package.json scripts, sharding in CI, or watch mode shortcuts.

# Command Line Interface

## Commands

```bash
vitest                    # Watch mode in dev, run mode in CI
vitest foobar             # Run tests containing "foobar" in path
vitest basic/foo.test.ts:10  # Run specific test by file and line number
vitest run                # Run once without watch mode
vitest watch              # Explicitly start watch mode
vitest related src/index.ts src/utils.ts --run  # Run tests that import specific files
vitest bench              # Run only benchmark tests
vitest list               # List all matching tests without running
vitest list --json        # Output as JSON
vitest list --filesOnly   # List only test files
vitest init browser       # Set up browser testing
```

## Common Options

```bash
# Configuration
--config <path>           # Path to config file
--project <name>          # Run specific project

# Filtering
--testNamePattern, -t     # Run tests matching pattern
--changed                 # Run tests for changed files
--changed HEAD~1          # Tests for last commit changes

# Reporters
--reporter <name>         # default, verbose, dot, json, html
--reporter=html --outputFile=report.html

# Coverage
--coverage                # Enable coverage
--coverage.provider v8
--coverage.reporter text,html

# Execution
--shard <index>/<count>   # Split tests across machines
--bail <n>                # Stop after n failures
--retry <n>               # Retry failed tests n times
--sequence.shuffle        # Randomize test order

# Environment
--environment <env>       # jsdom, happy-dom, node
--globals                 # Enable global APIs

# Debugging
--inspect                 # Enable Node inspector
--inspect-brk             # Break on start

# Output
--silent                  # Suppress console output
--no-color                # Disable colors
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "coverage": "vitest run --coverage"
  }
}
```

## Sharding for CI

```bash
# Machine 1
vitest run --shard=1/3 --reporter=blob

# Machine 2
vitest run --shard=2/3 --reporter=blob

# Machine 3
vitest run --shard=3/3 --reporter=blob

# Merge reports
vitest --merge-reports --reporter=junit
```

## Watch Mode Keyboard Shortcuts

- `a` — Run all tests
- `f` — Run only failed tests
- `u` — Update snapshots
- `p` — Filter by filename pattern
- `t` — Filter by test name pattern
- `q` — Quit

## Key Points

- Watch mode is default in dev, run mode in CI (when `process.env.CI` is set)
- Use `--run` flag to ensure single run (important for lint-staged)
- Both camelCase (`--testTimeout`) and kebab-case (`--test-timeout`) work
- Boolean options can be negated with `--no-` prefix
