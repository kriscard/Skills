> **Read this when:** A dotfiles scan finds credential candidates, unsafe permissions, shell-history risks, or ignore gaps that need remediation.

# Security remediation

## Live-secret response

For a confirmed live credential:

1. Keep the value out of output, patches, reports, and chat.
2. Revoke or rotate it at the provider.
3. Replace the tracked value with a lookup from the chosen secret store or a local ignored file.
4. Verify the current tree is clean with a redacted scan.
5. Determine whether Git history or remote caches require cleanup.

Done when the old credential is invalid, the replacement source is untracked, and verification reports only redacted locations.

## Secret storage

Prefer the platform keychain, a password-manager CLI, or another existing secret store. When the repository already uses a local ignored environment file, keep it outside the Stow package when practical, restrict it to the user, and source it explicitly.

Commit templates with empty or unmistakably fake values:

```dotenv
GITHUB_TOKEN=
OPENAI_API_KEY=
AWS_ACCESS_KEY_ID=
```

## Permissions

Inspect contents only when required for the finding. Typical private files use user-only permissions:

```sh
chmod 600 ~/.dotfiles/.env
chmod 600 ~/.netrc ~/.authinfo
```

Git identity files need user-only permissions only when they contain private material; email addresses and public signing-key identifiers are not secrets.

## Shell history

Use `HIST_IGNORE_SPACE` only as defense in depth: a leading-space convention is easy to forget. Prefer commands that read secrets from stdin, the keychain, or a protected file. Inspect the current history options before editing them.

## Version control

Derive ignore rules from real local-secret paths. Common candidates include:

```gitignore
.env
.env.*
!.env.example
.netrc
.authinfo
**/99-local.zsh
**/*.local.*
.zcompdump*
*.zwc
```

Confirm behavior rather than assuming the pattern works:

```sh
git -C ~/.dotfiles check-ignore -v .env
git -C ~/.dotfiles status --short --ignored
```

Done when each sensitive local file is ignored or intentionally tracked, permissions match its contents, and no secret value appears in verification output.