> **Read this when:** assembling the final standalone repository-analysis HTML.
> It provides the offline document skeleton, required variables, and encoding
> contract. Load the selected visualization reference separately.

# HTML Report Template

Replace every `{{VARIABLE}}` before delivery. Remove sections that have no useful
content rather than leaving empty shells.

## Encoding contract

Treat repository files, configuration, command output, and delegated findings as
untrusted input.

- HTML-escape text variables: `&`, `<`, `>`, `"`, and `'`.
- XML-escape labels before constructing inline SVG.
- Construct report rows and cards from escaped fields; never paste raw model or
  repository output into HTML.
- `{{ARCHITECTURE_VISUAL}}` is trusted markup generated after its labels were
  encoded. It may be inline SVG, the zoomable shell, or semantic HTML/CSS.
- Do not insert executable repository content or event-handler attributes.

## Variables

| Variable | Content |
|---|---|
| `{{REPO_NAME}}` | Escaped repository name |
| `{{REVISION}}` | Escaped branch/commit or `Working tree` |
| `{{DATE}}` | Analysis date |
| `{{SCOPE}}` | Included and excluded scope |
| `{{ASSESSMENT}}` | One-sentence interpretation |
| `{{PROVENANCE}}` | Commands, artifacts, and limitations |
| `{{SUMMARY_METRICS}}` | Constructed metric cards with provenance |
| `{{TLDR}}` | Constructed dominant shape, risk, and next action |
| `{{ARCHITECTURE_VISUAL}}` | Trusted generated visualization markup |
| `{{ARCHITECTURE_CAPTION}}` | Escaped caption; omit when shell already owns it |
| `{{MODULE_DESIGN}}` | Constructed organization/composition assessment |
| `{{DECISION_RECORD}}` | Constructed ADR links and qualified candidates |
| `{{RISK_MAP}}` | Constructed subsystem risk summary |
| `{{FINDINGS}}` | Constructed ranked finding articles |
| `{{HOTSPOTS}}` | Constructed focused file/module details |
| `{{RECOMMENDATIONS}}` | Constructed ordered recommendation items |
| `{{VERIFICATION_ITEMS}}` | Constructed checklist items |

