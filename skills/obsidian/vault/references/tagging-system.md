# Tagging System

Tags complement PARA folders — they cut **across** folder structure for cross-category discovery.

> **Folders = "What type"** (project, area, resource)
> **Tags = "What about"** (React, career, interview)

Don't tag what the folder already tells you.

## Tag Categories

**1. Subject Tags (Pick 1-2):**
- `javascript` - JavaScript ecosystem
- `react` - React framework
- `css` - Styling and design
- `typescript` - TypeScript features
- `web` - General web dev (APIs, GraphQL, performance)
- `career` - Professional development
- `personal` - Health, goals, life
- `tools` - Dev tools and workflows

**2. Status Tags (Optional):**
- `interview` - Job interview prep
- `active` - Currently working on

**3. Flashcard Tags (For spaced repetition):**
- `flashcards` - Any spaced repetition content
- `javascript_flashcards`, `react_flashcards`, `css_flashcards`, `typescript_flashcards`, `web_flashcards`

**4. TIL Tags (For Today I Learned notes):**
- Use `til/` prefix: `til/react`, `til/architecture`, `til/testing`, `til/debugging`, `til/performance`

## Tags NOT to Use

These duplicate folder structure — let PARA handle them:
- ~~`project`~~ -> `1 - Projects/` folder
- ~~`area`~~ -> `2 - Areas/` folder
- ~~`reference`~~ -> `3 - Resources/` folder
- ~~`daily`~~ -> `2 - Areas/Daily Ops/` folder
- ~~`moc`~~ -> `MOCs/` folder
- ~~`meeting`~~ -> File location handles this
- ~~`meta`~~ -> Vault organization files are obvious

## Tagging Best Practices

- Maximum 3-4 tags per note
- Subject tags only — don't duplicate folder info
- Preserve flashcard tags (critical for spaced repetition)
- Use `til/` prefix for TIL discoverability
- Search first, browse second

## Tagging Examples

```yaml
# Flashcards
tags: [flashcards, react, react_flashcards, interview]

# Project notes (in 1 - Projects/)
tags: [react, active]  # NOT [project, react, active]

# Resource files (in 3 - Resources/)
tags: [javascript]  # NOT [reference, javascript]

# TIL notes
tags: [til/react, til/hooks, til/architecture]

# Career meetings (in 2 - Areas/Careers/)
tags: [career]  # NOT [meeting, career]
```
