---
name: architecture
description: Designs module contracts and repo shape, starts from-scratch rebuilds with a walking skeleton and production-eligibility gate, deepens and enforces boundaries, and designs multi-tenant isolation, routing, and custom domains. Use when asked to "design the architecture", "simplify our modules", "start the rebuild", "is this production ready", "isolate tenant data", or "support custom domains". For a feature plan use backlog; for diff review use tidy; for hooks and CI use gates; for a new repo use scaffold.
---

# Architecture

Decide a TypeScript codebase's structure, build it from the foundations out, improve it where change has become expensive, and make it hold. The target is a codebase a reader can hold in their head: few surfaces, one canonical way to do each job, tenant data that cannot leak, and behaviour where you would first look for it.

- **IS:** repo shape, module contracts, request and tenant context, frontend/backend boundaries; architecture briefs and decision records; the walking skeleton, first vertical slice, and production-eligibility gate of a rebuild; domain-informed deepening; boundary checks, contagion markers, and add-a-new-X recipes; tenant identification, isolation, routing, custom domains, and plan limits.
- **IS NOT:** generating a repo from templates (`scaffold`), hooks, CI wiring, verification tiers, cold-clone checks, or PR size limits (`gates`), the AGENTS.md file itself (`gates`), a plan for one feature (`backlog`), a diff review or cleanup (`tidy`), per-tenant SEO content (`seo`), or release mechanics (`ship`).

## Modes

Pick by the problem, not by the artifact, and say which you picked.

| Mode | You are here when | Output |
|------|-------------------|--------|
| **Design** | A new app, service, or surface, and the structure is not decided | An architecture brief |
| **Build** | The stack is agreed and a from-scratch rebuild or first code is about to land | Walking skeleton, one green vertical slice, eligibility ledger, decision records |
| **Deepen** | The code works but change is expensive: concepts scattered, seams leaking, one idea under three names | Ranked opportunities, then one migrated slice |
| **Harden** | The structure is decided and keeps decaying, or agents keep copying the wrong pattern | Boundary checks with negative fixtures, markers, recipes |

**Tenancy is a lens, not a mode.** Whenever one deployment serves several customer organisations, or the task mentions tenants, subdomains, custom domains, white-label, or RLS, run the tenancy workflow alongside the mode.

**Modes compose.** Design ends in Harden and Build, because a contract with no check is a suggestion. Deepen ends in Harden so the new seam cannot decay back. When Deepen and Harden both look right ("agents keep using the old pattern"), prefer Deepen: quarantine only freezes a duplicate that deletion removes.

**When you cannot write to the repo**, each mode degrades to its plan (the brief, the ranked list, the named checks, the eligibility ledger with every row `unknown`). Say which checks remain unproven.

**As simple as possible, no simpler.** Every mode cuts surfaces, concepts, dual paths, and dormant config. The floor never gets cut: validation at trust boundaries, error handling that prevents data loss, tenant isolation, security, accessibility, and observability on anything deployed. A deliberate corner gets a marker naming its ceiling and upgrade path.

## References

Load only when the condition applies.

| Reference | Read when |
|-----------|-----------|
| [references/design.md](references/design.md) | Design mode: constraints, repo shape, module contracts, frontend boundaries, stack defaults, the brief and its convention entries |
| [references/api-design.md](references/api-design.md) | Designing endpoints, module contracts, request context, error shapes, or an agent-facing CLI/SDK surface |
| [references/distributed-correctness.md](references/distributed-correctness.md) | The work provably touches an external system, webhook, queue, outbox, retry, audit trail, or money (confirm before loading in Design) |
| [references/greenfield.md](references/greenfield.md) | Build mode, or judging whether a system is ready for real customer data |
| [references/deepening.md](references/deepening.md) | Deepen mode: vocabulary, opportunity patterns, ranking, output template |
| [references/domain-language.md](references/domain-language.md) | Writing a glossary, resolving naming divergence, or recording any decision (choice, reason, flip condition) |
| [references/boundaries.md](references/boundaries.md) | Harden mode: choosing, landing, and proving boundary, dependency, dead-code, duplication, and generated-contract checks |
| [references/wayfinding.md](references/wayfinding.md) | Agents cannot find things, re-derive the same path, or copy legacy, generated, or dual-path code |
| [references/tenancy.md](references/tenancy.md) | Any tenant work: platform choice, identification, isolation, routing, context propagation, output schema, evidence |
| [references/data-isolation.md](references/data-isolation.md) | Tenant data model, RLS, database roles, schema- or database-per-tenant |
| [references/domains.md](references/domains.md) | Tenant domain strategy, PSL, subdomains, custom-domain onboarding, certificates, DNS troubleshooting |
| [references/platform-vercel.md](references/platform-vercel.md) | Tenancy on Vercel: `proxy.ts` resolution, App Router layout, Global Config, per-tenant static files, caching |
| [references/platform-cloudflare.md](references/platform-cloudflare.md) | Tenancy on Cloudflare: dispatch namespaces, dispatch Worker, isolation modes, per-tenant data primitives |
| [references/plan-limits.md](references/plan-limits.md) | Mapping platform limits to plans or pricing |
| `agents/openai.yaml` | Never during a task: launcher metadata for external runners |

