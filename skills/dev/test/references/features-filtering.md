> **Read this when:** filtering tests by name/path/tag, using --changed, test.only/skip, include/exclude patterns, or listing tests without running.

# Test Filtering

## CLI Filtering

```bash
vitest user                          # files containing "user"
vitest user auth                     # multiple patterns
vitest src/user.test.ts              # specific file
vitest src/user.test.ts:25           # by file + line number
vitest -t "login"                    # by test name
vitest --testNamePattern "should.*"  # regex
```

## Changed Files

```bash
vitest --changed                  # uncommitted changes
vitest --changed HEAD~1           # since last commit
vitest --changed origin/main      # since branch
```

## Related Files

Run tests that import specific files (useful with lint-staged):

```bash
vitest related src/utils.ts src/api.ts --run
```

```js
// .lintstagedrc.js
export default {
  '*.{ts,tsx}': 'vitest related --run',
}
```

## Focus Tests (.only)

```ts
test.only('only this runs', () => {})
describe.only('only this suite', () => {})
```

In CI, `.only` throws unless configured:

```ts
defineConfig({
  test: {
    allowOnly: true,
  },
})
```

## Skip Tests

```ts
test.skip('skipped', () => {})
test.skipIf(process.env.CI)('not in CI', () => {})
test.runIf(!process.env.CI)('local only', () => {})

test('dynamic', ({ skip }) => {
  skip(someCondition, 'reason')
})
```

## Tags

```ts
test('database test', { tags: ['db'] }, () => {})
test('slow test', { tags: ['slow', 'integration'] }, () => {})
```

```bash
vitest --tags db
vitest --tags "db,slow"
```

```ts
defineConfig({
  test: {
    tags: ['db', 'slow', 'integration'],
    strictTags: true, // fail on unknown tags
  },
})
```

## Include/Exclude Patterns

```ts
defineConfig({
  test: {
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/e2e/**', '**/*.skip.test.ts'],
    includeSource: ['src/**/*.ts'], // for in-source testing
  },
})
```

## Watch Mode Shortcuts

- `p` — filter by filename pattern
- `t` — filter by test name pattern
- `a` — run all tests
- `f` — run only failed tests

## Projects Filtering

```bash
vitest --project unit
vitest --project integration --project e2e
```

## List Tests Without Running

```bash
vitest list                  # show all test names
vitest list -t "user"        # filter by name
vitest list --filesOnly      # file paths only
vitest list --json           # JSON output
```

## Key Points

- Use `-t` for test name pattern filtering
- `--changed` runs only tests affected by uncommitted changes
- `--related` runs tests importing specific files
- Tags provide semantic grouping runnable from CLI
- Use `.only` for debugging — configure CI to reject it (`allowOnly: false`)
