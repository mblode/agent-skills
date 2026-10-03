# app-verification sources

Provenance for `skills/app-verification`. Never loads during a task.

## pstack (Lauren Tan, MIT)

- `create-verification-skill`: the Create mode method (interview the repo, generate, seed the map, prove it, hand off). Generalized past one company's Mac-mini and worktree-adapter conventions.
- `maintain-verification-skill`: the Maintain mode loop (source wave, live pass, ship or stop) and the clean / changed / blocked outcomes.
- `reproduce-and-fix-issues` (the Benny automation): the reproduce-first handoff and its verdicts.

The SKILL.md Credit section carries the attribution that ships with the skill.

## Maintainer app devkit (2026-10 deepening pass)

Contracts generalized from the maintainer's working production harness (a TypeScript monorepo, commit `fa1a55e`):

- `packages/devkit/src/features.ts`: colocated `feature.json` schema (strict), owned-path rule (trailing `/` owns a directory), and the completeness check failures in `references/feature-map-format.md`.
- `packages/devkit/src/proof.ts` and `verify.ts`: proof.json fields, per-user-path aggregation (covered only if one or more checks ran and all passed), `dirty`, `mode`, and the uncovered (source) vs exempt (docs, config, lockfiles, plans) split.
- `packages/devkit/src/doctor.ts`: port holder check (own-checkout holder passes; foreign holder named by pid and working directory with the fix) and `--json` output.
- `packages/devkit/src/worktree.ts`, `with-env.ts`, `env-loading.test.ts`: refusal of the main instance's ports and database, `ensureEnvFile` after `git clean`, exported values winning over env files (tested per loader), and ephemeral vs persistent browser profiles (`browserProfileDir`, `browserProblems`).
- `skills/repro/SKILL.md` and `.github/workflows/heal.yml`: the exact parseable first line read with `head -n1`, the Could not reproduce template, report text as untrusted data, and "a repro script is not a test".
