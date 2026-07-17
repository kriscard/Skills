> **Read this when:** implementing dynamic, nested, reorderable, or virtualized rows with `useFieldArray`.

# Field arrays

- Give the array a stable, non-dynamic name.
- Use RHF's generated row identity as the React key: `field.id` in v7; load the v8 reference before
  applying v8 identity changes.
- Append, prepend, insert, and update complete row objects rather than partial `{}` placeholders.
- Keep one `useFieldArray` instance per array name.
- Avoid stacking multiple structural mutations in one event; sequence intent explicitly.
- `update` remounts the row. Use `setValue` for leaf updates when remounting would lose UI state.
- Keep row errors beside rows and collection constraints at the array root.
- Use `type="button"` for add/remove controls and provide accessible names.
- Avoid `shouldUnregister` for reorderable arrays because unmount/remount participates in reorder.
- Treat disabled arrays and whole-array replacement as version-sensitive; inspect installed types.

For virtualized rows, keep form state/defaults above the virtualizer and verify what unmounting does
to off-screen values.

Sources: [useFieldArray](https://react-hook-form.com/docs/usefieldarray),
[advanced virtualized lists](https://react-hook-form.com/advanced-usage),
[shadcn array example](https://ui.shadcn.com/docs/forms/react-hook-form#array-fields).
