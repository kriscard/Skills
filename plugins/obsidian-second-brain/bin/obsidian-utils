#!/usr/bin/env bash
# obsidian-utils.sh - Unified Obsidian CLI operations
#
# Usage: source this script and use the functions, OR call directly:
#   ./obsidian-utils.sh read "path/to/note.md"
#   ./obsidian-utils.sh append "path/to/note.md" "content"
#   ./obsidian-utils.sh list "folder/"
#   ./obsidian-utils.sh search "query"
#
# Commands:
#   ./obsidian-utils.sh tasks [all|daily|done|todo]
#   ./obsidian-utils.sh tags [all] [counts]
#   ./obsidian-utils.sh backlinks "file"
#   ./obsidian-utils.sh links "file"
#   ./obsidian-utils.sh unresolved
#   ./obsidian-utils.sh orphans
#   ./obsidian-utils.sh outline "file"
#   ./obsidian-utils.sh properties "file"
#   ./obsidian-utils.sh property-set "file" "name" "value"
#   ./obsidian-utils.sh property-read "file" "name"
#   ./obsidian-utils.sh templates
#   ./obsidian-utils.sh template-read "name"

set -euo pipefail

# Error message when CLI fails
cli_failed() {
    echo "Obsidian CLI isn't working — update Obsidian with CLI enabled." >&2
    return 1
}

# ============================================================================
# Core File Operations
# ============================================================================

# Read a file from the vault
# Usage: obsidian_read "path/to/note.md"
obsidian_read() {
    local path="$1"
    obsidian read path="$path" 2>/dev/null || cli_failed
}

# Read a file by name (wikilink-style resolution)
# Usage: obsidian_read_file "Recipe" (finds Recipe.md anywhere)
obsidian_read_file() {
    local file="$1"
    obsidian read file="$file" 2>/dev/null || cli_failed
}

# List files in a directory
# Usage: obsidian_list "folder/" [format: text|json]
obsidian_list() {
    local folder="$1"
    local format="${2:-json}"
    obsidian files folder="$folder" format="$format" 2>/dev/null || cli_failed
}

# Create a new file
# Usage: obsidian_create "path/to/note.md" "content" [template] [overwrite:true|false]
obsidian_create() {
    local path="$1"
    local content="${2:-}"
    local template="${3:-}"
    local overwrite="${4:-false}"

    local cmd="obsidian create path=\"$path\" silent"
    [[ -n "$content" ]] && cmd="$cmd content=\"$content\""
    [[ -n "$template" ]] && cmd="$cmd template=\"$template\""
    [[ "$overwrite" == "true" ]] && cmd="$cmd overwrite"
    eval "$cmd" 2>/dev/null && echo "Created: $path" || cli_failed
}

# Create a file from template
# Usage: obsidian_create_from_template "path/to/note.md" "TemplateName"
obsidian_create_from_template() {
    local path="$1"
    local template="$2"
    obsidian create path="$path" template="$template" silent 2>/dev/null && echo "Created from template: $path" || cli_failed
}

# Append content to a file
# Usage: obsidian_append "path/to/note.md" "content" [inline:true|false]
obsidian_append() {
    local path="$1"
    local content="$2"
    local inline="${3:-false}"

    local cmd="obsidian append path=\"$path\" content=\"$content\" silent"
    [[ "$inline" == "true" ]] && cmd="$cmd inline"
    eval "$cmd" 2>/dev/null && echo "Appended to: $path" || cli_failed
}

# Prepend content to a file (after frontmatter)
# Usage: obsidian_prepend "path/to/note.md" "content" [inline:true|false]
obsidian_prepend() {
    local path="$1"
    local content="$2"
    local inline="${3:-false}"

    local cmd="obsidian prepend path=\"$path\" content=\"$content\" silent"
    [[ "$inline" == "true" ]] && cmd="$cmd inline"
    eval "$cmd" 2>/dev/null && echo "Prepended to: $path" || cli_failed
}

