# Interface Quality

Load in `review` and `harden` modes, and for any material visual change. This file holds the correctness and resilience standards and the severity rubric used to report findings. It does not cover visual aesthetics (route to `ui-design`) or implementation audits (route to `ui-audit`).

## Verify the real surface

Source inspection establishes behavior; a rendered interface establishes visual and interaction quality. Never claim visual verification from code alone. State which you did:

- "Verified in source" means you read the component and traced the logic.
- "Verified rendered" means you looked at the running interface at the stated viewport.

A review that says "looks good" without naming which kind of verification happened is not a verification.

## Standards

### Correctness

- The control matches the choice (`rule/control-matches-cardinality`) and the semantic matches the intent (`rule/navigation-vs-action`).
- The primary task and action are unmistakable (`rule/one-primary-action`).
- Important actions name their object, scope, and consequence (`rule/name-object-scope-consequence`).
- User input survives validation and recoverable errors (`rule/preserve-user-input`).

### Accessibility as a product concern

This skill owns whether a user can complete the task with assistive technology, not the implementation-level markup audit (that is `ui-audit`).

- Every interactive control has an accessible name (`rule/accessible-name-required`).
- The primary flow is completable by keyboard, with visible focus and sensible order (`rule/keyboard-complete-flow`).
- Focus moves to new surfaces and returns on close; nothing traps the user.
- Do not bypass the shared focus token with a custom ring (`rule/no-custom-focus-bypass`).
- State and consequence are understandable, not just present: an error a screen reader announces as "error" with no detail fails this even if it is technically labeled.

### Hierarchy and structure

- Group content with hierarchy, spacing, and alignment before adding containers (`rule/structure-before-containers`); nested boxes add weight, not meaning.

Visual-token integrity (design-system overrides, raw shadows, off-grid spacing, modal scroll structure) is not this skill's concern. Route those rendered and lint checks to `ui-audit` and the project's visual lint, and route taste-level visual decisions (palette, type scale, polish) to `ui-design`. This skill checks that the interaction and structure are correct, not whether the result is beautiful.

## Resilience

The interface must survive reality beyond the demo data.

- Overflow: long names, long labels, and long single words do not break layout or clip silently. Truncate with intent and a way to see the full value.
- Extreme data: very large counts, very long lists, zero, and negative or boundary values render without breaking alignment or pagination.
- Localization and RTL: translated strings are longer; layouts that assume English width break. Mirror correctly under RTL.
- Network and error: every fetch can fail or hang. Slow, offline, and partial responses each land in a designed state (`surfaces.md`), not a blank screen or an infinite spinner.
- Time and timezone: relative times and date formatting do not assume the viewer's locale silently.

A surface that only works with short English strings and fast, successful responses is not resilient; it is a demo.

## Severity rubric

Report findings ordered by user impact. Use these levels exactly.

- P0: blocks the primary task, creates a severe accessibility failure, or can cause unrecoverable user harm (data loss, a permission bypass, a destructive action the user cannot understand or undo).
- P1: likely task failure, a misleading consequence, a missing critical state, or a major responsive or accessibility defect.
- P2: meaningful friction, inconsistency, weak hierarchy, or a recoverability issue that does not block the task.
- P3: minor craft or consistency improvement.

For each finding include:

- Location: file and line for source findings, or the rendered location and viewport.
- Verification status: verified in source, verified rendered, or unverified (and why).
- Rule ID: the `rule/` slug it violates.
- User consequence: what goes wrong for the user, not just what the code does.
- Smallest concrete fix: the narrowest change that resolves it, and which skill owns implementing it.

Keep findings at the decision altitude. Naming the wrong control, the missing error state, or the unnamed destructive action is this skill's job. A line-level React bug with a code patch is `ui-audit`'s job; hand it over rather than writing the fix here.
