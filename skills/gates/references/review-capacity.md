# Review capacity

Review is the bottleneck once agents write the code. AI PRs wait about 5x longer for pickup and are about 2.6x larger at p75 (LinearB 2026). Every rule here keeps a change smaller than the review it needs and the queue shorter than the reviewers.

## Contents

- The queueing knee
- PR size gate
- WIP
- Stop merging when main is red
- Required checks
- Auto-approval
- Risk and Proof section

## The queueing knee

Time from opened to reviewed grows as 1/(1 - utilisation), in units of one review's length: 2 at 50% reviewer utilisation, 5 at 80%, 10 at 90%. The curve bends sharply past about 80%: that is the knee, and adding agents past it adds hours of wait, stale branches, and conflicts, not throughput. Keep utilisation below the knee by shrinking PRs and capping WIP, not by asking reviewers to go faster.

## PR size gate

Default limit: 400 changed lines excluding lockfiles, snapshots, and generated code. Tune it from the retro (the size at which review quality or pickup time drops), then keep it in the check, not in prose.

```yaml
  size:
    if: github.event_name == 'pull_request' && !contains(github.event.pull_request.labels.*.name, 'size-exception')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: |
          n=$(git diff --numstat "origin/${{ github.base_ref }}...HEAD" -- . \
            ':!**/package-lock.json' ':!**/pnpm-lock.yaml' ':!**/__snapshots__/**' ':!**/generated/**' \
            | awk '{ s += $1 + $2 } END { print s + 0 }')
          echo "changed lines: $n"
          [ "$n" -le 400 ] || { echo "Over 400 changed lines: split it, or a human adds size-exception"; exit 1; }
```

The label is a human's decision; an agent that adds it to its own PR defeats the gate, so say so in AGENTS.md.

## WIP

Open agent PRs awaiting review ≤ what the reviewers can review in a working day at the size limit. The `backlog` skill dispatches to this number; this skill makes it visible. A scheduled job or a check that counts open PRs with the agent label and fails (or comments) above the limit is enough.

## Stop merging when main is red

Nothing fired when main went red, and agents kept merging onto it. Add a required check that fails while the latest main run is red, except on the PR that fixes it:

```yaml
  main-green:
    if: github.event_name == 'pull_request' && !contains(github.event.pull_request.labels.*.name, 'fixes-main')
    runs-on: ubuntu-latest
    steps:
      - env:
          GH_TOKEN: ${{ github.token }}
        run: |
          c=$(gh run list -R "${{ github.repository }}" --branch main --workflow ci.yml --limit 1 --json conclusion --jq '.[0].conclusion')
          [ "$c" = "success" ] || { echo "main is $c: merges wait for the fix"; exit 1; }
```

A merge queue also runs checks on the merged result, which catches two green PRs that are red together; it does not stop merges while main is already red.

## Required checks

On the default branch, required: the `verify` job, the container build, `size`, and `main-green`. The container is built on every PR even without pushing it: a container that never built on the PR is how a merged change broke the deploy. Changing required checks binds everyone, so write the change up for the user rather than applying it.

## Auto-approval

Auto-approve or auto-merge only diffs that are small and low-risk by rule, not by an agent's judgement:

- Paths on an allow-list: docs, dependency patch bumps with a lockfile, test-only fixture updates.
- Under a lower size limit (for example 50 lines).
- Never touching auth, tenancy, migrations, infrastructure, billing, CI configuration, or the gates themselves.
- All required checks green on a fresh run.

Anything else gets a human, and the reviewer's model is never the author's.

## Risk and Proof section

Every agent PR body carries this, and `ship` fills it:

```markdown
## Risk
- Blast radius: <what breaks for whom if this is wrong>
- Touches: <auth | tenancy | migration | money | infra | none>
- Rollback: <revert | flag off | down migration>

## Proof
- `npm run verify` on a fresh install -> <last line>
- <acceptance check from the ticket> -> <observed result>
- Evidence level: <cached | fresh tests | build | runtime startup>
- Not verified: <what was not run, and why>
```

A PR whose Proof section is missing or says only "tests pass" is not ready for review.
