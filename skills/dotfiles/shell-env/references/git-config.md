> **Read this when:** The user is changing Git identity, signing, conditional includes, aliases, pager/diff tooling, or multi-config setup in shell dotfiles.

# Git configuration

The canonical sources are `~/.dotfiles/home/.gitconfig`, `.gitconfig-personal`, and `.gitconfig-work`, linked into the home directory by the single `home` Stow package. Inspect current values and preserve private identity details in reports.

## Conditional identities

Git resolves include paths from the linked home config. Prefer home-facing paths in includes:

```gitconfig
[includeIf "gitdir:~/personal/**"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/work/**"]
    path = ~/.gitconfig-work
```

Match patterns to the user's actual repository roots. Remember that `gitdir` matching and trailing `/**` semantics matter; verify from repositories on both sides of the boundary.

```sh
git config --show-origin --get-regexp '^(user|includeIf)\.'
git config --get user.name
git config --get user.email
git config --get user.signingkey
git config --get commit.gpgsign
```

Done when representative personal and work repositories resolve the intended identity and signing configuration from the expected source file.

## Signing

Inspect the configured signing format before assuming GPG or SSH. Treat private keys as secrets and public-key paths or identifiers as configuration. Verify with a disposable signed commit or the repository's established signing check; keep private identity values out of reports.

## Aliases

Read existing aliases before adding one:

```sh
git config --show-origin --get-regexp '^alias\.'
```

Choose aliases that preserve arguments and quote shell fragments deliberately. For destructive or branch-cleanup aliases, test against a disposable repository containing merged, unmerged, protected, and oddly named branches.

## Pager and diff tooling

Verify the selected tool is installed and inspect current `core.pager`, `interactive.diffFilter`, and tool-specific options. Exercise normal diff, staged diff, log, and interactive add after a change.

## Completion gate

Done when effective values are verified from representative repository paths, signing behavior is exercised when changed, aliases pass their relevant edge cases, and only source files under `~/.dotfiles/home/` were edited.