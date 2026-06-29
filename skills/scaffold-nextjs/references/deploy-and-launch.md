# Deploy and Launch

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

Verify: `https://{{domain}}` loads the default Next.js page.

## Phase 8: Pre-launch checklist

### Favicon

Generate a favicon package from your source image at [RealFaviconGenerator](https://realfavicongenerator.net/), then place the generated files in `apps/web/app/`.

### OG images

Create in `apps/web/app/`:
- `opengraph-image.png` (1200x630)
- `twitter-image.png` (1200x630)

Next.js App Router serves these as OG and Twitter card images via file-based metadata conventions. Alternatively, generate them with code (`.js`, `.ts`, `.tsx`).

### Skill handoffs

After deployment, run these skills in order:

1. `optimise-seo`: metadata, structured data, sitemap, robots, Core Web Vitals
2. `ui-audit`: accessibility, typography surface checks, interaction quality, craft polish
3. `ui-animation`: motion easing, timing, gestures, and review rules

## Validation checklist

After all phases, verify:

- [ ] `npm run dev` starts from project root (turbo runs apps/web)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` passes Ultracite checks
- [ ] `npm run check-types` passes TypeScript checks
- [ ] `npx lefthook run pre-commit --all-files` passes all hooks
- [ ] GitHub repo has initial commit pushed
- [ ] Vercel deployment is live at `{{domain}}`
- [ ] Favicon appears in browser tab
- [ ] OG image renders in social card previews (use https://opengraph.xyz to test)
