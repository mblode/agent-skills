# Interface Quality

Load in `review` and `harden` modes. Holds the accessibility-as-task-completion standard, the review scan order, and the severity rubric and finding format. Not visual aesthetics or implementation audits: both route to `ui-design` (Direction and Build modes for aesthetics, Audit mode for the built result).

## Accessibility as task completion

This skill owns whether a user can complete the task with assistive technology or constrained input. The implementation-level markup audit (roles, `aria-*`, contrast, axe output) is `ui-design` Audit mode's. The test at this altitude: can a keyboard-only, screen-reader, switch, or one-handed touch user finish the job, not just reach the first control?

- Every interactive control has an accessible name (`rule/accessible-name-required`).
- The primary flow is keyboard-completable with visible focus and sensible order; focus moves into new surfaces, returns on close, and is never fully hidden behind sticky chrome (`rule/keyboard-complete-flow`, `rule/no-custom-focus-bypass`).
- Every gesture-triggered action has a single-pointer, non-timed control that does the same thing (`rule/gesture-has-control-alternative`).
- Information entered earlier in the flow is not retyped (`rule/no-redundant-entry`).
- Authentication does not rest on memory or transcription; paste and password managers work (`rule/auth-allows-assistance`).
- State and consequence are understandable, not merely present: an error a screen reader announces as "error" with no detail fails even when technically labeled (`rule/reads-without-seeing`).
- Target size is a rendered check: `ui-design` owns the 44 and 24 CSS-pixel numbers (`interaction-target-size`). This skill's decision is upstream: whether the action is on a control at all, rather than a gesture or a tiny inline glyph.

## Review scan order

In `review` mode, walk the flow once per category in `rules.md`, in this order: action naming and consequence (the highest-impact failures live here), state coverage, interaction and control selection, accessibility as task completion, hierarchy and structure. Stop at decision altitude: the finding is "this delete has no safeguard", not "add `onConfirm`".

## Severity rubric

Report findings ordered by user impact. Use these levels exactly.

- P0: blocks the primary task, a severe accessibility failure, or unrecoverable user harm (data loss, a permission bypass, a destructive action the user cannot understand or undo).
- P1: likely task failure, a misleading consequence, a missing critical state, or a major responsive or accessibility defect.
- P2: meaningful friction, inconsistency, weak hierarchy, or a recoverability issue that does not block the task.
- P3: minor craft or consistency improvement.

For each finding include:

- Location: the screen, step, or component; file and line when reviewing from source.
- Verification status: verified in source, verified rendered, or unverified (and why).
- Rule ID: the `rule/` slug it violates, or a labeled coverage gap.
- User consequence: what goes wrong for the user, not just what the code does.
- Smallest concrete fix: the narrowest change that resolves it, and which skill owns it.

A line-level React bug with a code patch is `ui-design` Audit mode's output; hand it over rather than writing the fix here.
