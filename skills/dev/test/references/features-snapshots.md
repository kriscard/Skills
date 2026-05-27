> **Read this when:** using toMatchSnapshot, inline snapshots, file snapshots, updating snapshots, custom serializers, or error snapshot matching.

# Snapshot Testing

## Basic Snapshot

```ts
test('snapshot', () => {
  const result = generateOutput()
  expect(result).toMatchSnapshot()
})
```

First run creates `.snap` file:

```js
// __snapshots__/test.spec.ts.snap
exports['snapshot 1'] = `
{
  "id": 1,
  "name": "test"
}
`
```

## Inline Snapshots

Stored in the test file itself — Vitest auto-fills them:

```ts
test('inline snapshot', () => {
  const data = { foo: 'bar' }
  expect(data).toMatchInlineSnapshot(`
    {
      "foo": "bar",
    }
  `)
})
```

## File Snapshots

```ts
test('render html', async () => {
  const html = renderComponent()
  await expect(html).toMatchFileSnapshot('./expected/component.html')
})
```

## Snapshot Hints

```ts
test('multiple snapshots', () => {
  expect(header).toMatchSnapshot('header')
  expect(body).toMatchSnapshot('body content')
})
```

## Object Shape Matching

Match partial structure (useful for dynamic values):

```ts
test('shape snapshot', () => {
  const data = {
    id: Math.random(),
    created: new Date(),
    name: 'test'
  }

  expect(data).toMatchSnapshot({
    id: expect.any(Number),
    created: expect.any(Date),
  })
})
```

## Error Snapshots

```ts
expect(() => {
  throw new Error('Something went wrong')
}).toThrowErrorMatchingSnapshot()

expect(() => {
  throw new Error('Bad input')
}).toThrowErrorMatchingInlineSnapshot(`[Error: Bad input]`)
```

## Updating Snapshots

```bash
vitest -u
vitest --update
# In watch mode: press 'u'
```

## Custom Serializers

```ts
expect.addSnapshotSerializer({
  test(val) {
    return val && typeof val.toJSON === 'function'
  },
  serialize(val, config, indentation, depth, refs, printer) {
    return printer(val.toJSON(), config, indentation, depth, refs)
  },
})
```

Or via config:

```ts
defineConfig({
  test: {
    snapshotSerializers: ['./my-serializer.ts'],
  },
})
```

## Concurrent Test Snapshots

Use context's `expect`:

```ts
test.concurrent('concurrent 1', async ({ expect }) => {
  expect(await getData()).toMatchSnapshot()
})
```

## Snapshot File Location

```ts
defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) =>
      testPath.replace('__tests__', '__snapshots__') + snapExtension,
  },
})
```

## Key Points

- Commit snapshot files to version control
- Review snapshot diffs in code review like any other change
- Use `toMatchFileSnapshot` for large outputs (HTML, JSON)
- Inline snapshots auto-update in test file on `vitest -u`
- Use context's `expect` for concurrent tests
