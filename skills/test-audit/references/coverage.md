# Measuring Coverage

The budget is only as good as the measurement. Use the repository's own coverage configuration and the same command for baseline and after, on the same commit base, or the delta is noise.

## Contents

- Baseline command by runner
- Per-file comparison
- Which tests cover a line
- Mutation spot checks
- Counting tests

## Baseline command by runner

| Runner | Command | Output to compare |
|--------|---------|-------------------|
| Vitest | `vitest run --coverage --coverage.reporter=json-summary --coverage.reporter=json` | `coverage/coverage-summary.json` |
| Jest | `jest --coverage --coverageReporters=json-summary --coverageReporters=json` | `coverage/coverage-summary.json` |
| Node test runner | `c8 --reporter=json-summary node --test` | `coverage/coverage-summary.json` |
| pytest | `pytest --cov=<pkg> --cov-branch --cov-report=json --cov-context=test` | `coverage.json` |
| Go | `go test ./... -coverprofile=cover.out -covermode=count` then `go tool cover -func=cover.out` | per-function lines |

Scope the `include` or `--cov` target to production source so deleting test helpers does not inflate the percentage. Record lines and branches separately; branch coverage drops first when a test that exercised an error path goes.

When the repo sets coverage thresholds in config, the budget cannot be looser than those thresholds. Changing thresholds is a CI gate change and needs confirmation.

## Per-file comparison

Aggregate coverage hides a file that lost its only test. Compare per production file:

```bash
# Vitest, Jest, and c8 json-summary: print files whose line coverage fell by more than 2 points
node -e '
const [a, b] = process.argv.slice(1).map((f) => require(require("path").resolve(f)));
for (const [file, m] of Object.entries(a)) {
  if (file === "total" || !b[file]) continue;
  const d = b[file].lines.pct - m.lines.pct;
  if (d < -2) console.log(d.toFixed(1).padStart(6), file);
}' baseline-summary.json coverage/coverage-summary.json
```

Keep a copy of the baseline summary outside `coverage/`, which the next run overwrites.

## Which tests cover a line

To rank candidates by unique contribution rather than guess:

- **pytest:** `--cov-context=test` records which test executed each line. `coverage json --show-contexts` exposes it; a test whose lines are all covered by other contexts adds no unique coverage.
- **JavaScript:** no runner records per-test contexts by default. Run coverage for the suite without the candidate file (exclude it by pattern) and compare per-file against the baseline. Batch candidates by lane to keep the run count manageable.
- **Go:** run `go test -run '<TestName>' -coverprofile` per candidate and diff against the package profile.

Zero unique coverage makes a test a candidate, not a deletion: it may still be the only test that asserts on those lines. Check that a keeper asserts the behavior.

## Mutation spot checks

Line coverage says a line ran, not that anything checked it. For contracts where coverage held but the deleted test was the one with the assertion, mutate the production owner (flip a condition, drop a call, return early) and confirm some remaining test fails. Restore the source byte for byte afterwards.

For a broader signal, run the repo's mutation tool on the touched files only, before and after: Stryker (JavaScript and TypeScript), mutmut (Python), or go-mutesting (Go). Full-suite mutation runs are slow; scope them to the owners of the deleted tests. A mutation score that falls while line coverage holds is exactly the regression coverage cannot see.

## Counting tests

Count declarations with the runner's own listing where one exists, since a grep misses table rows and dynamic cases:

- Vitest: `vitest list --json`
- Jest: `jest --listTests` for files; declarations via `--json` on a run
- pytest: `pytest --collect-only -q`
- Go: `go test -list '.*' ./...`

Count test and support lines with `git ls-files` filtered to test paths piped into `wc -l`, so generated and ignored files stay out.
