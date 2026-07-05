# Interrogation protocol

## Question decision tree

Start at the root. Branch on what the codebase scan already told you.

```text
Intent clear?
├── NO → Ask: "What are you trying to achieve? My read is [X] because [evidence]."
└── YES
    Scope clear?
    ├── NO → Ask: "What's in, what's out? I'd keep it to [X] and skip [Y]."
    └── YES
        Reference to build on? (existing code, a library, a design, a site)
        ├── UNKNOWN → Explore the codebase first; then ask: "Is there code, a library, a design, or a site that already does this the way you want? Point me at it."
        ├── YES → Read it; its semantics are the spec. Ask: "Extend [module], or reimplement the same semantics alongside it?"
        └── NO
            Simplest approach obvious?
            ├── NO → Ask: "I see two approaches: [A] and [B]. I'd pick [A] because [reason]."
            └── YES
                Risky parts identified?
                ├── NO → Ask: "What's most likely to go wrong or take longest?"
                └── YES
                    Verification strategy?
                    ├── NO → Ask: "How will we know this works? I'd verify with [X]."
                    └── YES
                        Whole change as simple as it can be?
                        ├── NO → Ask: "Can this whole PR be radically simpler? I'd cut [X] / collapse [Y]."
                        └── YES → Synthesize. You have enough.
```

Don't walk the tree mechanically; skip branches the codebase scan already answered. It ranks what matters, it is not a script. When the user names a reference, read it and treat its semantics as the spec ("reimplement the same semantics as `vendor/rate-limiter`"), interrogating deviations only.

Always voice the simplicity node, even when the change looks simple: the whole-change view only exists once every other decision is settled, so the step-back catches scope no earlier question could. This is the mandatory simplicity challenge from SKILL.md Step 2.

**Budget:** 5-10 questions. At 10 without convergence, the scope is too large: say so and suggest splitting into separate plans.

## Blindspot pass

When the user is unfamiliar with the area or asks for a "blindspot pass" / "unknown unknowns", their answers would be guesses. Before spending questions, surface two things and teach them back in 5-8 cited bullets, no lecture:

- **Unknown knowns:** repo decisions they would contradict (conventions, ADRs, prior art), found via `git log`, PRs, and docs.
- **Unknown unknowns:** what good looks like here, common potholes, and the questions they don't know to ask.

Then resume the tree; later answers win. This costs zero questions: exploration, not interrogation.

## Recommended answer format

Every question carries a concrete recommendation so the user reacts to something specific instead of generating from scratch.

**Good** (name the file, function, approach):

> **Q: Should we extend the existing `auth` middleware or build a new one?**
>
> My recommendation: extend `auth/middleware.ts`. It already validates tokens and has the hook points we need at line 45. A new one duplicates the refresh logic.

> **Q: How should we handle the case where the external API is down?**
>
> My recommendation: return cached data with a staleness indicator. The `cache/` module already stores responses with TTLs. Adding a `stale: true` flag is one line.

**Bad:**

> My recommendation: it depends on your needs. (Too vague. Pick a side.)

> My recommendation: we should probably think about whether to use approach A or B. (Still making the user decide.)

**Rule:** name the file, the function, the approach. If you can't be specific, you haven't explored enough: read more code before asking.

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

Propose the sharp version and ask if it's right; never ask "what do you mean?" in the abstract.

## Anti-rationalization table

Users will try to skip the interrogation. Push back with these:

| User says | Why it's a trap | Your response |
|---|---|---|
| "Just write the plan" | Plans without shared understanding produce rework | "I'll keep it to 3 more questions. The plan will be better for it." |
| "I already know what I want" | They know the goal, not the implementation path | "Great, then these questions will be fast. Let me confirm a few things." |
| "Skip the questions, I'm in a hurry" | Rushed plans cause more time loss than 5 questions | "5 minutes now saves hours of wrong-direction work. Let me ask the fastest 3." |
| "It's simple, just do it" | "Simple" things that don't need a plan don't need this skill | "If it's truly simple, should we skip the plan entirely and just implement?" |
| "I'll figure it out as I go" | Exploration without a plan leads to backtracking | "Let me at least confirm scope so you don't build something you'll throw away." |

**Escape hatch:** If the user insists a second time, respect it: synthesize what you have and move on. Never block the user.
