# Git Configuration Patterns

Multi-identity setup, useful aliases, and git tool integrations.

## Multi-Config Strategy

Separate personal and work configurations:

**Main .gitconfig**:
```gitconfig
[user]
    name = Chris Cardoso

[includeIf "gitdir:~/personal/"]
    path = ~/.dotfiles/.gitconfig-personal

[includeIf "gitdir:~/work/"]
    path = ~/.dotfiles/.gitconfig-work

[core]
    editor = nvim
    pager = delta

[init]
    defaultBranch = main
```

**Personal config** (`.gitconfig-personal`):
```gitconfig
[user]
    email = contact@christophercardoso.dev
    signingkey = PERSONAL_GPG_KEY

[commit]
    gpgsign = true
```

**Work config** (`.gitconfig-work`):
```gitconfig
[user]
    email = chris.cardoso@company.com
    signingkey = WORK_GPG_KEY

[commit]
    gpgsign = true
```

**Benefits**:
- Automatic email switching based on directory
- Different signing keys for personal vs work
- Easy to manage separate identities

## Useful Git Aliases

```gitconfig
[alias]
    # Status and logs
    st = status -sb
    lg = log --graph --oneline --decorate --all
    last = log -1 HEAD --stat

    # Quick operations
    co = checkout
    cob = checkout -b
    cm = commit -m
    ca = commit --amend

    # Undo
    undo = reset HEAD~1 --soft
    unstage = reset HEAD --

    # Cleanup
    prune = fetch --prune
    clean-merged = !git branch --merged | grep -v '\\*\\|main\\|master' | xargs -n 1 git branch -d
```
