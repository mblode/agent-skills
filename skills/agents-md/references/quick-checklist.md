# Quick Checklist (12 Checks)

Fast triage for any AGENTS.md/CLAUDE.md root file.

Scoring: `Yes` = 1, `No` = 0, `N/A` = exclude from denominator. Target: `>= 10/12` (or equivalent with `N/A`).

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
11. Rules are phrased as the outcome wanted, with absolutes reserved for safety, data loss, format contracts, and observed failures
12. Nothing restates harness or model default behavior, and no rule conflicts with a parent file or an installed skill

Quick grade:

- Pass: >= 10
- Borderline: 8-9, escalate to the full criteria
- Fail: <= 7, escalate to the full criteria; likely needs the refactor workflow

Automatic fail regardless of score:

- Commands are mostly broken/stale
- Content is mostly generic advice, template text, or restatements of default agent behavior
