# App Setup Commands

## Contents

- [Phase 2: Create Next.js app](#phase-2-create-nextjs-app)
- [Phase 2.1: Upgrade to TypeScript 7](#phase-21-upgrade-to-typescript-7)
- [Phase 2.2: Turn on Instant Navigations](#phase-22-turn-on-instant-navigations)
- [Phase 3: Install Blode UI components and icons](#phase-3-install-blode-ui-components-and-icons)
- [Phase 4: Install Agentation](#phase-4-install-agentation)
- [Phase 4.1: Add Google Analytics (optional)](#phase-41-add-google-analytics-optional)
- [Phase 5: Install Ultracite](#phase-5-install-ultracite)
- [Phase 6 prep: Move into apps/web/](#phase-6-prep-move-into-appsweb)

---

## Phase 2: Create Next.js app

Run non-interactively with all flags:

```bash
npx create-next-app@latest {{name}} --typescript --tailwind --no-linter --no-agents-md --react-compiler --app --no-src-dir --import-alias "@/*" --use-npm
```

Sets up: TypeScript, Tailwind CSS v4, no linter (Ultracite installs Oxlint and Oxfmt in Phase 5), React Compiler, App Router, Turbopack (default in Next.js 16+), no src/ directory, `@/*` import alias, npm.

`--no-linter` and `--no-agents-md` matter: taking the `--biome` or `--eslint` default means uninstalling it again in Phase 5, and `--agents-md` (on by default) writes an AGENTS.md and CLAUDE.md that Ultracite then overwrites in Phase 5. Next 16.3 adds its own managed block to those files on the first `next dev` regardless, so nothing is lost by skipping the generator here.

If prompted interactively, select "No, customize settings" and match the flag values above.

After creation, verify:

```bash
cd {{name}}
npm run dev
```

Confirm the app loads at `http://localhost:3000`.

The generated `.gitignore` already lists `.next/`, `.env*`, and `next-env.d.ts`. Leave `next-env.d.ts` ignored: Next.js regenerates it on every `dev`, `build`, and `typegen`, and its contents are an implementation detail.

## Phase 2.1: Upgrade to TypeScript 7

`create-next-app` installs TypeScript 5. Move to TypeScript 7:

```bash
npm install -D typescript@^7
```

That is the whole step. No config goes with it: in 16.3, `next build` runs the
project-local `tsc` CLI by default rather than loading TypeScript's JavaScript
compiler API, which is what makes TypeScript 7 work at all (7 does not ship that
API). `experimental.useTypeScriptCli` exists only to turn the CLI checker back
**off** by setting it to `false`, so a fresh scaffold should never mention it.

Verify:

```bash
npx tsc --version   # Version 7.x
npm run build       # type check runs through tsc, build succeeds
```

Behaviour changes to expect:
- Errors are raw `tsc` diagnostics; no Next.js code frames or route-specific rewrites.
- The whole `tsconfig.json` project is checked, including test files and `.next/dev/types`.
- In VS Code, run "TypeScript: Select TypeScript Version" > "Use Workspace Version" so the editor matches the build.

## Phase 2.2: Turn on Instant Navigations

Cache Components and Partial Prefetching make rendering dynamic by default and
let every `<Link>` prefetch a shared App Shell. Adopting them in an existing app
is a migration; in a new one it is four lines, because there is no legacy
caching to unwind and no `<Link prefetch={true}>` to audit.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  // Version-skew protection and cache busting: clients on an old deployment
  // hard-reload instead of loading stale chunks. Vercel sets the variable at
  // build time; anywhere else it is undefined and the option is inert.
  deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
  experimental: {
    // Runs the React Compiler inside Turbopack as native code instead of
    // through the Babel plugin. Experimental in 16.3; see the note below.
    turbopackRustReactCompiler: true,
  },
};

export default nextConfig;
```

`partialPrefetching` only works with `cacheComponents`, so the two ship together
or not at all; `next dev` and `next build` refuse the config otherwise.

`turbopackRustReactCompiler` is the one flag here Next.js still marks
experimental: the 16.3 docs describe it as released "to gather feedback before it
becomes the default". It removes the Babel step from the pipeline, which is where
most of the React Compiler's build cost lives, so the scaffold turns it on, but
tell the user it is experimental. The exit is one line: drop the flag and
`npm install -D babel-plugin-react-compiler`, and `reactCompiler: true` keeps
working through Babel.

With the Rust compiler on, `babel-plugin-react-compiler` is not needed.
`create-next-app --react-compiler` installed it anyway, so remove it now
(`npm uninstall babel-plugin-react-compiler`), and add no other Babel
transform: any Babel step in the pipeline gives back most of what the Rust path
saves.

What the flags change, and what to write from day one:
- Nothing is cached unless a function says `'use cache'`. Add it at the data
  access, with `cacheLife` for how long and `cacheTag` for what invalidates it.
  On Vercel that cache is per function instance; anything that must be shared
  across instances (the data behind a sitemap or a list page) uses
  `'use cache: remote'`.
- Four route segment configs are gone: `export const dynamic`, `dynamicParams`,
  `revalidate`, and `fetchCache` are build errors under Cache Components, in
  pages and route handlers alike. A `'use cache'` helper plus `cacheLife`
  replaces them; the directive goes on the helper, never on a `GET` export.
- `generateStaticParams` must return at least one param, or the build raises
  `empty-generate-static-params`. Unlisted params get the App Shell on first
  visit and upgrade in the background.
- Never `await params` or `searchParams` at the top of a page. Pass the promise
  into a `<Suspense>`-wrapped child and await it there, or the shell is tied to
  one URL. Type the props with the generated `PageProps<'/route'>` helper.
- Filters on a list page live in path segments (`/projects/tag/[slug]`), not
  `searchParams`. Reading search params opts the list out of static rendering
  and streams it twice; a `has: [{ type: 'query' }]` redirect keeps the old
  query form working.
- Same for `cookies()` and `headers()`: read them inside a boundary so the rest
  of the page still prerenders.
- No `new Date()`, `Date.now()`, `Math.random()` or `crypto.randomUUID()` during
  render, in server or client components. These are hard build errors. The docs
  give two fixes: `await connection()` inside a `<Suspense>`-wrapped component
  for a per-request value, or a `'use cache'` function for one value shared
  across users (a copyright year, a build stamp). Reading the clock in
  `next.config.ts` and passing it through `env` also works, but that `env`
  option is marked legacy; prefer the cached function.
- `useSearchParams` always needs a `<Suspense>` boundary, even in a
  `"use client"` page.
- The previous route stays mounted as hidden DOM during navigation (React
  `<Activity>`), so backgrounds and themes belong to the route, never to
  `body` or `html`, and any theme switch keys off `usePathname()` rather than
  a class on `body`. Component state survives back navigation too; reset it in
  an effect or derive it from the URL.
- Keep filesystem-reading modules apart from the constants client components
  and `proxy.ts` import. A lazy-loaded footer that imports the project list
  pulls the whole dataset into the browser bundle, and a `lib/site.ts` that
  imports `next/headers` cannot be imported by the proxy at all.
- `generateMetadata` follows the same rules. External data goes behind
  `'use cache'` inside it; runtime data (`cookies()`, `params`) needs a dynamic
  marker in the page, or the build raises
  `blocking-prerender-metadata-runtime`.

Verify with `next dev` rather than the build. Instant navigation validation runs
in development only and never fails `next build`, so a green build is not
evidence. Load each route and confirm the dev overlay reports none. The
Navigation Inspector in the Next.js DevTools ("Pause on navigations") freezes the
page at its shell so you can see what a visitor gets before data streams in.

## Phase 3: Install Blode UI components and icons

Blode UI is a third-party shadcn/ui registry served at `blode.co/ui` (the `ui.blode.co` subdomain 301s there). Use the hosted `@blode` namespace flow.

```bash
npx shadcn@latest init
npx shadcn@latest registry add @blode=https://blode.co/ui/r/{name}.json
npm install blode-icons-react
```

Then open `components.json` and change the icon library before adding any component:

```json
{
  "iconLibrary": "blode-icons-react"
}
```

`shadcn init` writes `"iconLibrary": "lucide"`. Left alone, every component the CLI adds imports from `lucide-react`, and the replace step below repeats on each add. Now add components:

```bash
npx shadcn@latest add @blode/button
```

Order matters: `registry add` must run before any `add @blode/...` call, or the namespace is unknown and the add fails.

Creates:
- `components.json`: shadcn config, the Blode registry mapping, and the icon library
- `lib/utils.ts`: `cn()` helper (clsx + tailwind-merge)
- `components/ui/button.tsx`: button from the Blode registry
- CSS variable updates in `app/globals.css`

Icons: use `blode-icons-react` for all icon imports. If any generated file still imports `lucide-react`, replace the import paths with `blode-icons-react`. `lucide-react` is not a dependency of this scaffold; if it appears in `package.json`, remove it.

## Phase 4: Install Agentation

```bash
npm install agentation
```

Patch `app/layout.tsx`: add `import { Agentation } from "agentation";` at the top, and render the component before `</body>` behind a dev-only guard, `{process.env.NODE_ENV === "development" && <Agentation />}`. Full pattern:

```tsx
import { Agentation } from "agentation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
```

## Phase 4.1: Add Google Analytics (optional)

```bash
npm install @next/third-parties@latest
```

Add two lines to the Phase 4 layout: the import, and the `<GoogleAnalytics>` element as a sibling of `<body>` (inside `<html>`, after `</body>`), which is where the Next.js third-parties guide places it:

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";
// ...inside <html>, after </body>:
<GoogleAnalytics gaId="G-XYZ" />
```

Replace `"G-XYZ"` with your GA4 measurement ID.

For any other analytics or error-tracking SDK (PostHog, Sentry), initialise it in
`instrumentation-client.ts` at the app root rather than in a client component.
The file runs before the app hydrates, needs no exports, and keeps the SDK out of
the component tree. Lessons from a production PostHog setup that apply to any
SDK:

- Guard `init` against `localhost`, `127.0.0.1`, and `*.localhost` (named dev
  origins from portless) so development sessions do not land in production data.
- Point `api_host` at a reverse proxy on your own domain, set from a
  `NEXT_PUBLIC_` variable, so ad blockers that list the vendor's hosts do not
  drop the data; set `ui_host` to the vendor's real app so its toolbar and
  links still work. The proxy origin then belongs in the CSP `script-src`
  (the SDK lazy-loads chunks), `connect-src`, and `worker-src 'self' blob:`.
- Filter `before_send` for browser-extension exceptions (`chrome-extension://`,
  `runtime.sendMessage`, `Extension context invalidated`) and framework noise
  (`AbortError`, `Script error.`, `Internal Next.js error`) or the error inbox
  is unusable within a week.
- Server-side captures go straight to the ingestion host (a server request has
  no blocker to get past) and reuse the browser cookie's `distinct_id` so
  conversions attach to the same person; send them with `after()`.
- A build-time source-map upload wrapper that throws when its credentials are
  missing must be applied conditionally, or a fresh clone and every Vercel
  build without the variables fails on `Failed to load next.config.ts`.

## Phase 5: Install Ultracite

1. Run Ultracite init non-interactively (Oxlint + Oxfmt + Lefthook). Scaffolding with `--no-linter` means there is no Biome or ESLint config to remove first; if you inherited one from an older scaffold, delete it and uninstall the dependency before this step, or two linters fight over the same files.

```bash
npx ultracite@latest init \
  --linter oxlint \
  --frameworks next react \
  --integrations lefthook \
  --agents universal \
  --pm npm \
  --skip-install \
  --quiet
```

Flag notes:
- `--frameworks` takes space-separated values (`next react`), not commas; commas fail validation.
- `--agents universal` writes `AGENTS.md` with the Ultracite code standards. Without it, `--quiet` skips the agent prompt and no file is written.
- `--skip-install` lets you review the generated `package.json` changes before installing.
- Omit `--quiet` to confirm the generated file list interactively.

Sets up (verified against a real `ultracite@7.10.7 init` run with these flags):
- `oxlint.config.ts`: extends `ultracite/oxlint/{core,next,react}`
- `oxfmt.config.ts`: extends `ultracite/oxfmt`
- `lefthook.yml`: a pre-commit hook. This copy is temporary. Phase 6 replaces it with a root-level file scoped to `apps/web/`, because git reads `lefthook.yml` only from the directory that holds `.git`.
- `AGENTS.md` with the Ultracite code standards
- In `package.json`: `check` and `fix` scripts, `"type": "module"`, and `oxlint`, `oxfmt`, `lefthook` at `latest` plus a pinned `ultracite`. No `prepare` script: with `--skip-install` the lefthook install step that would write it is skipped, and the root `package.json` in Phase 6 owns it instead.

2. Install, pin, and verify:

```bash
npm install
npx ultracite fix     # oxfmt --write + oxlint --fix
npx ultracite check   # oxfmt --check + oxlint
```

Both pass with zero errors; the generated `oxlint.config.ts` needs no tuning. Replace the three `latest` ranges in `devDependencies` with the versions `npm install` resolved (`npm ls oxlint oxfmt lefthook --depth=0`), so the hook and CI run the same binaries. Create `CLAUDE.md` beside `AGENTS.md` as a one-line `@AGENTS.md` import (a symlink works on macOS and Linux but not Windows, and a copy drifts as soon as either file is edited). On the first `next dev` run from a coding agent's shell, Next 16.3 appends its managed `nextjs-agent-rules` block to `AGENTS.md`; content outside the markers is preserved, `CLAUDE.md` is left alone when it exists, and nothing is written from a plain terminal.

## Phase 6 prep: Move into apps/web/

From the parent directory of `{{name}}`:

```bash
mkdir -p {{name}}-turbo/apps
mv {{name}} {{name}}-turbo/apps/web
mv {{name}}-turbo {{name}}
```

The app is now at `{{name}}/apps/web/`. Root config files are generated in `{{name}}/` during Phase 6.
