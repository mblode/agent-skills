# Agent Readiness Scoring Tools

## Contents

- isitagentready.com
- AFDocs CLI
- Mintlify Agent Score
- Interpreting results
- Quick wins by score range

## isitagentready.com

Cloudflare's free tool that produces a 0-100 agent readiness score.

**URL**: https://isitagentready.com

**Categories checked:**
1. **Discoverability** — robots.txt, sitemap.xml, Link headers (RFC 8288)
2. **Content** — Markdown content negotiation, `<link rel="alternate">` tags
3. **Bot Access Control** — AI bot rules, Content Signals, Web Bot Auth
4. **Capabilities** — Agent Skills index, API Catalog (RFC 9727), MCP Server Card, A2A Agent Card, OAuth discovery, WebMCP
5. **Commerce** — x402 micropayments, Universal Commerce Protocol, Agentic Commerce Protocol

**Score levels:**
- Level 5 (83+): Agent-Native
- Level 4 (70+): Agent-Friendly
- Level 3 (50+): Agent-Aware
- Level 2 (25+): Agent-Visible
- Level 1 (0-24): Agent-Invisible

**Known limitation**: Penalises missing OAuth metadata even when a site intentionally has no authentication. Expect false negatives on fully public sites.

The tool itself exposes an MCP server — agents can scan sites programmatically via the `scan_site` tool.

## AFDocs CLI

The Agent-Friendly Documentation Spec implemented as a CLI tool.

**Install and run:**
```bash
npx afdocs scan https://example.com/docs
```

**7 categories, 23 checks:**

| Category | Checks | Key thresholds |
|----------|--------|----------------|
| Content Discoverability | 7 | llms.txt exists, valid, under 50K, links resolve, links are markdown |
| Markdown Availability | 2 | .md URLs work, Accept: text/markdown returns markdown |
| Page Size & Truncation | 4 | SSR (not SPA shell), pages under 50K, content starts in first 10% |
| Content Structure | 3 | Tabbed content serialises under 50K, headers are descriptive, code fences closed |
| URL Stability | 2 | Proper 404s (no soft 404), same-host redirects only |
| Observability | 3 | 95%+ doc pages in llms.txt, markdown matches HTML, cache hygiene |
| Authentication | 2 | Public content accessible, gated sites offer alternative access |

**Check dependencies**: Some checks only run if prerequisites pass (e.g., `llms-txt-valid` requires `llms-txt-exists`).

**Severity levels**: HIGH (blocks agent access), MEDIUM (degrades quality), LOW (nice-to-have).

## Mintlify Agent Score

Hosted scoring tool built on the AFDocs spec with a weighted composite score.

**URL**: https://www.mintlify.com/score

Enter a docs URL and get a 0-100 score. Top sites score 91-97 (Cloudflare leads at 97).

Uses the same 7 AFDocs categories but produces a single number. Includes a leaderboard by category (AI/Infrastructure/Devtools/Productivity).

## Interpreting Results

Run all three tools and triangulate:

| Tool | Best for | Blind spots |
|------|----------|-------------|
| isitagentready.com | Comprehensive protocol coverage (MCP, A2A, commerce) | Penalises missing auth on public sites |
| AFDocs | Documentation-specific quality (truncation, parity, structure) | Only checks docs, not product pages |
| Mintlify | Quick composite score with leaderboard context | Weighted — may hide individual failures |

## Quick Wins by Score Range

**0-24 (Agent-Invisible) → 50+ (Agent-Aware):**
1. Create `/llms.txt` with site index (30 min)
2. Add Link headers via middleware (15 min)
3. Add AI crawler directives to robots.txt (15 min)
4. Serve `/.well-known/mcp.json` as static JSON (30 min)

**50-69 (Agent-Aware) → 70+ (Agent-Friendly):**
5. Implement content negotiation middleware (2-4 hrs)
6. Add .md URL rewrites (1-2 hrs)
7. Generate llms-full.txt (1-2 hrs)
8. Add Content Signals to robots.txt (15 min)

**70-82 (Agent-Friendly) → 83+ (Agent-Native):**
9. Set up OAuth protected resource metadata (4-8 hrs)
10. Publish Agent Skills index (2-4 hrs)
11. Add API Catalog (1-2 hrs)
12. Implement WebMCP registration (days, emerging standard)
