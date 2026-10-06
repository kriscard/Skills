> **Read this when:** the architecture visualization will be authored as inline
> SVG. It defines reusable nodes, edges, labels, and layout rules.

# Inline SVG Patterns

Inline SVG is the default for a curated diagram whose important relationships
fit on one canvas. It keeps the report offline and gives precise control over
hierarchy.

## Safety and accessibility

- XML-escape repository-controlled text before placing it in text or attributes.
- Give the `<svg>` `role="img"` and an accessible name through `<title>` and
  `<desc>`.
- Keep the same information available in the caption or surrounding findings.
- Use `viewBox`; avoid fixed pixel width and height on the root SVG.

```html
<svg role="img" aria-labelledby="arch-title arch-desc"
     viewBox="0 0 1120 640" preserveAspectRatio="xMidYMid meet">
  <title id="arch-title">Repository architecture</title>
  <desc id="arch-desc">Application modules and their verified dependencies.</desc>
</svg>
```

## Markers and edges

Define arrow markers once and reference them by ID:

```html
<defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
          markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
  </marker>
</defs>
<path class="edge" d="M 260 140 C 340 140, 360 250, 440 250"
      marker-end="url(#arrow)" />
```

Use solid edges for verified runtime or import relationships. Use dashed edges
for supported/inferred relationships and label them accordingly. Do not draw an
edge solely to make the composition look balanced.

## Module node

```html
<g class="node" transform="translate(60 80)">
  <rect width="220" height="92" rx="10" />
  <text class="node-kicker" x="18" y="28">BOUNDARY</text>
  <text class="node-title" x="18" y="54">Module name</text>
  <text class="node-meta" x="18" y="76">role · evidence</text>
</g>
```

Keep labels inside nodes concise. Put exact paths and detailed evidence in the
report component linked to the node.

## Hotspot treatment

A hotspot uses the semantic severity stroke plus a visible `HOTSPOT` label. Do
not rely on a red fill alone.

```html
<g class="node node--warning" aria-label="Warning hotspot">
  <!-- node content -->
</g>
```

Limit hotspot emphasis to the findings discussed beside the figure.

## Layout

1. Choose one dominant reading direction: top-to-bottom for layers,
   left-to-right for pipelines.
2. Place stable boundaries before drawing edges.
3. Route primary edges first; secondary edges may curve around nodes.
4. Keep labels horizontal and at least 12px at the rendered report width.
5. Use whitespace to separate boundaries; use containers only for real
   ownership or deployment groups.
6. Prefer two linked diagrams over one unreadable graph.

## CSS roles

```css
.architecture-svg { width: 100%; height: auto; min-width: 720px; }
.node rect { fill: var(--surface); stroke: var(--border); stroke-width: 1.5; }
.node-title { fill: var(--text); font: 600 15px system-ui, sans-serif; }
.node-kicker, .node-meta { fill: var(--muted); font: 11px ui-monospace, monospace; }
.edge { fill: none; stroke: var(--muted); stroke-width: 1.5; }
.edge--supported { stroke-dasharray: 6 5; }
.node--critical rect { stroke: var(--critical); stroke-width: 3; }
.node--warning rect { stroke: var(--warning); stroke-width: 3; }
```

Place wide SVGs in an overflow container or use the zoomable shell. The report
must still expose the caption and textual findings without horizontal page
scrolling.
