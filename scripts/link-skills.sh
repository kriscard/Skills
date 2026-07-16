#!/usr/bin/env bash
set -euo pipefail

# Links manifest-owned skills directly into Claude Code and Pi.
# Run with --dry-run first. Real files/directories are never deleted or replaced.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
MODE="${1:-apply}"
MANIFEST="$REPO/.claude-plugin/plugin.json"

if [[ "$MODE" != "apply" && "$MODE" != "--dry-run" ]]; then
  echo "usage: $0 [--dry-run]" >&2
  exit 2
fi

DESTINATIONS=(
  "$HOME/.claude/skills"
  "$HOME/.pi/agent/skills"
)

SOURCES=()
while IFS= read -r relative; do
  src="$REPO/${relative#./}"
  if [[ ! -f "$src/SKILL.md" ]]; then
    echo "error: manifest skill is missing SKILL.md: $relative" >&2
    exit 1
  fi
  SOURCES+=("$src")
done < <(jq -r '.skills[]' "$MANIFEST")

check_destination_root() {
  local dest="$1"
  if [[ ( -e "$dest" || -L "$dest" ) && ! -d "$dest" ]]; then
    echo "error: $dest exists but is not a directory; leaving it untouched." >&2
    return 1
  fi
  if [[ -L "$dest" ]]; then
    local resolved
    resolved="$(readlink -f "$dest")"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $dest is a symlink into this repo ($resolved)." >&2
        return 1
        ;;
    esac
  fi
}

# Preflight the entire operation before changing anything.
conflicts=0
for dest in "${DESTINATIONS[@]}"; do
  check_destination_root "$dest" || conflicts=$((conflicts + 1))
  for src in "${SOURCES[@]}"; do
    name="$(basename "$src")"
    target="$dest/$name"
    if [[ -e "$target" && ! -L "$target" ]]; then
      echo "conflict: $target is a real file or directory; leaving it untouched." >&2
      conflicts=$((conflicts + 1))
    fi
  done
done

if (( conflicts > 0 )); then
  echo "error: found $conflicts conflict(s). Move or remove them manually, then rerun." >&2
  exit 1
fi

if [[ "$MODE" == "--dry-run" ]]; then
  for dest in "${DESTINATIONS[@]}"; do
    [[ -d "$dest" ]] || echo "would create runtime directory: $dest"
    for src in "${SOURCES[@]}"; do
      name="$(basename "$src")"
      target="$dest/$name"
      if [[ -L "$target" ]]; then
        echo "would relink $target -> $src (currently $(readlink "$target"))"
      else
        echo "would link $target -> $src"
      fi
    done
  done
  exit 0
fi

for dest in "${DESTINATIONS[@]}"; do
  mkdir -p "$dest"
  for src in "${SOURCES[@]}"; do
    name="$(basename "$src")"
    target="$dest/$name"
    ln -sfn "$src" "$target"
    echo "linked $target -> $src"
  done
done
