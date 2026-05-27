# iA Presenter Markdown Syntax

## Critical: Tabbing Rules

**MUST be tabbed to appear on slides:**
- Regular paragraphs
- Lists (bullets, numbered, tasks)
- Block quotes, tables, images

**NO TAB needed (appear automatically):**
- Headers (`#`, `##`, `###`)
- Horizontal rules (`---`)
- Fenced code blocks
- Math blocks

**Never appears on slides:**
- Comments (`//`)

## Slide Structure

### New Slides
```markdown
---
```

### Headings (no tab needed)
```markdown
# Heading 1
## Heading 2
### Heading 3
```

## Text on Slides

Tabbed text appears on slide:
```markdown
⇥This text appears on the slide.
```

Without tabs = speaker notes only:
```markdown
This text is only for the speaker.
```

## Lists (must be tabbed)

```markdown
⇥- Item one
⇥- Item two

⇥1. First item
⇥2. Second item
```

## Code Blocks (no tab needed)

````markdown
```typescript
function hello() {
  console.log('Hello');
}
```
````

## Images (must be tabbed)

```markdown
⇥![Alt text](filename.png)
```

## Tables (must be tabbed)

```markdown
⇥| Name | Price |
⇥|:--|--:|
⇥| Widget | 10$ |
```

## Comments (speaker notes)

```markdown
// This is a reminder for the speaker
```

## Complete Slide Example

````markdown
# Slide Title

// Speaker note - not visible on slide

⇥This paragraph appears on the slide.

⇥Key points:
⇥- First point
⇥- Second point

```typescript
// Code blocks don't need tabs
function example() {
  return 'visible';
}
```

---

# Next Slide
````

## Best Practices

1. Tab all regular content
2. Don't tab headers or code blocks
3. Use comments for speaker notes
4. Break complex code across multiple slides
5. Test that visible content is properly tabbed
