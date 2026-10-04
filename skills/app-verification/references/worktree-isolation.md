# Worktree Isolation

Several agents, each in their own worktree, can share one machine. One instance's broken migration or held port must not fail every other agent's verification run, and a harness that cannot isolate must say so rather than quietly point every worktree at the same shared instance. This reference is the collection's one owner of worktree isolation; sibling skills point here.

## Contents

- [Refuse, don't fall back](#refuse-dont-fall-back)
- [What gets isolated](#what-gets-isolated)
- [Env files and exported values](#env-files-and-exported-values)
- [Browser profiles](#browser-profiles)
- [Seed data and test accounts](#seed-data-and-test-accounts)

## Refuse, don't fall back

A line in a brief telling an agent to "use your own port" does not survive a rushed session: the default port is the path of least resistance, and the first agent to take it corrupts every other worktree's run without anyone noticing until the results stop making sense. The refusal belongs in the CLI, not the prompt. Every entry point that starts, seeds or drives the app (`doctor`, `seed`, `verify`, the dev server wrapper, the browser test config) derives its own isolated port, database and profile from the worktree, and when it detects the main instance's port or database it exits non-zero immediately, names exactly what it detected and the fix (`DATABASE_URL names myapp, the main instance's database. Point it at myapp_w3 in the worktree env file.`), and does not proceed. A harness that falls back silently looks like it worked right up until two worktrees' runs start interfering with each other. Check only in worktree mode, so the main checkout driving its own ports is never refused.

## What gets isolated

- **Port(s).** Derive from something worktree-specific (a slot number, a hash of the worktree path, an assigned range), and refuse any port the main instance is known to use. A harness with several services derives a small block from one base (API on the base, web on base + 1) so the whole set moves together.
- **Database.** One database per worktree, its name derived from the same worktree-specific value, and refuse a name matching the main instance's. Migrations run against the isolated database only. A slot that starts with an empty database needs `seed` (which migrates first), and `doctor` should name that fix.
- **Browser profile.** See [Browser profiles](#browser-profiles).

Where a dependency genuinely cannot be forked per instance (a single shared third-party auth provider, a single shared message queue), namespace instead of isolating: tag test accounts, job names, and any state that dependency holds with the worktree's own identifier, and say plainly in the harness that this one dependency is shared, not isolated, so nobody assumes a guarantee that was not built.

## Env files and exported values

- **Exported values win over the file.** Whatever creates the worktree usually exports its port base and database URL. Every env loader the stack uses (the runtime's env-file flag, the framework's own loader, the test runner's config) must keep an already-exported value over the one in a `.env` file, or the worktree silently runs on the main instance's values copied from the example. Loaders differ on this, so prove it with a test per loader: export worktree values, write a `.env` with the main instance's, start each loader, assert the exported values survived.
- **Recreate a missing env file, never overwrite one.** A worktree slot that is reset with `git clean` loses its untracked `.env` files. Have the dev and seed wrappers recreate a missing one from its `.env.example`, patching in the worktree's own database URL and ports, so a freshly cleaned slot needs no manual setup step. Never touch a file that exists: a value someone set on purpose is not the wrapper's to clobber.

## Browser profiles

- **Ephemeral profiles need nothing.** A test runner that launches its own browser (Playwright and similar) gets a fresh, throwaway profile per run already. Its one isolation duty is the target: the config refuses a base URL on the main instance's ports when run from a worktree, because a fresh profile still lands its requests on whatever the main instance is serving.
- **Persistent profiles need a directory per instance.** A CDP or computer-use session driven by hand reuses a real profile (cookies, local storage, a debugging port). Give it a `--user-data-dir` under a gitignored folder keyed by the worktree's port base (or `main`), and run the same main-port refusal before it attaches. Reusing the default profile across worktrees is the browser-side version of sharing a port.

## Seed data and test accounts

- **Deterministic ids.** A fixed demo organization or tenant, plus at least one cross-tenant fixture, so a feature file can name an exact account (`admin@seed.test`) rather than "some seeded user" that might not exist by the time the file is read.
- **Idempotent seeding.** `seed` is safe to run twice and against a database that already has the seed; it updates to the fixed state rather than failing on a duplicate key. It refuses to run in production.
- **Per-role test accounts** on a reserved test domain, so they are recognizable in logs and cannot be confused with a real user's data.
- **A guarded shortcut past sign-in**, where the app's own auth flow is not the path under test: a dev-only route or fixed credential that skips the sign-in form for paths that are not the sign-in path itself. It is a production backdoor the moment it ships enabled, so guard it explicitly: gate it on development mode and a local, non-production database, and add a boot check that refuses to start with it enabled against anything that looks like production. Verify the guard itself as its own path in the feature map, not only the feature the shortcut speeds up; a shortcut nobody re-tests is the one most likely to still be armed when it matters.
