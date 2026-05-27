> **Read this when:** running tests concurrently, configuring parallel file execution, sharding across CI machines, test sequence/shuffle, pool options, or merging reports.

# Concurrency & Parallelism

## File Parallelism

By default, Vitest runs test files in parallel across workers:

```ts
defineConfig({
  test: {
    fileParallelism: true,  // default: true
    maxWorkers: 4,
    minWorkers: 1,
    pool: 'threads',        // 'threads' | 'forks' | 'vmThreads'
  },
})
```

## Concurrent Tests (within a file)

```ts
test.concurrent('test 1', async ({ expect }) => {
  expect(await fetch1()).toBe('result')
})

test.concurrent('test 2', async ({ expect }) => {
  expect(await fetch2()).toBe('result')
})

// All tests in suite concurrent
describe.concurrent('parallel suite', () => {
  test('test 1', async ({ expect }) => {})
  test('test 2', async ({ expect }) => {})
})
```

**Important:** Use `{ expect }` from context for concurrent tests, not the imported `expect`.

## Sequential in Concurrent Context

```ts
describe.concurrent('mostly parallel', () => {
  test('parallel 1', async () => {})
  test('parallel 2', async () => {})

  test.sequential('must run alone 1', async () => {})
  test.sequential('must run alone 2', async () => {})
})
```

## Max Concurrency

```ts
defineConfig({
  test: {
    maxConcurrency: 5, // max concurrent tests per file
  },
})
```

## Sharding for CI

```bash
# Machine 1
vitest run --shard=1/3

# Machine 2
vitest run --shard=2/3

# Machine 3
vitest run --shard=3/3
```

### GitHub Actions Matrix

```yaml
jobs:
  test:
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - run: vitest run --shard=${{ matrix.shard }}/3 --reporter=blob

  merge:
    needs: test
    steps:
      - run: vitest --merge-reports --reporter=junit
```

### Merge Reports

```bash
vitest run --shard=1/3 --reporter=blob --coverage
vitest run --shard=2/3 --reporter=blob --coverage
vitest --merge-reports --reporter=json --coverage
```

## Test Sequence

```ts
defineConfig({
  test: {
    sequence: {
      shuffle: true,       // random order
      seed: 12345,         // reproducible shuffle
      hooks: 'stack',      // 'stack' | 'list' | 'parallel'
      concurrent: true,    // all tests concurrent by default
    },
  },
})
```

## Pool Options

```ts
defineConfig({
  test: {
    // Threads (default) — faster
    pool: 'threads',
    poolOptions: {
      threads: { maxThreads: 8, minThreads: 2, isolate: true },
    },

    // Forks — better isolation, slower
    pool: 'forks',
    poolOptions: {
      forks: { maxForks: 4, isolate: true },
    },
  },
})
```

## Bail on Failure

```bash
vitest --bail 1    # stop after 1 failure
```

## Key Points

- Files run in parallel by default
- Use `.concurrent` for parallel tests within a file
- Always use context's `expect` in concurrent tests
- Sharding splits test files across CI machines — use `--merge-reports` to combine
- Shuffle tests to find hidden order dependencies
