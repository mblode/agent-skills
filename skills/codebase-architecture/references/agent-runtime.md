# Agent Runtime

Configuration that makes a session productive from its first turn, and merge gating that matches the risk of the change. Load when configuring session hooks, permissions, or review gating.

## Hooks

Every manual setup step is a failed or slow session. Three hooks cover most of it:

- **Session start:** install dependencies when they are missing. A fresh worktree becomes productive with zero instructions, and the agent never spends a turn diagnosing a missing module as a code error.
- **After a write or edit:** run the formatter and autofixer on the file just written. The tree stays clean by construction rather than by the agent remembering, and a formatting gate can never fail on agent-authored code.
- **Before a destructive command:** block what should never run unattended, where the repo has such commands.

The post-edit hook largely subsumes a pre-commit formatting hook, and catches the same failure earlier and cheaper. Keep pre-commit for what a per-file hook cannot see: whole-repo checks, cross-file rules, and anything needing the staged set.

The harness owns the settings file's schema and matcher syntax. Decide what belongs in it and why; do not restate mechanics the harness already documents.

## Permission allowlist

Allowlist the read-only commands an agent runs constantly (status, log, diff, typecheck, lint, test, ripgrep, ls). Each approval prompt is a stall, and a session spent approving `git status` twenty times trains everyone toward blanket approval, which is the outcome the prompts exist to prevent.

Allowlist by command shape, not by prefix breadth. `git diff` is read-only; `git` is not.

## Worktree bootstrap

For parallel agent fleets, a bootstrap script that copies environment files, reuses dependency and codegen artifacts from the main checkout when lockfiles match, and offsets ports so worktrees never collide. Without the port offset, the second agent's dev server fails in a way that looks like a code bug.

## Blast-radius review rubric

A checked-in rubric, read from the base ref, telling the automated reviewer which changes it may approve and which must escalate to a human. Without one, the reviewer applies generic defaults: uniformly cautious, so nothing merges unattended, or uniformly permissive, so nothing is gated.

Two explicit lists, not a severity score:

**Auto-approve:** features, bug fixes, refactors, tests, documentation, styling, copy and translation additions, analytics events, feature-flag default changes.

**Escalate to a human:** billing and payments, authentication and authorization, data deletion, migrations touching stored data, build, signing, and release configuration, permission and entitlement changes, anything altering a public contract.

The escalation list is the one worth arguing over, and its shape generalises: money, identity, destructive data operations, persisted-data shape, and anything that ships to users outside the normal deploy path. Everything else is reversible by the rollback path, which is why it can merge unattended.

Verify the rubric the same way as any other gate: open a documentation-only change (auto-approves) and a migration (escalates). A rubric nobody has watched escalate is not known to work.
