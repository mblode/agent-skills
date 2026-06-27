# few-options-select

Rule IDs exercised:
- `rule/control-matches-cardinality`: 2-3 static, mutually exclusive options use radios or a segmented control, not a select.

This fixture is also covered deterministically by the lint rule
`prefer-radio-for-few-options`. It appears here to test that the agent makes the
same call from judgment, and that it carries the consequence of each option
(who can see it) rather than just relabeling the control.

Judge should check:
- The select became a visible-options control (radios or segmented).
- Each option communicates its consequence.

Do not credit converting to radios if the options become dynamic or exceed a
small static set, where a select is the right call.
