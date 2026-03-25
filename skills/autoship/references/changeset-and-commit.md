# Changeset Creation and Commit

## Table of Contents

- [Detecting Existing Changesets](#detecting-existing-changesets)
- [Creating a Changeset](#creating-a-changeset)
- [Quality Gates](#quality-gates)
- [Generating the Changelog](#generating-the-changelog)
- [Commit and Push](#commit-and-push)

## Detecting Existing Changesets

Check for pending changesets before creating a new one:

```bash
ls .changeset/*.md 2>/dev/null | grep -v README.md
```

If changesets already exist, ask the user whether to create an additional one or skip.

## Creating a Changeset

Prefer non-interactive changeset creation for agent mode:

```bash
# Interactive (TTY required)
npm run changeset

# Non-interactive — write the changeset file directly
cat > .changeset/<short-id>.md << 'EOF'
---
"<package-name>": patch
---

<description of changes>
EOF
```

Generate the short id with: `node -e "console.log(Math.random().toString(36).slice(2,10))"`.

### Bump Type Selection

| Type  | When to use |
|-------|-------------|
| patch | Bug fixes, documentation, internal refactors (default) |
| minor | New features, non-breaking additions |
| major | Breaking changes (only with explicit user instruction) |

Default to `patch` unless the user specifies otherwise.

### Changeset Summary

Infer the summary from recent commits:

```bash
git log --oneline -10
```

Write a concise 1-2 sentence description focusing on user-facing changes.

## Quality Gates

Run the project's quality checks in this order before committing. Discover available scripts first:

```bash
cat package.json | jq '.scripts | keys[]' -r
```

### Gate Order

1. **Lint** -- `npm run lint` or the project's lint script
   - Auto-fix: `npm run lint -- --fix` or `npx eslint --fix .`
2. **Type-check** -- `npm run typecheck` or `npx tsc --noEmit`
   - Fix type errors manually if they occur
3. **Tests** -- `npm test` or `npm run test`
   - Fix failing tests; do not skip them
4. **Format** -- `npm run format` or `npx prettier --write .`
   - Auto-fix: formatters are safe to run automatically

### Retry Logic

- Retry each gate up to 3 times after applying fixes.
- If a gate still fails after 3 attempts, stop and report to the user.
- Re-run all gates from the beginning after any code change to ensure no regressions.

## Generating the Changelog

After creating the changeset file, run `changeset version` to consume pending changesets and update versions and changelogs:

```bash
npx changeset version
```

This will:
- Read all pending changeset files in `.changeset/`
- Bump `package.json` version fields according to the changeset bump types
- Update or create `CHANGELOG.md` with entries for each changeset
- Delete the consumed changeset files from `.changeset/`

### Manual Changelog Editing

If the project does not use `changeset version`, or if the generated entry needs improvement:

1. Read the existing `CHANGELOG.md` to understand the format
2. Prepend a new entry following the existing convention
3. Focus on user-facing changes, not internal refactors
4. Include the new version number and date

### Important: Order of Operations

- Create the changeset file first (Step 1)
- Run `changeset version` to generate the changelog (Step 2)
- Then run quality gates and commit everything together (Step 3)
- Do NOT run `changeset version` before the changeset file exists

## Commit and Push

Use `chore: add <type> changeset for <package>` as the commit message convention.
