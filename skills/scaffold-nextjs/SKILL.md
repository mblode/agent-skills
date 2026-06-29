---
name: scaffold-nextjs
description: Scaffolds a production-ready Next.js turborepo end to end. Runs create-next-app with TypeScript, Tailwind CSS, and React Compiler, sets up shadcn/ui with Blode UI components from the ui.blode.co registry, blode-icons-react icons, Agentation, and Ultracite (Oxlint, Oxfmt, Lefthook), converts the app into a turborepo, then creates the GitHub repo and deploys to Vercel with a pre-launch checklist. Use when creating a brand-new Next.js app, bootstrapping a turborepo, scaffolding a web project, starting a new repo for a website or marketing site, or asking "create a Next.js project", "set up a turborepo", or "start a new web app". For a TypeScript CLI or npm package, use scaffold-cli. For folder structure and module contracts in an existing app, use define-architecture. For building a page inside an existing app, visual direction, palettes, and theming, use ui-design.
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

- **IS:** bootstrapping a brand-new Next.js turborepo end to end: app creation, Blode UI, Ultracite tooling, turborepo conversion, GitHub, and Vercel.
- **IS NOT:** scaffolding a TypeScript CLI or npm package (use `scaffold-cli`), designing folder structure or module contracts for an existing app (use `define-architecture`), building a page inside an existing app, or choosing visual direction and palettes (use `ui-design`).

Low-freedom workflow. The reference files are the single source of truth for commands: run them as written, in phase order. Do not reconstruct commands from memory.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Phase 2: create-next-app flags, shadcn + Blode registry, Agentation, Ultracite, move into apps/web/ |
| `references/turbo-configs.md` | Phase 6: root package.json, turbo.json, .gitignore, knip.json, workspace scripts, next.config.ts |
| `references/deploy-and-launch.md` | Phase 7: GitHub, Vercel, favicon, OG images, validation checklist |

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

Collect from the user (ask only for what is missing):

| Variable | Example | Default | Used in |
|----------|---------|---------|---------|
| `{{name}}` | `acme-web` | none (required) | Root package.json, directory name, README |
| `{{description}}` | `Marketing site for Acme` | none (required) | App package.json, README |
| `{{repo}}` | `acme-corp/acme-web` | none (required) | GitHub remote URL |
| `{{domain}}` | `acme.com` | none (ask if missing) | Vercel custom domain, metadataBase |
| `{{author}}` | `Your Name` | none (required) | package.json author |
| `{{year}}` | `2026` | current year | LICENSE |

### Phase 2: Create Next.js app

Run the create-next-app command from `references/app-setup.md` exactly as written (it pins linter, React Compiler, and package-manager flags). Confirm the app loads at `http://localhost:3000` before continuing.

### Phase 3: Install Blode UI components

Blode UI section of `references/app-setup.md`: `shadcn init`, register the `@blode` namespace, then add components. Registration must precede any `add @blode/...` call. Use `blode-icons-react` for icon imports, never `lucide-react`.

### Phase 4: Install Agentation

Agentation section of `references/app-setup.md`: install the package, patch `app/layout.tsx` with the dev-only `<Agentation />` guard. Optionally add Google Analytics via `@next/third-parties`.

### Phase 5: Install Ultracite

Ultracite section of `references/app-setup.md`: delete the Biome placeholder config, run `ultracite init` with the exact flags listed, then verify with `npx ultracite fix` and `npx ultracite check`.

### Phase 6: Convert to Turborepo

Move the app into `apps/web/` (commands at the end of `references/app-setup.md`), then from `references/turbo-configs.md`:

1. Generate root `package.json`, `turbo.json`, `knip.json`, and `.gitignore` from the templates.
2. Update `apps/web/package.json` scripts to the turbo-compatible block.
3. Verify `apps/web/next.config.ts` has `reactCompiler: true`.
4. Run `npm install` from the root.
5. Verify `npm run dev` works from the root (turbo runs apps/web).

### Phase 7: GitHub and Vercel setup

From `references/deploy-and-launch.md`: create the GitHub repo with `gh`, deploy to Vercel, attach `{{domain}}`.

### Phase 8: Pre-launch checklist

Favicon and OG image steps in `references/deploy-and-launch.md`, then run the validation checklist at the end of that file. Done only when every validation item passes; "the site loads" is not sufficient evidence.

## Placeholder Reference

Templates use `{{variable}}` syntax. Before Phase 7, sweep for missed placeholders:

```bash
grep -rn '{{' --include='*.json' --include='*.ts' --include='*.tsx' --include='*.md' .
```

A `{{name}}` left in `package.json` fails `npm install` (invalid-name error); a `{{domain}}` left in metadata ships broken OG URLs.

## Gotchas

- No `src/` directory. The scaffold uses `--no-src-dir`; adding `src/` later breaks the `@/*` alias and every shadcn component path.
- No ESLint or Prettier. Ultracite owns lint and format via Oxlint + Oxfmt; a stray `.eslintrc` makes the editor disagree with the lefthook pre-commit hook.
- Never run `oxlint` or `oxfmt` ad hoc; use `npx ultracite fix` / `npx ultracite check` (or root `npm run fix` / `npm run check`) so config resolution matches the hook. The `oxlint .` / `oxfmt .` scripts in `apps/web/package.json` exist only for turbo's per-workspace orchestration.
- No manual git hooks. `ultracite init` writes `lefthook.yml` and a `prepare: lefthook install` script; husky or another hook manager double-runs or skips fixes.
- No app dependencies in the root `package.json` (root holds only `turbo` and `ultracite`); they break workspace isolation and turbo cache keys.
- Never run `npx shadcn@latest add @blode/...` before `npx shadcn@latest registry add @blode=...`; the unregistered namespace makes the add fail.
- Never import from `lucide-react`; `blode-icons-react` is Blode UI's icon library and mixed imports bundle two icon sets. Replace any generated `lucide-react` import paths.
- Never create `apps/web/` by hand. Scaffold at the root first, then move it in Phase 6; hand-building skips create-next-app defaults (Tailwind wiring, alias config).
- Check the Vercel Root Directory before dashboard deploys. On a 404 or wrong app, set Root Directory to `apps/web` in Settings > General.

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `optimise-seo` |
| Before launch, audit UI quality | `ui-audit` |
| Before launch, add motion and animation | `ui-animation` |
