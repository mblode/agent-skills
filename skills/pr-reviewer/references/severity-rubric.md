# Severity Rubric

Use the smallest severity that still matches the concrete impact.
Map severities into the local review report:

- `critical` and `major` -> `Must fix before push`
- `minor` -> `Should fix soon`
- no qualifying issue -> `Ready for handoff`

Severity answers "how bad if real". It is independent of the verdict, which answers "how sure". A plausible finding keeps the severity its impact earns and carries a `plausible` marker so the reader knows a repro comes first. Do not downgrade a critical to minor because you are unsure; that hides the impact instead of the uncertainty.

## Critical

Introduces:
- a certain compile or type failure
- a direct security issue with an obvious exploit path
- a guaranteed crash or broken core flow

## Major

Introduces:
- a clear functional regression in normal usage
- incorrect state transitions or data handling
- an unambiguous instruction-file violation that meaningfully changes behavior or reviewability
- a file pushed past ~1000 lines when the new code could be extracted (structural rubric loaded)
- ad-hoc feature logic scattered into shared code paths, harder to reason about (structural rubric loaded)

## Minor

Introduces:
- a narrow but real bug
- a constrained edge-case regression
- a clearly missing but non-blocking regression or validation test
- a non-blocking instruction-file violation with clear scope
- a bespoke helper where a canonical utility already exists (structural rubric loaded)
- an unnecessary abstraction layer that adds indirection without clarity (structural rubric loaded)

## Do not report

Drop the finding instead of a low severity when it is:
- refuted: the code disproves it, a type or constant makes it impossible, or the diff already guards it
- stylistic, with no observable effect
- pre-existing and unrelated to the diff
- likely caught automatically by lint or typecheck without extra reviewer value

Uncertainty alone is not grounds to drop. A real mechanism whose trigger you cannot pin down is reported as `plausible`, not deleted.
