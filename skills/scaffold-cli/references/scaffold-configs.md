# Scaffold Config Templates

## Contents

- [package.json](#packagejson)
- [tsconfig.json](#tsconfigjson)
- [tsdown.config.ts](#tsdownconfigts)
- [.gitignore](#gitignore)
- [LICENSE.md](#licensemd)
- [.changeset/config.json](#changesetconfigjson)
- [.changeset/README.md](#changesetreadmemd)
- [.github/workflows/ci.yml](#githubworkflowsciyml)
- [.github/workflows/npm-publish.yml](#githubworkflowsnpm-publishyml)

---

## package.json

```json
{
  "name": "{{name}}",
  "version": "0.0.1",
  "description": "{{description}}",
  "type": "module",
  "packageManager": "pnpm@{{pnpm_version}}",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "bin": {
    "{{bin}}": "./dist/cli.js"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE.md"
  ],
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch",
    "start": "node dist/cli.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run --passWithNoTests",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "release": "pnpm run build && changeset publish"
  },
  "keywords": [],
  "author": "{{author}}",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/{{repo}}.git"
  },
  "homepage": "https://github.com/{{repo}}#readme",
  "bugs": {
    "url": "https://github.com/{{repo}}/issues"
  },
  "engines": {
    "node": ">=24.11"
  },
  "dependencies": {
    "@clack/prompts": "^1.7.0",
    "commander": "^15.0.0"
  },
  "devDependencies": {
    "@changesets/cli": "^2.31.0",
    "@types/node": "^24.13.3",
    "tsdown": "^0.22.4",
    "typescript": "^7.0.2",
    "ultracite": "^7.9.3",
    "vitest": "^4.1.10"
  }
}
```

`ultracite init` (post-scaffold) adds the `oxlint`, `oxfmt`, and `lefthook` devDependencies plus the `check`, `fix`, and `prepare` scripts, which is why this template omits them.

`{{pnpm_version}}` is the output of `pnpm --version`. `pnpm/action-setup` in both workflows reads the pnpm version from `packageManager`, and corepack refuses a mismatch, so keep the field even for a single-package repo.

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2024",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2024"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

## tsdown.config.ts

```typescript
import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: { cli: "src/cli.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    clean: true,
    dts: false,
    sourcemap: true,
    target: "node24",
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    platform: "node",
    fixedExtension: false,
    dts: true,
    sourcemap: true,
    target: "node24",
  },
]);
```

`fixedExtension: false` keeps `.js` and `.d.ts`. tsdown's node-platform default emits `.mjs` and `.d.mts`, and then `bin` and `exports` point at files that do not exist; `pnpm dlx publint` after the build catches it.

`banner` injects the shebang into `dist/cli.js` at build, which is why `src/cli.ts` carries none.

## .gitignore

```
node_modules/
dist/
*.tsbuildinfo
.env
.env.local
.DS_Store
```

## LICENSE.md

```
The MIT License (MIT)

Copyright (c) {{year}} {{author}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## .changeset/config.json

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
  "ignore": []
}
```

## .changeset/README.md

```markdown
# Changesets

Run `pnpm run changeset` to add a changeset when making changes to {{name}}.

This generates a changeset file that describes the change and its semver bump type (patch, minor, or major). Changesets are consumed during release to update the version and generate changelog entries.
```

## .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: pnpm

      - name: Install
        run: pnpm install --frozen-lockfile

      - name: Changeset Status
        if: github.event_name == 'pull_request'
        run: pnpm exec changeset status --since origin/main

      - name: Lint
        run: pnpm run check

      - name: Typecheck
        run: pnpm run typecheck

      - name: Test
        run: pnpm run test

      - name: Build
        run: pnpm run build
```

Notes:

- `pnpm run check` is the ultracite-added lint script; it exists by CI time because post-scaffold `ultracite init` runs before the initial commit.
- `Changeset Status` fails PRs without a changeset on purpose; `fetch-depth: 0` is required for the `--since origin/main` comparison.
- `pnpm/action-setup` must run before `actions/setup-node`: `cache: pnpm` looks for the pnpm binary to locate its store and fails without it. With no `version` input it installs the version named in `packageManager`.
- `--frozen-lockfile` is the `npm ci` equivalent: it fails when `pnpm-lock.yaml` is out of date instead of rewriting it.

## .github/workflows/npm-publish.yml

```yaml
name: Release

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - name: Set up pnpm
        uses: pnpm/action-setup@v4
      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
          cache: pnpm
      - name: Upgrade npm for OIDC trusted publishing
        run: npm install -g npm@latest
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Create release PR or publish
        uses: changesets/action@v2
        with:
          publish-script: pnpm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Notes:

- `changeset publish` detects pnpm from the lockfile and publishes with `pnpm publish`.
- The `npm install -g npm@latest` step stays on purpose: `pnpm publish` can hand the upload to the npm CLI on `PATH`, and OIDC trusted publishing needs npm 11.5.1 or later.
