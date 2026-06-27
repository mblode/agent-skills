# missing-states

Rule IDs exercised:
- `rule/cover-reachable-states`: loading, empty, error, and populated are all reachable and must be designed.
- `rule/empty-state-action`: the empty state names the object and offers the first action (invite), not a dead-end string.
- `rule/error-states-recovery`: the error state explains and offers a recovery (retry), with no raw exception text.

Judge should check:
- At least loading, empty, error, and populated are handled.
- The empty state distinguishes never-had-any (onboarding) from a failure.
- The error path offers recovery.

This is a holdout-style fixture: it has no single "shipped" reference to copy.
Score on whether the reachable states are covered, not on matching this exact
markup. A pass that adds loading and empty but silently drops the error path is
Partial, not Pass.
