# Merge Conflicts

Detection, resolution, and safety guardrails for keeping a PR branch current.

## Contents

- [Conflict Detection](#conflict-detection)
- [Resolution Strategy](#resolution-strategy)
- [Rebase Workflow](#rebase-workflow)
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
| `BEHIND` | Base has advanced, no conflict yet | Rebase to update (required when branch protection demands an up-to-date branch) |
| `DIRTY` | The merge commit cannot be created: real conflicts | Resolve |
| `UNSTABLE` | Mergeable, a check is failing | Skip (Phase 3 owns checks) |
| `BLOCKED` | Branch protection blocks the merge (review, checks) | Skip |
| `DRAFT` | Draft PR | Skip unless the user asked for drafts |
| `HAS_HOOKS` | Mergeable, pre-receive hooks pending | Skip |
| `UNKNOWN` | GitHub is computing | Recheck next tick |

`mergeable` is `UNKNOWN` (REST: `null`) while GitHub runs the mergeability job in the background. Requesting the PR is what starts that job, so a second `gh pr view` a few seconds later usually has the answer.

## Resolution Strategy

**Default to rebase.** Merge only when the branch is shared, because a rebase rewrites commits other people based work on:

```bash
git log origin/{base_branch}..HEAD --format='%ae' | sort -u
```

More than one author email means shared: `git merge origin/{base_branch}` instead. An explicit user preference for merge also overrides the default.

## Rebase Workflow

```bash
git stash push --include-untracked      # only if the tree is dirty
git fetch origin {base_branch}
git rebase origin/{base_branch}
# clean:
git push --force-with-lease --force-if-includes
# conflicts: resolve per the sections below, then per conflicted commit:
git add {resolved files} && GIT_EDITOR=true git rebase --continue
# unsafe to resolve:
git rebase --abort
git stash pop                            # if you stashed
```

`--force-if-includes` is a no-op without `--force-with-lease`; together they refuse the push when the remote tip was fetched but never integrated locally, which is exactly the state a monitor loop can drift into between a fetch and a rebase.

During a rebase, `--ours` is the base branch and `--theirs` is the commit being replayed. Name sides by branch in notifications, not by ours/theirs.

## Auto-Resolvable Conflicts

**Lockfiles** (`package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`): generated output, so never hand-edit the markers. Each package manager resolves a conflicted lockfile itself:

```bash
npm install --package-lock-only     # npm >= 5.7 merges both sides' resolutions
yarn install                        # Yarn 1 and Berry rewrite the conflicted file
pnpm install                        # pnpm merges; its docs ask you to review the result
```

If `package.json` also conflicts, resolve it first (both sides' additions), then run the install. Prove the result with a frozen install (`npm ci`, `yarn install --immutable`, `pnpm install --frozen-lockfile`) before `git add` and `git rebase --continue`.

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

1. `--force-with-lease --force-if-includes`, never bare `--force`. A refused lease means someone else pushed since your fetch: abort and notify, do not overwrite their commits
2. Stash before rebasing a dirty tree; pop after
3. Any resolution that fails or looks wrong: `git rebase --abort` restores the branch
4. Never rebase a shared branch (detection above); merge instead
5. After pushing, confirm `gh pr view --json mergeable` reports `MERGEABLE`
6. One resolution per cycle: if the base advances again, resolve again on the next tick rather than batching
