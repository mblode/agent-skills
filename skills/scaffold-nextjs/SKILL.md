---
name: scaffold-nextjs
description: "Scaffolds a Next.js turborepo with Blode UI, icons, Ultracite (oxlint/shadcn), workspace hooks, and GitHub/Vercel setup. Use when asked to \"create a Next.js project\", \"bootstrap a turborepo\", or \"start a new web app\"."
compatibility: Requires a shell, Git, Node.js, pnpm, and package registry access.
---

# Scaffold Next.js

Scaffold a Next.js turborepo with full tooling, GitHub, and Vercel deployment.

- **IS:** bootstrapping a brand-new Next.js turborepo end to end: app creation, Blode UI, Ultracite with `ultracite/oxlint/shadcn`, turborepo conversion, GitHub, and Vercel.
- **IS NOT:** scaffolding a TypeScript CLI or npm package (use `scaffold-cli`), designing folder structure or module contracts for an existing app (use `codebase-architecture`), building a page inside an existing app, or choosing visual direction and palettes (use `ui-design`).

The references encode the house stack and dependency order. Verify version-sensitive flags against the installed CLI and bundled documentation; update a proven incompatible template rather than forcing stale flags. Where a Next.js question comes up that the references do not answer, read the bundled docs at `node_modules/next/dist/docs/` in the app (they match the installed version) rather than training data.

## Reference Files

| File | Read When |
|------|-----------|
| `references/app-setup.md` | Phase 2: create-next-app flags, TypeScript 7 upgrade, Instant Navigations config and the rules block for `apps/web/AGENTS.md`, shadcn + Blode registry, icons, Agentation, Ultracite 7.12+ with `ultracite/oxlint/shadcn`, move into apps/web/ |
| `references/turbo-configs.md` | Phase 6: root package.json, pnpm-workspace.yaml, turbo.json, root lefthook.yml, .gitignore, knip.json, workspace scripts, next.config.ts, root and app AGENTS.md |
| `references/deploy-and-launch.md` | Phase 7 and 8: GitHub, Vercel, CI workflow, metadataBase, verification, security.txt, favicon, OG image, validation checklist |

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
- [ ] Phase 5.1: Enable ultracite/oxlint/shadcn
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

Run the create-next-app command from `references/app-setup.md` exactly as written (it pins linter, React Compiler, and package-manager flags). Confirm the app loads on the port reported by the server. Use a free task-owned port when 3000 is occupied.

### Phase 2.1: Upgrade to TypeScript 7

TypeScript 7 section of `references/app-setup.md`: install `typescript@^7` and confirm `pnpm run build` type-checks through `tsc`. No config accompanies it.

### Phase 2.2: Turn on Instant Navigations

Instant Navigations section of `references/app-setup.md`: set `cacheComponents`, `partialPrefetching`, and `experimental.turbopackRustReactCompiler` in `next.config.ts`. Cheap here and expensive later, so do it before any route exists. Read the Instant Navigations rules block that follows it before Phase 3; it governs how every page is written, and Phase 5.1 appends it to `AGENTS.md`.

### Phase 3: Install Blode UI components and icons

Blode UI section of `references/app-setup.md`: `shadcn init`, register the `@blode` namespace, set `iconLibrary` in `components.json`, install `blode-icons-react`, then add components.

### Phase 4: Install Agentation

Agentation section of `references/app-setup.md`: install the package, patch `app/layout.tsx` with the dev-only `<Agentation />` guard. Optionally add Google Analytics via `@next/third-parties`.

### Phase 5: Install Ultracite

Ultracite section of `references/app-setup.md`: run `ultracite@latest init` with the exact flags listed, including `--js-plugins @shadcn/lint` (Ultracite ≥ 7.12). Verify with `pnpm exec ultracite fix` and `pnpm exec ultracite check`. The `lefthook.yml` it writes is temporary; Phase 6 replaces it with a root-level one.

### Phase 5.1: Enable ultracite/oxlint/shadcn

`ultracite/oxlint/shadcn` section of `references/app-setup.md`: confirm init wrote `import shadcn from "ultracite/oxlint/shadcn"` into `extends` alongside core/next/react. If it did not, add that import (and `jsPlugins: shadcn.jsPlugins`). Do not hand-roll `jsPlugins: ["@shadcn/lint"]` or a starter-only `no-restyle` rule. The preset already turns `shadcn/no-restyle` off inside `**/components/ui/**`; add a matching override only when `aliases.ui` is a different path.

### Phase 6: Convert to Turborepo

Move the app into `apps/web/` (commands at the end of `references/app-setup.md`), then from `references/turbo-configs.md`:

