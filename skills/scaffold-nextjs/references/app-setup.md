# App Setup Commands

## Contents

- [Phase 2: Create Next.js app](#phase-2-create-nextjs-app)
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

## Phase 3: Install Blode UI components

Blode UI is a third-party shadcn/ui registry at `ui.blode.co`. Use the hosted `@blode` namespace flow.

```bash
npx shadcn@latest init
npx shadcn@latest registry add @blode=https://ui.blode.co/r/{name}.json
npx shadcn@latest add @blode/button
```

Order matters: `registry add` must run before any `add @blode/...` call, or the namespace is unknown and the add fails.

Creates:
- `components.json`: shadcn config plus the Blode registry mapping
- `lib/utils.ts`: `cn()` helper (clsx + tailwind-merge)
- `components/ui/button.tsx`: button from the `ui.blode.co` registry
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

The app is now at `{{name}}/apps/web/`. Next: load `references/turbo-configs.md` and generate root config files in `{{name}}/`.
