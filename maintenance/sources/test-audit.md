# test-audit sources

Provenance for `skills/test-audit`. Never loads during a task.

## OpenClaw `test-audit` (MIT)

Adapted from OpenClaw's `test-audit` skill and its campaign guide ([openclaw/openclaw](https://github.com/openclaw/openclaw/tree/main/.agents/skills/test-audit), MIT), which removed about 400k lines of tests with little change in coverage.

- Took: the junk patterns, retention bar, evidence fields, and campaign order.
- Left: the OpenClaw-specific runners, CI routing, and PR tooling. The per-test gate this skill originally carried moved to `tidy`, which reviews the diff that adds the test.
- Authored here: the target-and-budget framing (an agent told only to "clean up" stops early), the coverage measurement reference, and the AGENTS.md gate handoff.

The SKILL.md Credit line carries the attribution that ships with the skill.
