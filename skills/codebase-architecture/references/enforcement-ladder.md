# Enforcement Ladder

How to introduce a check into a codebase that already violates it. Load when adding any guardrail to an existing repo.

## Order of enforcement

Before picking a rung on the ladder below, pick the mechanism. Strongest to weakest, and the weaker ones exist only for what the stronger ones cannot yet reach:

1. **Make the mistake impossible in the code structure.** A type that cannot represent the invalid state, a folder layout with nowhere to put the wrong thing, a function signature that cannot be called wrong, a single file that owns a value so there is no second place to write it. Nobody has to remember anything, because there is nothing to remember.
2. **Lint and CI.** An automated, blocking check for what structure alone cannot prevent. This is `guardrail-tooling.md` and the rest of this file. When the linter cannot express the rule (Oxlint has no `no-restricted-syntax`, for example), write a test that scans for it before dropping to prose: one that reads the schema and fails on any timestamp column without a time zone, or greps the source for a raw `fetch` with no timeout signal. It rides the existing test command and names the offending file.
3. **Soft rules and skills.** AGENTS.md, a skill, prose guidance. A capable reader follows it, and it decays under context pressure the first time something more urgent competes for attention.
4. **Human review.** Last, because it is the slowest feedback loop, the easiest to skip under deadline, and the only one that costs a person's attention per violation instead of a machine's.

Treat every review comment as a missing lint rule. When a human catches something in review, ask whether rung 1, 2, or 3 could have caught it first and did not; if a lint rule, a type, or a structural change can express the same thing, that comment should never need to be made again. A repo that keeps re-teaching the same review comment has an enforcement gap, not a training problem.

Treat every incident and every repeated mistake the same way. A production failure, a reverted merge, or the same slip made twice ends in a deterministic check that would have caught it (a type, a lint rule, a test, a CI step), landed with the fix. A postmortem whose only output is prose has fixed one occurrence and taught nobody.

### Rung 4 in practice: a blast-radius rubric

Where an automated reviewer gates merges, give it a checked-in rubric, read from the base ref so a PR cannot edit its own gate, saying which changes it may approve and which must escalate to a human. Without one it applies generic defaults: uniformly cautious, so nothing merges unattended, or uniformly permissive, so nothing is gated.

Two explicit lists, not a severity score:

- **Auto-approve:** features, bug fixes, refactors, tests, documentation, styling, copy and translation additions, analytics events, feature-flag default changes.
- **Escalate to a human:** billing and payments, authentication and authorization, data deletion, migrations touching stored data, build, signing, and release configuration, permission and entitlement changes, anything altering a public contract, lint config and allowlist files, new environment variables.

The escalation list is the one worth arguing over, and its shape generalises: money, identity, destructive data operations, persisted-data shape, and anything that ships to users outside the normal deploy path. A new environment variable belongs there because someone has to set it in every environment, outside the diff and before the deploy that reads it. Lint config and allowlists are on it because growing them is how a gate gets switched off without anyone seeing a red run. Everything else is reversible by the rollback path, which is why it can merge unattended. Prove it like any gate: a documentation-only change auto-approves and a migration escalates.

A new gate starts in shadow: it posts the verdict it would have given and blocks nothing, and it is enforced once its labels match what humans decided on the same PRs. A gate enforced on its first day either escalates everything or lets everything through, and people learn to route around it before anyone tunes it. This is for judgement gates like the rubric; a deterministic lint rule skips the shadow and takes the first rung of the ladder below that holds.

## The ladder

Take the first rung that holds.

1. **Fix the violations and block.** Correct whenever the count is small enough to fix in the same change. The cleanest outcome and more often reachable than it looks: run the tool before assuming otherwise.
2. **Scope with the tool's own config.** Every tool in this category ships one: `knip.json` `ignore` and `ignoreDependencies`, jscpd `ignore` globs, dependency-cruiser `pathNot`. The exclusion sits next to the rule, so anyone reading the config sees what is exempt.

   **Not the linter's `ignorePatterns`** (ESLint and Oxlint both have one). It removes those files from *every* rule, not the one you are adding, so trading 400 long files for 400 unlinted files leaves the repo worse while looking like you followed the ladder. Rung 2 holds for the linter only when the violations sit in directories that should be unlinted anyway (generated output, vendored code); carve those out first and they come off the count before you pick a rung for the rest.
