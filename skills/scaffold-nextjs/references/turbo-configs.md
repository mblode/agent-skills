# Turborepo Config Templates

## Contents

- [Root package.json](#root-packagejson)
- [turbo.json](#turbojson)
- [Root lefthook.yml](#root-lefthookyml)
- [Root .gitignore](#root-gitignore)
- [knip.json](#knipjson)
- [apps/web/package.json scripts](#appswebpackagejson-scripts)
- [apps/web/next.config.ts](#appswebnextconfigts)
- [Root AGENTS.md and CLAUDE.md](#root-agentsmd-and-claudemd)

---

## Root package.json

Create at `{{name}}/package.json`. Copy the `ultracite` version from `apps/web/package.json` so the two cannot drift, and set `packageManager` to the output of `npm --version` (corepack refuses a mismatch):

```json
{
  "name": "{{name}}",
  "private": true,
  "packageManager": "npm@{{npm_version}}",
  "workspaces": [
    "apps/*"
  ],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "lint:fix": "turbo lint:fix",
    "format": "turbo format",
    "format:check": "turbo format:check",
    "check-types": "turbo check-types",
    "check": "turbo lint format:check check-types",
    "fix": "turbo lint:fix format",
    "prepare": "lefthook install || true"
  },
  "devDependencies": {
    "lefthook": "^2",
    "turbo": "^2",
    "ultracite": "{{ultracite_version}}"
  }
}
```

`check` and `fix` go through turbo so they run inside `apps/web`, where the Oxlint and Oxfmt configs live. `prepare` installs the git hooks from the root `lefthook.yml` on every `npm install`; the `|| true` keeps a CI or Vercel install from failing when there is no `.git` (Vercel builds have none).

## turbo.json

Create at `{{name}}/turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "out/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "lint:fix": {
      "cache": false
    },
    "format": {
      "cache": false
    },
    "format:check": {
      "dependsOn": ["^build"]
    },
    "check-types": {
      "dependsOn": ["^build"]
    }
  }
}
```

When the build later needs a secret (an email API key, an analytics token), list it under `build.passThroughEnv` so turbo forwards it without hashing it into the cache key.

## Root lefthook.yml

Create at `{{name}}/lefthook.yml` and delete `apps/web/lefthook.yml`. Lefthook loads the config next to `.git`; a file inside a workspace is read only when lefthook is invoked from that directory, which the git hook never does.

```yaml
# `root` scopes each job to the workspace: lefthook filters staged files to
# that directory and passes them relative to it, which is what oxfmt and oxlint
# need because their config files live there rather than here.
pre-commit:
  parallel: true
  jobs:
    # oxfmt and oxlint directly, not `ultracite fix`: ultracite exits non-zero
    # when the staged set contains no lintable JS/TS file, so a docs-only or
    # CSS-only commit would fail the hook outright. Two jobs with their own
    # globs let lefthook skip whichever one has nothing to do.
    - name: oxfmt
      root: "apps/web/"
      # Matches what `format:check` inspects (`oxfmt --check .`), markdown
      # included. Omitting md/mdx lets a doc pass this hook and still fail the
      # format gate in CI.
      glob:
        - "*.js"
        - "*.jsx"
        - "*.ts"
        - "*.tsx"
        - "*.json"
        - "*.jsonc"
        - "*.css"
        - "*.md"
        - "*.mdx"
      run: npx oxfmt --write {staged_files}
      stage_fixed: true
    - name: oxlint
      root: "apps/web/"
      glob: "*.{js,jsx,ts,tsx}"
      run: npx oxlint --fix {staged_files}
      stage_fixed: true
```

Verify from the root after `npm install`:

```bash
npx lefthook run pre-commit --all-files
```

## Root .gitignore

Create at `{{name}}/.gitignore`. `apps/web/.gitignore` from create-next-app stays in place and already covers `.next/`, `.env*`, and `next-env.d.ts`; this file covers the root and anything a second workspace adds later.

```
node_modules
out
dist
*.tgz

coverage
*.lcov

logs
*.log

.env
.env.development.local
.env.test.local
.env.production.local
.env.local

.eslintcache
.cache
*.tsbuildinfo

.next
next-env.d.ts

.idea
.DS_Store
.turbo
.vercel

# Agent scratch output stays out; knowledge files are the project's memory
# and must survive a machine change.
.claude/
!/.claude/
/.claude/*
!/.claude/knowledge/
!apps/web/.claude/
.cursor/
.vscode/
```

`.env.local` lives in `apps/web/`, where Next.js reads it, and `apps/web/.gitignore` already ignores `.env*`; `vercel env pull apps/web/.env.local` is the pull command.

## knip.json

Create at `{{name}}/knip.json`:

```json
{
  "$schema": "https://unpkg.com/knip@6/schema.json",
  "ignore": [".vercel/**"]
}
```

Run dead-code analysis on demand with `npx knip` from the root (not a devDependency; npx fetches it). Add workspace-specific entry points as needed (e.g. CLI apps or docs sites with custom entry files).

## apps/web/package.json scripts

Replace the `scripts` block in `apps/web/package.json`. `ultracite init` left `check` and `fix` there; the root scripts replace them, so drop both. Keep the `"type": "module"` it added:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",
    "check-types": "tsc --noEmit"
  }
}
```

Script names match the tasks in `turbo.json` so turbo can orchestrate them across workspaces. If you add a test runner later, add a matching `test` task to `turbo.json` at the same time; with `node --test`, glob the files (`node --test "lib/**/*.test.ts"`) rather than naming one. Optional: `portless <name> next dev` as the `dev` script gives the app a stable `https://<name>.localhost` origin, so several apps run side by side without port juggling.

Two things Vercel's Linux builders can trip on that a Mac never shows: Tailwind's oxide and lightningcss ship platform-specific binaries, and when the lockfile was generated on macOS an `npm ci` on Linux can miss them. Pin the Linux packages in `optionalDependencies` (`@tailwindcss/oxide-linux-x64-gnu`, `lightningcss-linux-x64-gnu`) at the versions the lockfile resolves if that happens. And set an explicit `browserslist` so CSS output does not change when the default query moves.

## apps/web/next.config.ts

Verify `apps/web/next.config.ts` still has React Compiler and the Instant
Navigations flags after the move:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  poweredByHeader: false,
  experimental: {
    // blode-icons-react is not on Next's built-in optimizePackageImports list
    // (lucide-react is), so name it or every icon import pulls the barrel.
    optimizePackageImports: ["blode-icons-react"],
    turbopackRustReactCompiler: true,
  },
};

export default nextConfig;
```

`create-next-app` generates this file when React Compiler is selected; verify `reactCompiler: true` is present. The others come from Phase 2.2 and must survive the move into `apps/web/`, since dropping `cacheComponents` silently takes `partialPrefetching` with it. No `turbopack.root` is needed: Turbopack infers the workspace root from the lockfile at `{{name}}/package-lock.json`. If the config ever imports a project module (a `basePath` constant, a site URL), import it by relative path: Next compiles `next.config.ts` without `tsconfig` path resolution, so an `@/` alias resolves against the wrong directory. `experimental.useOffline: true` is worth turning on once the app has forms; it holds a navigation or Server Action through a connectivity drop and retries on reconnect instead of throwing.

## Root AGENTS.md and CLAUDE.md

Ultracite's `AGENTS.md` and the Next-managed block both live in `apps/web/`. The root needs its own short file so an agent opening the repo runs commands from the right directory. Create `{{name}}/AGENTS.md`:

````markdown
# {{name}}

Turborepo. The site lives in `apps/web` (see that app's `AGENTS.md` for code
standards and the Next.js docs pointer). Everything here applies to every task,
including ones that only touch root config.

## Commands

Run these from this directory, not from `apps/web`; they go through Turborepo:

```bash
npm run dev           # start the site
npm run build         # build every workspace
npm run lint          # oxlint
npm run lint:fix      # oxlint --fix
npm run format        # oxfmt --write .   (scope to your changes)
npm run format:check  # oxfmt --check
npm run check-types   # tsc --noEmit
npm run check         # lint + format:check + check-types
npm run fix           # lint:fix + format
```

`npm run check` is the combined quality gate; the pre-commit hook runs the same
tools on staged files.

## Rules

- No em dashes in copy, content, docs, or commit messages. Rephrase with a
  colon, comma, or a separate sentence.
- `next.config.ts` keeps `cacheComponents`, `partialPrefetching`, and
  `reactCompiler` on. Read the Instant Navigations rules in
  `apps/web/AGENTS.md` before adding a route.
````

Then `{{name}}/CLAUDE.md` containing the single line `@AGENTS.md`. After the first `npm run dev` from the coding agent's shell, confirm `apps/web/AGENTS.md` ends with the `<!-- BEGIN:nextjs-agent-rules -->` block and commit it; `apps/web/CLAUDE.md` stays the one-line import.
