# Decision briefs

Read when a consequential decision goes to a human in any mode, when choosing which question to ask, or when the user asks to be interviewed or grilled. The human reads about 240 words a minute; the agent writes pages in seconds. A decision argued in prose makes the slower reader do the translation. Do it for them: measure the options, show them, ask about the one fact that decides it, and record the answer. Use the host's question interface. There is no question quota.

Running example: a feature needs four more props on a shared `DataTable`. Extend it, or build a new component?

## Contents

- Choosing the question (decision tree, blindspot pass, fuzzy terms)
- 1. Measure, don't predict
- 2. Name the hinge
- 3. Show, don't tell
- 4. One decision per unit, answer first
- 5. Record it, and keep the context

## Choosing the question

Rank what to ask by walking this tree, skipping every branch the codebase scan already answered. It ranks what matters; it is not a script.

```text
Intent clear?            NO → "What are you trying to achieve? My read is [X] because [evidence]."
Scope clear?             NO → "What's in, what's out? I'd keep it to [X] and skip [Y]."
Reference to build on?   UNKNOWN → explore first, then "Is there code, a library, a design, or a site that already does this the way you want?"
                         YES → read it; its semantics are the spec. Ask: "Extend [module], or reimplement the same semantics alongside it?" Interrogate deviations only.
Simplest approach obvious?  NO → "I see [A] and [B]. I'd pick [A] because [reason]."
Risky parts identified?  NO → "What's most likely to go wrong or take longest?"
Verification strategy?   NO → "How will we know this works? I'd verify with [X]."
Whole change minimal?    NO → "Can this be radically simpler? I'd cut [X] / collapse [Y]."
All YES → synthesize; you have enough.
```

Challenge scope only with a concrete cut to propose; no ritual closing question.

**Blindspot pass.** When the user is unfamiliar with the area or asks for a "blindspot pass" or "unknown unknowns", their answers would be guesses. Before spending questions, teach back in 5 to 8 cited bullets, no lecture:

- **Unknown knowns:** repo decisions they would contradict (conventions, ADRs, prior art), found via `git log`, PRs, and docs.
- **Unknown unknowns:** what good looks like here, common potholes, and the questions they don't know to ask.

Then resume the tree; later answers win. This costs zero questions.

**Fuzzy terms.** Propose the sharp version and ask if it is right; never ask "what do you mean?" in the abstract.

| Fuzzy term | Ask this | Example sharpening |
|---|---|---|
| "handle auth" | Validate token? Refresh? Redirect? | "Validate JWT in the API middleware" |
| "make it fast" | What latency target, for which operation? | "P95 under 200ms for list queries" |
| "clean up the API" | What's wrong now: naming, validation? | "Rename endpoints to match resource nouns" |
| "add caching" | What, at which layer, with what invalidation? | "Cache user profiles in Redis with 5-min TTL" |
| "improve the UX" | Which flow, what friction? | "Reduce checkout form from 3 pages to 1" |
| "make it scalable" | What load, what bottleneck? | "Support 10k concurrent WebSocket connections" |
| "refactor this" | What's the pain: readability, coupling, speed? | "Extract the payment logic into its own module" |
| "add error handling" | Which errors, and what does the user see? | "Show a retry button on network timeout" |

**Batching.** One question call can carry several questions only when no answer changes which question comes next (a greenfield spec with independent decisions, or a user who asked for a questionnaire). When answers branch, which is the normal case, ask one per turn. Each batched question still carries its recommendation.

## 1. Measure, don't predict

Before asking, get each option's cost from the repository: call sites affected, files and lines touched, tests that change, public API change. When a spike is cheap and reversible, build each option in a scratch branch or worktree, run the tests, and report what broke. A measured line beats a paragraph of reasoning:

> Extend: 4 new props, 23 call sites untouched, 1 test file changes. New `ReportTable`: 1 new file, duplicates sort and paging (about 60 lines).

Every question carries a concrete recommendation that names the file, the function, and the approach. "It depends on your needs", "we should think about A or B", and two paragraphs weighing options with no numbers all leave the user to decide alone. If you can't be specific, read more code before asking.

## 2. Name the hinge

State what would flip the recommendation, as a `Flips if:` line. The hinge is usually context the repository cannot hold: the roadmap, how far the feature will grow, a migration the team already agreed, a deadline. When the hinge is a fact only the human has, ask about the hinge, not the options:

> Will this table gain more than these four props in the next month?

beats "extend or new component?". The human answers a fact in seconds; the recommendation follows from it. A shared abstraction forced past its shared rule is the classic cost of not asking.

## 3. Show, don't tell

Give every option a preview the reader can take in at a glance:

- the call site as it would read under each option;
- a before and after type signature;
- an ASCII sketch of the flow or state machine;
- a table when there are more than two options or more than two criteria.

Use the host's question interface with per-option previews where it has one (AskUserQuestion). When the decision is visual (UI, layout, a state machine too big for a sketch), render a comparison page or artifact where the host supports it instead of describing it.

## 4. One decision per unit, answer first

Lead with the recommendation, then the measured evidence, then the preview. Keep prose to about five lines per decision; anything longer belongs in the preview or the table. Make mechanical choices silently and list them as assumptions, so the human's attention goes to the forks that need it.

## 5. Record it, and keep the context

Write each resolved decision into the plan's decision log:

```markdown
- **Extend DataTable or new component?** Chose: new `ReportTable`. Decided by: <who>, 2026-09-23.
  Why: the table grows to about ten props over October (roadmap), past DataTable's shared rule.
  Measured: extend = 4 props, 23 call sites untouched; new = 1 file, duplicates sort and paging (~60 lines).
  Flips if: the October work is cut.
```

When the answer came from context the repository lacks, offer once to write that context where future agents read it: the project's AGENTS.md, a roadmap or direction doc, or the agent's memory file. The next session then starts with what this one had to ask for.

A handoff plan and the PR description carry the log, so reviewers and teammates see why, not only the diff.
