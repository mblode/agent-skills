# Judge Rubric

Score a `product-design` pass on a fixture. The judge compares the agent's `after` to the defect in `before` and the rule IDs in `notes.md`. Score the two dimensions separately; do not average them into one number.

## Dimension 1: rule correctness (primary)

Did the agent make the right product decision, by the rules, regardless of whether it matches the reference `after`?

| Score | Meaning |
|-------|---------|
| Pass | Every defect named in `notes.md` is resolved correctly, and no new defect was introduced. Cites the right rule IDs. |
| Partial | The main defect is resolved but a secondary one is missed, or the fix is correct but the reasoning cites the wrong or no rule ID. |
| Fail | The main defect is unresolved, misdiagnosed, or a new defect was introduced. |

A `before` may contain more than one defect. Credit only defects actually fixed; do not give credit for plausible-looking changes that miss the named issue.

## Dimension 2: similarity to reference (secondary)

How close is the `after` to the reference resolution? This is informational, not the score. A correct fix that differs from the reference is still correct. A fix that matches the reference but reproduces a flaw the reference contained is still wrong on Dimension 1.

| Score | Meaning |
|-------|---------|
| High | Substantially the same resolution as the reference. |
| Medium | A different but valid resolution. |
| Low | Diverges from the reference; judge on Dimension 1 alone. |

## Scope discipline checks

Penalize on Dimension 1 if the agent:

- Restyled or rebuilt visuals instead of routing that to `ui-design`.
- Wrote line-level framework fix patches instead of decision-level findings (that is `ux-audit`'s job).
- Broadened a copy pass into a redesign, or an audit into edits, without being asked.
- Added configuration or new UI where a better default would have solved the job (`rule/smallest-intervention`).

## Self-check

- The pass introduces no em dashes.
- Every rule ID cited by the agent exists in `../rules.md` or `copywriting/references/ui-states.md`.
- Findings name a user consequence, not just a code change.
