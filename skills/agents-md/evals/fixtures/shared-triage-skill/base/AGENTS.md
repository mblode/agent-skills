# Copper Kettle

Ordering site for a tea subscription. Next.js App Router, TypeScript, Biome.

## Commands

- `npm run dev`: dev server on `localhost:3400`.
- `npm run check`: type-check and lint. Run before every push.
- `npm run build`: production build.

## Conventions

- Server code reports errors through `captureError()` in `src/lib/capture.ts`. Do not call the analytics client directly from a route.
- Prices are integer pence. Format them in components, never in `src/lib`.
- Subscription changes take effect at the next billing date, so a handler that edits a subscription writes `pendingPlan`, not `plan`.

## Error triage

When asked to triage production errors:

1. Fetch the top unresolved error from the last 24 hours from PostHog error tracking, ordered by occurrence count.
2. Read its stack trace and find the first frame under `src/`.
3. Open that file and the `captureError()` call site that reported it, and read the `area` tag to see which team owns it.
4. Reproduce locally with `npm run dev` if the error has a request path.
5. Fix the cause, not the capture call. Do not wrap the failing line in a try/catch that swallows the error.
6. Reply with the error title, occurrence count, owning area, and the fix or the reason it needs a person.

## Skills

Project skills live in `skills/`. Claude Code is set up for this repo through `.mcp.json`; Codex through `.codex/config.toml`.
