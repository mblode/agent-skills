# Deploy and Launch

## Contents

- [Phase 7: GitHub setup](#phase-7-github-setup)
- [Phase 7: Vercel deployment](#phase-7-vercel-deployment)
- [Phase 8: Pre-launch checklist](#phase-8-pre-launch-checklist)
- [Validation checklist](#validation-checklist)

---

## Phase 7: GitHub setup

From the project root (`{{name}}/`):

```bash
git init
git add -A
git commit -m "initial commit"
git branch -M main
gh repo create {{repo}} --public --source=. --remote=origin --push
```

Creates the repo and pushes in one step via the GitHub CLI (`gh`). If `gh` is unavailable:

```bash
git remote add origin https://github.com/{{repo}}.git
git push -u origin main
```

`git add -A` is safe here because the tree is fresh and both `.gitignore` files are in place. Confirm `git status` shows no `.next/`, `node_modules/`, or `next-env.d.ts` before committing.

## Phase 7: Vercel deployment

Via the Vercel CLI:

```bash
npx vercel --yes
npx vercel --prod
```

Or via the dashboard:

1. Go to [vercel.com/new](https://vercel.com/new) and add a new project.
2. Import the GitHub repo (`{{repo}}`).
3. Vercel auto-detects the turborepo and Next.js app in `apps/web`.
4. Deploy.

Add custom domain `{{domain}}` (dashboard Settings > Domains, or `npx vercel domains add {{domain}}`).

On a 404 or wrong app, set the project Root Directory to `apps/web` (dashboard Settings > General > Root Directory) and redeploy; Vercel does not always infer the app location in a fresh turborepo.

Optional, once a second workspace exists: add `apps/web/vercel.json` so Vercel skips builds that turbo can prove did not touch the app.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "ignoreCommand": "npx turbo-ignore"
}
```

`turbo-ignore` exits 0 (skip the build) when no file in the workspace or its dependencies changed since the last deploy. Prefix it with a preview guard (`if [ "$VERCEL_ENV" = "preview" ]; then exit 0; fi;`) only if the project deliberately does not build previews.

Verify: `https://{{domain}}` loads the default Next.js page.

## Phase 8: Pre-launch checklist

### Favicon

Generate a favicon package from your source image at [RealFaviconGenerator](https://realfavicongenerator.net/). Its Next.js export drops `favicon.ico`, `icon0.svg`, `icon1.png`, `apple-icon.png`, and `manifest.json` into `apps/web/app/`, and the `web-app-manifest-192x192.png` / `web-app-manifest-512x512.png` files into `apps/web/public/`. Next.js turns the `app/` files into `<link rel="icon">` and `<link rel="apple-touch-icon">` tags through its file conventions; nothing goes in `metadata.icons`.

### OG image

Create in `apps/web/app/`:
- `opengraph-image.png` (1200x630, under 8 MB or the build fails)
- `opengraph-image.alt.txt` (one line of alt text; it becomes `og:image:alt`)

Next.js App Router serves the file as both the Open Graph and the Twitter card image via file-based metadata conventions. A separate `twitter-image.png` is redundant: `twitter:image` falls back to the OG image when the file is absent, and a byte-identical duplicate only doubles the payload. Alternatively, generate the card with code (`opengraph-image.tsx` and `ImageResponse` from `next/og`); `optimise-seo` covers that pattern and the metadata merge rules that decide whether a page keeps its card.

### Skill handoffs

After deployment, run these skills in order:

1. `optimise-seo`: metadata, structured data, sitemap, robots, Core Web Vitals
2. `ui-design` Audit mode: accessibility, typography surface checks, interaction quality, craft polish
3. `ui-animation`: motion easing, timing, gestures, and review rules

## Validation checklist

After all phases, verify:

- [ ] `npm run dev` starts from project root (turbo runs apps/web) and the dev overlay reports no instant-navigation insight on the home route
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` passes lint, format, and type checks from the root
- [ ] `npx lefthook run pre-commit --all-files` passes from the root
- [ ] `apps/web/AGENTS.md` and `apps/web/CLAUDE.md` carry the Next-managed `nextjs-agent-rules` block and are committed
- [ ] `git status` is clean after `npm run dev` (no regenerated files left uncommitted)
- [ ] GitHub repo has initial commit pushed
- [ ] Vercel deployment is live at `{{domain}}`
- [ ] Favicon appears in browser tab
- [ ] OG image renders in social card previews (use https://opengraph.xyz to test)
