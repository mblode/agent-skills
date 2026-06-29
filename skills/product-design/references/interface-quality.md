# Interface Quality

Load in `review` and `harden` modes, and for any material visual change. Holds the correctness and resilience standards and the severity rubric for reporting findings. Not visual aesthetics (route to `ui-design`) or implementation audits (route to `ui-audit`).

## Verify the real surface

Source inspection establishes behavior; rendering establishes visual and interaction quality. Never claim visual verification from code alone. State which you did:

- "Verified in source": you read the component and traced the logic.
- "Verified rendered": you looked at the running interface at the stated viewport.

A review that says "looks good" without naming which verification happened is not a verification.

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

Visual-token integrity (design-system overrides, raw shadows, off-grid spacing, modal scroll structure) is not this skill's concern: route those rendered and lint checks to `ui-audit` and the project's visual lint, and taste-level visual decisions (palette, type scale, polish) to `ui-design`. This skill checks that interaction and structure are correct, not whether the result is beautiful.

## Resilience

The interface must survive reality beyond demo data.

- Overflow: long names, labels, and single words do not break layout or clip silently. Truncate with intent and a way to see the full value.
- Extreme data: large counts, long lists, zero, negative, and boundary values render without breaking alignment or pagination.
- Localization and RTL: translated strings are longer; layouts assuming English width break. Mirror correctly under RTL.
- Network and error: every fetch can fail or hang. Slow, offline, and partial responses land in a designed state (`surfaces.md`), not a blank screen or spinner.
- Time and timezone: relative times and date formatting do not silently assume the viewer's locale.

A surface that only works with short English strings and fast, successful responses is a demo, not resilient.

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
