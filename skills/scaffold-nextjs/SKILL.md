---
name: scaffold-nextjs
description: Scaffolds a production-ready Next.js turborepo end to end. Runs create-next-app with TypeScript 7, Tailwind CSS, React Compiler, and Cache Components, sets up shadcn/ui with Blode UI components from the Blode registry, blode-icons-react icons, Agentation, and Ultracite (Oxlint, Oxfmt, Lefthook), converts the app into a turborepo, then creates the GitHub repo and deploys to Vercel with a pre-launch checklist. Use when creating a brand-new Next.js app, bootstrapping a turborepo, scaffolding a web project, starting a new repo for a website or marketing site, or asking "create a Next.js project", "set up a turborepo", or "start a new web app". For a TypeScript CLI or npm package, use scaffold-cli. For folder structure and module contracts in an existing app, use codebase-architecture. For building a page inside an existing app, visual direction, palettes, and theming, use ui-design.
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

- **IS:** bootstrapping a brand-new Next.js turborepo end to end: app creation, Blode UI, Ultracite tooling, turborepo conversion, GitHub, and Vercel.
- **IS NOT:** scaffolding a TypeScript CLI or npm package (use `scaffold-cli`), designing folder structure or module contracts for an existing app (use `codebase-architecture`), building a page inside an existing app, or choosing visual direction and palettes (use `ui-design`).

Low-freedom workflow. The reference files are the single source of truth for commands: run them as written, in phase order. Do not reconstruct commands from memory. Where a Next.js question comes up that the references do not answer, read the bundled docs at `node_modules/next/dist/docs/` in the app (they match the installed version) rather than training data.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Phase 2: create-next-app flags, TypeScript 7 upgrade, Instant Navigations, shadcn + Blode registry, icons, Agentation, Ultracite, move into apps/web/ |
| `references/turbo-configs.md` | Phase 6: root package.json, turbo.json, root lefthook.yml, .gitignore, knip.json, workspace scripts, next.config.ts, root AGENTS.md |
| `references/deploy-and-launch.md` | Phase 7: GitHub, Vercel, favicon, OG image, validation checklist |

## Scaffold Workflow

Copy this checklist to track progress:

