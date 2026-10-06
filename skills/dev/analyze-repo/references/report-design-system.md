> **Read this when:** generating any repository-analysis report. It defines the
> standalone visual system, semantic tokens, responsive behavior, and
> accessibility contract.

# Report Design System

Use a restrained editorial system: neutral surfaces, one cool accent, and
severity colors reserved for meaning. The report should feel like an engineering
instrument, not a marketing page.

## Standalone contract

The report must remain useful from a local `file://` URL without fonts,
stylesheets, scripts, or network access. Use system fonts and inline CSS. Core
content stays visible when JavaScript is unavailable; JavaScript may enhance
zoom controls only.

## Semantic tokens

Define tokens once in `:root` and consume them throughout the document:

```css
:root {
  color-scheme: light dark;
  --bg: #f4f5f7;
  --surface: #ffffff;
  --surface-subtle: #eef1f4;
  --text: #18202a;
  --muted: #5f6b78;
  --border: #d8dee6;
  --accent: #315efb;
  --accent-soft: #e9eeff;
  --critical: #b42318;
  --critical-soft: #fef0ee;
  --warning: #a15c00;
  --warning-soft: #fff5df;
  --info: #175cd3;
  --info-soft: #edf4ff;
  --success: #067647;
  --success-soft: #ecfdf3;
  --shadow: 0 1px 2px rgb(16 24 40 / 6%), 0 8px 24px rgb(16 24 40 / 6%);
  --radius: 12px;
  --content: 1180px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --surface: #151b23;
    --surface-subtle: #1d2530;
    --text: #edf2f7;
    --muted: #a7b1bd;
    --border: #303b48;
    --accent: #8aa4ff;
    --accent-soft: #202c55;
    --critical: #ff8a80;
    --critical-soft: #3c2020;
    --warning: #ffc66d;
    --warning-soft: #3a2c16;
    --info: #8ab4ff;
    --info-soft: #182c4b;
    --success: #75d6a5;
    --success-soft: #173528;
    --shadow: 0 12px 32px rgb(0 0 0 / 24%);
  }
}
```

Exact values may change, but semantic roles must remain stable. Diagram colors
must use the same roles as findings.

## Type and hierarchy

- Body: system UI stack, 15–16px, line-height 1.55.
- Technical labels and paths: system monospace stack.
- Page title: 30–36px; section headings: 20–24px.
- Use sentence case. Keep summaries short enough to scan.
- Put evidence next to the claim it supports rather than in a remote appendix.

## Layout

- Center content within `--content`; retain at least 20px side padding.
- Use a 12-column mental grid, but prefer simple CSS grid/flex layouts.
- Summary metrics may use cards; findings should remain a list or table with
  strong row hierarchy.
- At widths below 760px, collapse multi-column regions to one column and allow
  tables to scroll within their own labeled container.
- Avoid nested cards. A surface may contain grouped rows without wrapping each
  row in another surface.

## Interaction and accessibility

- Native controls first; every button needs visible text or an accessible name.
- Show `:focus-visible` with a 2px accent outline and offset.
- Interactive targets are at least 40px square.
- Respect `prefers-reduced-motion`; zoom and expand state changes need no
  decorative animation.
- Color supplements labels; it never carries severity or confidence alone.
- Use real headings, lists, tables, `details`, and `figure`/`figcaption` elements.

## Visual gate

Before delivery, verify both color schemes, a desktop width, and a 390px-wide
viewport. No text may overlap, clip, or rely on hover for discovery.
