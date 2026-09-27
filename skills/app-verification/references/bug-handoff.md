# Bug Handoff

Reproduce first, in an isolated instance, before doing anything else with a bug report. This format traces to pstack's Benny automation (`reproduce-and-fix-issues`); what follows is the shape a Maintain-mode run hands off once it has a verdict.

## Contents

- [Verdict](#verdict)
- [Steps](#steps)
- [Handoff template](#handoff-template)

## Verdict

Every investigation ends in exactly one of these, stated plainly at the top of the handoff:

- **Reproduced.** File it with the handoff template below.
- **Reproduced but already fixed on main.** Close it, naming the fixing commit, and ship whatever was pending on it.
- **Cannot reproduce.** Reply with exactly what was tried and what evidence would let someone try again (a specific account, a specific timestamp, a specific input the report did not include). "Cannot reproduce" with no attempt log is not a verdict, it is a shrug.

## Steps

1. **Map the report to a feature file** by whatever it names: the visible text on screen, the route, a screenshot. If nothing in the map covers it, that absence is itself a finding: the feature map is missing a path, and Maintain mode's triage should add it once the bug itself is resolved.
2. **Reproduce in a fresh, isolated instance, on `main`,** not on a branch that might already carry an unrelated fix: `doctor`, then `seed`, then the mapped path's own check (`verify --feature <id>`) or the exact manual steps the report describes.
3. **If it does not reproduce on `main`,** walk backward: the reporter's commit, an earlier release, `git log` or a bisect, until it does reproduce or until you can say with real confidence it never did. Landing on a commit already merged to `main` is what turns this into "reproduced but already fixed."
4. **Read the failing path until you can state two separate things:** the root cause (the file and the faulty assumption, not just the symptom), and the specific case no existing test covers. These are two different sentences on purpose; a root cause with no named untested case leaves the next fix free to patch the symptom and leave the same gap open for a different trigger.

## Handoff template

```markdown
Reproduced (3/3 on main @ <sha>)

Report: <quote from the report>; <link to a screenshot or recording, if any>
Repro path: feature `<id>`, path `<path-id>`
1. `<the doctor/seed commands, or however the isolated instance was brought up>`
2. `<the exact manual steps, or the verify command for this path>`
Evidence: <trace, screenshot, or recording path from this run>

Root cause: <file and the faulty assumption, one or two sentences>
Case no test covers: <the specific gap, stated concretely enough that a test could be written from this sentence alone>

For the agent fixing this: re-run the repro above to confirm your fix, write a failing test for the case named above, then fix the issue.
```

For the "reproduced but already fixed" verdict, replace the first line with `Reproduced but already fixed on main (<sha of the fixing commit>)` and drop the "For the agent fixing this" line; there is nothing left to fix, only to confirm and close.