```text
Scaffold progress:
- [ ] Phase 1: Gather project info
- [ ] Phase 2: Create Next.js app
- [ ] Phase 2.1: Upgrade to TypeScript 7
- [ ] Phase 2.2: Turn on Instant Navigations
- [ ] Phase 3: Install Blode UI components and icons
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

### Phase 2.1: Upgrade to TypeScript 7

TypeScript 7 section of `references/app-setup.md`: install `typescript@^7` and confirm `npm run build` type-checks through `tsc`. No config accompanies it.

### Phase 2.2: Turn on Instant Navigations

Instant Navigations section of `references/app-setup.md`: set `cacheComponents`, `partialPrefetching`, and `experimental.turbopackRustReactCompiler` in `next.config.ts`. Cheap here and expensive later, so do it before any route exists. Read the authoring rules in that section before Phase 3; they govern how every page is written.

### Phase 3: Install Blode UI components and icons

Blode UI section of `references/app-setup.md`: `shadcn init`, register the `@blode` namespace, set `iconLibrary` in `components.json`, install `blode-icons-react`, then add components.

### Phase 4: Install Agentation

Agentation section of `references/app-setup.md`: install the package, patch `app/layout.tsx` with the dev-only `<Agentation />` guard. Optionally add Google Analytics via `@next/third-parties`.

### Phase 5: Install Ultracite

Ultracite section of `references/app-setup.md`: run `ultracite init` with the exact flags listed, then verify with `npx ultracite fix` and `npx ultracite check`. The `lefthook.yml` it writes is temporary; Phase 6 replaces it with a root-level one.

### Phase 6: Convert to Turborepo

Move the app into `apps/web/` (commands at the end of `references/app-setup.md`), then from `references/turbo-configs.md`:

1. Generate root `package.json`, `turbo.json`, `lefthook.yml`, `knip.json`, and `.gitignore` from the templates. Delete `apps/web/lefthook.yml`; git only reads the copy next to `.git`.
2. Update `apps/web/package.json` scripts to the turbo-compatible block and remove its `prepare` script (the root one installs the hooks).
3. Verify `apps/web/next.config.ts` still has `reactCompiler: true`, `cacheComponents: true`, and `partialPrefetching: true`.
4. Write the root `AGENTS.md` and `CLAUDE.md` from the template.
5. Run `npm install` from the root, then `npm run dev` once. Next 16.3 upserts its managed `nextjs-agent-rules` block into `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` on that first run. Commit it.
6. Verify `npm run check` and `npx lefthook run pre-commit --all-files` pass from the root.

### Phase 7: GitHub and Vercel setup

From `references/deploy-and-launch.md`: create the GitHub repo with `gh`, deploy to Vercel, attach `{{domain}}`.

### Phase 8: Pre-launch checklist

Favicon and OG image steps in `references/deploy-and-launch.md`, then run the validation checklist at the end of that file. Done only when every validation item passes; "the site loads" is not sufficient evidence.

## Placeholder Reference

Templates use `{{variable}}` syntax. Before Phase 7, sweep for missed placeholders:

```bash
grep -rn '{{' --include='*.json' --include='*.ts' --include='*.tsx' --include='*.md' --include='*.yml' .
```

A `{{name}}` left in `package.json` fails `npm install` (invalid-name error); a `{{domain}}` left in metadata ships broken OG URLs. `{{ultracite_version}}` in the root `package.json` template is not gathered in Phase 1: copy it from the `ultracite` entry that `ultracite init` wrote into `apps/web/package.json`.

## Gotchas

- No `src/` directory. The scaffold uses `--no-src-dir`; adding `src/` later breaks the `@/*` alias and every shadcn component path.
- Never set `experimental.useTypeScriptCli`. Since 16.3 the CLI checker is the default, and the flag exists only to switch it back off with `false`; setting it to `true` is noise that reads like a requirement.
- Expect raw `tsc` diagnostics from the CLI checker: no Next.js code frames, and the full `tsconfig.json` project is checked (tests and `.next/dev/types` included), so a type error in a file `next build` used to skip now blocks the build. If you add `node --test` files later, either keep them type-clean or add `**/*.test.ts` to `tsconfig.json` `exclude`.
- A green `next build` does not mean navigation is instant. Instant navigation validation runs in development only (`validationLevel: 'warning'`) and never fails the build, so validate in `next dev` and read the overlay.
- With `cacheComponents: true`, any route segment that exports `dynamic`, `revalidate`, or `fetchCache` fails the build (`Route segment config "dynamic" is not compatible with nextConfig.cacheComponents`). That includes route handlers such as `robots.txt/route.ts`. Use `'use cache'` plus `cacheLife` instead.
- Never add `output: "standalone"`. It is for self-hosting, and on Vercel it stops `.next/next-server.js.nft.json` being written, so the build compiles every page and then dies in Vercel's onBuildComplete.
- Never set `runtime = "edge"`; it is deprecated in 16 and Cache Components requires Node.js. For work that must outlive the response (analytics, logging), use `after()` from `next/server` rather than a floating promise, which Node can cut off the moment the response goes out.
- Add no Turbopack cache config. `turbopackFileSystemCacheForDev`, `turbopackFileSystemCacheForBuild`, and memory eviction (`'auto'`) are on by default in 16.3.
- `turbopack.root` is not needed here. Turbopack infers the workspace root from the lockfile; set it only when linked packages live outside the repo.
- `next dev` writes a managed `<!-- BEGIN:nextjs-agent-rules -->` block into the `AGENTS.md` and `CLAUDE.md` next to the `next` package (so `apps/web/`, not the root). Reverting it only recreates the diff on the next run; commit it, and keep project instructions outside the markers.
- No ESLint or Prettier. Ultracite owns lint and format via Oxlint + Oxfmt; a stray `.eslintrc` makes the editor disagree with the lefthook pre-commit hook.
- Run lint and format through the workspace scripts: root `npm run check` / `npm run fix` (turbo runs them inside `apps/web`), or `npx ultracite check` from `apps/web`. Running `ultracite`, `oxlint`, or `oxfmt` from the repo root finds no `oxlint.config.ts` there and lints with defaults, which disagrees with the hook.
- No manual git hooks. Lefthook owns them; husky or another hook manager double-runs or skips fixes.
- `lefthook.yml` lives at the repo root, next to `.git`. A copy inside `apps/web/` is read only when lefthook is invoked from that directory, which the git hook never does. The root file scopes each job with `root: "apps/web/"` so staged paths are passed relative to the workspace, where `oxlint.config.ts` and `oxfmt.config.ts` live.
- The hook runs `oxfmt` and `oxlint` as two jobs with their own globs, not `ultracite fix`. Ultracite exits non-zero when the staged set contains no lintable JS/TS file, so a CSS-only or Markdown-only commit fails the hook outright; two jobs let lefthook skip whichever has nothing to do. The `oxfmt` glob includes `md` and `mdx` so it inspects what `format:check` inspects.
- No app dependencies in the root `package.json` (root holds only `turbo`, `ultracite`, and `lefthook`); they break workspace isolation and turbo cache keys. Pin the same `ultracite` version at the root and in `apps/web` so config resolution cannot drift.
- Never run `npx shadcn@latest add @blode/...` before `npx shadcn@latest registry add @blode=...`; the unregistered namespace makes the add fail.
- Never import from `lucide-react`; `blode-icons-react` is Blode UI's icon library and mixed imports bundle two icon sets. `shadcn init` writes `"iconLibrary": "lucide"` into `components.json`; change it to `blode-icons-react` before adding components, and replace any generated `lucide-react` import paths.
- Never create `apps/web/` by hand. Scaffold at the root first, then move it in Phase 6; hand-building skips create-next-app defaults (Tailwind wiring, alias config).
- `next-env.d.ts` is generated and belongs in `.gitignore` (create-next-app already lists it). Do not commit it or edit it; custom declarations go in a separate `.d.ts` referenced from `tsconfig.json`.
- Check the Vercel Root Directory before dashboard deploys. On a 404 or wrong app, set Root Directory to `apps/web` in Settings > General.

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `optimise-seo` |
| Before launch, audit UI quality | `ui-design` (Audit mode) |
| Before launch, add motion and animation | `ui-animation` |
