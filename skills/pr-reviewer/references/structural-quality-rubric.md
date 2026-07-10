# Structural Quality Rubric

Unusually strict review of implementation quality, maintainability, and codebase health. Loaded by pr-reviewer's Structural mode ("thermo-nuclear review", "structural review", "deep code quality audit", "harsh maintainability review", "code judo").

The core question is not "will this code break?" but "should this code exist in this form?"

## Contents

- Review target
- Non-negotiable standards
- Preferred remedies
- Blockers

## Review target

Report structural issues only when the diff worsens a concrete maintenance path:

- a future named change now touches more files or layers than before
- a feature branch leaks into shared code that does not own the feature
- a new abstraction has no current caller, invariant, or boundary to protect
- a file crosses the 1000-line threshold because new behavior was added in place
- a simpler vertical slice could delete branches, state, or orchestration without changing behavior
- a compatibility path or legacy alias survives with no evidence anything still depends on it
- hand-rolled code or a new dependency duplicates a stdlib or native platform capability

## Non-Negotiable Standards

These eight standards are the source of truth. Every flag and blocker below maps back to a number here.

1. **Ambitious structural simplification.** Reframe changes so branches, helpers, modes, conditionals, or layers disappear. Prefer deleting moving parts to moving them around.
2. **1000-line file threshold.** Do not let a PR push a file from under 1000 lines to over without a named structural reason. Prefer extracting helpers, subcomponents, modules, or local abstractions. Waive only when the new section has one responsibility, local tests, and no mixed orchestration/detail code.
3. **No spaghetti branching growth.** Be highly suspicious of new ad-hoc conditionals, scattered special cases, or one-off branches in unrelated flows; treat them as a design problem, not a stylistic nit. Prefer a dedicated abstraction, helper, state machine, policy object, or separate module.
4. **Behavior-preserving cleanup.** If behavior can stay the same while structure becomes meaningfully cleaner, flag the smaller shape: fewer branches, shared-code touchpoints, casts, modes, or files in the next related change.
5. **No unearned indirection.** Treat brittle, ad-hoc, or "magic" behavior as a code-quality issue. Be skeptical of generic mechanisms that hide data-shape assumptions. Flag wrappers that add indirection without clarity.
6. **Type and boundary cleanliness.** Question unnecessary optionality, `unknown`, `any`, or cast-heavy code when a clearer type boundary could exist. Prefer explicit typed models or shared contracts over loosely-shaped ad-hoc objects. If a branch relies on silent fallback to paper over an unclear invariant, ask whether the boundary should be explicit.
7. **Keep logic in the canonical layer.** Call out feature logic leaking into shared paths or implementation details leaking through APIs. Prefer existing canonical utilities and helpers over bespoke one-offs, and prefer the stdlib or native platform over both. Push code toward the right package, service, or module instead of normalizing architectural drift.
8. **Orchestration simplicity.** Treat unnecessary sequential orchestration and non-atomic updates as design smells when the same inputs can be processed independently or one transaction/batch would avoid partial state. Do not over-index on micro-optimizations; flag orchestration when the proposed structure reduces branches, retries, or rollback paths.

## Preferred Remedies

Name the move rather than polishing the existing shape:

- Delete a whole layer of indirection rather than refining it (1, 5)
- Reframe the state model so conditionals disappear instead of getting centralized (1, 3)
- Change the ownership boundary so the feature becomes a natural extension of an existing abstraction (7)
- Turn special-case logic into a simpler default flow with fewer exceptions (3, 4)
- Extract a helper or pure function when it names a reused invariant or boundary (4)
- Split a large file into smaller focused modules (2)
- Replace condition chains with a typed model or explicit dispatcher (3, 6)
- Reuse the existing canonical helper instead of introducing a near-duplicate (7)
- Replace hand-rolled code or a redundant dependency with the stdlib or platform equivalent (7)
- Make type boundaries more explicit so the control flow gets simpler (6)
- Move retry, transaction, rollback, and partial-state handling out of business logic (8)
- Parallelize independent work when that also simplifies the orchestration (8)
- Delete the old path in the same change instead of leaving both alive (1, 4)

Do not spend findings on naming or style when the real issue is structural. Name the structural move that removes the complexity.

## Blockers

Do not approve merely because behavior seems correct. Treat each item below as `Must fix before push` unless the diff names the constraint that requires the shape. Each maps to a numbered standard:

- [ ] Missed simplification: one ownership or model change would delete branches, modes, helpers, or layers (1)
- [ ] A file crosses 1000 lines with no named structural reason, or new behavior with a local boundary went unsplit (2)
- [ ] Ad-hoc branching or scattered feature checks added to a shared path that does not own the feature (3, 7)
- [ ] A refactor moved code without reducing the concepts a reader must hold (1, 4)
- [ ] An unnecessary abstraction, wrapper, or cast-heavy contract whose callers, invariant, or boundary cannot be named (5, 6)
- [ ] A duplicated helper, rule, or invariant now has two owners, or logic landed outside its canonical layer (7)
- [ ] Hand-rolled code or a new dependency duplicates stdlib or native platform capability with no named constraint (7)
- [ ] Orchestration complexity a batch, transaction, or independent parallel step would remove (8)
- [ ] Unrequested compatibility: an old/new dual path, legacy alias, or staged deprecation kept with no named consumer of the old path (1, 4)
- [ ] Incomplete replacement: a replaced model's obsolete fields, validators, fixtures, tests, or docs remain (4)
