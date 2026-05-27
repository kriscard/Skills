---
name: prototype
description: >-
  Guides a new idea from vague concept to working MVP — scoping, stack choice,
  architecture, implementation, and deployment in one structured workflow.
  Make sure to use this skill whenever the user says "new project", "start a
  project", "build an MVP", "side project idea", "I want to build X",
  "prototype this", "launch something", or invokes /prototype. Also use
  proactively when someone describes a new idea they want to build, even if
  they don't explicitly ask for a prototype workflow.
user-invocable: true
---

# Prototype Workflow

Structured path from idea → working MVP. Most side projects die in "where do
I even start" — this is the scaffolding. Discard it once momentum exists.

## Phase 0 — Scope Calibration

Ask first. The answer changes everything.

> "Is this a quick side project or something you want to take seriously?"

- **Side project / weekend hack**: skip formality, move fast, Phase 3 is a
  one-liner, deployment is optional for now
- **Serious startup / real product**: run all phases with full depth

## Phase 1 — Clarify the Idea

3 questions max. Don't proceed until all 3 have clear answers.

1. **Who is this for?** (specific person/role, not "everyone")
2. **What's the one thing it does?** (if you need "and", it's two products)
3. **What does "done" look like for v1?** (the minimum that a real user could
   actually use)

If the user can't answer #2 without "and", help them cut.

## Phase 2 — Tech Stack

Recommend based on project type and stated skills. Offer 2 options with
honest trade-offs — don't just list everything.

**Web app (default for solo dev speed):**
- Next.js + Vercel — fastest from zero to deployed, great DX, edge-ready
- SvelteKit + Vercel — smaller bundle, less ecosystem, better if React fatigue

**API / backend:**
- Hono + Bun — fast, minimal, TypeScript-first, great for side projects
- FastAPI — Python, better if the user has ML or data science adjacent work

**Mobile:**
- Expo (React Native) — ship to iOS + Android from one codebase, Vercel-style
  DX for mobile

**CLI:**
- Node.js + commander — if the user knows JS
- Python + click or Typer — if the user knows Python

**Database (don't overcomplicate v1):**
- Turso (libSQL) or Neon (Postgres) + Drizzle ORM — serverless, free tier
- Supabase — if auth + realtime + storage are needed out of the box

State the trade-off plainly: "Next.js is the default because it ships fastest.
Use SvelteKit if bundle size is a constraint or you dislike React's mental
model."

## Phase 3 — Architecture

One-paragraph overview only. No architecture astronautics.

Cover:
- Data model (3–5 entities max for v1)
- Key routes or components
- Auth approach (no auth / magic link / OAuth — pick based on audience)

If the user is over-engineering, say so: "You don't need a message queue for
an MVP with 10 users."

## Phase 4 — Implementation

Use the Task tool to spawn a coder subagent with full context:
- Stack decision + rationale
- Data model
- V1 scope (the "done" definition from Phase 1)

Set up in order: repo → CI if needed → core feature → README.

## Phase 5 — Ship Checklist

Before declaring done:
- [ ] Env vars not committed (`.env` in `.gitignore`)
- [ ] Domain configured (or Vercel preview URL is fine for MVP)
- [ ] Basic error monitoring (Sentry free tier — 5 min setup)
- [ ] Rate limiting on public endpoints (Upstash is free + easy)
- [ ] Analytics if you need user data (Vercel Analytics or Plausible)
- [ ] README with one-liner description and setup instructions

Skip items that don't apply to a side project — the checklist is a prompt,
not a requirement.
