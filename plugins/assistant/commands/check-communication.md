# Staff Communication Review

Analyze the following message against staff-level communication frameworks. Read it as a peer who wants the message to land, not as a judge looking for faults.

## Message to Review

$ARGUMENTS

## Step 1: Auto-Detect Message Type

Before evaluating, identify the message type from context and content:

| Type | Signals |
|---|---|
| **Status update** | Progress language, timeline mentions, blockers |
| **Standup** | Short, daily cadence, what I did / will do |
| **Proposal / RFC** | Suggests a change, asks for approval, presents options |
| **PR review comment** | Code references, review language, suggestions |
| **Disagreement / Pushback** | Countering a position, expressing concern |
| **Slack message** | Casual tone, async communication, thread context |
| **Email / formal** | Recipients, subject-like structure, formal tone |
| **General** | Doesn't fit above categories |

State the detected type before proceeding. This determines which frameworks apply.

## Step 2: Core Evaluation (Always Apply)

Score each as **Strong / Acceptable / Needs Work / Missing**. Skip dimensions that don't apply to the detected message type.

### BLUF (Bottom Line Up Front)
Does it lead with conclusion/need, then context, then ask? Watch for the point buried in paragraph 3.

### Problem Level Clarity
Is it clear what level the message operates at?
- Level 1: Goal → Level 2: Problem → Level 3: Approach → Level 4: Solution
- Common miss: jumping to solution without stating the problem

### Trade-offs & Alternatives
Does it name downsides of its own proposal? Mention rejected alternatives? Naming the cons builds credibility; presenting only upsides usually backfires.

### Ask Clarity
Is there a clear action requested? From whom? By when? A vague "thoughts?" with no specific ask leaves people unsure what to do next.

### Tone & Framing
- Steel Man: does it strengthen others' positions before countering?
- "Us vs the problem" framing, not "me vs you"
- Watch for: "As I already explained...", defensive language, or anything that makes the reader feel talked down to

### Signal-to-Noise Ratio
Could it be shorter without losing meaning? The best edits cut words, not ideas.

### Audience Awareness
Right level of detail for the audience? Explaining basics to experts wastes their time; heavy jargon with non-technical stakeholders loses the room.

## Step 3: Type-Specific Evaluation

Apply ONLY the section matching the detected type.

### If Status Update → STATUS Framework
- **State**: on track / at risk / blocked
- **Target**: deliverable and deadline
- **Achieved**: impact over activity ("reduced latency 40%", not "worked on caching")
- **Threats**: what could go wrong
- **Unblocks**: what you need from others

### If Standup → 30-Second Formula
- **Signal** (5s): what moved and what it changed
- **Need** (5s): what you need from the team
- **Radar** (10s): something you noticed that affects others
- Staff standups coordinate, they don't report accountability

### If Proposal / RFC → Proposal Structure
- Problem (1 paragraph with real data)
- Proposed Solution (scoped, not "change everything")
- Why Now? (what triggered this)
- Trade-offs (pros AND cons — naming downsides builds trust)
- Alternatives Considered (what you rejected and why)
- Rollback Plan (makes skeptics comfortable)

### If PR Review Comment → Prefix System
- Uses prefixes: `nit:` / `suggestion:` / `question:` / `issue:` / `thought:`
- Explains WHY for blockers, not just what
- Makes people feel smart, not dumb

### If Disagreement → Conflict Resolution
- Steel Man technique (make their argument stronger, then compare)
- Goes down one level to find agreement
- Disagree and commit readiness ("I can commit, but want to flag [risk]")
- Unlock questions when someone repeats themselves

### If Slack Message → Async Communication
- Thread Rule awareness (3 exchanges max → call → summarize)
- 2:1 ratio (questions vs statements)
- Appropriate length for the medium

## Output Format

Write the feedback as natural prose with light markdown headers. Do not wrap the output in a code block.

**Detected Type:** [type]

**What's landing well**
Start here. Name 1-2 specific strengths with a short quote from the message. Peer-level tone: you're reading this as a colleague who wants it to succeed, not as a judge.

**What to tighten**
For each issue: name it plainly, explain why it matters in context, then offer a concrete rewrite. Keep it to 2-3 issues max — more than that and the feedback stops being useful.

**A version to steal from**
Offer a rewrite that preserves the author's voice and intent. Improve the structure; don't swap their personality for a template. If the original is already strong, say so and note one small thing worth considering.

## Rules

- Honest and direct, but written as a peer, not a performance review.
- Name issues plainly without labeling the person. "The ask is buried" not "this signals inexperience."
- Concrete rewrites over abstract labels every time.
- If the message is strong, acknowledge it genuinely. Don't manufacture criticism.
- Flag the "no surprises" risk if the message would catch stakeholders off guard in a group setting.
- Apply the 2:1 ratio insight: staff communicators ask roughly twice as many questions as they make statements.
