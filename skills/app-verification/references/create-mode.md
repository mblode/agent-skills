# Create Mode

Bootstrap a verification harness inside the target repo when none exists: interview, generate, seed the map, prove it, hand off.

## Contents

- [Step 1: interview the repo, not the user](#step-1-interview-the-repo-not-the-user)
- [Step 2: scaffold the three commands](#step-2-scaffold-the-three-commands)
- [Step 3: wire isolation before the first feature file](#step-3-wire-isolation-before-the-first-feature-file)
- [Step 4: seed the feature map](#step-4-seed-the-feature-map)
- [Step 5: prove it before calling it done](#step-5-prove-it-before-calling-it-done)
- [Step 6: hand off](#step-6-hand-off)
- [Doctor command shape](#doctor-command-shape)
- [Verify CLI shape](#verify-cli-shape)

## Step 1: interview the repo, not the user

Answer these from the repo itself before writing anything; a user's one-line request rarely supplies all five, and guessing wrong here rewrites the harness later instead of extending it.

- **Surface.** Web, CLI, desktop, API, or mobile, and which of those the repo actually ships (a repo can have more than one).
- **Run.** The real start command, the ports it binds, the environment variables it needs, and how it gets seed data.
- **Drive.** What already exists first: an installed Playwright or Cypress config, a PTY/tmux pattern for a CLI or TUI, a debug port, curl against a documented API. Reach for a generic recipe only once you have confirmed nothing already fits.
- **Observe.** What evidence a check can actually produce here: screenshots, a captured transcript, a response body, a log line, an exit code, a row in the database. A check that cannot name its evidence cannot be verified later.
- **Isolate.** Can two instances of this app run side by side right now. If not, say so in the harness itself rather than risk a second agent's run corrupting the first one's session; isolation (`references/worktree-isolation.md`) is what turns "no" into "yes."

## Step 2: scaffold the three commands

Create `doctor`, `seed`, and `verify` per the contract in the main `SKILL.md`, plus the feature map (`references/feature-map-format.md` covers both layouts), inside a skill folder in the target repo (the host's project-skill convention, for example `.claude/skills/verify-<app>/`). Shape below; adapt the language and runtime to the repo's own stack, the shape is what matters, not the specific syntax.

Language-agnostic naming that keeps the harness discoverable without a registry: a script named exactly `doctor`, `seed`, and `verify` (or `doctor.<ext>`, etc., matching the repo's convention) at the top of the skill folder, never buried behind a generic `run.sh <subcommand>` an agent has to already know to find.

## Step 3: wire isolation before the first feature file

Get `references/worktree-isolation.md` working, and prove it (two instances running side by side, `doctor` passing in both, neither writing to the other's port or database) before seeding a single feature. A feature file written against a harness with no isolation gets rewritten the day two agents run it at once; wiring isolation first means it never needs revisiting.

## Step 4: seed the feature map

Write the top three to five features first, per `references/feature-map-format.md`. For each: every user-reachable path, the cheapest method that still exercises it the way a user reaches it (`references/verification-ladder.md`), and the preconditions and gotchas someone would otherwise learn the hard way. Stop at three to five; a map seeded for every feature on day one is usually a map nobody has actually driven yet.

## Step 5: prove it before calling it done

Run the whole loop once, for real, on one feature: `doctor`, then `seed`, then `verify` against that one feature end to end. Capture the evidence the feature file promises, clean up, then confirm the evidence survived cleanup (cleanup that deletes its own proof is worse than no cleanup). A harness that was generated but never executed is a draft, not a deliverable, and the first person to actually run it should not be the next agent under deadline pressure.

## Step 6: hand off

Point whoever picks this up next at Maintain mode (`references/maintain-mode.md`) for every session after this one. Create mode does not run again just because a session forgot the harness exists; check for it first.

## Doctor command shape

An ordered checklist, each stage depending on the one before it, so a failure two stages in does not print eight unrelated-looking symptoms for the same root cause:

```text
context      -> which worktree/instance this is, and that it resolved at all
toolchain    -> the runtime and package manager versions this repo pins
deps         -> installed dependencies match the lockfile
env          -> required environment variables and .env files are present
ports        -> this instance's ports are free and are not the main instance's
db           -> database reachable, and it is this instance's database, not the main one
migrations   -> schema is current
seed         -> test accounts and demo data are present and match the fixed ids
build        -> build output is newer than source, or a dev server is actually serving current source
driver       -> the browser or computer-use tool this harness needs is reachable
```

Stop naming a check as failed once an earlier one it depends on has already failed; print `blocked by <id>` for it instead of running it and reporting a confusing secondary failure. Every failure line names the exact fix, not just the symptom: `DATABASE_URL points at the main instance's database (myapp), not this worktree's (myapp_w3). Run \`scripts/seed --reset\` after pointing it at the isolated one.` teaches the fix; `db check failed` does not.

Two stages need more than a yes or no:

- **ports.** A port held by a process whose working directory is inside this checkout passes (it is this instance's own dev server, already running). A port held by anything else fails, naming each holder by pid and working directory (`:4100 is held by pid 5123 in /work/app-w2`) and the fix (stop that pid, or give this worktree its own port base). A bare "port in use" sends the agent to kill its own server. Where the port lookup tool is missing, report the port as not checked rather than passing or failing it.
- **`--json`.** Print `{ "ok": <bool>, "results": [{ "name", "ok", "detail", "fix" }] }` instead of the human table, so a script or a fix job branches on `ok` without scraping text. The exit code stays the same in both modes.

## Verify CLI shape

Flags worth supporting once the repo's size makes a full run expensive:

- `--feature <id>`: run one feature's full check set, cheapest method first. The default entry point for Maintain mode investigating one thing.
- `--since <ref>` (default: the merge base with the main branch): map changed files, plus uncommitted and untracked ones, to features by each feature's owned paths (`references/feature-map-format.md`), and run only those features' checks. A changed file no feature owns splits two ways. A source file (code under the app and package directories, tests included) is **uncovered** and fails the run: add it to the owning feature's paths. Anything else (docs, config, lockfiles, plans) is **exempt**: listed in the proof so a reader sees it, never a failure. Without that split, either every README edit fails the gate or unowned code slips through with it.
- `--fast`: cli/api checks only, skipping anything that needs a browser or computer use. A development convenience, never a merge gate (main `SKILL.md` Gotchas); the proof records `mode: fast`.
- `--ci` (or equivalent completeness flag): fail the run if any in-scope path is uncovered without a named reason. This is the flag a merge gate calls; the others are for a human or agent iterating locally.

Report each run twice: a short per-feature summary on the terminal, and a proof file at a fixed, gitignored path in the repo. The proof file's shape and the rule for when a path counts as covered live in `references/maintain-mode.md`. When two features share a check (a whole API suite, say), run it once and reuse the result for both.
