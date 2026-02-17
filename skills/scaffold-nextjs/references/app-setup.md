# App Setup Commands

## Contents

- [Phase 2: Create Next.js app](#phase-2-create-nextjs-app)
- [Phase 3: Install shadcn/ui](#phase-3-install-shadcnui)
- [Phase 4: Install Agentation](#phase-4-install-agentation)
- [Phase 5: Install Ultracite](#phase-5-install-ultracite)
- [Phase 6 prep: Move into apps/web/](#phase-6-prep-move-into-appsweb)

---

## Phase 2: Create Next.js app

Run non-interactively with all flags:

```bash
npx create-next-app@latest {{name}} --typescript --tailwind --biome --react-compiler --app --no-src-dir --import-alias "@/*" --use-npm
```

This sets up: TypeScript, Tailwind CSS v4, Biome (not ESLint), React Compiler, App Router, Turbopack (default in Next.js 16+), no src/ directory, `@/*` import alias, npm as package manager.

If running interactively, select "No, customize settings" at the defaults prompt, then choose:
- **TypeScript:** Yes
- **Which linter:** Biome
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

## Phase 3: Install shadcn/ui

```bash
npx shadcn@latest init
npx shadcn@latest add --all
```

This creates:
- `components.json` — shadcn configuration
- `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `components/ui/` — all component files
- CSS variable updates in `app/globals.css`

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

## Phase 5: Install Ultracite

1. Delete the Biome config created by create-next-app:

```bash
rm biome.json
```

2. Run Ultracite init:

```bash
npx ultracite@latest init
```

This sets up:
- `biome.jsonc` — extending ultracite presets
- Husky pre-commit hook (`.husky/pre-commit`)
- lint-staged config in `package.json`

## Phase 6 prep: Move into apps/web/

From the parent directory of `{{name}}`:

```bash
mkdir -p {{name}}-turbo/apps
mv {{name}} {{name}}-turbo/apps/web
mv {{name}}-turbo {{name}}
```

The Next.js app is now at `{{name}}/apps/web/`.

Next: load `references/turbo-configs.md` and generate root config files in `{{name}}/`.
