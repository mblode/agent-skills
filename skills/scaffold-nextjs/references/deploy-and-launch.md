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

This uses the GitHub CLI (`gh`) to create the repo and push in one step. If `gh` is not available, use the manual approach:

```bash
git remote add origin https://github.com/{{repo}}.git
git push -u origin main
```

## Phase 7: Vercel deployment

Using the Vercel CLI:

```bash
npx vercel --yes
npx vercel --prod
```

Or via the dashboard:

1. Go to [vercel.com/new](https://vercel.com/new) and add a new project.
2. Import the GitHub repo (`{{repo}}`).
3. Vercel auto-detects the turborepo and Next.js app in `apps/web`.
4. Deploy.

Then add custom domain: `{{domain}}` (via dashboard Settings > Domains, or `npx vercel domains add {{domain}}`).

Verify: `https://{{domain}}` loads the default Next.js page.

## Phase 8: Pre-launch checklist

### Favicon

1. Open [RealFaviconGenerator](https://realfavicongenerator.net/).
2. Generate a favicon package from your source image.
3. Place the generated files in `apps/web/app/`.

### OG images

Create and place in `apps/web/app/`:
- `opengraph-image.png` (1200x630)
- `twitter-image.png` (1200x630)

Next.js App Router automatically serves these as OG and Twitter card images via file-based metadata conventions. Alternatively, generate images using code (`.js`, `.ts`, `.tsx`).

### Skill handoffs

Run these skills in order after deployment:

1. `optimise-seo` — metadata, structured data, sitemap, robots, Core Web Vitals
2. `ui-audit` — accessibility, typography, interaction quality, craft polish
3. `ui-animation` — motion easing, timing, gestures, and review rules

## Validation checklist

After all phases complete, verify:

- [ ] `npm run dev` starts successfully from project root (turbo runs apps/web)
- [ ] `npm run build` succeeds with no errors
- [ ] `npm run check` passes Ultracite checks
- [ ] `npm run check-types` passes TypeScript checks
- [ ] `prek run --all-files` passes all hooks
- [ ] GitHub repo has the initial commit pushed
- [ ] Vercel deployment is live at `{{domain}}`
- [ ] Favicon appears in browser tab
- [ ] OG image renders in social card previews (use https://opengraph.xyz to test)
