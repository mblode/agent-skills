---
name: scaffold-nextjs
description: Scaffolds a production-ready Next.js turborepo with TypeScript, Tailwind CSS, the shadcn/ui CLI, Blode UI components from the ui.blode.co registry, blode-icons-react, Oxlint, Oxfmt, Ultracite, and Vercel deployment. Use when creating a new Next.js app, bootstrapping a turborepo, scaffolding a web project, starting a new website, or asking "create a Next.js project."
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Default: create-next-app flags, shadcn + Blode registry setup, Agentation, Ultracite commands and code patches |
| `references/turbo-configs.md` | Default: root package.json, turbo.json, .gitignore, knip.json, next.config.ts |
| `references/deploy-and-launch.md` | After Phase 6: GitHub setup, Vercel deployment, favicon, OG images, pre-launch checklist |

## Scaffold Workflow

Copy this checklist to track progress:

```text
Scaffold progress:
- [ ] Phase 1: Gather project info
- [ ] Phase 2: Create Next.js app
- [ ] Phase 3: Install Blode UI components
- [ ] Phase 4: Install Agentation
- [ ] Phase 5: Install Ultracite
- [ ] Phase 6: Convert to Turborepo
- [ ] Phase 7: GitHub and Vercel setup
- [ ] Phase 8: Pre-launch checklist
```

### Phase 1: Gather project info

Collect from the user (ask only what was not provided):

| Variable | Example | Default | Used in |
|----------|---------|---------|---------|
| `{{name}}` | `acme-web` | -- (required) | Root package.json, directory name, README |
| `{{description}}` | `Marketing site for Acme` | -- (required) | App package.json, README |
| `{{repo}}` | `acme-corp/acme-web` | — (required) | GitHub remote URL |
| `{{domain}}` | `acme.com` | — (ask if not provided) | Vercel custom domain, metadataBase |
| `{{author}}` | `Your Name` | — (required) | package.json author |
| `{{year}}` | `2026` | current year | LICENSE |

### Phase 2: Create Next.js app

Load `references/app-setup.md`.

```bash
npx create-next-app@latest {{name}} --typescript --tailwind --app --no-src-dir --no-eslint --import-alias "@/*"
```

Follow the remaining setup in `references/app-setup.md`. Confirm the app runs with `npm run dev`.

### Phase 3: Install Blode UI components

Load `references/app-setup.md`.

Initialize shadcn/ui and register the Blode UI component library from `ui.blode.co` as described in the reference. Always use `blode-icons-react` for icon imports (never `lucide-react`).

### Phase 4: Install Agentation

Load `references/app-setup.md`.

Install the package and patch `app/layout.tsx` with the dev-only `<Agentation />` component as described in the reference. Optionally add Google Analytics using `@next/third-parties`.

### Phase 5: Install Ultracite

Load `references/app-setup.md`.

Remove the default biome config and initialize Ultracite as described in the reference.

### Phase 6: Convert to Turborepo

Load `references/turbo-configs.md`.

1. Create root directory structure and move the app into `apps/web/`.
2. Generate root `package.json`, `turbo.json`.
3. Generate `knip.json`.
4. Generate root `.gitignore`.
5. Ensure `apps/web/package.json` has these scripts:
    - `"lint": "oxlint ."`
    - `"lint:fix": "oxlint --fix ."`
    - `"format": "oxfmt --write ."`
    - `"format:check": "oxfmt ."`
    - `"check-types": "tsc --noEmit"`
    - `"test": "vitest run"`
    - `"test:watch": "vitest"`
6. Verify `apps/web/next.config.ts` has `reactCompiler: true`.
7. Run `npm install` from root.
8. Verify `npm run dev` works from root (turbo runs apps/web).

### Phase 7: GitHub and Vercel setup

Load `references/deploy-and-launch.md`.

Follow the GitHub and Vercel setup steps in the reference.

### Phase 8: Pre-launch checklist

Load `references/deploy-and-launch.md`.

Generate a favicon package using RealFaviconGenerator, add OG images, then hand off to other skills.

## Placeholder Reference

All templates use `{{variable}}` syntax. Do a final sweep to catch missed placeholders.

| Placeholder | Source |
|-------------|--------|
| `{{name}}` | Project name (kebab-case) |
| `{{description}}` | One-line project description |
| `{{repo}}` | GitHub owner/repo |
| `{{domain}}` | Custom domain for Vercel |
| `{{author}}` | Author name |
| `{{year}}` | Current year |

## Anti-patterns

- Do not use src/ directory -- create-next-app flag disables it
- Do not use ESLint -- Oxlint via Ultracite replaces it
- Do not call oxlint or oxfmt directly -- use `ultracite fix` or `ultracite check`
- Do not configure git hooks manually -- Ultracite sets up lefthook automatically
- Do not put app dependencies in root package.json -- only devDependencies (turbo, ultracite)
- Do not skip the Blode registry setup step (see `references/app-setup.md`) before adding Blode components
- Do not use `lucide-react` in scaffolded UI code -- use `blode-icons-react`
- Do not create apps/web manually -- create-next-app first, then move

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `optimise-seo` |
| Before launch, audit UI quality | `ui-audit` |
| Before launch, add motion and animation | `ui-animation` |
