---
name: tutorial
description: >-
  Checkpointed tutorial writer for step-by-step technical teaching: visible end
  state, dependency-ordered steps, working checkpoints, and mechanism
  explanations. Use when the user asks to create, draft, revise, or outline a
  tutorial, step-by-step guide, onboarding guide, or documentation that teaches a skill.
user-invocable: true
argument-hint: "[topic or technology]"
---

# Tutorial Writer

Tutorials fail when they front-load theory or hide the result until the end. This structure builds toward a visible goal with checkpoints that confirm understanding along the way.

## Structure (non-negotiable order)

### 1. Show the End State First

Before any steps, show what the reader will have built when they're done. A screenshot, a code snippet output, a running demo. This creates a goal — readers tolerate confusion when they can see where it's going.

```
By the end of this tutorial, you'll have:
[concrete, visible result — not "understand X" but "a working Y that does Z"]
```

### 2. Prerequisites

What the reader needs to already know or have installed. Be specific:
- "Node.js 18+" not "Node.js"
- "Familiarity with async/await" not "JavaScript experience"
- Link to setup instructions for tools, don't include them inline

### 3. Steps in Order of Dependency

Each step does one thing and builds on the previous step. Never skip a step because it "should be obvious" — if it were obvious, there would be no need for a tutorial.

**Each step structure:**
```
## Step N: [Action verb + what]

[1-2 sentences of context — why this step exists]

[Code block or command to run]

[Expected output or visible result]
```

### 4. Working Checkpoint After Each Major Step

Every 2-4 steps, include a checkpoint: the reader should run something and see a result that confirms they're on track. If they can't, they know exactly where they got lost.

```
### Checkpoint
Run:
[command]

You should see:
[exact expected output]

If you see X instead, [specific fix].
```

### 5. Explain the Mechanism After Each Checkpoint

A brief explanation of the mechanism — not re-explaining the steps, but the underlying concept. This is what turns a recipe-follower into someone who understands the system.

Keep it short: 3-5 sentences. Long explanations belong in concept docs, not tutorials.

### 6. Extension Exercises

After the tutorial is complete, 2-3 things to try next. These extend the tutorial naturally rather than pointing at unrelated docs. Format: "Try X to see what happens when Y."

## Writing Rules

**Every code block must:**
- Be copy-pasteable without modification (no `<your-value>` placeholders without explaining how to get the value)
- Show exactly what to run and where (file path matters)
- Include the full context needed to understand it, not just the interesting line

**Errors the reader will hit:**
Include the 2-3 most common errors with exact error messages and fixes. Don't ignore the unhappy path — it's where most readers abandon the tutorial.

**Words to never use:**
- "simple" / "simply" / "easy" / "just" — if it were, they wouldn't need a tutorial
- "obviously" / "of course" — condescending
- "as you can see" — if the code needs narrating, the code isn't clear

## Workflow

1. Clarify the topic and target audience (what do they already know?)
2. Identify the end state — what working thing will they have built?
3. Map the dependency order of steps before writing any of them
4. Write with checkpoints every 2-4 steps
5. Validate every code block by running it when the environment is available. If it was not run, mark it as unverified and state the assumption.

## Output

A complete tutorial with:
- End state shown upfront
- Prerequisites list
- Numbered steps with code blocks
- Working checkpoints with expected output
- Mechanism explanation after each checkpoint
- Common errors section
- Extension exercises
- Validation notes naming which code blocks were run and which remain unverified
