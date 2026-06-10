# Structural Quality Rubric

Unusually strict review focused on implementation quality, maintainability, and codebase health. Loaded by pr-reviewer's Structural mode ("thermo-nuclear review", "structural review", "deep code quality audit", "harsh maintainability review", "code judo").

The core question is not "will this code break?" but "should this code exist in this form?"

## Contents

- Core philosophy
- Non-negotiable standards
- Primary review questions
- What to flag aggressively
- Preferred remedies
- Approval bar
- Presumptive blockers
- Tone
- Anti-rationalizations

## Core Philosophy

Push hard for ambitious structural simplification. Do not stop at "this could be a bit cleaner." Look for **code judo** moves: re-organizations that use the existing architecture more effectively and make the change dramatically simpler and more elegant. Prefer the solution that makes the code feel inevitable in hindsight. If there is a path to delete complexity rather than rearrange it, push hard for that path.

Rethink how to structure and implement the changes to meaningfully improve code quality without impacting behavior. Improve abstractions, modularity, reduce spaghetti code, improve succinctness and legibility. If there is a clear path to improving the implementation that involves restructuring some of the codebase, go for it.

## Non-Negotiable Standards

### 1. Ambitious structural simplification

Look for opportunities to reframe the change so whole branches, helpers, modes, conditionals, or layers disappear entirely. If you see a path to delete complexity rather than rearrange it, push hard for that path. Prefer refactors that remove moving pieces altogether over refactors that merely spread the same complexity around.

### 2. 1000-line file threshold

Do not let a PR push a file from under 1000 lines to over 1000 lines without a very strong reason. Prefer extracting helpers, subcomponents, modules, or local abstractions instead of letting a file sprawl. If the diff crosses that threshold, explicitly flag it for decomposition. Only waive when there is a compelling structural reason and the resulting file is still clearly organized.

### 3. No spaghetti branching growth

Be highly suspicious of new ad-hoc conditionals, scattered special cases, or one-off branches inserted into unrelated flows. If a change adds random if-statements in unrelated places, treat that as a design problem, not a stylistic nit. Prefer pushing the logic into a dedicated abstraction, helper, state machine, policy object, or separate module.

### 4. Bias toward cleaning the design

If behavior can stay the same while the structure becomes meaningfully cleaner, push for the cleaner version. Do not rubber-stamp "it works" implementations that leave the codebase messier. Strongly prefer simplifications that remove moving pieces altogether over refactors that merely spread the same complexity around.

### 5. Direct, boring, maintainable over hacky or magical

Treat brittle, ad-hoc, or "magic" behavior as a code-quality problem. Be skeptical of generic mechanisms that hide simple data-shape assumptions. Flag thin abstractions, identity wrappers, or pass-through helpers that add indirection without buying clarity.

### 6. Type and boundary cleanliness

Question unnecessary optionality, `unknown`, `any`, or cast-heavy code when a clearer type boundary could exist. Prefer explicit typed models or shared contracts over loosely-shaped ad-hoc objects. If a branch relies on silent fallback to paper over an unclear invariant, ask whether the boundary should be made explicit instead.

### 7. Keep logic in the canonical layer

Call out feature logic leaking into shared paths or implementation details leaking through APIs. Prefer existing canonical utilities and helpers over bespoke one-offs. Push code toward the right package, service, or module instead of normalizing architectural drift.

### 8. Orchestration simplicity

Treat unnecessary sequential orchestration and non-atomic updates as design smells when the cleaner structure is obvious. If independent work is serialized for no good reason, flag it. If related updates can leave state half-applied, push for a more atomic structure. Do not over-index on micro-optimizations, but flag avoidable orchestration complexity that makes the implementation more brittle.

## Primary Review Questions

For every meaningful change, ask:

**Structural simplification:**
- Is there a code judo move that would make this dramatically simpler?
- Can this change be reframed so fewer concepts, branches, or helper layers are needed?
- Does this improve or worsen the local architecture?

**Complexity and branching:**
- Did the diff add branching complexity where a better abstraction should exist?
- Did a previously cohesive module become more coupled, more stateful, or harder to scan?
- Are there repeated conditionals that signal a missing model or missing helper?
- Is the implementation direct and legible, or does it rely on special cases and incidental control flow?

**Boundary and abstraction quality:**
- Is this logic living in the right file and layer?
- Did this change enlarge a file or component past a healthy size boundary?
- Is this abstraction actually earning its keep, or is it just a wrapper?
- Is this logic living in the canonical layer, or did the diff leak details across a boundary?

**Type contracts:**
- Did the diff introduce casts, optionality, or ad-hoc object shapes that obscure the real invariant?
- Is this orchestration more sequential or less atomic than it needs to be?

## What to Flag Aggressively

