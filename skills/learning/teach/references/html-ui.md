> **Read this when:** creating or revising any HTML lesson, reference, diagram, quiz, simulator, or shared visual asset.

# HTML lesson UI

Make each lesson feel like a small, modern learning tool rather than a generic document or marketing page. When available, use the `design-taste-frontend` skill to choose and critique the visual direction; this file remains the self-contained fallback. Adapt that skill's subject-specific art direction, typography, hierarchy, anti-slop rules, responsive inspection, and screenshot loop to education; marketing-only requirements such as conversion copy, testimonials, or a fixed quantity of photography do not apply.

## Start with the subject

Choose one visual idea that comes from the topic itself: its structure, process, notation, material, history, interface, or central contrast. Carry that idea through the lesson. Do not default to a centered hero, repeated feature cards, decorative gradients, glass panels, or ornamental diagrams.

The lesson has one visual job: make the concept easier to understand. Every diagram, interaction, color, and animation must clarify a relationship, reveal a change, provide feedback, or help retrieval.

## Write like a person

Stop using jargon and speak coherently. State it more simply and concisely, like one human talking or writing to another.

Use a technical term only when the learner needs it. Define it in plain language on first use, then use it consistently. Prefer short sentences, concrete verbs, specific examples, and direct instructions. Remove throat-clearing, repeated summaries, inflated claims, and labels that do not help the learner act.

## Page system

Every lesson starts with a complete document shell: `<!doctype html>`, `<html lang="…">`, UTF-8 charset, a meaningful `<title>`, and `<meta name="viewport" content="width=device-width, initial-scale=1">`.

- Use semantic HTML landmarks and a meaningful heading hierarchy.
- Define colors, type, spacing, radii, and states as CSS custom properties. Prefer semantic names such as `--background`, `--foreground`, `--card`, `--muted-foreground`, `--border`, `--primary`, `--success`, `--warning`, and `--destructive`.
- Give the page one ground, one readable ink, and one purposeful accent. Separate surfaces with a tone change before reaching for borders or shadows.
- Use one type family or a deliberate pair. Reserve monospace for code, terminal output, and values that benefit from alignment.
- Keep prose to a readable measure, usually 55–75 characters. Running text is at least 16px with generous line height.
- Build a clear scale: one dominant lesson title, strong section headings, readable body text, and quiet metadata. Avoid tiny uppercase labels and decorative numbering.
- Vary section composition according to the material. Do not put every idea in an identical card.
- Keep controls native where possible. Every interactive element needs a visible focus state, a useful label, and a complete keyboard path.
- Support narrow phones without horizontal page scrolling. Treat the phone layout as a deliberate composition, not a squeezed desktop.
- Provide `prefers-reduced-motion` behavior. Content remains available when scripts or animation fail.
- Add print styles for reference material: remove controls that have no printed meaning, preserve contrast, and prevent important figures from splitting badly.

## Diagrams

Use diagrams when spatial structure explains the concept faster than prose.

- Prefer inline SVG for a controlled figure and Mermaid for relationship-heavy diagrams that benefit from automatic layout.
- Give SVGs a `viewBox`, responsive width, a short title or caption, and theme-token colors.
- Draw connectors before nodes so arrows remain behind content. Use `<defs>` markers for consistent arrowheads.
- Keep labels short. Put longer explanation in the surrounding prose or figure caption.
- Use solid lines for the primary path and dashed lines only for optional, deferred, or indirect relationships.
- For an oversized diagram, provide zoom out, zoom in, reset, and expand controls plus a visible zoom label. Do not add a diagram toolbar when the figure already reads at normal page width.

## Interactive learning

A lesson should contain one useful interaction when the concept benefits from it: a prediction, quiz, slider, runnable example, reveal, simulator, or state comparison. The interaction must give immediate, specific feedback and retain a plain fallback when JavaScript is unavailable.

Do not reveal the answer through option length, position, color, or formatting. Group answer choices with their prompt using `fieldset` and `legend` when appropriate. Use success and error colors as reinforcement after the response, not as the only way to communicate correctness. Announce dynamic feedback programmatically with a status/live region or deliberate focus management so screen-reader users receive the result.

## Visual check

Open the lesson in a real browser at desktop, tablet, and phone widths. Check the complete page and fix:

- clipped or overflowing content;
- unreadable code and diagrams;
- weak contrast or excessively muted prose;
- headings that wrap awkwardly;
- repetitive cards or empty sections;
- interactions without visible feedback;
- motion that delays reading;
- generic decoration unrelated to the topic.

Recheck after the fixes. A valid HTML file is not complete until the rendered lesson is readable and usable.

## Design references

This guidance is informed by the pinned Plannotator visual-explainer references:

- [Design system](https://github.com/backnotprop/plannotator/blob/16036b4bfad3aa8c51bc289175f87626054ee424/apps/skills/extra/plannotator-visual-explainer/references/design-system.md)
- [Diagram shell](https://github.com/backnotprop/plannotator/blob/16036b4bfad3aa8c51bc289175f87626054ee424/apps/skills/extra/plannotator-visual-explainer/references/diagram-shell.md)
- [SVG patterns](https://github.com/backnotprop/plannotator/blob/16036b4bfad3aa8c51bc289175f87626054ee424/apps/skills/extra/plannotator-visual-explainer/references/svg-patterns.md)
- [Theme override](https://github.com/backnotprop/plannotator/blob/16036b4bfad3aa8c51bc289175f87626054ee424/apps/skills/extra/plannotator-visual-explainer/references/theme-override.md)
