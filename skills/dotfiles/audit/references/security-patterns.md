# Security Patterns

Credential management, file permissions, and history security for dotfiles.

## Credential Management

**Never hardcode credentials**:
```zsh
# BAD
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"

# GOOD
# In .env (not committed)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# In 99-local.zsh (not committed)
[ -f "$HOME/.dotfiles/.env" ] && source "$HOME/.dotfiles/.env"
```

**Use .env.example pattern**:
```bash
# .env.example (committed as template)
GITHUB_TOKEN=ghp_your_token_here
OPENAI_API_KEY=sk-your_key_here
AWS_ACCESS_KEY_ID=your_access_key
```

## File Permissions

**Sensitive files should be 600** (user read/write only):
- `.gitconfig-work`, `.gitconfig-personal` (if containing tokens)
- `.env` files
- `.ssh/config`
- `.netrc`, `.authinfo`

```bash
chmod 600 ~/.dotfiles/.gitconfig-work
```

## History Security

**Prevent sensitive commands in history**:
```zsh
# In zsh.d/10-options.zsh
setopt HIST_IGNORE_SPACE  # Commands starting with space aren't logged

# Exclude patterns (zsh 5.3+)
HISTORY_IGNORE="(ls|cd|pwd|exit|clear)*"
```

**Usage**: Prefix sensitive commands with space
```bash
# Not logged due to leading space
 export API_KEY=secret
```

## Version Control

**What to commit**:
- Configuration templates
- Scripts and functions
- Plugin lists
- `.env.example` files

**What NOT to commit**:
- Secrets (.env, tokens)
- Local overrides (99-local.zsh)
- Machine-specific paths
- Cache files (.zcompdump)

**.gitignore patterns**:
```gitignore
# Secrets
.env
*_token
*_secret
*_key

# Local overrides
**/99-local.zsh
**/*.local.*

# Cache
*.zwc
.zcompdump*
.DS_Store
```
