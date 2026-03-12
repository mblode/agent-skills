# Severity Rubric

Use the smallest severity that still matches the concrete impact.
Map severities into the local review report like this:

- `critical` and `major` -> `Must fix before push`
- `minor` -> `Should fix soon`
- no qualifying issue -> `Ready for handoff`

## Critical

Use when the change introduces:
- a certain compile or type failure
- a direct security issue with an obvious exploit path
- a guaranteed crash or broken core flow

## Major

Use when the change introduces:
- a clear functional regression in normal usage
- incorrect state transitions or data handling
- an unambiguous instruction-file violation that meaningfully changes behavior or reviewability

## Minor

Use when the change introduces:
- a narrow but real bug
- a constrained edge-case regression
- a clearly missing but non-blocking regression or validation test
- a non-blocking instruction-file violation with clear scope

## Do not report

Drop the finding instead of assigning a low severity when it is:
- speculative
- stylistic
- pre-existing and unrelated to the diff
- likely to be caught automatically by lint or typecheck without extra reviewer value
