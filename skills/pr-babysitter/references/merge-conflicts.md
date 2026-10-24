# Merge Conflicts

Detection, resolution, and safety guardrails for keeping a PR branch current.

## Contents

- [Conflict Detection](#conflict-detection)
- [Resolution Strategy](#resolution-strategy)
- [Branch Update Workflow](#branch-update-workflow)
- [Auto-Resolvable Conflicts](#auto-resolvable-conflicts)
- [Do Not Auto-Resolve](#do-not-auto-resolve)
- [Safety Guardrails](#safety-guardrails)

## Conflict Detection

```bash
gh pr view --json mergeable,mergeStateStatus
```

| `mergeStateStatus` | Meaning | Action |
|--------------------|---------|--------|
| `CLEAN` | Mergeable, checks passing | Skip |
| `BEHIND` | Base has advanced, no conflict yet | Update when branch protection or the task requires it |
| `DIRTY` | The merge commit cannot be created: real conflicts | Resolve |
| `UNSTABLE` | Mergeable, a check is failing | Skip (Phase 3 owns checks) |
| `BLOCKED` | Branch protection blocks the merge (review, checks) | Skip |
| `DRAFT` | Draft PR | Skip unless the user asked for drafts |
| `HAS_HOOKS` | Mergeable, pre-receive hooks pending | Skip |
| `UNKNOWN` | GitHub is computing | Recheck next tick |

`mergeable` is `UNKNOWN` (REST: `null`) while GitHub runs the mergeability job in the background. Requesting the PR is what starts that job, so a second `gh pr view` a few seconds later usually has the answer.

## Resolution Strategy

Follow the user's and repository's branch policy. Default to one merge of the current base: it preserves history and avoids replaying the same conflict through every commit. Rebase only when explicitly required on an exclusively owned branch. Author email counts do not establish ownership; multiple agents may share one identity.

## Branch Update Workflow

```bash
git status --porcelain                 # establish ownership of any changes first
git fetch origin {base_branch}
git merge origin/{base_branch}
# clean:
git push                              # after required checks
# safe generated-file conflicts: resolve per the sections below, then:
git add {resolved files} && git merge --continue
# unsafe to resolve:
git merge --abort
```

Do not stash, reset, or overwrite another agent's dirty files. A dirty tree whose ownership is unclear blocks the update; report the paths. Record the pre-update state so cleanup reverses only this run's changes.

For an explicitly required rebase, use `git rebase origin/{base_branch}`, `git rebase --continue` after a safe resolution, and `git rebase --abort` when intent is unclear. Push only your own branch with `--force-with-lease --force-if-includes`; a refused lease requires re-inspection, not a force override. Name sides by branch, since ours/theirs reverses during a rebase.

## Auto-Resolvable Conflicts

**Lockfiles** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`): generated output, so never hand-edit the markers. Each package manager resolves a conflicted lockfile itself:

```bash
npm install --package-lock-only     # npm >= 5.7 merges both sides' resolutions
yarn install                        # Yarn 1 and Berry rewrite the conflicted file
pnpm install                        # pnpm merges; its docs ask you to review the result
```

If `package.json` also conflicts, resolve it first when the intent is unambiguous, then run the install. Prove the result with a frozen install (`npm ci`, `yarn install --immutable`, `pnpm install --frozen-lockfile`) before `git add` and completing the update.

**Generated files** (`*.generated.*`, `schema.graphql`, codegen output): take either side, re-run the project's generation command, stage the output.

**Changelogs** (`CHANGELOG.md`, `CHANGES.md`): keep both sides, newest entry first.

**Config files with additive changes** (both sides added different keys): keep both additions, check the result still parses.

## Do Not Auto-Resolve

Abort and notify, with the conflicting files, the conflicting lines, and what each side changed:

- Source code where both sides modified the same function body
- Database migrations: ordering matters, a bad resolution breaks the chain
- API contracts and OpenAPI specs: semantic changes need a human
- Both sides deleted and added on overlapping lines: intent is ambiguous
- Test files with conflicting assertions: the right assertion depends on intent

## Safety Guardrails

1. Never force-push a shared branch. A rejected push requires re-inspection, not an overwrite
2. Preserve dirty files and the index; do not stash other agents' work
3. Any resolution whose intent is unclear: abort the merge or rebase you started and report the conflict
4. Use one merge unless an explicit policy requires a rebase on your own branch
5. After pushing, confirm `gh pr view --json mergeable` reports `MERGEABLE`
6. One resolution per cycle: if the base advances again, resolve again on the next tick rather than batching