## Document skeleton

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light dark" />
  <title>Repository analysis — {{REPO_NAME}}</title>
  <style>
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
        --bg: #0d1117; --surface: #151b23; --surface-subtle: #1d2530;
        --text: #edf2f7; --muted: #a7b1bd; --border: #303b48;
        --accent: #8aa4ff; --accent-soft: #202c55;
        --critical: #ff8a80; --critical-soft: #3c2020;
        --warning: #ffc66d; --warning-soft: #3a2c16;
        --info: #8ab4ff; --info-soft: #182c4b;
        --success: #75d6a5; --success-soft: #173528;
        --shadow: 0 12px 32px rgb(0 0 0 / 24%);
      }
    }
    * { box-sizing: border-box; }
    html { background: var(--bg); }
    body {
      margin: 0; color: var(--text); background: var(--bg);
      font: 15px/1.55 ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }
    a { color: var(--accent); }
    code, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    button, summary { font: inherit; }
    button:focus-visible, summary:focus-visible, [tabindex]:focus-visible {
      outline: 2px solid var(--accent); outline-offset: 3px;
    }
    .page { width: min(100% - 40px, var(--content)); margin-inline: auto; }
    .page-header { padding: 54px 0 30px; border-bottom: 1px solid var(--border); }
    .eyebrow {
      color: var(--accent); font: 700 12px/1.2 ui-monospace, monospace;
      letter-spacing: .08em; text-transform: uppercase;
    }
    h1 { max-width: 820px; margin: 10px 0; font-size: clamp(30px, 5vw, 48px); line-height: 1.06; }
    h2 { margin: 0 0 18px; font-size: clamp(20px, 3vw, 26px); }
    h3 { margin: 0; font-size: 17px; }
    .assessment { max-width: 800px; margin: 14px 0 0; color: var(--muted); font-size: 18px; }
    .meta { display: flex; flex-wrap: wrap; gap: 8px 18px; margin-top: 22px; color: var(--muted); }
    main { padding: 34px 0 64px; }
    section + section { margin-top: 38px; }
    .surface {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius); box-shadow: var(--shadow);
    }
    .section-body { padding: clamp(18px, 3vw, 30px); }
    .metrics { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
    .metric { padding: 18px; }
    .metric-value { font-size: 28px; font-weight: 750; line-height: 1.1; }
    .metric-label { margin-top: 7px; font-weight: 650; }
    .metric-source { margin-top: 5px; color: var(--muted); font-size: 12px; }
    .tldr { border-left: 4px solid var(--accent); background: var(--accent-soft); padding: 20px 22px; }
    .figure-frame { overflow-x: auto; padding: 18px; background: var(--surface-subtle); border-radius: 10px; }
    figure { margin: 0; }
    figcaption { margin-top: 12px; color: var(--muted); }
    .risk-map { display: flex; flex-wrap: wrap; gap: 10px; }
    .chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 7px 10px;
      border: 1px solid var(--border); border-radius: 999px; background: var(--surface);
    }
    .finding { padding: 22px; border-left: 4px solid var(--info); }
    .finding + .finding { margin-top: 12px; }
    .finding[data-severity="critical"] { border-left-color: var(--critical); background: var(--critical-soft); }
    .finding[data-severity="warning"] { border-left-color: var(--warning); background: var(--warning-soft); }
    .finding[data-severity="info"] { border-left-color: var(--info); background: var(--info-soft); }
    .finding-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
    .tag {
      padding: 3px 7px; border: 1px solid currentColor; border-radius: 5px;
      font: 700 11px/1.2 ui-monospace, monospace; text-transform: uppercase;
    }
    .evidence { margin-top: 14px; padding: 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); }
    .evidence-label { color: var(--muted); font-size: 12px; font-weight: 700; text-transform: uppercase; }
    details { border-top: 1px solid var(--border); }
    details:first-child { border-top: 0; }
    summary { cursor: pointer; min-height: 44px; padding: 14px 18px; font-weight: 650; }
    .details-body { padding: 0 18px 18px; color: var(--muted); }
    .recommendations li + li, .checklist li + li { margin-top: 12px; }
    .provenance { color: var(--muted); font-size: 13px; }
    .scroll-region { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; border-bottom: 1px solid var(--border); text-align: left; vertical-align: top; }
    th { color: var(--muted); font-size: 12px; text-transform: uppercase; }
    @media (max-width: 820px) { .metrics { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 520px) {
      .page { width: min(100% - 24px, var(--content)); }
      .page-header { padding-top: 34px; }
      .metrics { grid-template-columns: 1fr; }
      .section-body, .finding { padding: 17px; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }
  </style>
</head>
<body>
  <header class="page-header">
    <div class="page">
      <div class="eyebrow">Repository analysis</div>
      <h1>{{REPO_NAME}}</h1>
      <p class="assessment">{{ASSESSMENT}}</p>
      <div class="meta">
        <span>{{REVISION}}</span><span>{{DATE}}</span><span>{{SCOPE}}</span>
      </div>
    </div>
  </header>

  <main class="page">
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading">Measured summary</h2>
      <div class="metrics">{{SUMMARY_METRICS}}</div>
    </section>

    <section aria-labelledby="tldr-heading">
      <h2 id="tldr-heading">TL;DR</h2>
      <div class="tldr surface">{{TLDR}}</div>
    </section>

    <section aria-labelledby="architecture-heading">
      <h2 id="architecture-heading">Architecture</h2>
      <div class="surface section-body">
        <figure>
          <div class="figure-frame">{{ARCHITECTURE_VISUAL}}</div>
          <figcaption>{{ARCHITECTURE_CAPTION}}</figcaption>
        </figure>
      </div>
    </section>

    <section aria-labelledby="module-design-heading">
      <h2 id="module-design-heading">Module design</h2>
      <div class="surface section-body">{{MODULE_DESIGN}}</div>
    </section>

    <section aria-labelledby="decisions-heading">
      <h2 id="decisions-heading">Architecture decisions</h2>
      <div class="surface section-body">{{DECISION_RECORD}}</div>
    </section>

    <section aria-labelledby="risk-heading">
      <h2 id="risk-heading">Risk concentration</h2>
      <div class="risk-map">{{RISK_MAP}}</div>
    </section>

    <section aria-labelledby="findings-heading">
      <h2 id="findings-heading">Ranked findings</h2>
      <div>{{FINDINGS}}</div>
    </section>

    <section aria-labelledby="hotspots-heading">
      <h2 id="hotspots-heading">Hotspot tour</h2>
      <div class="surface">{{HOTSPOTS}}</div>
    </section>

    <section aria-labelledby="recommendations-heading">
      <h2 id="recommendations-heading">Recommendations</h2>
      <div class="surface section-body">
        <ol class="recommendations">{{RECOMMENDATIONS}}</ol>
      </div>
    </section>

    <section aria-labelledby="verification-heading">
      <h2 id="verification-heading">Verification checklist</h2>
      <div class="surface section-body">
        <ul class="checklist">{{VERIFICATION_ITEMS}}</ul>
      </div>
    </section>

    <section aria-labelledby="provenance-heading">
      <h2 id="provenance-heading">Provenance and limits</h2>
      <div class="surface section-body provenance">{{PROVENANCE}}</div>
    </section>
  </main>
</body>
</html>
```

## Component examples

A metric:

```html
<div class="metric surface">
  <div class="metric-value">184</div>
  <div class="metric-label">Source files</div>
  <div class="metric-source">Measured · tracked source paths</div>
</div>
```

A finding:

```html
<article class="finding surface" id="finding-1" data-severity="warning">
  <div class="finding-meta">
    <span class="tag">Warning</span><span class="tag">Verified</span>
    <span class="tag">Dependencies</span>
  </div>
  <h3>Boundary title</h3>
  <p><strong>Observed:</strong> Escaped factual statement.</p>
  <p><strong>Impact:</strong> Concrete consequence.</p>
  <p><strong>Next action:</strong> Bounded recommendation.</p>
  <div class="evidence">
    <div class="evidence-label">Evidence</div>
    <code>escaped/path.ts · escaped command summary</code>
  </div>
</article>
```

## Assembly gate

Before opening the report:

1. Search for `{{` and require zero matches.
2. Confirm the document has no external URLs required for styles, scripts, or
   fonts.
3. Confirm every finding ID appears in the evidence ledger.
4. Confirm unmeasured values say `Not measured` rather than presenting an
   estimate.
5. Render-check using the workflow in `SKILL.md`.
