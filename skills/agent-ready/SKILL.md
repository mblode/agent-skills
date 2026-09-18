---
name: agent-ready
description: Implements agent-readiness on public sites and docs from Mintlify Agent Score, AFDocs, Is Agentic, and Is It Agent Ready reports. Covers llms.txt, markdown negotiation, OpenAPI errors, rate-limit headers, MCP discovery, and robots Link headers. Use when asked to "make this agent-ready", "improve Agent Score", "fix llms.txt coverage", or when a pasted isitagentready, is-agentic, or mintlify/score report is the brief. For docs prose use docs-writing; for CLI/SDK ergonomics use dx-audit; for agentic product UX use ax-audit; for crawler policy and Next.js markdown routes use seo.
---

# Agent Ready

Turn a public agent-readiness score into shipped, verified HTTP and docs changes.

- **IS:** ingesting Mintlify Agent Score / AFDocs, [Is Agentic](https://is-agentic.com/), or [Is It Agent Ready](https://isitagentready.com/) findings, inspecting the repo, implementing the matching protocols, adding tests, and verifying live responses.
- **IS NOT:** rewriting docs prose (`docs-writing`), package/CLI/SDK ergonomics (`dx-audit`), whether an in-product agent can be trusted (`ax-audit`), or search ranking, crawler policy, and Next.js `llms.txt`/markdown routes (`seo`). Do not vendor [vercel-labs/is-agentic](https://github.com/vercel-labs/is-agentic); that skill retrieves reports. This one implements the product.

## Contents

- [Workflow](#workflow)
- [Reference files](#reference-files)
- [Priority](#priority)
- [Output](#output)
- [Gotchas](#gotchas)
- [Related skills](#related-skills)
- [Sources](#sources)

## Workflow

```text
Agent-ready progress:
- [ ] Step 1: Ingest the report (or run scanners against the public URL)
- [ ] Step 2: Inspect the existing codebase before any edit
- [ ] Step 3: Map each finding to a real surface; skip surfaces the product does not offer
- [ ] Step 4: Load the matching reference and implement failures, then warnings. For Next.js App Router `llms.txt` and markdown routes, load `seo` (that skill's `nextjs-implementation.md` and `answer-engines.md`) instead of a second recipe.
- [ ] Step 5: Add or update tests for every behavior you change
- [ ] Step 6: Verify every public endpoint and machine-readable file you touched
- [ ] Step 7: Report changes, quoted verification, and remaining product decisions
```

A pasted scorecard is the spec. If none is present and the user named a public URL, gather one:

```bash
npx afdocs check <docs-url> --format scorecard --sampling deterministic
npx is-agentic <domain> --json
```

Is It Agent Ready: `POST https://isitagentready.com/api/scan` with `{"url":"<origin>","format":"agent"}`. Prefer the user's pasted report over a new scan when both exist.

Preserve visual design and existing product behavior. Change discovery, representations, headers, and documented contracts, not the feature set.

Local test suites that cannot reach production are safe to run, fix, and rerun. Do not deploy, change DNS, buy a registry name, or write outside the working tree without authorization.

Done when every in-scope failing check has a code or content change (or an explicit skip with reason), tests cover the new behavior, and Step 6 quotes status, `Content-Type`, and the relevant headers or body from the environment you actually hit.

## Reference files

| File | Read when |
|------|-----------|
| [references/docs-afdocs.md](references/docs-afdocs.md) | Mintlify Agent Score, AFDocs, `llms.txt`, `.md` URLs, Accept negotiation, page size, auth gates |
| [references/api-surfaces.md](references/api-surfaces.md) | Is Agentic API findings: JSON errors, OpenAPI, versioning, rate limits, function calling, CLI, MCP |
| [references/site-discovery.md](references/site-discovery.md) | Is It Agent Ready: robots, sitemap, Link headers, DNS-AID, well-known catalogs, bot rules |
| [references/verification.md](references/verification.md) | Step 6: curl recipes and what counts as evidence |

## Priority

1. Failures the product actually has (docs HTML that agents cannot read, HTML error pages on a real API, gated public docs with no alternate path).
2. Warnings on those same surfaces (`llms.txt` coverage, buried directives, wrong `Content-Type`).
3. Recommended checks that match a surface already in the repo (OpenAPI, MCP, OAuth).
4. Emerging extras (commerce protocols, A2A, DNS-AID) only when the product already offers them or the user asked to add them.

A missing MCP card is not a failure on a site that has no MCP server. Do not invent an API, CLI, or payment protocol to chase points.

## Output

Group work by check. For each: evidence from the report, files changed, exact markup or schema added, verification quote, skip reason if N/A.

Finish with remaining items that need a product decision, DNS access, or credentials.

## Gotchas

- `llms.txt` that lists HTML while `.md` twins exist steers agents away from markdown and is scored worse than linking `.md` from the start.
- A directive in `<head>`, nav, or past 50% of the HTML body does not count. Put it in the document body, near the top, server-rendered.
- Returning markdown with `Content-Type: text/plain` or `text/html` is a warn, not a pass. Set `text/markdown; charset=utf-8` and `Vary: Accept`.
- Mentioning a CLI or MCP server in `llms.txt` without a published package or live endpoint is a partial that you cannot fix with copy. Ship it or stop advertising it.
- Empty `/.well-known/` documents and stub OpenAPI files fail typed-schema checks. Advertise only what exists.
- Cross-host redirects for `llms.txt` or docs URLs fail agents that do not follow them. Same-host 3xx, or serve the file on the docs host.
- Coverage fail vs curated index: regenerate from the sitemap when the site intends parity; if the index is intentional, say so and do not pad it with marketing URLs.

## Related skills

- `docs-writing`: page quality after the machine-readable path works
- `seo`: App Router `llms.txt` and markdown routes, sitemaps, robots, crawler policy, and AEO measurement. This skill owns the AFDocs/Is Agentic contract those routes must satisfy.
- `dx-audit`: the CLI or SDK once it exists as a package
- `ax-audit`: in-product agent trust, not public HTTP discovery
- `agents-md`: repo instruction files, not public `llms.txt`

Maintenance only: `evals/evals.json` is for changing this skill, not for a user task.

## Sources

Drew process and check lists from [AFDocs / Agent-Friendly Documentation Spec](https://www.agentdocsspec.com/), [Mintlify Agent Score](https://www.mintlify.com/score), [Is Agentic](https://is-agentic.com/methodology), and [Is It Agent Ready](https://isitagentready.com/llms.txt). Left their scoring UIs and the official Is Agentic retrieve-a-report skill. Authored the inspect-then-implement loop, skip rules for absent surfaces, and verification contract.
