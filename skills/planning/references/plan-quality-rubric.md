# Plan Quality Rubric

Six dimensions for plan review. Use them to find the weakest parts of a plan, then fix the gap or ask about it. When a gap is checkable against local code or docs (an unused helper, an unconfirmed library capability, a doc that contradicts the plan), verify it first (`claim-verification.md`) and lead with the evidence instead of a question. Adapt each question to the plan's own sections and names; never ask a generic one verbatim.

Score 1 to 5 only when the user asks for scores: 5 = specific, no visible gaps; 3 = mentioned, key scenarios unaddressed; 1 = absent. Otherwise record findings. A NOT VERIFIED claim drops its dimension a point and becomes the first question.

## 1. Completeness: what must exist that is not mentioned?

- Look for: new API calls or data flows without error handling; state transitions without failure paths; missing cleanup or teardown; no behavior when an external service is down; no validation at boundaries (user input, external APIs); no rollback.
- Push: "You said 'handle errors appropriately'. Name the three likeliest errors and what the user sees for each."

## 2. Feasibility: which step needs something unproven or outside your control?

- Look for: one-sentence steps that hide significant work; libraries or APIs cited without evidence they support the use case (read the docs or types first); performance assumptions without measurement; "then we just..." phrasing; horizontal layers built before a tracer bullet (the thinnest slice that proves the approach end to end).
- Push: "You said this is 'straightforward'. Describe the implementation in three sentences."

## 3. Scope: what is not needed to reach the stated goal?

- Look for: abstractions justified by "we might need this later"; several approaches kept "for flexibility"; caching, optimization, or generalization before the basic path works; helpers or wrappers called once; nice-to-haves mixed with requirements.
- Keep repetition when the proposed abstraction lacks a shared invariant, owner, lifecycle, or failure mode. Ask whether similar call sites encode the same business rule or only the same shape.
- Push: "What user problem does X solve? Name a specific scenario."

## 4. Testability: how will each step be shown to work?

- Look for: no verification section; "add tests" without cases; integration points with no contract check; manual-only verification of automatable checks; no way to confirm a migration or deploy succeeded; untested boundary conditions; no assertion at critical state transitions.
- Push: "Name three specific test cases now. If you can't, the plan doesn't understand its own behavior."

## 5. Risk: what is the worst realistic outcome as written?

- Look for: shared state changed without a concurrency story; migrations on large tables without a downtime strategy; changes to authentication or authorization paths; code other teams call (grep for call sites before asking); no feature flag or gradual rollout where the blast radius is wide; removal of code whose reason is unknown (Chesterton's fence: `git log` the file before accepting "it's unused").
- Push: "You said risk is 'low'. What evidence supports that? Which failure modes did you trace?"

## 6. Assumptions: what does the plan take for granted?

- Look for: performance claims without measurement; "users will..." without evidence; compatibility assumptions (API versions, browsers, OS features); timing assumptions; reliance on team knowledge or undocumented behavior; no statement of what would invalidate the approach.
- Push: "If that assumption is false, which parts of the plan survive?"

## Acting on findings

Fix gaps tied to acceptance criteria or operational consequences. Record unverified claims and unresolved choices; a score is a judgement, not proof. Stop when further changes would add speculative scope or when a user decision is required.
