---
name: scaffold-nextjs
description: Scaffolds a production-ready Next.js turborepo end to end. Runs create-next-app with TypeScript, Tailwind CSS, and React Compiler, sets up shadcn/ui with Blode UI components from the ui.blode.co registry, blode-icons-react icons, Agentation, and Ultracite (Oxlint, Oxfmt, Lefthook), converts the app into a turborepo, then creates the GitHub repo and deploys to Vercel with a pre-launch checklist. Use when creating a new Next.js app, bootstrapping a turborepo, scaffolding a web project, starting a new website or marketing site, or asking "create a Next.js project", "set up a turborepo", or "start a new web app". For a TypeScript CLI or npm package, use scaffold-cli. For folder structure and module contracts in an existing app, use define-architecture. For visual direction, palettes, and theming, use ui-design.
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

- **IS:** bootstrapping a brand-new Next.js turborepo end to end: app creation, Blode UI, Ultracite tooling, turborepo conversion, GitHub, and Vercel.
- **IS NOT:** scaffolding a TypeScript CLI or npm package (use `scaffold-cli`), designing folder structure or module contracts for an existing app (use `define-architecture`), or choosing visual direction and palettes (use `ui-design`).

This is a low-freedom workflow. Commands live in the reference files and are exact: run them as written, in phase order. The reference files are the single source of truth for commands; do not reconstruct them from memory.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Starting Phase 2: create-next-app flags, shadcn + Blode registry setup, Agentation, Ultracite commands, and the move into apps/web/ |
| `references/turbo-configs.md` | Starting Phase 6: root package.json, turbo.json, .gitignore, knip.json, workspace scripts, next.config.ts |
| `references/deploy-and-launch.md` | Starting Phase 7: GitHub setup, Vercel deployment, favicon, OG images, validation checklist |

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
- [ ] Validation: run the checklist in deploy-and-launch.md
```

### Phase 1: Gather project info

Collect from the user (ask only what was not provided):

| Variable | Example | Default | Used in |
|----------|---------|---------|---------|
| `{{name}}` | `acme-web` | none (required) | Root package.json, directory name, README |
| `{{description}}` | `Marketing site for Acme` | none (required) | App package.json, README |
| `{{repo}}` | `acme-corp/acme-web` | none (required) | GitHub remote URL |
| `{{domain}}` | `acme.com` | none (ask if missing) | Vercel custom domain, metadataBase |
| `{{author}}` | `Your Name` | none (required) | package.json author |
| `{{year}}` | `2026` | current year | LICENSE |

### Phase 2: Create Next.js app

Load `references/app-setup.md` and run the create-next-app command exactly as written there (it pins the linter, React Compiler, and package-manager flags). Confirm the app loads at `http://localhost:3000` before moving on.

### Phase 3: Install Blode UI components

Follow the Blode UI section in `references/app-setup.md`: `shadcn init`, then register the `@blode` namespace, then add components. Registration must come before any `add @blode/...` call. Always use `blode-icons-react` for icon imports (never `lucide-react`).

### Phase 4: Install Agentation

Follow the Agentation section in `references/app-setup.md`: install the package and patch `app/layout.tsx` with the dev-only `<Agentation />` guard. Optionally add Google Analytics via `@next/third-parties`.

### Phase 5: Install Ultracite

Follow the Ultracite section in `references/app-setup.md`: delete the Biome placeholder config, run `ultracite init` with the exact flags listed, then verify with `npx ultracite fix` and `npx ultracite check`.

### Phase 6: Convert to Turborepo

Move the app into `apps/web/` (commands at the end of `references/app-setup.md`), then load `references/turbo-configs.md` and:

1. Generate root `package.json`, `turbo.json`, `knip.json`, and `.gitignore` from the templates.
2. Update `apps/web/package.json` scripts to the turbo-compatible block in the reference.
3. Verify `apps/web/next.config.ts` has `reactCompiler: true`.
4. Run `npm install` from the root.
5. Verify `npm run dev` works from the root (turbo runs apps/web).

### Phase 7: GitHub and Vercel setup

Load `references/deploy-and-launch.md`. Create the GitHub repo with `gh`, deploy to Vercel, and attach `{{domain}}`.

### Phase 8: Pre-launch checklist

Follow the favicon and OG image steps in `references/deploy-and-launch.md`, then run the validation checklist at the end of that file. The scaffold is done only when every validation item passes; "the site loads" is not sufficient evidence.

## Placeholder Reference

All templates use `{{variable}}` syntax. Before Phase 7, sweep for missed placeholders:

```bash
grep -rn '{{' --include='*.json' --include='*.ts' --include='*.tsx' --include='*.md' .
```

A `{{name}}` left in `package.json` makes `npm install` fail with an invalid-name error; a `{{domain}}` left in metadata ships broken OG URLs.

## Gotchas

- Do not add a `src/` directory. The scaffold uses `--no-src-dir`; introducing `src/` later breaks the `@/*` alias and every shadcn component path.
- Do not add ESLint or Prettier. Ultracite owns lint and format via Oxlint + Oxfmt; a stray `.eslintrc` makes the editor disagree with the lefthook pre-commit hook.
- Do not run `oxlint` or `oxfmt` ad hoc; use `npx ultracite fix` / `npx ultracite check` (or `npm run fix` / `npm run check` at the root) so config resolution matches the hook. The `oxlint .` / `oxfmt .` scripts inside `apps/web/package.json` exist only so turbo can orchestrate per-workspace tasks.
- Do not configure git hooks manually. `ultracite init` writes `lefthook.yml` and a `prepare: lefthook install` script; adding husky or another hook manager double-runs or skips fixes.
- Do not put app dependencies in the root `package.json`. The root holds only `turbo` and `ultracite`; app deps at the root break workspace isolation and turbo cache keys.
- Do not run `npx shadcn@latest add @blode/...` before `npx shadcn@latest registry add @blode=...`. The unregistered namespace makes the add command fail.
- Do not import from `lucide-react`. `blode-icons-react` is the icon library for Blode UI; mixed imports bundle two icon sets. Replace any generated `lucide-react` import paths.
- Do not create `apps/web/` by hand. Scaffold at the root first, then move it in Phase 6; hand-building skips create-next-app defaults (Tailwind wiring, alias config).
- Do not deploy from the dashboard without checking the Root Directory. If Vercel serves a 404 or the wrong app, set the project Root Directory to `apps/web` in Settings > General.

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `optimise-seo` |
| Before launch, audit UI quality | `ui-audit` |
| Before launch, add motion and animation | `ui-animation` |
