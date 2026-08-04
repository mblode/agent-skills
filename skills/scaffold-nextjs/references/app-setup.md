# App Setup Commands

## Contents

- [Phase 2: Create Next.js app](#phase-2-create-nextjs-app)
- [Phase 2.1: Upgrade to TypeScript 7](#phase-21-upgrade-to-typescript-7)
- [Phase 2.2: Turn on Instant Navigations](#phase-22-turn-on-instant-navigations)
- [Phase 3: Install Blode UI components](#phase-3-install-blode-ui-components)
- [Phase 4: Install Agentation](#phase-4-install-agentation)
- [Phase 4.1: Add Google Analytics (optional)](#phase-41-add-google-analytics-optional)
- [Phase 5: Install Ultracite](#phase-5-install-ultracite)
- [Phase 6 prep: Move into apps/web/](#phase-6-prep-move-into-appsweb)

---

## Phase 2: Create Next.js app

Run non-interactively with all flags:

```bash
npx create-next-app@latest {{name}} --typescript --tailwind --biome --react-compiler --app --no-src-dir --import-alias "@/*" --use-npm
```

Sets up: TypeScript, Tailwind CSS v4, Biome (placeholder, replaced by Oxlint + Oxfmt via Ultracite in Phase 5), React Compiler, App Router, Turbopack (default in Next.js 16+), no src/ directory, `@/*` import alias, npm.

If prompted interactively, select "No, customize settings" and match the flag values above.

After creation, verify:

```bash
cd {{name}}
npm run dev
```

Confirm the app loads at `http://localhost:3000`.

## Phase 2.1: Upgrade to TypeScript 7

`create-next-app` installs TypeScript 5. Move to TypeScript 7:

```bash
npm install -D typescript@^7
```

That is the whole step. No config goes with it: since 16.3, `next build` runs the
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
  experimental: {
    // Runs the React Compiler inside Turbopack instead of Babel.
    turbopackRustReactCompiler: true,
  },
};

export default nextConfig;
```

`partialPrefetching` only works with `cacheComponents`, so the two ship together
or not at all.

With the Rust compiler on, `babel-plugin-react-compiler` is not needed. Leave it
out, and add no other Babel transform: any Babel step in the pipeline gives back
most of what the Rust path saves.

What the flags change, and what to write from day one:
- Nothing is cached unless a function says `'use cache'`. Add it at the data
  access, with `cacheLife` for how long.
- Never `await params` or `searchParams` at the top of a page. Pass the promise
  into a `<Suspense>`-wrapped child and await it there, or the shell is tied to
  one URL.
- Same for `cookies()` and `headers()`: read them inside a boundary so the rest
  of the page still prerenders.
- No `new Date()`, `Date.now()`, `Math.random()` or `crypto.randomUUID()` during
  render, in server or client components. These are hard build errors. Stamp the
  value at build time in `next.config.ts` via `env`, or read it after hydration
  in a `useEffect`.
- `useSearchParams` always needs a `<Suspense>` boundary.

Verify with `next dev` rather than the build. Instant navigation insights are
development-only and never fail `next build`, so a green build is not evidence.
Load each route and confirm the dev overlay reports none.

## Phase 3: Install Blode UI components

Blode UI is a third-party shadcn/ui registry served at `blode.co/ui` (the `ui.blode.co` subdomain 301s there). Use the hosted `@blode` namespace flow.

```bash
npx shadcn@latest init
npx shadcn@latest registry add @blode=https://blode.co/ui/r/{name}.json
npx shadcn@latest add @blode/button
```

Order matters: `registry add` must run before any `add @blode/...` call, or the namespace is unknown and the add fails.

Creates:
- `components.json`: shadcn config plus the Blode registry mapping
- `lib/utils.ts`: `cn()` helper (clsx + tailwind-merge)
- `components/ui/button.tsx`: button from the Blode registry
- CSS variable updates in `app/globals.css`

Icons: use `blode-icons-react` for all icon imports. If any generated file imports `lucide-react`, replace the import paths with `blode-icons-react`.

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

Add two lines to the Phase 4 layout: the import, and the `<GoogleAnalytics>` element as a sibling of `<body>` (inside `<html>`, after `</body>`):

```tsx
import { GoogleAnalytics } from "@next/third-parties/google";
// ...inside <html>, after </body>:
<GoogleAnalytics gaId="G-XYZ" />
```

Replace `"G-XYZ"` with your GA4 measurement ID.

## Phase 5: Install Ultracite

1. Delete the Biome config and dependency from create-next-app:

```bash
rm biome.json
npm uninstall @biomejs/biome
```

2. Run Ultracite init non-interactively (Oxlint + Oxfmt + Lefthook):

```bash
npx ultracite@latest init \
  --linter oxlint \
  --frameworks next react \
  --integrations lefthook \
  --pm npm \
  --skip-install \
  --quiet
```

Flag notes:
- `--frameworks` takes space-separated values (`next react`), not commas; commas fail validation.
- `--skip-install` lets you review the generated `package.json` changes before installing.
- Omit `--quiet` to confirm the generated file list interactively.

Sets up:
- `oxlint.config.ts`: extends `ultracite/oxlint/{core,next,react}`
- `oxfmt.config.ts`: extends `ultracite/oxfmt`
- `lefthook.yml`: pre-commit hook running `npx ultracite fix` on staged JS/TS/JSON/CSS with `stage_fixed: true`
- Adds `oxlint`, `oxfmt`, `lefthook` to devDependencies and `prepare: lefthook install` to scripts

3. Install and verify:

```bash
npm install
npx ultracite fix     # oxfmt --write + oxlint --fix
npx ultracite check   # oxfmt --check + oxlint
```

Both pass with zero errors; the generated `oxlint.config.ts` needs no tuning. AGENTS.md is generated automatically with the Ultracite code-standards reference; create `CLAUDE.md` as a symlink or one-line `@AGENTS.md` reference.

## Phase 6 prep: Move into apps/web/

From the parent directory of `{{name}}`:

```bash
mkdir -p {{name}}-turbo/apps
mv {{name}} {{name}}-turbo/apps/web
mv {{name}}-turbo {{name}}
```

The app is now at `{{name}}/apps/web/`. Root config files are generated in `{{name}}/` during Phase 6.
