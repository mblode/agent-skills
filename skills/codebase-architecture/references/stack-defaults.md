# Stack Defaults

Default baseline; deviate only when a project constraint requires it, and record the deviation in the brief.

This is the most perishable file in the bundle: it is a preference, not a finding, and library choices rot faster than anything else here. **Last reviewed: 2026-08.** Treat it as stale if that date is more than a year old, and confirm the choice against the ecosystem before writing it into a brief.

- Turborepo + npm workspaces.
- Next.js App Router + React.
- Tailwind CSS + shadcn/ui.
- React Hook Form + TanStack Query.
- ConnectRPC + protobuf types.
- Prisma + Postgres.
- Supabase (auth/storage), Stripe (payments), Resend (email), Twilio (SMS).
- Ultracite with Oxlint + Oxfmt.
- Vitest.
- Deploy: Vercel (web) + Fly.io (API).
