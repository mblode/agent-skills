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
    "release": "npm run build && changeset publish"
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

Notes:

- `--passWithNoTests` is required: zero test files means plain `vitest run` exits 1 and fails the first CI run.
- `ultracite init --linter oxlint --integrations lefthook` (post-scaffold) adds `oxlint`, `oxfmt`, `lefthook` to devDependencies plus `check`, `fix`, and `prepare: lefthook install` scripts. Never list those by hand: causes duplicate scripts and version skew against ultracite's pins.

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
    clean: true,
    sourcemap: true,
    target: "node24",
    banner: { js: "#!/usr/bin/env node" },
  },
  {
    entry: { index: "src/index.ts" },
    format: ["esm"],
    dts: true,
    sourcemap: true,
    target: "node24",
  },
]);
```

`banner` injects the shebang into `dist/cli.js` at build. Never add `#!/usr/bin/env node` to `src/cli.ts` or the build doubles it. Keep the two configs separate: CLI entry needs the shebang and no `.d.ts`; library entry needs `.d.ts` and no shebang.

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

Run `npm run changeset` to add a changeset when making changes to {{name}}.

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

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm

      - name: Install
        run: npm ci

      - name: Changeset Status
        if: github.event_name == 'pull_request'
        run: npx changeset status --since origin/main

      - name: Lint
        run: npm run check

      - name: Typecheck
        run: npm run typecheck

      - name: Test
        run: npm run test

      - name: Build
        run: npm run build
```

Notes:

- `npm run check` is the ultracite-added lint script; it exists by CI time because post-scaffold `ultracite init` runs before the initial commit.
- `Changeset Status` fails PRs without a changeset on purpose; `fetch-depth: 0` is required for the `--since origin/main` comparison.

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
      - name: Set up Node
        uses: actions/setup-node@v6
        with:
          node-version: 24
          registry-url: https://registry.npmjs.org
          cache: npm
      - name: Upgrade npm for OIDC trusted publishing
        run: npm install -g npm@latest
      - name: Install dependencies
        run: npm ci
      - name: Create release PR or publish
        uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_CONFIG_PROVENANCE: "true"
```
