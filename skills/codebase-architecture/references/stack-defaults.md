# Stack Defaults

Default baseline; deviate only when a project constraint requires it, and record the deviation in the brief.

This is the most perishable file in the bundle: it is a preference, not a finding, and library choices rot faster than anything else here. **Last reviewed: 2026-09.** Treat it as stale if that date is more than a year old, and confirm the choice against the ecosystem before writing it into a brief.

- Turborepo + npm workspaces.
- Next.js App Router + React. Request interception lives in `proxy.ts` (Next 16 renamed `middleware.ts`; the codemod is `npx @next/codemod@canary middleware-to-proxy .`).
- Tailwind CSS + shadcn/ui.
- React Hook Form + TanStack Query (Connect Query where the API is ConnectRPC).
- ConnectRPC + protobuf types.
- Prisma + Postgres.
- Supabase (auth/storage), Stripe (payments), Resend (email), Twilio (SMS).
- Ultracite preset over Oxlint + Oxfmt, hooks via Lefthook. Guardrail rules in `guardrail-tooling.md` name the Oxlint form first and the ESLint or Biome equivalent where a repo runs those instead.
- Vitest.
- Deploy: Vercel (web) + Fly.io (API).