# Delete a file
# Usage: obsidian_delete "path/to/note.md" [permanent:true|false]
obsidian_delete() {
    local path="$1"
    local permanent="${2:-false}"

    local cmd="obsidian delete path=\"$path\""
    [[ "$permanent" == "true" ]] && cmd="$cmd permanent"
    eval "$cmd" 2>/dev/null && echo "Deleted: $path" || cli_failed
}

# Move/rename a file
# Usage: obsidian_move "path/to/note.md" "new/path/or/name.md"
obsidian_move() {
    local path="$1"
    local to="$2"
    obsidian move path="$path" to="$to" 2>/dev/null && echo "Moved: $path -> $to" || cli_failed
}

# ============================================================================
# Search Operations
# ============================================================================

# Search the vault
# Usage: obsidian_search "query" [format: text|json] [limit]
obsidian_search() {
    local query="$1"
    local format="${2:-json}"
    local limit="${3:-}"

    local cmd="obsidian search query=\"$query\" format=\"$format\""
    [[ -n "$limit" ]] && cmd="$cmd limit=$limit"
    eval "$cmd" 2>/dev/null || cli_failed
}

# ============================================================================
# Daily Notes
# ============================================================================

# Get daily note (today's)
# Usage: obsidian_daily [action: read|append|prepend] [content]
obsidian_daily() {
    local action="${1:-read}"
    local content="${2:-}"

    case "$action" in
        read)
            obsidian daily:read 2>/dev/null || cli_failed
            ;;
        append)
            obsidian daily:append content="$content" silent 2>/dev/null && echo "Appended to daily note" || cli_failed
            ;;
        prepend)
            obsidian daily:prepend content="$content" silent 2>/dev/null && echo "Prepended to daily note" || cli_failed
            ;;
        open)
            obsidian daily silent 2>/dev/null || cli_failed
            ;;
        *)
            echo "Unknown action: $action" >&2
            return 1
            ;;
    esac
}

# ============================================================================
# Tasks
# ============================================================================

# List tasks
# Usage: obsidian_tasks [filter: all|daily|done|todo] [verbose:true|false]
obsidian_tasks() {
    local filter="${1:-all}"
    local verbose="${2:-false}"

    local cmd="obsidian tasks"
    case "$filter" in
        all) cmd="$cmd all" ;;
        daily) cmd="$cmd daily" ;;
        done) cmd="$cmd done" ;;
        todo) cmd="$cmd todo" ;;
    esac
    [[ "$verbose" == "true" ]] && cmd="$cmd verbose"
    eval "$cmd" 2>/dev/null || cli_failed
}

# Toggle a task
# Usage: obsidian_task_toggle "path/to/note.md" "line_number"
obsidian_task_toggle() {
    local path="$1"
    local line="$2"
    obsidian task path="$path" line="$line" toggle 2>/dev/null && echo "Toggled task at $path:$line" || cli_failed
}

# ============================================================================
# Tags
# ============================================================================

# List tags
# Usage: obsidian_tags [all:true|false] [counts:true|false]
obsidian_tags() {
    local all="${1:-true}"
    local counts="${2:-true}"

    local cmd="obsidian tags"
    [[ "$all" == "true" ]] && cmd="$cmd all"
    [[ "$counts" == "true" ]] && cmd="$cmd counts"
    eval "$cmd" 2>/dev/null || cli_failed
}

# Get tag info
# Usage: obsidian_tag "tagname" [verbose:true|false]
obsidian_tag() {
    local name="$1"
    local verbose="${2:-true}"

    local cmd="obsidian tag name=\"$name\""
    [[ "$verbose" == "true" ]] && cmd="$cmd verbose"
    eval "$cmd" 2>/dev/null || cli_failed
}

# ============================================================================
# Links
# ============================================================================

# List backlinks to a file
# Usage: obsidian_backlinks "path/to/note.md" [counts:true|false]
obsidian_backlinks() {
    local path="$1"
    local counts="${2:-true}"

    local cmd="obsidian backlinks path=\"$path\""
    [[ "$counts" == "true" ]] && cmd="$cmd counts"
    eval "$cmd" 2>/dev/null || cli_failed
}

