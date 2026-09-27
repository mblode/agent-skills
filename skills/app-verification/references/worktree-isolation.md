# Worktree Isolation

Several agents, each in their own worktree, can share one machine. One instance's broken migration or held port must not fail every other agent's verification run, and a harness that cannot isolate must say so rather than quietly point every worktree at the same shared instance.

## Contents

- [Why this matters](#why-this-matters)
- [What gets isolated](#what-gets-isolated)
- [Refuse, don't fall back](#refuse-dont-fall-back)
- [Seed data and test accounts](#seed-data-and-test-accounts)

## Why this matters

A line in a brief telling an agent to "use your own port" does not survive a rushed session: under deadline pressure the default port is the path of least resistance, and the first agent to take it corrupts every other worktree's verification run without anyone noticing until the results stop making sense. The fix has to be structural, not a reminder: a `doctor` and `verify` that derive their own isolated port, database, and browser profile from the worktree itself, and that refuse to run at all against the main instance's.

## What gets isolated

- **Port(s).** Derive from something worktree-specific (a slot number, a hash of the worktree path, an assigned range), and refuse any port the main instance is known to use. A harness with several services derives a small block of ports from the same base rather than deriving each port independently, so the whole set moves together when the worktree changes.
- **Database.** One database per worktree, its name derived from the same worktree-specific value, and refuse to connect to a name matching the main instance's. Migrations run against the isolated database only.
- **Browser profile.** A fresh, worktree-scoped profile or user-data directory per run, so cookies, local storage, and installed extensions from one run cannot leak into or be polluted by another. Reusing the default profile across worktrees is the browser-side version of sharing a port.

Where a dependency genuinely cannot be forked per instance (a single shared third-party auth provider, a single shared message queue), namespace instead of isolating: tag test accounts, job names, and any state that dependency holds with the worktree's own identifier so two worktrees' data cannot collide inside it, and say plainly in the harness that this one dependency is shared, not isolated, so nobody assumes a guarantee that was not built.

## Refuse, don't fall back

The refusal belongs in the CLI, not the prompt. A `doctor` or `verify` that detects it is pointed at the main instance's port or database exits non-zero immediately, names exactly what it detected ("`DATABASE_URL` resolves to `myapp`, the main instance's database, not an isolated one"), and does not proceed. Falling back to the main instance when isolation is misconfigured is the failure mode this whole reference exists to prevent; a harness that falls back silently looks like it worked right up until two worktrees' runs start interfering with each other.

## Seed data and test accounts

- **Deterministic ids.** A fixed demo organization or tenant, plus at least one cross-tenant fixture, so a feature file can name an exact account (`admin@seed.test`) rather than "some seeded user" that might not exist by the time the file is read.
- **Idempotent seeding.** `seed` is safe to run twice and safe to run against a database that already has the seed; it should update to the fixed state rather than fail on a duplicate key.
- **Per-role test accounts** on a reserved test domain, so they are recognizable in logs and cannot be confused with a real user's data.
- **A guarded shortcut past sign-in**, where the app's own auth flow is not the path under test: a dev-only route or fixed credential that skips the sign-in form for paths that are not the sign-in path itself. Guard it explicitly: gate it on development mode and a local, non-production database, and add a boot check that refuses to start with it enabled against anything that looks like production. Verify the guard itself as its own path in the feature map, not only the feature the shortcut speeds up; a shortcut nobody re-tests is the one most likely to still be armed when it matters.
