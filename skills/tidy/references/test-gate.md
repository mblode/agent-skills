# Test Gate

Loads only when the diff adds or changes a test. A diff with no test changes skips this file entirely.

For each new or changed test, answer:

1. Does it pin behavior this diff changed? Name the hunk.
2. Would it fail if that behavior broke? If you cannot describe the break that turns it red, it pins nothing.
3. Does it duplicate an existing test? Grep sibling tests for the same contract at the same boundary before treating a new one as needed.
4. Is it a snapshot or implementation-detail test with no real assertion: a snapshot of output the test also defines, a private call-shape check (`toHaveBeenCalledWith` on an internal), or a rename-sensitive string match that a real behavior change would not fail?
5. Is it mock-only: every collaborator stubbed, the mock producing the very value asserted, so the test proves the mock rather than the code?

A "no" on 1 or 2, or a "yes" on 3, 4, or 5, is a finding. File it in the confirmed tier when the evidence is direct (the assertion reads back the mock, the duplicate is named and cited); file it in the plausible tier when the mechanism is real but you have not traced every caller, per `references/severity-rubric.md`'s verdict step.

## In apply mode

Delete a test that fails the gate with no salvageable assertion. Rewrite one that has a real behavior buried under mock-only setup: move the assertion to the boundary the mock stands in for, or fold it into the sibling test it duplicates. Do not add a replacement test that restates the same implementation under a different name.

## Scope

This gate judges tests inside the diff. It does not sweep the existing suite for pre-existing junk, set a repo-wide test count target, or hold a coverage budget: that is `test-audit`.