# List outgoing links from a file
# Usage: obsidian_links "path/to/note.md"
obsidian_links() {
    local path="$1"
    obsidian links path="$path" 2>/dev/null || cli_failed
}

# List unresolved (broken) links
# Usage: obsidian_unresolved [verbose:true|false]
obsidian_unresolved() {
    local verbose="${1:-true}"

    local cmd="obsidian unresolved"
    [[ "$verbose" == "true" ]] && cmd="$cmd verbose counts"
    eval "$cmd" 2>/dev/null || cli_failed
}

# List orphan files (no incoming links)
# Usage: obsidian_orphans
obsidian_orphans() {
    obsidian orphans 2>/dev/null || cli_failed
}

# List dead-end files (no outgoing links)
# Usage: obsidian_deadends
obsidian_deadends() {
    obsidian deadends 2>/dev/null || cli_failed
}

# ============================================================================
# Outline & Structure
# ============================================================================

# Show file outline (headings)
# Usage: obsidian_outline "path/to/note.md" [format: tree|md]
obsidian_outline() {
    local path="$1"
    local format="${2:-tree}"
    obsidian outline path="$path" format="$format" 2>/dev/null || cli_failed
}

# ============================================================================
# Properties
# ============================================================================

# List properties of a file
# Usage: obsidian_properties "path/to/note.md" [format: yaml|tsv]
obsidian_properties() {
    local path="$1"
    local format="${2:-yaml}"
    obsidian properties path="$path" format="$format" 2>/dev/null || cli_failed
}

# Set a property on a file
# Usage: obsidian_property_set "path/to/note.md" "name" "value" [type]
obsidian_property_set() {
    local path="$1"
    local name="$2"
    local value="$3"
    local type="${4:-text}"
    obsidian property:set path="$path" name="$name" value="$value" type="$type" 2>/dev/null && echo "Set property $name=$value on $path" || cli_failed
}

# Read a property from a file
# Usage: obsidian_property_read "path/to/note.md" "name"
obsidian_property_read() {
    local path="$1"
    local name="$2"
    obsidian property:read path="$path" name="$name" 2>/dev/null || cli_failed
}

# Remove a property from a file
# Usage: obsidian_property_remove "path/to/note.md" "name"
obsidian_property_remove() {
    local path="$1"
    local name="$2"
    obsidian property:remove path="$path" name="$name" 2>/dev/null && echo "Removed property $name from $path" || cli_failed
}

# ============================================================================
# Templates
# ============================================================================

# List templates
# Usage: obsidian_templates
obsidian_templates() {
    obsidian templates 2>/dev/null || cli_failed
}

# Read template content
# Usage: obsidian_template_read "TemplateName" [resolve:true|false]
obsidian_template_read() {
    local name="$1"
    local resolve="${2:-true}"

    local cmd="obsidian template:read name=\"$name\""
    [[ "$resolve" == "true" ]] && cmd="$cmd resolve"
    eval "$cmd" 2>/dev/null || cli_failed
}

# ============================================================================
# Vault Info
# ============================================================================

# Get vault info
# Usage: obsidian_vault_info [info: name|path|files|folders|size]
obsidian_vault_info() {
    local info="${1:-}"

    if [[ -n "$info" ]]; then
        obsidian vault info="$info" 2>/dev/null || cli_failed
    else
        obsidian vault 2>/dev/null || cli_failed
    fi
}

# Check CLI status
# Usage: obsidian_status
obsidian_status() {
    obsidian vault 2>/dev/null || cli_failed
}

# ============================================================================
# Aliases
# ============================================================================

# Get all aliases in vault
# Usage: obsidian_aliases [all:true|false]
obsidian_aliases() {
    local all="${1:-true}"

    local cmd="obsidian aliases"
    [[ "$all" == "true" ]] && cmd="$cmd all verbose"
    eval "$cmd" 2>/dev/null || cli_failed
}

# ============================================================================
# Word Count
# ============================================================================

# Get word count for a file
# Usage: obsidian_wordcount "path/to/note.md"
obsidian_wordcount() {
    local path="$1"
    obsidian wordcount path="$path" 2>/dev/null || cli_failed
}

