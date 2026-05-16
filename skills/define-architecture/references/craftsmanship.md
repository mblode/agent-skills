# Craftsmanship Checklists

Use these checklists when setting conventions or reviewing code quality.

## Code style

- Use active names for functions; names should say what they do.
- Pick one word per concept — don't mix `get`/`fetch`/`retrieve`.
- Keep functions small; do one thing well; one level of abstraction per function.
- Prefer minimal arguments; avoid boolean flag parameters.
- Avoid negative conditionals.
- Delete commented-out code and unused code.
- Give names to magic numbers.
- Comments must not contradict the code; use them for intent, not description.
- Be careful with side effects.

## Interfaces and errors

- Hide implementation details; design small orthogonal primitives.
- Do the same thing the same way everywhere; avoid surprises.
- Detect errors at low levels; handle them at high levels.
- Use exceptions only for exceptional situations.

## Debugging checklist

- Debug it now, not later; don't make the same mistake twice.
- Reproduce the bug; read before typing; get a stack trace.
- Inspect recent changes; look for patterns or failure numerology.
- Explain the code to someone else.
- Divide and conquer; localize with logging or output.
- Draw pictures; use tools; keep records.
- Write self-checking code and log files when needed.

## Testing discipline

- Write unit tests early and often; test incrementally.
- Test boundaries; pre/post-conditions; program defensively.
- Check error returns; start with simple parts.
- Know expected output; verify conservation properties.
- Compare independent implementations when possible.
- Automate regression tests; measure coverage.
- Prefer self-contained tests; aim for one assertion per test.

## Performance

- Measure first: automate timings, use a profiler, focus on hot spots.
- Prefer better algorithms/data structures; avoid useless optimization.
- Cache or precompute; buffer I/O; handle special cases separately.
- Replace expensive operations; collect common subexpressions.
- Unroll or eliminate loops when it helps measurably.
- Consider approximation or lower-level code only when needed.
- Do not store what is easy to recompute.

## Portability

- Stick to standards and mainstream tools; use standard libraries.
- Beware language trouble spots; hide system dependencies behind interfaces.
- Maintain compatibility; rename if the specification changes.

## Professionalism and pragmatism

- Design before writing code; be prepared and communicate early.
- Avoid harmful changes; prefer reversible steps when risk is unclear.
- Communicate requirements with a brief spec or acceptance criteria.
- Create acceptance tests; leave the codebase cleaner than found.
- Do not remove a fence until its purpose is known.
- Treat DRY as duplication of knowledge; prefer duplication over wrong abstraction.
- Track and surface technical debt; favor designs that are easy to change.
- Use tracer bullets; decouple concerns; apply SRP.
- Review changes for regressions before final output.
