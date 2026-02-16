# Turborepo Config Templates

## Contents

- [Root package.json](#root-packagejson)
- [turbo.json](#turbojson)
- [Root biome.jsonc](#root-biomejsonc)
- [Root .gitignore](#root-gitignore)
- [.changeset/config.json](#changesetconfigjson)
- [.changeset/README.md](#changesetreadmemd)
- [.github/workflows/ci.yml](#githubworkflowsciyml)
- [knip.json](#knipjson)
- [prek.toml](#prektoml)
- [apps/web/package.json scripts](#appswebpackagejson-scripts)
- [apps/web/next.config.ts](#appswebnextconfigts)

---

## Root package.json

Create at `{{name}}/package.json`:

```json
{
  "name": "{{name}}",
  "private": true,
  "packageManager": "npm@10.9.3",
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
    "check": "ultracite check",
    "fix": "ultracite fix",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.29.0",
    "turbo": "^2",
    "ultracite": "^7.1.5"
  }
}
```

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

## Root biome.jsonc

Create at `{{name}}/biome.jsonc`:

```jsonc
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": [
    "ultracite/biome/core",
    "ultracite/biome/next",
    "ultracite/biome/react"
  ]
}
```

## Root .gitignore

Create at `{{name}}/.gitignore`:

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

.idea
.DS_Store
.turbo
.vercel

.claude/
.cursor/
.vscode/
```

## .changeset/config.json

Create at `{{name}}/.changeset/config.json`:

```json
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["web"]
}
```

The `"ignore": ["web"]` entry excludes the private web app from changeset versioning. Remove this if you later add publishable packages.

## .changeset/README.md

Create at `{{name}}/.changeset/README.md`:

```markdown
# Changesets

Run `npm run changeset` to add a changeset when making changes to {{name}}.

This generates a changeset file that describes the change and its semver bump type (patch, minor, or major). Changesets are consumed during release to update the version and generate changelog entries.
```

## .github/workflows/ci.yml

Create at `{{name}}/.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
    paths-ignore:
      - "**/*.md"
  push:
    branches: [main]
    paths-ignore:
      - "**/*.md"

jobs:
  checks:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}

    steps:
      - name: Checkout repo
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: lts/*
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Check formatting
        if: matrix.os == 'ubuntu-latest'
        run: npm run check
```

## knip.json

Create at `{{name}}/knip.json`:

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "ignore": [".vercel/**"]
}
```

Add workspace-specific entry points as needed (e.g. for CLI apps or docs sites with custom entry files).

## prek.toml

Create at `{{name}}/prek.toml`:

```toml
[[repos]]
repo = "local"

[[repos.hooks]]
id = "ultracite-fix"
name = "Ultracite Fix"
entry = "npx ultracite fix"
language = "system"
pass_filenames = false
always_run = true
stages = ["pre-commit"]
```

After creating, install hooks with `prek install`. This replaces Husky with prek for git hook management.

## apps/web/package.json scripts

Update the `scripts` block in `apps/web/package.json` to include turbo-compatible commands:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check-types": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

These script names match the tasks defined in `turbo.json`, allowing turbo to orchestrate them across workspaces.

## apps/web/next.config.ts

Verify `apps/web/next.config.ts` has React Compiler enabled:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
```

`create-next-app` generates this file when React Compiler is selected. Verify `reactCompiler: true` is present.
