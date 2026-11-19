# Diagnostics that name the fix

The pattern and the reasoning belong to agent-skills `codebase-architecture`, section "Self-explaining failures" in `references/enforcement-ladder.md`: say what is wrong in this repo's terms, the API or owner to use instead, and why when it is not obvious, in one or two sentences an agent can act on mid-edit. This file keeps worked examples.

## Lint messages

| Weak | Names the fix |
|---|---|
| `drizzle-orm` import restricted | "Routers call services; queries live in the module's service.ts." |
| `@org/<project>-db` import restricted | "Only the API and its database package touch the database. Everything else calls the API through @org/<project>-contract." |
| `db.owner` restricted | "Owner handles bypass RLS. Use database.withTenant with the verified organisation ID, or add this file to the allow list in oxlint.config.ts." |
| An icon library restricted | "Icons come from <the house icon package>." |
| `process.env` outside entry points | "Read environment variables through env.ts, which parses them once at startup." |
| An exception list grew | "adds <path> for <rule>. This list only shrinks: fix the code instead of adding the exception." |
| An exception list entry is stale | "<path> now passes <rule>. Delete its line." |
| A banned runner in a script | "Use <house runner> instead of <banned runner>; check-package-manager lists the exceptions and their reasons." |
| `refresh` from `next/cache` restricted | "Wrap the API call in runAction from @/lib/action; it refreshes and returns { error } for the form." |

The RLS message also names the escape hatch and where it lives, so the agent that genuinely needs it changes the allowlist (a reviewed diff) instead of adding a disable comment.

## Beyond lint

- **Types:** name the type so the error message is readable. `AdminActor` in a signature produces a type error naming `AdminActor` (only the `admin` middleware produces one), which points at the fix.
- **Startup checks:** fail fast with the variable and the file to set it in: "DATABASE_URL is missing. Copy apps/api/.env.example to apps/api/.env (bun run setup does this)."
- **Tests that guard invariants:** the failure names the offender and the test says the fix. `schema.test.ts` fails with the list of naive `timestamp` columns by table and column, and the comment above it says every timestamp is `timestamptz` and why.
- **CI scripts:** print the command that fixes it (`bun run fix`, `bun run db:generate`).
- **Doctor:** each failing check prints the command that fixes it (`app-verification`).

## When a message cannot be customised

Some rules (oxlint and ESLint `max-lines`) emit a fixed string. Put the reason and fix in a comment directly above the rule in config: for example "A file an agent can read in one pass. Split by concept, not by line." above `max-lines`.
