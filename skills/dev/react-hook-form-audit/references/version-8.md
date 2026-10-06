> **Read this when:** the installed project uses RHF v8 beta/stable, requests a v8 migration, or exposes v8-only methods in its types.

# React Hook Form v8 gate

Inspect `package.json`, the lockfile, installed declarations, and the current official migration
guide. Generate v7-compatible code unless project evidence confirms the v8 API.

The published beta migration guide includes these changes:

- React Compiler compatibility;
- flat field-array support;
- generated field-array identity changing from `id` to `key` and removal of `keyName`;
- callback `watch` removal in favor of `subscribe`;
- whole-array `setValue` replacement by `replace`;
- `Watch` prop changes;
- newer APIs documented on the live site, including `resetDefaultValues`, may require installed-type
  confirmation because live docs mix stable and forward-facing material.

Do not infer v8 from the documentation site's presence of a method. Typecheck is the final API
contract for the installed project.

Source: [V7 to V8 migration](https://react-hook-form.com/migrate-v7-to-v8),
[API docs](https://react-hook-form.com/docs).
