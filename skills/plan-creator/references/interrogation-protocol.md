# Interrogation protocol

## Contents

1. [Question decision tree](#question-decision-tree)
2. [Recommended answer format](#recommended-answer-format)
3. [Fuzzy term patterns](#fuzzy-term-patterns)
4. [Anti-rationalization table](#anti-rationalization-table)

## Question decision tree

Start at the root. Branch based on what you already know from the codebase scan.

```text
Intent clear?
├── NO → Ask: "What are you trying to achieve? My read is [X] because [evidence]."
└── YES
    Scope clear?
    ├── NO → Ask: "What's in, what's out? I'd keep it to [X] and skip [Y]."
    └── YES
        Existing code to build on?
        ├── UNKNOWN → Explore the codebase. Answer this yourself.
        ├── YES → Ask: "Should we extend [module] or build alongside it?"
        └── NO
            Simplest approach obvious?
            ├── NO → Ask: "I see two approaches: [A] and [B]. I'd pick [A] because [reason]."
            └── YES
                Risky parts identified?
                ├── NO → Ask: "What's most likely to go wrong or take longest?"
                └── YES
                    Verification strategy?
                    ├── NO → Ask: "How will we know this works? I'd verify with [X]."
                    └── YES → Synthesize. You have enough.
```

Do not exhaust this tree mechanically. Skip branches where the codebase scan already gave you the answer. The tree ranks what matters; it is not a script to recite.

**Budget:** 5-10 questions total. If you reach 10 without convergence, the scope is too large: say so and suggest splitting the work into separate plans.

## Recommended answer format

Every question includes a concrete recommendation. The user reacts to something specific instead of generating from scratch.

**Good recommendations:**

> **Q: Should we extend the existing `auth` middleware or build a new one?**
>
> My recommendation: extend `auth/middleware.ts`. It already handles token validation and has the hook points we need at line 45. Building a new one duplicates the refresh logic.

> **Q: How should we handle the case where the external API is down?**
>
> My recommendation: return cached data with a staleness indicator. The `cache/` module already stores responses with TTLs. Adding a `stale: true` flag is one line.

**Bad recommendations:**

> My recommendation: it depends on your needs.

(Too vague. Pick a side.)

> My recommendation: we should probably think about whether to use approach A or B.

(Still asking the user to decide without a concrete suggestion.)

**The rule:** name the file, name the function, name the approach. If you can't be specific, you haven't explored enough; go read more code before asking.

## Fuzzy term patterns

When you hear these, sharpen them:

| Fuzzy term | Ask this | Example sharpening |
|---|---|---|
| "handle auth" | What specifically? Validate token? Refresh? Redirect? | "Validate JWT in the API middleware" |
| "make it fast" | What latency target? For which operation? | "P95 under 200ms for list queries" |
| "clean up the API" | What's wrong now? Inconsistent naming? Missing validation? | "Rename endpoints to match resource nouns" |
| "add caching" | What are you caching? At what layer? What invalidation? | "Cache user profiles in Redis with 5-min TTL" |
| "improve the UX" | Which user flow? What's the friction? | "Reduce checkout form from 3 pages to 1" |
| "make it scalable" | What load? What bottleneck? | "Support 10k concurrent WebSocket connections" |
| "refactor this" | What's the pain? Readability? Coupling? Performance? | "Extract the payment logic into its own module" |
| "add error handling" | Which errors? What should the user see? | "Show a retry button on network timeout" |

When the user gives you a fuzzy term, suggest the sharp version and ask if it's right. Don't ask "what do you mean?" in the abstract; propose a specific interpretation they can confirm or correct.

## Anti-rationalization table

Users will try to skip the interrogation. Push back with these:

| User says | Why it's a trap | Your response |
|---|---|---|
| "Just write the plan" | Plans without shared understanding produce rework | "I'll keep it to 3 more questions. The plan will be better for it." |
| "I already know what I want" | They know the goal, not the implementation path | "Great, then these questions will be fast. Let me confirm a few things." |
| "Skip the questions, I'm in a hurry" | Rushed plans cause more time loss than 5 questions | "5 minutes now saves hours of wrong-direction work. Let me ask the fastest 3." |
| "It's simple, just do it" | "Simple" things that don't need a plan don't need this skill | "If it's truly simple, should we skip the plan entirely and just implement?" |
| "I'll figure it out as I go" | Exploration without a plan leads to backtracking | "Let me at least confirm scope so you don't build something you'll throw away." |

**Escape hatch:** If the user insists a second time after your pushback, respect it. Synthesize what you have and move on. Never block the user.
