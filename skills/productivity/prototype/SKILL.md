---
name: prototype
description: >-
  Use when the user wants to build, scaffold, or ship a working MVP from an
  idea. Covers scope, stack choice, minimal architecture, implementation
  handoff, validation, and deployment. Trigger on "build an MVP", "prototype
  this", "scaffold this project", "turn this idea into a working app", "launch
  this", or /prototype. Do not use when the user only wants to capture, explore,
  or stress-test an idea; use ideation for that.
user-invocable: true
---

# Prototype Workflow

Structured path from idea → working MVP. Most side projects die in "where do I even start" — this is the scaffolding. Discard it once momentum exists.

Boundary: use `ideation` when the user wants to think, compare, stress-test, or write planning artifacts. Use this skill when they want to build.

## Ask — Calibrate seriousness

Ask first. The answer changes everything.

> "Is this a quick side project or something you want to take seriously?"

- **Side project / weekend hack**: skip formality, move fast, architecture is a one-liner, deployment is optional for now.
- **Serious startup / real product**: run all phases with full depth.

## Cut — Define the smallest usable v1

3 questions max. Don't proceed until all 3 have clear answers.

1. **Who is this for?** (specific person/role, not "everyone")
2. **What's the one thing it does?** (if you need "and", it's two products)
3. **What does "done" look like for v1?** (the minimum that a real user could actually use)

If the user can't answer #2 without "and", help them cut.

## Choose — Pick the fastest credible stack

Recommend based on project type and stated skills. Offer 2 options with honest trade-offs — don't just list everything.

**Web app (default for solo dev speed):**

- Next.js + Vercel — fastest from zero to deployed, great DX, edge-ready
- SvelteKit + Vercel — smaller bundle, less ecosystem, better if React fatigue

**API / backend:**

- Hono + Bun — fast, minimal, TypeScript-first, great for side projects
- FastAPI — Python, better if the user has ML or data science adjacent work

**Mobile:**

- Expo (React Native) — ship to iOS + Android from one codebase, Vercel-style DX for mobile

**CLI:**

- Node.js + commander — if the user knows JS
- Python + click or Typer — if the user knows Python

**Database (don't overcomplicate v1):**

- Turso (libSQL) or Neon (Postgres) + Drizzle ORM — serverless, free tier
- Supabase — if auth + realtime + storage are needed out of the box

State the trade-off plainly: "Next.js is the default because it ships fastest. Use SvelteKit if bundle size is a constraint or you dislike React's mental model."

## Shape — Name the minimal architecture

One-paragraph overview only. No architecture astronautics.

Cover:

- Data model (3–5 entities max for v1)
- Key routes or components
- Auth approach (no auth / magic link / OAuth — pick based on audience)

If the user is over-engineering, say so: "You don't need a message queue for an MVP with 10 users."

## Build — Hand off or implement with acceptance criteria

Implementation must include:

- One-sentence product goal
- V1 scope and explicit non-goals
- Stack decision and rationale
- Data model
- Required routes/screens
- Validation commands
- Definition of done

Set up in order: repo → CI if needed → core feature → README. If implementation is delegated or done later, pass the bullets above as the handoff; if implementing now, use them as the acceptance criteria.

## Verify — Prove the MVP is shippable

Before declaring done:

- [ ] Env vars not committed (`.env` in `.gitignore`)
- [ ] Domain configured (or Vercel preview URL is fine for MVP)
- [ ] Basic error monitoring considered for serious products
- [ ] Rate limiting considered for public endpoints
- [ ] Analytics considered if user data matters
- [ ] README with one-liner description and setup instructions

Skip items that don't apply to a side project, but report what was skipped.

## Completion Criteria

Do not declare the prototype complete until:

- V1 scope is 3–5 user-visible capabilities max.
- Stack choice includes one recommended option and one rejected alternative.
- Architecture names the core entities, routes/components, and auth choice.
- Implementation has either been completed or handed off with explicit acceptance criteria.
- Validation commands have run, or failures are reported honestly.
- Final response includes repo path, run command, and deployment URL if deployed.
