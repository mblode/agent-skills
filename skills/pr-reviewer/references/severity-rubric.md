# Severity Rubric

Use the smallest severity that still matches the concrete impact.
Map severities into the local review report:

- `critical` and `major` -> `Must fix before push`
- `minor` -> `Should fix soon`
- no qualifying issue -> `Ready for handoff`

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
- speculative
- stylistic
- pre-existing and unrelated to the diff
- likely caught automatically by lint or typecheck without extra reviewer value
