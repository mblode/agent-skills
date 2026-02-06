# Quick Checklist (10)

Use this for a fast triage pass.

Scoring:
- `Yes` = 1
- `No` = 0
- `N/A` = exclude from denominator
- Quick target: `>= 8/10` (or equivalent with `N/A`)

1. Core run/test/build/lint commands exist when applicable
2. Commands appear runnable and match project scripts/tooling
3. Setup/bootstrap requirements are documented
4. At least one project-specific gotcha is documented
5. Gotchas include corrective action (what to do instead)
6. Conventions that change implementation choices are explicit
7. Every line passes the litmus test: removing it would cause the agent to make mistakes
8. Root file avoids framework doc dumps/templates
9. Linked paths and commands are current (not stale/dead)
10. Non-universal detail is linked out (via `@import` or child files), not inlined

Quick grade:
- Pass: >= 8
- Borderline: 6-7
- Fail: <= 5

Automatic fail:
- Commands are mostly broken/stale
- Content is mostly generic advice/template text
