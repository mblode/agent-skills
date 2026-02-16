---
name: scaffold-nextjs
description: Scaffolds a production-ready Next.js turborepo with TypeScript, Tailwind CSS, shadcn/ui, Biome, Ultracite, Changesets, and Vercel deployment. Use when creating a new Next.js app, bootstrapping a turborepo, scaffolding a web project, starting a new website, or asking "create a Next.js project."
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Default: create-next-app flags, shadcn, Agentation, Ultracite, prek commands and code patches |
| `references/turbo-configs.md` | Default: root package.json, turbo.json, biome.jsonc, .gitignore, knip.json, prek.toml, changeset config, CI workflow, next.config.ts |
| `references/deploy-and-launch.md` | After Phase 6: GitHub setup, Vercel deployment, favicon, OG images, pre-launch checklist |

## Scaffold Workflow

Copy this checklist to track progress:

```text
Scaffold progress:
- [ ] Phase 1: Gather project info
- [ ] Phase 2: Create Next.js app
- [ ] Phase 3: Install shadcn/ui
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
| `{{repo}}` | `acme-corp/acme-web` | — (required) | GitHub remote URL, CI workflow |
| `{{domain}}` | `acme.com` | — (ask if not provided) | Vercel custom domain, metadataBase |
| `{{author}}` | `Your Name` | — (required) | package.json author |
| `{{year}}` | `2026` | current year | LICENSE |

### Phase 2: Create Next.js app

Load `references/app-setup.md`.

Run `npx create-next-app@latest` with flags: `--typescript --tailwind --biome --react-compiler --app --no-src-dir --import-alias "@/*" --use-npm`.

Confirm the app runs with `npm run dev`.

### Phase 3: Install shadcn/ui

Load `references/app-setup.md`.

Run `npx shadcn@latest init`, then `npx shadcn@latest add --all`.

### Phase 4: Install Agentation

Load `references/app-setup.md`.

Install the package and patch `app/layout.tsx` with the dev-only `<Agentation />` component.

### Phase 5: Install Ultracite

Load `references/app-setup.md`.

Delete `biome.json` (created by create-next-app), run `npx ultracite@latest init`, then remove Husky/lint-staged and replace with prek.

### Phase 6: Convert to Turborepo

Load `references/turbo-configs.md`.

1. Create root directory structure and move the app into `apps/web/`.
2. Generate root `package.json`, `turbo.json`, `biome.jsonc`.
3. Generate `knip.json`.
4. Generate `prek.toml` and run `prek install`.
5. Generate `.changeset/config.json` and `.changeset/README.md`.
6. Generate `.github/workflows/ci.yml`.
7. Generate root `.gitignore`.
8. Ensure `apps/web/package.json` has these scripts:
    - `"lint": "biome check ."`
    - `"lint:fix": "biome check --write ."`
    - `"format": "biome format --write ."`
    - `"format:check": "biome format ."`
    - `"check-types": "tsc --noEmit"`
    - `"test": "vitest run"`
    - `"test:watch": "vitest"`
9. Verify `apps/web/next.config.ts` has `reactCompiler: true`.
10. Run `npm install` from root.
11. Verify `npm run dev` works from root (turbo runs apps/web).

### Phase 7: GitHub and Vercel setup

Load `references/deploy-and-launch.md`.

GitHub: init, add, commit, push. Vercel: connect repo, deploy, add custom domain.

### Phase 8: Pre-launch checklist

Load `references/deploy-and-launch.md`.

Generate favicon, add OG images, then hand off to other skills.

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
- Do not use ESLint -- Biome via Ultracite replaces it
- Do not call biome directly -- use `ultracite fix` or `ultracite check`
- Do not use Husky -- replace with prek after Ultracite init
- Do not put app dependencies in root package.json -- only devDependencies (turbo, ultracite, changesets)
- Do not skip `shadcn add --all` -- install all components upfront
- Do not create apps/web manually -- create-next-app first, then move

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `optimise-seo` |
| Before launch, audit UI quality | `audit-ui` |
| Before launch, add motion and animation | `ui-animation` |
