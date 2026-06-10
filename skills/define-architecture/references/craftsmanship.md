# Craftsmanship Checklists

Convention checklists worth encoding in an architecture brief. Load when writing the team-conventions or testing sections; copy the relevant items into the brief rather than linking here.

## Code style conventions

- Pick one word per concept across the codebase; don't mix `get`/`fetch`/`retrieve` for the same operation.
- One level of abstraction per function; a function that mixes orchestration and detail gets split.
- No boolean flag parameters; split into two functions or pass an options object with named fields.
- Avoid negative conditionals (`if (!isNotReady)` reads twice as slowly).
- Name magic numbers; an unexplained `86400` is a bug waiting for a timezone.
- Comments carry intent, never description; a comment that restates the code rots the moment the code changes.

## Interfaces and errors

- Hide implementation details; design small orthogonal primitives.
- Do the same thing the same way everywhere; an API that surprises once is distrusted everywhere.
- Detect errors at low levels; handle them at high levels. Mid-layer catch-and-rethrow loses the stack for nothing.
- Exceptions are for exceptional situations, not control flow.

## Testing discipline

- Test boundaries and pre/post-conditions first; that's where the bugs cluster.
- Prefer self-contained tests with one logical assertion each; a test that needs another test's side effects flakes under parallel runs.
- Automate regression tests for every fixed bug; a bug that recurs untested recurs again.
- Compare independent implementations when correctness is critical (e.g. a fast path against a naive reference).

## Performance

- Measure first with a profiler; intuition about hot spots is usually wrong, and optimizing a cold path adds complexity for zero gain.
- Prefer better algorithms and data structures over micro-tuning.
- Do not store what is easy to recompute; caches need invalidation, recomputation doesn't.

## Pragmatism

- Do not remove a fence until its purpose is known; "unused" code guarding an edge case fails in production, not review.
- Treat DRY as duplication of knowledge, not of text; two similar-looking functions encoding different business rules must stay separate.
- Track and surface technical debt in the brief's Open risks section; invisible debt compounds.
- Prefer reversible steps when risk is unclear; an irreversible change needs a documented fallback first.
