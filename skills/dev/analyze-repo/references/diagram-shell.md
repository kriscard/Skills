> **Read this when:** an architecture figure needs zoom or pan to keep labels
> legible. The shell accepts any trusted inline SVG, including SVG pre-rendered
> by a graph tool; it does not require Mermaid.

# Zoomable Diagram Shell

Use this enhancement only when a static responsive figure cannot remain legible.
Core report content must work without JavaScript.

## Clipping contract

- Controls and caption are siblings of the viewport, never children of it.
- The viewport owns clipping with `overflow: hidden`.
- Only the canvas transforms during zoom and pan.
- Zoom never changes layout height.
- Reset fits and centers the diagram.
- Expand changes viewport height, then re-fits.
- Panning is clamped so the diagram continues to cover or center within the
  viewport.
- At maximum zoom and every pan extreme, controls and caption remain legible.

## Markup

```html
<figure class="diagram-shell" data-diagram-shell>
  <div class="diagram-toolbar" aria-label="Diagram controls">
    <button type="button" data-zoom-out aria-label="Zoom out">−</button>
    <output data-zoom-label aria-live="polite">100%</output>
    <button type="button" data-zoom-in aria-label="Zoom in">+</button>
    <button type="button" data-zoom-reset>Reset</button>
    <button type="button" data-zoom-expand aria-pressed="false">Expand</button>
  </div>
  <div class="diagram-viewport" tabindex="0"
       aria-label="Zoomable architecture diagram">
    <div class="diagram-canvas">
      {{TRUSTED_INLINE_SVG}}
    </div>
  </div>
  <figcaption>{{DIAGRAM_CAPTION}}</figcaption>
</figure>
```

`{{TRUSTED_INLINE_SVG}}` is generated output, not unescaped repository text.
Encode source labels before generating the SVG.

## CSS

```css
.diagram-shell { margin: 0; }
.diagram-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 10px;
}
.diagram-toolbar button {
  min-width: 40px;
  min-height: 40px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
}
.diagram-toolbar output {
  min-width: 56px;
  color: var(--muted);
  text-align: center;
  font: 12px ui-monospace, monospace;
}
.diagram-viewport {
  position: relative;
  height: 520px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface-subtle);
  cursor: grab;
  touch-action: none;
}
.diagram-viewport:active { cursor: grabbing; }
.diagram-viewport[data-expanded="true"] { height: min(78vh, 900px); }
.diagram-canvas {
  position: absolute;
  inset: 0 auto auto 0;
  transform-origin: 0 0;
  will-change: transform;
}
.diagram-canvas > svg { display: block; max-width: none; }
.diagram-shell figcaption { margin-top: 10px; color: var(--muted); }
```

## Behavior

Implement one controller per `[data-diagram-shell]`:

1. Read the viewport and SVG bounding boxes after layout.
2. `fit()` sets scale to `min(viewportWidth / svgWidth,
   viewportHeight / svgHeight)`, capped at `1`, then centers the canvas.
3. Zoom around the viewport center in bounded steps, for example `0.25×` through
   `4×` of the fitted scale.
4. Pointer drag updates translation while the pointer is captured.
5. Clamp each axis: center when scaled content is smaller than the viewport;
   otherwise constrain translation between `viewport - content` and `0`.
6. Arrow keys pan when the viewport is focused; `+`, `-`, and `0` zoom in, zoom
   out, and reset.
7. Expand toggles viewport state and `aria-pressed`, then calls `fit()`.
8. Resize calls `fit()` through `ResizeObserver`.
9. Update the zoom output after every transform.

A pre-rendered Mermaid SVG may be placed in the canvas, but Mermaid is not loaded
or executed by this shell.

## Delivery gate

Verify at desktop and narrow widths:

- zoom in/out/reset and keyboard controls
- drag to all four extremes at maximum zoom
- expand and collapse
- resize after zoom
- caption and controls never clip or move under the canvas
- reduced-motion mode remains fully usable
