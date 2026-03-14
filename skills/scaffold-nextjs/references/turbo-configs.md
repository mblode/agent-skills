# Turborepo Config Templates

## Contents

- [Root package.json](#root-packagejson)
- [turbo.json](#turbojson)
- [Root .gitignore](#root-gitignore)
- [knip.json](#knipjson)
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
    "fix": "ultracite fix"
  },
  "devDependencies": {
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

## knip.json

Create at `{{name}}/knip.json`:

```json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "ignore": [".vercel/**"]
}
```

Add workspace-specific entry points as needed (e.g. for CLI apps or docs sites with custom entry files).

## apps/web/package.json scripts

Update the `scripts` block in `apps/web/package.json` to include turbo-compatible commands:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "format": "oxfmt --write .",
    "format:check": "oxfmt .",
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
