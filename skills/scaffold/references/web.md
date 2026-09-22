# Web Profile: Next.js Turborepo

A Next.js app in `apps/web` inside an npm-workspaces Turborepo, with Blode UI, `blode-icons-react`, Agentation, Ultracite over Oxlint and Oxfmt with the shadcn preset, Lefthook, and a Vercel deploy. Templates are in `templates/web/`. When a Next.js question is version-sensitive, the bundled docs at `node_modules/next/dist/docs/` in the app match the installed version and win over this file.

## Contents

- Inputs
- Sequence
- Instant Navigations authoring rules
- Analytics and error tracking
- Remote setup and pre-launch
- Gotchas

## Inputs

`{{name}}`, `{{description}}`, `{{repo}}` (`owner/name`), `{{domain}}`, `{{author}}`. Filled while generating: `{{npm_version}}` (`npm --version`), and in `check.yml` the current `actions/checkout` and `actions/setup-node` major tags and the Node version the Vercel project uses.

## Sequence

1. **Create the app at the root, never by hand in `apps/web`.** Run `create-next-app@latest` with TypeScript, Tailwind, App Router, no `src/` directory, `@/*` alias, npm, React Compiler, no linter (Ultracite installs Oxlint), and no generated AGENTS.md (Ultracite writes one). Confirm the flag names against `npx create-next-app@latest --help`; they change between releases. Start it on a free port and load it.
2. **TypeScript.** `npm install -D typescript@latest`, then confirm `npm run build` type-checks through the `tsc` CLI.
3. **Instant Navigations.** Replace `next.config.ts` with the template before any route exists: cheap now, a migration later. Remove `babel-plugin-react-compiler`, which `create-next-app` installed and the native compiler makes unused. Tell the user `turbopackRustReactCompiler` is experimental and name its one-line exit (in the template comment).
4. **Blode UI and icons.** `npx shadcn@latest init`, then `npx shadcn@latest registry add @blode=https://blode.co/ui/r/{name}.json`, `npm install blode-icons-react`, set `"iconLibrary": "blode-icons-react"` in `components.json`, and only then `npx shadcn@latest add @blode/button`. Class merging goes through `cn`; do not add `clsx` or `tailwind-merge`.
5. **Agentation.** `npm install agentation`; render `<Agentation />` before `</body>` behind `process.env.NODE_ENV === "development"`.
6. **Ultracite.** Check that `npx ultracite@latest init --help` accepts `--js-plugins`, then run it with Oxlint, the `next react` frameworks (space-separated), `--js-plugins @shadcn/lint`, the Lefthook integration, `--agents universal`, npm, `--skip-install`, and `--quiet`. Install, then pin every `latest` range to the resolved version. Confirm `oxlint.config.ts` matches the template (core, next, react, and shadcn presets, `jsPlugins` hoisted). Append `web-agents-section.md.tmpl` to the app's `AGENTS.md`. `npx ultracite fix` then `npx ultracite check` pass with zero errors.
7. **Turborepo.** From the parent directory: `mkdir -p {{name}}-turbo/apps && mv {{name}} {{name}}-turbo/apps/web && mv {{name}}-turbo {{name}}`. At the root, write `package.json` from `root-package.json`, plus `turbo.json`, `lefthook.yml`, `.gitignore` (from `gitignore`), and `knip.json`; `AGENTS.md` from `root-agents.md.tmpl`. Delete `apps/web/lefthook.yml`. Replace the app's scripts with `web-scripts.json`, dropping the `check`, `fix`, and `prepare` scripts Ultracite added. Install `turbo`, `lefthook`, and the same `ultracite` version as the app as root devDependencies.
8. **First agent run.** `git init`, `npm install` from the root, then `npm run dev` once from the coding agent's shell: current Next.js appends a managed `nextjs-agent-rules` block to `apps/web/AGENTS.md` when it detects a coding agent. Keep AGENTS.md, delete any generated `CLAUDE.md` wrapper, keep project text outside the markers.
9. **Prove it.** Commit locally, then run `scripts/cold-clone.sh --dev-url http://localhost:<port> --start-url http://localhost:<port>` and `npx lefthook run pre-commit --all-files`. Sweep for placeholders.

## Instant Navigations authoring rules

These govern every page written afterwards; the app-level section in `web-agents-section.md.tmpl` carries the short form.

- Nothing is cached unless a function says `'use cache'`, with `cacheLife` and `cacheTag`. On Vercel plain `'use cache'` is per function instance; data behind a sitemap or list page uses `'use cache: remote'`.
- `dynamic`, `dynamicParams`, `revalidate`, and `fetchCache` segment exports are build errors, in pages and route handlers alike (including a hand-written `robots.txt/route.ts`). The directive goes on a helper, never on a `GET` export.
- `generateStaticParams` returns at least one param, or the build raises `empty-generate-static-params`.
- Never await `params`, `searchParams`, `cookies()`, or `headers()` at the top of a page; pass the promise into a `<Suspense>`-wrapped child. Type props with the generated `PageProps<'/route'>`.
- List filters live in path segments, not `searchParams`, so the list stays static.
- No `new Date()`, `Date.now()`, `Math.random()`, or `crypto.randomUUID()` during render: `await connection()` in a Suspense child for a per-request value, a `'use cache'` function for a shared one.
- `useSearchParams` always needs a `<Suspense>` boundary.
- The previous route stays mounted as hidden DOM (React `<Activity>`), so backgrounds and themes belong to the route, never `body` or `html`, and component state survives back navigation.
- Keep filesystem-reading modules apart from constants that client components and `proxy.ts` import.
- Validation runs in `next dev` only and never fails `next build`. Load each route in dev and read the overlay; a green build is not evidence.

