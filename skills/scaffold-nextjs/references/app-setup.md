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

This sets up: TypeScript, Tailwind CSS v4, Biome (placeholder — will be replaced by Oxlint + Oxfmt via Ultracite), React Compiler, App Router, Turbopack (default in Next.js 16+), no src/ directory, `@/*` import alias, npm as package manager.

If running interactively, select "No, customize settings" at the defaults prompt, then choose:
- **TypeScript:** Yes
- **Which linter:** Biome (will be replaced by Oxlint + Oxfmt in Phase 5)
- **React Compiler:** Yes
- **Tailwind CSS:** Yes
- **src/ directory:** No
- **App Router:** Yes
- **Import alias:** `@/*`

After creation, verify:

```bash
cd {{name}}
npm run dev
```

Confirm the app loads at `http://localhost:3000`.

## Phase 3: Install Blode UI components

Blode UI is a third-party shadcn/ui registry hosted at `ui.blode.co`. Use the hosted `@blode` namespace flow by default.

```bash
npx shadcn@latest init
npx shadcn@latest registry add @blode=https://ui.blode.co/r/{name}.json
npx shadcn@latest add @blode/button
```

This creates:
- `components.json` — shadcn configuration + Blode registry mapping
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `components/ui/button.tsx` — button from the `ui.blode.co` registry
- CSS variable updates in `app/globals.css`

Icon library requirement:
- Use `blode-icons-react` for all icon imports.
- If any generated file imports `lucide-react`, replace import paths with `blode-icons-react`.

## Phase 4: Install Agentation

```bash
npm install agentation
```

Patch `app/layout.tsx`:

1. Add import at the top:

```tsx
import { Agentation } from "agentation";
```

2. Add the component before `</body>`, wrapped in a dev-only guard:

```tsx
{process.env.NODE_ENV === "development" && <Agentation />}
```

Full layout pattern:

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

Patch `app/layout.tsx`:

```tsx
import { Agentation } from "agentation";
import { GoogleAnalytics } from "@next/third-parties/google";

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
      <GoogleAnalytics gaId="G-XYZ" />
    </html>
  );
}
```

Replace `"G-XYZ"` with your GA4 measurement ID.

## Phase 5: Install Ultracite

1. Delete the Biome config and dependency created by create-next-app:

```bash
rm biome.json
npm uninstall @biomejs/biome
```

2. Run Ultracite init (select "Oxlint + Oxfmt" when prompted for linter):

```bash
npx ultracite@latest init
```

This sets up:
- `.oxlintrc.json` — extending ultracite presets
- `.oxfmtrc.jsonc` — formatting config
- Lefthook pre-commit hook (`lefthook.yml`)

## Phase 6 prep: Move into apps/web/

From the parent directory of `{{name}}`:

```bash
mkdir -p {{name}}-turbo/apps
mv {{name}} {{name}}-turbo/apps/web
mv {{name}}-turbo {{name}}
```

The Next.js app is now at `{{name}}/apps/web/`.

Next: load `references/turbo-configs.md` and generate root config files in `{{name}}/`.
