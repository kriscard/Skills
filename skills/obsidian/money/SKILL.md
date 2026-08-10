---
name: money
description: >-
  Revenue advisor — scans the Obsidian vault for work history and active projects, diagnoses the
  revenue system, and surfaces monetization opportunities the user can't see from inside their own
  perspective. Make sure to use this skill whenever the user says "/money", "how can I make more
  money", "review my revenue", "what should I charge", "help me monetize", "find opportunities", or
  asks about income, pricing, or business strategy. Goes beyond the vault — diagnoses structure
  first, then surfaces opportunities.
disable-model-invocation: true
argument-hint: '[domain to focus on — omit for full analysis]'
---

# Money — Revenue Advisor

Use the vault as evidence, then reason beyond it explicitly. The vault is the starting point, not
the ceiling; every recommendation must separate evidence from inference.

Full analysis with `/money`. Focused mode with `/money [domain]`: run the full workflow, but
constrain searches, diagnostics, opportunities, and final builds to that domain. Briefly note
excluded areas.

## Step 1 — Deep Vault Scan

If `$ARGUMENTS` names a focus domain, constrain all queries and interpretation to that domain while
still checking whether obvious adjacent evidence is being excluded.

```bash
obsidian search query="project"
obsidian search query="business"
obsidian search query="client"
obsidian search query="revenue"
obsidian search query="pricing"
obsidian files folder="1 - Projects/" format=json
```

Also read recent daily notes (past 30 days) to extract:

- Client work mentioned (past and current)
- Revenue discussions, pricing conversations
- Skills demonstrated — things actually done, not claimed
- Tools built or systems created
- Frustrations that might signal market gaps
- Ideas for products, services, or offerings

Completion: list folders searched, recent notes inspected, search terms used, and stopping condition
(e.g. no new relevant evidence after N searches or focused-domain coverage complete).

## Step 2 — Asset Inventory

Map what you actually have. Be specific and evidence-based.

- **Skills (demonstrated, not claimed)** — only list with vault evidence
- **Relationships** — professional network, clients, communities
- **IP & infrastructure** — content, templates, frameworks, tooling
- **Audience & distribution** — social following, channels
- **Credibility signals** — notable clients, public proof, testimonials

## Step 3 — Revenue Diagnostics

Diagnose the revenue system FIRST. The problem is usually not "what to sell" but "why isn't what
exists converting?"

**Attention-to-Revenue Conversion**

- Total impressions/attention generated vs. total revenue
- If conversion is low: no product, no CTA, no funnel, or no offer?

**Revenue Type Audit** — categorize all revenue:

- One-time payments (client work, contracts)
- Recurring revenue (retainers, subscriptions)
- Passive income (products, licensing)
- Equity positions (advisory, investments)

If everything is one-time payments, flag as structural problem.

**Sales System Audit** — does a real system exist?

- Active outbound process (or purely inbound/luck?)
- Pipeline tracking and follow-up
- Rate card or pricing — if time-based, calculate the ceiling

**Pricing Structure**

- Time-based (hourly): linear, capped by hours → flag if this is the model
- Project-based (flat fee): better, still one-time
- Value-based (outcomes): best, requires confidence in delivering results

## Step 4 — Beyond the Vault

The most valuable insights come from seeing what the user is NOT thinking about. Go beyond vault
contents.

**Blind spots to check:**

- Aversion to selling or pricing aggressively?
- Pattern of undervaluing work?
- Building without monetization plans?

**The Packaging Gap:**

- Skills with no associated price or offering
- Work done for one client that could be repeatable
- Internal tools with external value
- Attention/audience with no conversion mechanism

## Step 5 — Revenue Opportunities

For each category, cite vault evidence and keep an Evidence Ledger. Include opportunities that
extrapolate beyond the vault only when the extrapolation is labeled.

For every opportunity, separate:

- **Evidence**: vault citations or user-provided facts
- **Inference**: what you are extrapolating
- **Confidence**: High / Medium / Low
- **Assumption to validate next**

Revenue estimates use ranges plus assumptions unless hard data exists.

- **Services to Sell** — based on proven work
- **Products to Build** — revenue without active work
- **Low-Hanging Fruit (This Week)** — minimal effort, asset already exists
- **Medium-Term Plays (1–3 Months)** — require setup, clear path
- **Long-Term Bets (6–12 Months)** — bigger plays aligned with trajectory
- **Undermonetized Assets** — already built, not generating revenue
- **Pricing Corrections** — evidence of undercharging

## Step 6 — Prioritization

**Top 5 by Effort-to-Revenue Ratio:**

```
[Opportunity]: Effort [Low/Medium/High]. Revenue potential [range/timeframe + assumptions]. Evidence quality [High/Medium/Low]. Why it ranks here.
```

**The Immediate Play** — one thing to do this week. Specific first step.

**The Biggest Upside** — highest ceiling opportunity and why evidence supports it.

**The Surprising One** — non-obvious opportunity most people would miss.

**The Structural Fix** — the one change to HOW revenue works (not what to sell) that would have the
biggest impact.

## Step 7 — Actionable Builds

End every run with a list of specific documents to create RIGHT NOW:

- Service offerings document
- Cold outreach email template
- Pricing page or rate card
- Pitch document for a specific opportunity
- Product landing page draft

Format:

```
[Document]: What it is. What it unblocks. Estimated revenue impact. "I can build this now."
```

Ask which ones to build. Then build them.

## Anti-Patterns

- **Newsletter Fallacy** — no generic "start a newsletter" without evidence of demand
- **Scale Fantasy** — don't jump to "$X million"; start with first month, current resources
- **Vague Opportunity** — "consulting" is not an opportunity; be specific about who, what, how much
- **Cheerleader** — don't sugarcoat; if the revenue system is broken, say so plainly
- **Unlabeled Extrapolation** — don't blur vault evidence with speculation; separate evidence,
  inference, confidence, and next validation step