3. **Allowlist or downgrade in the linter.** An `overrides` entry (Oxlint's `.oxlintrc.json`, or an ESLint flat-config object scoped with `files`) naming the current offenders (in Oxlint the override replaces the rule's options; see `guardrail-tooling.md`), or start the rule at `warn` and promote to `error` once burned down. Use this when the violations are a known finite list you intend to shrink. Prefer `error` plus an allowlist over a blanket `warn`: `warn` fails to block the next new violation, which is the whole point of adding the rule.

   List explicit paths, never globs, so the exemption cannot silently cover a file written tomorrow, and so growing it shows up as added lines in a diff a reviewer reads. That review is the only thing holding the list down, which is why lint config and allowlist files are on the rubric's escalation list above: a grown list needs a human. An allowlist has the same pull as the baseline file below (under deadline, the cheapest green is appending your path), and it does not even fail when it grows; what it has instead is that every addition is visible, attributable, and in the same file as the rule it defeats.
4. **Report-only, non-blocking CI.** The rule runs and prints, nothing fails. Lowest value, but it beats not running: the number is visible and the wiring is done for the day someone burns the list down.

Whichever rung you pick, **write down which and why** in the config file or the CI step itself. The next person needs to know whether they are looking at a deliberate exemption or an accident.

## Never hand-roll a baseline

Do not write a custom guard script plus a committed baseline file (`*-ratchet.mjs` and `*.baseline.json`) that records the current violation count, fails when it grows, and rewrites itself downward when it shrinks.

It is an appealing design and it does not survive contact. It was built and deleted for two reasons:

- **Every tool in the category already ships the mechanism.** Rungs 2 and 3 are native features of knip, the linter, dependency-cruiser, and jscpd. The custom layer reimplements them and adds a file that must be regenerated, reviewed, and merged.
- **The baseline becomes the thing people edit.** Under deadline the cheapest green is a bigger number, and a baseline that only shrinks by convention does not only shrink.

The exception is narrow: a genuinely bespoke invariant no tool expresses (a naming rule derived from file paths, a ban on a specific cast shape, registry completeness). Write that as a check, and even then use rung 1 or 3 for the existing violations rather than a count file. Structural specs that walk the filesystem cover most of this ground and ride the existing test command.

## Ship it green

Land the rule and the fix for its existing violations in the same change.

A rule that ships red teaches everyone, agent and human, that this particular check is noise to be worked around. That lesson generalises to the next check you add. The ladder exists precisely so you never have to choose between shipping red and not shipping.

## Prove it bites

The completion criterion for installing any guardrail, and the step most often skipped because the config "obviously" works:

1. Run the check. It must **pass**.
2. Introduce a violation on purpose (a deep import, a duplicated block, an unused export, a misnamed directory). It must **fail**, and the message must name the fix.
3. Revert. It must **pass** again.

A check nobody has watched fail is not known to work. The common failure is silent: a glob that matches nothing, a path alias the tool cannot resolve, a rule registered under a config section the runner never reads. All three produce a green run that proves nothing.

## Self-explaining failures

Every violation message states why the invariant exists and how to fix it, not just where it fired:

```
src/modules/billing/lib/invoice.ts is imported from src/modules/orders/checkout.ts.
Modules are reachable only through their index.ts, so internals can be
refactored without breaking other modules. Import from ~modules/billing instead.
```

An agent that gets this self-corrects on the spot. An agent that gets `no-restricted-imports` and a path guesses, or asks, or reverts something unrelated. Boundary-lint messages should also name the rule and link the convention doc, so the failure teaches the convention it enforces.

Some rules cannot carry a custom message: `max-lines` in both Oxlint and ESLint emits a fixed string with no why and no fix, and takes no `message` option. Where that is the case, put the explanation in a comment above the rule in the config, which is where anyone debugging the failure looks next, and do not let the gap talk you out of the rule.

## Graduated enforcement

Two variants of the same check, wired at different strictness:

- **Pre-commit:** fast and warn-only where the check is slow or noisy. Fast signal without blocking a work-in-progress commit. When a hook does fail an agent's commit, it self-corrects immediately; that is the cheapest QA round available.
- **CI:** blocking. This is the merge gate, and an invariant that is not gated here decays silently.

Wire both, always. Hooks are not guaranteed installed on a fresh clone or in a worktree, which is exactly where agents run; CI alone gives feedback long after the agent's edit loop has moved on.
