# Interface Quality

Load in `review` and `harden` modes, and for any material visual change. Holds the correctness and resilience standards and the severity rubric for reporting findings. Not visual aesthetics (route to `ui-design`) or implementation audits (route to `ui-audit`).

## Standards

### Correctness

- Control matches the choice (`rule/control-matches-cardinality`); semantic matches the intent (`rule/navigation-vs-action`).
- Primary task and action are unmistakable (`rule/one-primary-action`).
- Important actions name object, scope, and consequence (`rule/name-object-scope-consequence`).
- User input survives validation and recoverable errors (`rule/preserve-user-input`).

### Accessibility as a product concern

Owns whether a user can complete the task with assistive technology, not the implementation-level markup audit (`ui-audit`).

- Every interactive control has an accessible name (`rule/accessible-name-required`).
- Primary flow is keyboard-completable, with visible focus and sensible order (`rule/keyboard-complete-flow`).
- Focus moves to new surfaces and returns on close; nothing traps the user.
- Do not bypass the shared focus token with a custom ring (`rule/no-custom-focus-bypass`).
- State and consequence are understandable, not just present: an error a screen reader announces as "error" with no detail fails even if technically labeled.

### Hierarchy and structure

- Group content with hierarchy, spacing, and alignment before adding containers (`rule/structure-before-containers`); nested boxes add weight, not meaning.

## Resilience

Which resilience states must exist (overflow, extreme data, localization and RTL, network failure) is a decision that lives in `surfaces.md`. Whether the built UI renders them correctly is `ui-audit`'s concern.

## Severity rubric

Report findings ordered by user impact. Use these levels exactly.

- P0: blocks the primary task, a severe accessibility failure, or unrecoverable user harm (data loss, a permission bypass, a destructive action the user cannot understand or undo).
- P1: likely task failure, a misleading consequence, a missing critical state, or a major responsive or accessibility defect.
- P2: meaningful friction, inconsistency, weak hierarchy, or a recoverability issue that does not block the task.
- P3: minor craft or consistency improvement.

For each finding include:

- Location: file and line for source findings, or the rendered location and viewport.
- Verification status: verified in source, verified rendered, or unverified (and why).
- Rule ID: the `rule/` slug it violates.
- User consequence: what goes wrong for the user, not just what the code does.
- Smallest concrete fix: the narrowest change that resolves it, and which skill owns it.

Keep findings at decision altitude: naming the wrong control, missing error state, or unnamed destructive action. A line-level React bug with a code patch is `ui-audit`'s; hand it over, don't write the fix here.