1. Generate root `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `lefthook.yml`, `knip.json`, and `.gitignore` from the templates. Delete `apps/web/lefthook.yml`; git only reads the copy next to `.git`. Move any build-script settings from `apps/web/pnpm-workspace.yaml` into the root file, then delete it.
2. Update `apps/web/package.json` scripts to the turbo-compatible block and remove its `prepare` script (the root one installs the hooks).
3. Verify `apps/web/next.config.ts` still has `reactCompiler: true`, `cacheComponents: true`, and `partialPrefetching: true`.
4. Write the root `AGENTS.md` from the template. Keep the Phase 5.1 Instant Navigations and design-system lint sections in `apps/web/AGENTS.md` outside the Next-managed markers.
5. Run `pnpm install` from the root, then `pnpm run dev` once from the coding agent's shell. When Next 16.3 detects a coding agent in the environment it appends its managed `nextjs-agent-rules` block to `apps/web/AGENTS.md` (some generators also create a CLAUDE.md wrapper). Commit AGENTS.md and remove any duplicate CLAUDE.md wrapper. From a plain terminal nothing is written; that is fine, the block arrives on the agent's first run.
6. Verify `pnpm run check`, `pnpm run build`, and `pnpm exec lefthook run pre-commit --all-files` pass from the root, then `pnpm --filter web start` and load the home page from the production build.

### Phase 7: GitHub and Vercel setup

From `references/deploy-and-launch.md`: create the GitHub repo with `gh`, deploy to Vercel, attach `{{domain}}`.

### Phase 8: Pre-launch checklist

From `references/deploy-and-launch.md`: add the CI workflow, set `metadataBase` to `https://{{domain}}`, register the site with Search Console and Bing, add `security.txt`, the favicon package, and the OG image, then run the validation checklist at the end of that file. Done only when every validation item passes; "the site loads" is not sufficient evidence.

## Placeholder Reference

Templates use `{{variable}}` syntax. Before Phase 7, sweep for missed placeholders:

```bash
grep -rn '{{' --include='*.json' --include='*.ts' --include='*.tsx' --include='*.md' --include='*.yml' .
```

A `{{name}}` left in `package.json` fails `pnpm install` (invalid-name error); a `{{domain}}` left in metadata ships broken OG URLs. Two placeholders in the root `package.json` template are not gathered in Phase 1: `{{ultracite_version}}` is copied from the `ultracite` entry that `ultracite init` wrote into `apps/web/package.json`, and `{{pnpm_version}}` is the output of `pnpm --version`.

## Gotchas

- No `src/` directory. The scaffold uses `--no-src-dir`; adding `src/` later breaks the `@/*` alias and every shadcn component path.
- Never add `output: "standalone"`. It is for self-hosting, and on Vercel it stops `.next/next-server.js.nft.json` being written, so the build compiles every page and then dies in Vercel's onBuildComplete.
- Add no Turbopack cache config. `turbopackFileSystemCacheForDev`, `turbopackFileSystemCacheForBuild`, and memory eviction (`'auto'`) are on by default in 16.3.
- No ESLint or Prettier. Ultracite owns lint and format via Oxlint + Oxfmt; a stray `.eslintrc` makes the editor disagree with the lefthook pre-commit hook.
- Run lint and format through the workspace scripts: root `pnpm run check` / `pnpm run fix` (turbo runs them inside `apps/web`), or `pnpm exec ultracite check` from `apps/web`. Running `ultracite`, `oxlint`, or `oxfmt` from the repo root finds no `oxlint.config.ts` there and lints with defaults, which disagrees with the hook and skips the shadcn preset. Remaining design-system findings after `ultracite fix` can go to `pnpm exec ultracite fix --codex` (or `--claude`) from `apps/web`.
- No manual git hooks. Lefthook owns them; husky or another hook manager double-runs or skips fixes.
- pnpm does not hoist dependencies to the root `node_modules`, so a tool resolves only in the workspace that declares it. Run `oxlint`, `oxfmt`, and `@shadcn/lint` through `pnpm exec` inside `apps/web` (the lefthook `root:` and the turbo scripts already do), never by adding them to the root.
- No app dependencies in the root `package.json` (root holds only `turbo`, `ultracite`, and `lefthook`); they break workspace isolation and turbo cache keys. `@shadcn/lint` stays in `apps/web` with `oxlint.config.ts`. Pin the same `ultracite` version (≥ 7.12) at the root and in `apps/web` so config resolution cannot drift.
- Never create `apps/web/` by hand. Scaffold at the root first, then move it in Phase 6; hand-building skips create-next-app defaults (Tailwind wiring, alias config).
- `node --test` runs a test file directly, where the `@/` alias does not resolve; test files and the modules they import use relative paths, and a test script globs `lib/**/*.test.ts` rather than naming one file, or a new test is never executed while the gate reports green. The `tsc` build checks the whole project, test files included: keep them type-clean or add `**/*.test.ts` to `tsconfig.json` `exclude`.

## Skill Handoffs

| When | Run |
|------|-----|
| After deployment, optimise SEO | `seo` |
| Before launch, audit UI quality | `ui-design` (Audit mode) |
| Before launch, add motion and animation | `ui-animation` |

Maintenance only: `evals/evals.json` contains regression scenarios for changes to this skill; it does not load during a user task.