## Workflow by mode

- **Design:** assume the common case for missing constraints and state every assumption; ask only where a wrong guess would restructure the brief (multi-tenancy, a public API). Every contract in the brief names the lint rule, type check, or test that catches its violation. Size the brief to the decisions.
- **Build:** foundations first with few agents, then a walking skeleton, then one vertical slice green end to end, then fan-out. The eligibility gate is pass, fail, or unknown per criterion and cannot be offset by strong scores elsewhere.
- **Deepen:** scope by `git log` hot spots before listing anything; record each opportunity with file paths and a named pattern; check deletion first; rank before designing interfaces; migrate one slice.
- **Harden:** survey what exists (checks that do not gate, gates that cannot fail, dormant config), choose checks by the failure this repo exhibits, land each green using the enforcement ladder, and prove each with a committed negative fixture. A request to add one check stops there; markers and recipes run only when their condition holds. Wiring the check into hooks and CI is `gates`.
- **Tenancy:** decide platform, domain strategy, identification, isolation, routing, context propagation, bindings, domains lifecycle, and plan limits in that order.

## Scope of done

Done is the mode's output plus evidence for every item it claims:

- Every contract names its check. Every installed check passes, fails on its negative fixture with a message naming the fix, and passes again. A check nobody has watched fail is not known to work.
- Every verification claim says which kind it is: cached check, fresh test run (cache disabled), build, or runtime startup. A cached green is not evidence about changed code.
- Where code changed: the repo's lint, typecheck, and affected tests pass, quoted.
- Net simplicity: the net change in files, surfaces, and exported names, with every increase paid for; every new port or layer names its second caller.
- Items that cannot run yet are recorded N/A or `unknown` with the reason, never passed silently.

Pre-approved, because they run locally against disposable state: running lint, typecheck, tests, boundary checks, and codegen; adding fixtures and negative fixtures; migrating a scratch or test database; starting local processes; iterating until green. Ask first before anything that deploys, changes DNS or domains, submits to the PSL, spends money, migrates a shared database, or touches real tenant data.

## Gotchas

- A DAO that accepts a transaction client and then calls the global client runs outside the transaction, so tenant context set with `set_config(..., true)` never applies and RLS sees no tenant. Type DAOs to take the transaction client only, and test a cross-tenant read through the DAO, not just in SQL.
- `FORCE ROW LEVEL SECURITY` binds table owners; superusers and `BYPASSRLS` roles still bypass every policy. An app connecting as the migration role sees every tenant with policies "on".
- Host parsing is not tenant resolution. Resolve only through a verified-domain record, fail closed (404) on an unknown host, and strip inbound `x-tenant-*` headers on every path.
- A boundary script that documents more rules than it enforces reads as coverage. List only rules that have a negative fixture.
- Microservices for a team under five buy a deploy pipeline and on-call surface per service. Start with a modular monorepo.
- App dependencies in a monorepo root hoist silently, so an app builds locally and breaks when deployed alone. Each app owns its deps.
- A `handler`/`service`/`dao` contract without an import rule decays at the first deadline. Add the rule the day you write the contract.
- `"use client"` at page or layout level converts the subtree to client rendering. Push it to leaves.
- `proxy.ts` as the only authorization layer: a matcher-excluded path skips it and Server Functions post to their page's route. Authorize in the handler or Server Function.
- Dual-writing to a database and a queue without an outbox loses or fabricates messages whenever one side commits and the other fails.
- A deepening scan without `git log` hot-spot scoping fills the list with modules nobody touches.
- `jscpd` without `--threshold` exits 0 on any duplication. dependency-cruiser without `options.tsConfig` drops aliased edges and passes. A green step is not a gate until you have watched it fail.
- A hand-rolled shrink-only baseline (`*-ratchet.mjs` plus `*.baseline.json`) reimplements what knip, the linter, dependency-cruiser, and jscpd ship, and the baseline becomes the file people edit for a green run. Never write one.
- A LEGACY marker only in a doc is never seen by an agent that arrived by grep. The marker goes at the top of the frozen file.

## Related skills

- `scaffold`: generate the repo this skill then structures.
- `gates`: hooks, CI, verification tiers, cold-clone checks, and the AGENTS.md that points at this skill's checks.
- `backlog`: a plan for one feature; briefs and decision records from here feed it.
- `tidy`: diff review and diff-scoped cleanup.
- `seo`: per-tenant `robots.txt`, sitemap, canonical, and structured-data content once routing serves them.
- `dx-audit`: the developer-facing surface a package ships outward.

Maintenance only: `evals/evals.json` holds the behavioural scenarios and routing prompts for anyone changing this skill. It never loads during a user task.
