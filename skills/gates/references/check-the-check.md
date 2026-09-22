# Check the check

A check is only evidence if it can fail. Each entry: the failure, how it was observed, and the recipe that detects it. Run the recipe, record the result, then fix the check or put a gate on the pattern.

## Contents

- Tests that cannot fail
- Test-only headers and branches
- Conditionals in tests
- Skip-on-failure modes
- Scorers that check length
- Cached versus cold runs
- Enforcement scripts that overclaim
- Dashboards against a hand count
- Findings table

## Tests that cannot fail

Tests that cannot fail head the list of agent mistakes, next to invented APIs and guards for states that do not exist. Typical shapes: an assertion on the mock's own return value, a snapshot of a mocked response, `expect(true)`, no assertion at all, a `waitFor` that resolves on any render.

- **Sabotage:** in a scratch branch, break the unit under test (invert a condition, return a constant, delete the call) and run only its tests. Green means the test does not test it.
- **Mutation, at scale:** `npx stryker run --mutate "src/billing/**/*.ts"` on the changed area; surviving mutants in the diff are findings.
- **No assertions:** `expect.hasAssertions()` in the test setup file, or the lint rules `vitest/expect-expect` or `jest/expect-expect`.

## Test-only headers and branches

An e2e suite was forced green by a test-only HTTP header that production code honoured. Any branch in production code keyed to "is this a test" is a way to pass without working.

```bash
git grep -nE "NODE_ENV ?[!=]==? ?['\"]test|x-(e2e|test|playwright)-|isTest|__TEST__|process\.env\.(CI|PLAYWRIGHT|E2E)" -- src app packages ':!**/*.test.*' ':!**/*.spec.*' ':!**/test/**' ':!**/e2e/**'
```

Every hit is a finding until it is shown to be config (a log level) rather than behaviour. Gate it: the same pattern as a `no-restricted-syntax` lint rule scoped to production paths, or the grep as a CI step that fails on a new hit.

## Conditionals in tests

`if`, ternaries, and `try/catch` inside a test body let assertions run on one branch only; a test with `catch {}` passes whatever throws.

- Lint: `vitest/no-conditional-in-test`, `vitest/no-conditional-expect` (or the `jest/` equivalents), as errors.
- Grep the diff: `git diff origin/main -- '*.test.*' '*.spec.*' | grep -nE '^\+.*\b(if ?\(|catch ?\()'`.

## Skip-on-failure modes

An eval configured with `failureMode: 'skip'` had 100% of runs fail silently while the dashboard showed green. The same shape in tests and CI:

```bash
git grep -nE "\.(skip|only|todo)\(|test\.fixme|failureMode|continue-on-error: ?true|\|\| ?true|--passWithNoTests|retries: ?[1-9]" -- . ':!node_modules'
```

A report is trustworthy only when it prints passed, failed, skipped, and errored counts, and the run fails when skipped or errored is above an expected number or when zero cases ran.

## Scorers that check length

A quality scorer passed any output of at least 20 characters. Any scorer, LLM judge, or eval metric gets must-fail fixtures:

- An off-topic answer long enough to pass a length check.
- A correct-looking answer with one factual error the rubric names.
- An empty or refusal output.

Run the scorer on them; each must score below the pass line, and they stay in the scorer's own test suite. Read the scorer's code for what it actually compares before trusting its name.

## Cached versus cold runs

A cached `turbo run test` was green; a fresh `turbo run test --force` failed on an env singleton evaluated at import. Queues were never created before registration on a fresh database, which only a cold start shows.

```bash
tmp=$(mktemp -d) && git clone --depth 1 "file://$PWD" "$tmp/cold" && cd "$tmp/cold" \
  && npm ci && npx turbo run test --force --output-logs=errors-only
```

Also check the task runner's hash inputs: an environment variable the code reads but `turbo.json` does not list in `env` or `globalEnv` serves a stale hit. Gate it with an uncached run on main at least nightly, and state the evidence level (cached, fresh, build, runtime startup) in every claim.

## Enforcement scripts that overclaim

A boundary script claimed more enforcement than it had. For each rule a lint config, boundary script, RLS policy, or pre-commit hook claims to enforce, commit a violation in a scratch branch and watch it go red. Postgres RLS: `FORCE ROW LEVEL SECURITY` binds the table owner, but a superuser or a `BYPASSRLS` role still bypasses it, so test as the application role. `turbo run <task>` skips workspaces without the script: list them with `npm pkg get scripts.<task> -ws`.

## Dashboards against a hand count

Dashboards lied in four observed ways: a partial day included in a daily average, a filter the tile missed, the wrong field used as GMV, and a stale date filter. Before a number drives a decision:

1. Pick one complete day and one segment.
2. Count it by hand from the source table with a query you wrote, not the dashboard's.
3. Compare. Then check the date range ends at the last complete day, each filter matches the question, and the field is the one the business means.

Record the hand count next to the tile's number; a mismatch is a finding until explained.

## Findings table

```markdown
| Check | Recipe run | Result | Fix or gate |
|-------|------------|--------|-------------|
| e2e checkout suite | grep for test-only headers | `x-e2e-bypass` honoured in src/api/pay.ts:41 | Removed; lint rule on production paths |
```
