# Changeset Creation and Commit

Mechanics for Steps 1-3. The decisions (bump type, gate order, what to stage) are in SKILL.md; this file is how to execute them without a TTY.

## Writing the changeset file

`pnpm changeset` prompts interactively, so write the file directly. Any filename works; the id below only needs to be unique.

```bash
ID=$(node -e "console.log(Math.random().toString(36).slice(2,10))")
cat > ".changeset/$ID.md" <<'EOF2'
---
"<package-name>": patch
---

<one or two sentences of user-facing change>
EOF2
```

- Quote the package name; a scoped name (`@scope/pkg`) is invalid YAML unquoted and the action fails on parse.
- The description ships verbatim in `CHANGELOG.md` and is the only thing consumers read about this version. Write the change, not the commit log.
- `pnpm changeset status` (read-only) prints the release plan and errors on a package name that is not in the workspace. Run it before committing; the same error in CI costs a full round trip.

## Discovering gate commands

Do not assume script names. ultracite repos expose `check` and `fix`, others `lint` and `format`:

```bash
jq -r '.scripts | to_entries[] | "\(.key): \(.value)"' package.json
```

| Gate | Typical script | Auto-fixer |
|------|----------------|------------|
| Lint | `pnpm check` or `pnpm lint` | `pnpm fix`, or `pnpm oxlint --fix <paths>` / `pnpm eslint --fix <paths>` |
| Type-check | `pnpm typecheck` or `pnpm tsc --noEmit` | none; fix by hand |
| Test | `pnpm test` | none; fix the code. Deleting or skipping a test to get green ships the bug under a green badge |
| Format | `pnpm format` or `pnpm oxfmt <paths>` / `pnpm prettier --write <paths>` | is the fixer |

Prefer the quiet form where the runner has one (`vitest run --reporter=dot`); a full test dump is re-sent on every remaining turn.

## Staging the release commit

```bash
git status --porcelain            # everything listed must be yours
git add .changeset/<id>.md <fixed paths>
git commit -m "chore: add patch changeset for <package>"
git push
```

Anything in `git status --porcelain` you did not intend (hook output such as a root `schema.gql`, or reformatted files outside the change) stays unstaged. Undo only changes introduced by this run; a whole-file restore can discard pre-existing edits. It does not ride into the release commit.