- A complicated implementation where a cleaner reframing could delete whole categories of complexity
- Refactors that move code around but fail to reduce the number of concepts a reader must hold in their head
- A file crossing 1000 lines due to the PR, especially if the new code could be split out
- New conditionals bolted onto unrelated code paths
- One-off booleans, nullable modes, or flags that complicate existing control flow
- Feature-specific logic leaking into general-purpose modules
- Generic "magic" handling that hides simple structure and makes the code harder to reason about
- Thin wrappers or identity abstractions that add indirection without simplifying anything
- Unnecessary casts, `any`, `unknown`, or optional params that muddy the real contract
- Copy-pasted logic instead of extracted helpers
- Narrow edge-case handling implemented in the middle of an already busy function
- Refactors that technically pass tests but make the code less modular or less readable
- "Temporary" branching that is likely to become permanent debt
- Bespoke helpers where the codebase already has a canonical utility for the job
- Logic added in the wrong layer or package when it should live somewhere more central
- Sequential async flow where obviously independent work could be simpler with parallel execution

## Preferred Remedies

When you identify a structural problem, prefer suggestions like:

- Delete a whole layer of indirection rather than polishing it
- Reframe the state model so conditionals disappear instead of getting centralized
- Change the ownership boundary so the feature becomes a natural extension of an existing abstraction
- Turn special-case logic into a simpler default flow with fewer exceptions
- Extract a helper or pure function
- Split a large file into smaller focused modules
- Move feature-specific logic behind a dedicated abstraction
- Replace condition chains with a typed model or explicit dispatcher
- Separate orchestration from business logic
- Collapse duplicate branches into a single clearer flow
- Delete wrappers that do not meaningfully clarify the API
- Reuse the existing canonical helper instead of introducing a near-duplicate
- Make type boundaries more explicit so the control flow gets simpler
- Move the logic to the package, module, or layer that already owns the concept
- Parallelize independent work when that also simplifies the orchestration
- Restructure related updates into a more atomic flow when partial state would be harder to reason about

Do not be satisfied with "maybe rename this" feedback when the real issue is structural. Do not be satisfied with a merely cleaner version of the same messy idea if there is a plausible path to a much simpler idea.

## Approval Bar

Do not approve merely because behavior seems correct. The bar is:

- No clear structural regression
- No obvious missed opportunity to make the implementation dramatically simpler when such a path is visible
- No unjustified file-size explosion
- No obvious spaghetti growth from special-case branching
- No obviously hacky or magical abstraction that makes the code harder to reason about
- No unnecessary wrapper, cast, or optionality churn obscuring the real design
- No clear architecture-boundary leak or avoidable canonical-helper duplication
- No missed opportunity for an obvious decomposition that would materially improve maintainability

## Presumptive Blockers

Treat these as `Must fix before push` unless the author can justify them clearly:

- The diff preserves a lot of incidental complexity when there is a plausible code judo move that would delete it
- The diff pushes a file from below 1000 lines to above 1000 lines
- The diff adds ad-hoc branching that makes an existing flow more tangled
- The diff solves a local problem by scattering feature checks across shared code
- The diff adds an unnecessary abstraction, wrapper, or cast-heavy contract that makes the design more indirect
- The diff duplicates an existing helper or puts logic in the wrong layer when there is a clear canonical home
- The diff adds orchestration complexity that's clearly avoidable

## Tone

Be direct, serious, and demanding about quality. Do not be rude, but do not soften major maintainability issues into mild suggestions. If the code is making the codebase messier, say so clearly. If the implementation missed an opportunity for a dramatic simplification, say that clearly too.

Effective phrases:
- "this pushes the file past 1k lines. can we decompose this first?"
- "this adds another special-case branch into an already busy flow. can we move this behind its own abstraction?"
- "this works, but it makes the surrounding code more spaghetti. let's keep the behavior and restructure the implementation"
- "this feels like feature logic leaking into a shared path. can we isolate it?"
- "this abstraction seems unnecessary. can we just keep the direct flow?"
- "why does this need a cast / optional here? can we make the boundary more explicit instead?"
- "this looks like a bespoke helper for something we already have. can we reuse the canonical one?"
- "i think there's a code judo move here. can we reframe this so these branches disappear?"
- "this refactor moves complexity around but doesn't really delete it. is there a way to make the model itself simpler?"

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "It works." | Working code is not the bar. The bar is working code that doesn't make the codebase worse. |
| "The complexity is necessary." | Show why. If you can't point to a constraint that forces it, it's not necessary, it's unexamined. |
| "The file is fine at 1200 lines." | It wasn't 1200 lines before your PR. Extract the new code into a focused module. |
| "This is just a small if-statement." | Small if-statements in shared paths compound. Move the logic behind its own abstraction. |
| "We can clean it up later." | There is no later. The next person inherits this shape. Clean it now. |
| "It's the same pattern as the existing code." | If the existing pattern is bad, don't extend it, fix it. Broken windows compound. |
| "Splitting this would be over-engineering." | Extracting a focused module is the opposite of over-engineering. Over-engineering is the 1200-line file. |
| "The abstraction is just a thin wrapper." | Then delete it. Thin wrappers add indirection without buying clarity. |
| "I need this cast because the types are wrong upstream." | Then fix the types upstream. Don't paper over a boundary problem with a cast. |