# ============================================================================
# Main - Direct CLI invocation
# ============================================================================

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    command="${1:-status}"
    shift || true

    case "$command" in
        # Core file operations
        read)
            obsidian_read "$@"
            ;;
        read-file)
            obsidian_read_file "$@"
            ;;
        list)
            obsidian_list "$@"
            ;;
        create)
            obsidian_create "$@"
            ;;
        create-template)
            obsidian_create_from_template "$@"
            ;;
        append)
            obsidian_append "$@"
            ;;
        prepend)
            obsidian_prepend "$@"
            ;;
        delete)
            obsidian_delete "$@"
            ;;
        move)
            obsidian_move "$@"
            ;;
        search)
            obsidian_search "$@"
            ;;
        # Daily notes
        daily)
            obsidian_daily "$@"
            ;;
        # Tasks
        tasks)
            obsidian_tasks "$@"
            ;;
        task-toggle)
            obsidian_task_toggle "$@"
            ;;
        # Tags
        tags)
            obsidian_tags "$@"
            ;;
        tag)
            obsidian_tag "$@"
            ;;
        # Links
        backlinks)
            obsidian_backlinks "$@"
            ;;
        links)
            obsidian_links "$@"
            ;;
        unresolved)
            obsidian_unresolved "$@"
            ;;
        orphans)
            obsidian_orphans
            ;;
        deadends)
            obsidian_deadends
            ;;
        # Structure
        outline)
            obsidian_outline "$@"
            ;;
        # Properties
        properties)
            obsidian_properties "$@"
            ;;
        property-set)
            obsidian_property_set "$@"
            ;;
        property-read)
            obsidian_property_read "$@"
            ;;
        property-remove)
            obsidian_property_remove "$@"
            ;;
        # Templates
        templates)
            obsidian_templates
            ;;
        template-read)
            obsidian_template_read "$@"
            ;;
        # Vault
        vault)
            obsidian_vault_info "$@"
            ;;
        status)
            obsidian_status
            ;;
        # Misc
        aliases)
            obsidian_aliases "$@"
            ;;
        wordcount)
            obsidian_wordcount "$@"
            ;;
        *)
            echo "Unknown command: $command" >&2
            echo ""
            echo "Usage: $0 <command> [args...]"
            echo ""
            echo "File Operations:"
            echo "  read <path>              Read file content"
            echo "  read-file <name>         Read file by name (wikilink resolution)"
            echo "  list <folder> [format]   List files in folder"
            echo "  create <path> [content] [template] [overwrite]"
            echo "  create-template <path> <template>"
            echo "  append <path> <content> [inline]"
            echo "  prepend <path> <content> [inline]"
            echo "  delete <path> [permanent]"
            echo "  move <path> <to>"
            echo "  search <query> [format] [limit]"
            echo ""
            echo "Daily Notes:"
            echo "  daily [read|append|prepend|open] [content]"
            echo ""
            echo "Tasks:"
            echo "  tasks [all|daily|done|todo] [verbose]"
            echo "  task-toggle <path> <line>"
            echo ""
            echo "Tags:"
            echo "  tags [all] [counts]"
            echo "  tag <name> [verbose]"
            echo ""
            echo "Links:"
            echo "  backlinks <path> [counts]"
            echo "  links <path>"
            echo "  unresolved [verbose]"
            echo "  orphans"
            echo "  deadends"
            echo ""
            echo "Structure:"
            echo "  outline <path> [format: tree|md]"
            echo ""
            echo "Properties:"
            echo "  properties <path> [format: yaml|tsv]"
            echo "  property-set <path> <name> <value> [type]"
            echo "  property-read <path> <name>"
            echo "  property-remove <path> <name>"
            echo ""
            echo "Templates:"
            echo "  templates"
            echo "  template-read <name> [resolve]"
            echo ""
            echo "Vault:"
            echo "  vault [info: name|path|files|folders|size]"
            echo "  status"
            echo ""
            echo "Misc:"
            echo "  aliases [all]"
            echo "  wordcount <path>"
            exit 1
            ;;
    esac
fi
