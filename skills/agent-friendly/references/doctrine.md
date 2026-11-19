# Worked examples

Examples for Explain mode, keyed to the catalogue sections in SKILL.md. They come from real repos, with names removed. The rules live with their owners; these show what a rule looks like in practice.

## Contents

- 1. Codebase shape
- 2. Enforcement ladder
- 3. Laws
- 4. Verification
- 5. Instructions

## 1. Codebase shape

- **Files, not registries.** A feature adds `features/<name>/entrypoint.ts` and `view.tsx`; the build discovers reserved filenames and the path derives the id and label. Two agents adding two features touch disjoint files.
- **A registry made safe.** Routers are registered in one `router.ts`, but `tsc` fails while a contract procedure has no handler, so a missed registration is a type error rather than a silent gap. A projects registry is checked against the `apps/` folders on every `check`, so the second agent to add an app cannot forget the entry.
- **One name everywhere.** `apps/<name>` is package `@org/<name>` and deploy project `<name>`; the generator rejects a name that would not fit `<name>-staging` in a DNS label and says so.
- **One writer.** Tenant data is written only through a tenant-scoped transaction inside the module's `service.ts`; routers and workflows cannot import the query builder.
- **History comments.** "Per review, never call X directly" becomes the rule agents cite for a workaround. The fix is a port that is the only way to call X, with a restricted import whose message names it; the history stays in git.

## 2. Enforcement ladder

| Rung | Example |
|---|---|
| Laws | "No query inside a tenant scope for `a` returns tenant `b`'s rows", as a property over two generated tenants |
| Codebase | An admin actor type is produced only by the admin middleware, so a router that skips it fails `tsc` |
| Static analysis | Lint bans the database package outside the API, the ORM in routers, and the RLS-bypassing handle outside an allowlist |
| Guard scripts | Exception lists diffed against the merge base: an added entry fails, a stale one fails |
| Rules and review | `REVIEW.md` blocks one-caller abstractions and mock-asserting tests |
| Style guide | The backlog of prose rules still to promote, each ranked by how often it was broken |

Guards by when they fire: the post-edit hook (format and lint `--fix`, findings returned on the same turn), pre-push (`check:changed`, a few seconds), CI (one required check), nightly (uncached tests, whole-repo lint, formal checks).

## 3. Laws

- **Tenancy:** a property generates two tenants and a random sequence of service calls and asserts no call made as `a` returns or changes `b`'s rows.
- **Idempotency:** applying a workflow step twice with one idempotency key leaves the same state as applying it once.
- **Repo promise:** "no app deploys main from git directly" is a census over every deploy config, with a planted mutant config that must fail it.
- **Sync engine:** a TLA+ spec with two clients, reordering and reconnects asserts every client converges to the server sequence.

## 4. Verification

- **Proof that fails empty.** A verify run that executed zero checks once reported green for a whole PR. The receipt now fails when nothing ran, when HEAD moved during the run, or when a browser run retried.
- **Worktree slots.** Each linked worktree gets its own ports and database from a slot file; one with no slot is refused rather than silently sharing the main database.
- **Incident tests.** A test helper inherited `GIT_DIR`, marked the checkout bare and pushed fixture commits to the real main branch. A test preload now strips git variables and allows only the file protocol, and a test proves it.
- **Repro first.** A bug report with only a screenshot is reproduced, the root cause and the untested case are named, and the handoff ends with "write a failing test, then fix it."

## 5. Instructions

- **Verify with limits.** An app's AGENTS.md says: "`bun run verify` proves the API contract and the tenant test. It does not prove real sign-in or email delivery." An agent then reports those as unverified instead of claiming the feature works.
- **Write-back.** A person corrected the same date-format mistake twice; the second time became a dated line in the lessons log, and the weekly pass turned it into a lint rule and deleted the line.
