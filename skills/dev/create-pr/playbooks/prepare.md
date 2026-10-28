> **Read this when:** the user wants a title, description or publication plan without remote changes.

# Prepare without publishing

1. Read the supplied change or local diff and relevant repository/template guidance. Inspect
   staged, unstaged and in-scope untracked content as needed to identify what the user means;
   preserve it. Distinguish the proposed working-tree change from an already committed comparison.
2. Write the title/body with the description reference. Use available evidence and mark missing
   context provisional. No remote access is required to produce a useful qualified draft.
3. Return the content and any missing decisions for later publication. A private temporary body
   file is optional; do not add one to the repository automatically. Preview locally, not with
   `gh pr create --dry-run`, which may push.

Complete with `prepared — not published`. No branch, index, commit, remote PR or upload changes.