## Analytics and error tracking

Optional. GA through `@next/third-parties` (`<GoogleAnalytics>` after `</body>`). Any other SDK initializes in `instrumentation-client.ts`, not a client component. Lessons from a production setup:

- Guard `init` against `localhost`, `127.0.0.1`, and `*.localhost`.
- Point the ingestion host at a reverse proxy on your own domain from a `NEXT_PUBLIC_` variable, and add it to the CSP `script-src`, `connect-src`, and `worker-src 'self' blob:`.
- Filter browser-extension and framework noise (`chrome-extension://`, `Extension context invalidated`, `AbortError`, `Script error.`) or the error inbox is unusable within a week.
- Server-side captures send with `after()` and reuse the browser cookie's `distinct_id`.
- A source-map upload wrapper that throws without credentials must be applied conditionally, or every clone and credential-less build fails on `Failed to load next.config.ts`.

## Remote setup and pre-launch

Only with the user's go-ahead, since these create public resources:

- `gh repo create {{repo}} --public --source=. --remote=origin --push`. Before the first commit, confirm `git status` shows no `.next/`, `node_modules/`, or `next-env.d.ts`.
- `npx vercel --yes`, then `npx vercel --prod`; attach `{{domain}}`. On a 404 or the wrong app, set Root Directory to `apps/web`. Never assume `{{name}}.vercel.app` is yours; use the alias Vercel confirms.
- `check.yml` into `.github/workflows/`, with the placeholders resolved. Once a second workspace exists, `apps/web/vercel.json` with `"ignoreCommand": "npx turbo-ignore"` skips untouched builds.

Pre-launch, in the app:

- `lib/site.ts` exports `siteUrl = "https://{{domain}}"`; the root layout sets `metadataBase: new URL(siteUrl)` beside `title` and `description`. A relative OG or canonical URL without it is a build error.
- `metadata.verification` carries the Search Console token (and `other: { "msvalidate.01": ... }` for Bing).
- `public/.well-known/security.txt` with `Contact:`, `Expires:` (within a year), and `Canonical:`.
- Favicon package files in `app/` (Next file conventions emit the tags); `opengraph-image.png` at 1200x630 plus `opengraph-image.alt.txt`. No separate `twitter-image.png`; the card falls back to the OG image.

Then `seo` for metadata, structured data, and sitemap; `design` for the UI audit and motion.

## Gotchas

- No `src/` directory: adding one later breaks the `@/*` alias and every shadcn component path.
- Never set `experimental.useTypeScriptCli`: the CLI checker is the default, and the flag exists only to turn it off. Expect raw `tsc` diagnostics and the whole `tsconfig.json` project checked, tests included.
- Never add `output: "standalone"`; on Vercel it stops the trace file being written and the build dies after compiling every page. Never set `runtime = "edge"`; Cache Components needs Node.js. For work after the response, use `after()`, not a floating promise.
- Add no Turbopack cache config and no `turbopack.root`; both are defaulted or inferred from the lockfile.
- If `next.config.ts` imports a project module, use a relative path: it compiles without `tsconfig` path resolution.
- `ultracite init --quiet` without an explicit linter flag installs Biome. Pass every flag.
- Keep Ultracite's `extends` and `ignorePatterns` and add `shadcn`. Do not hand-roll `jsPlugins: ["@shadcn/lint"]` plus a starter-only `no-restyle` block. The preset already turns `no-restyle`, `no-arbitrary-values`, and `require-static-classes` off inside `**/components/ui/**`; add a matching override only when `components.json` `aliases.ui` points elsewhere.
- Run lint and format through workspace scripts. `oxlint` from the repo root finds no config, lints with defaults, and disagrees with the hook.
- No ESLint, Prettier, or Husky. A stray `.eslintrc` makes the editor disagree with the hook; a second hook manager double-runs fixes.
- No app dependencies in the root `package.json`; they break workspace isolation and turbo cache keys. `@shadcn/lint` stays in `apps/web` with `oxlint.config.ts`.
- `registry add @blode=...` must run before any `add @blode/...`, and `iconLibrary` must change before the first add, or every component imports `lucide-react`. Never import from `lucide-react`.
- `next-env.d.ts` is generated and ignored; custom declarations go in a separate `.d.ts`.
- `.env.local` lives in `apps/web/`: `vercel env pull apps/web/.env.local`. Only `NEXT_PUBLIC_` variables reach the browser, inlined at build.
- Tailwind's oxide and lightningcss ship platform binaries; a lockfile generated on macOS can miss the Linux ones on Vercel. Pin them in `optionalDependencies` at the lockfile's versions if the build fails there.
- `node --test` files cannot resolve `@/`; use relative imports, and glob the files (`"lib/**/*.test.ts"`) so a new test is never silently skipped.
- `next start` on a taken port fails while the old server keeps answering, so the check passes against the wrong build. Use a free port and stop only what you started.
