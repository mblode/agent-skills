---
name: agent-ready-audit
description: Audits websites for AI agent readiness across llms.txt, markdown content negotiation, MCP server discovery, robots.txt AI directives, structured data for LLMs, and agent protocol compliance. 32 rules across 6 categories covering content discovery, markdown delivery, bot policy, agent protocols, structured data, and content quality. Use when auditing a site for AI readiness, implementing llms.txt, setting up MCP discovery, configuring robots.txt for AI crawlers, improving isitagentready.com score, raising Mintlify agent score, afdocs score, or asking "make my site agent-ready", "how do AI agents see my site", "audit agent readiness", "add llms.txt", "set up MCP discovery", "improve agent score".
---

# Agent-Ready Audit

32 rules across 6 categories for AI agent readiness. Complements `optimise-seo` (traditional SEO foundations) — run that first, then this skill for the AI-agent-specific layer.

## Reference Files

| File | Read When |
|------|-----------|
| `references/llms-txt-guide.md` | Implementing llms.txt and llms-full.txt from scratch |
| `references/markdown-delivery.md` | Setting up content negotiation, .md URLs, or framework-specific patterns |
| `references/mcp-discovery.md` | Configuring MCP server card, OAuth discovery, or Agent Skills index |
| `references/ai-crawler-policy.md` | Writing AI-specific robots.txt directives and crawler segmentation |
| `references/scoring-tools.md` | Running isitagentready.com, afdocs CLI, or Mintlify agent score |

## Audit Workflow

Copy and track this checklist:

```text
Agent-ready audit progress:
- [ ] Step 1: Determine site type and scope
- [ ] Step 2: Run external scoring tools
- [ ] Step 3: Audit by category (highest priority first)
- [ ] Step 4: Report findings
- [ ] Step 5: Implement fixes
- [ ] Step 6: Re-score and verify
```

### Step 1: Determine site type and scope

Classify the site:
- **Documentation site** — prioritise Content Discovery + Markdown Delivery (Tranche 1)
- **Product/SaaS app** — prioritise Agent Protocols + Structured Data (Tranche 1)
- **Marketing/content site** — prioritise Bot Policy + Content Quality (Tranche 1)
- **API provider** — prioritise Agent Protocols + Bot Policy (Tranche 1)

### Step 2: Run external scoring tools

Read `references/scoring-tools.md` for details on each tool.

1. **isitagentready.com** — Cloudflare's 0-100 score across 5 categories (discoverability, content, bot access, capabilities, commerce)
2. **afdocs CLI** — 23 checks across 7 categories from the Agent-Friendly Documentation Spec
3. **Mintlify agent score** — weighted composite score based on AFDocs checks

Baseline the current score before making changes.

### Step 3: Audit by category

Work through categories in priority order. Load only the rule files relevant to the current scope.

- Category map and impact rationale: `rules/_sections.md`
- Rule-level guidance and examples: `rules/<prefix>-*.md`

### Step 4: Report findings

Use the output contract below. Group findings by category, highest severity first.

### Step 5: Implement fixes

Load the relevant reference file for implementation guidance:
- Content Discovery failures → `references/llms-txt-guide.md`
- Markdown Delivery failures → `references/markdown-delivery.md`
- Agent Protocol failures → `references/mcp-discovery.md`
- Bot Policy failures → `references/ai-crawler-policy.md`

### Step 6: Re-score and verify

Re-run the scoring tools from Step 2. Compare before/after. Target:
- isitagentready.com: 70+ (Level 4) for docs sites, 50+ for product sites
- AFDocs: all High-impact checks passing
- Mintlify: 80+

## Rule Categories by Priority

| Priority | Category | Impact | Prefix | Rules |
|----------|----------|--------|--------|-------|
| 1 | Content Discovery | CRITICAL | `disc-` | 6 |
| 2 | Markdown Delivery | CRITICAL | `md-` | 5 |
| 3 | Bot Policy | HIGH | `bot-` | 5 |
| 4 | Agent Protocols | HIGH | `proto-` | 6 |
| 5 | Structured Data | MEDIUM-HIGH | `schema-` | 5 |
| 6 | Content Quality | MEDIUM | `quality-` | 5 |

## Quick Reference

Read only what is needed for the current scope:
- Category map and impact rationale: `rules/_sections.md`
- Rule-level guidance and examples: `rules/<prefix>-*.md`

Each rule file contains:
- Why the rule matters for AI agents specifically
- Failing example
- Passing example

## Review Output Contract

Report findings in this format:

```markdown
## Agent-Ready Audit Report

**Site**: [URL]
**Date**: [date]
**Scores**: isitagentready [X/100] | AFDocs [pass/warn/fail summary] | Mintlify [X/100]

### Findings

#### [CRITICAL] disc-llms-txt-exists — /llms.txt not found
**Issue**: No llms.txt file at the root URL.
**Fix**: Create /llms.txt following the llmstxt.org specification. See references/llms-txt-guide.md.

#### [HIGH] bot-crawler-segmentation — No AI crawler segmentation
**Issue**: robots.txt treats all AI crawlers identically.
**Fix**: Add separate directives for training vs retrieval crawlers. See references/ai-crawler-policy.md.

### Summary
- CRITICAL: N findings
- HIGH: N findings
- MEDIUM-HIGH: N findings
- MEDIUM: N findings
- Total: N/32 rules passing
```

## Triage by Effort

When reporting, tag each fix with estimated effort:

| Tag | Meaning | Examples |
|-----|---------|----------|
| **Quick win** | < 1 hour, config-only | llms.txt, Link headers, robots.txt directives |
| **Small PR** | 1-4 hours, code change | Content negotiation middleware, .md URL rewrites |
| **Project** | Days-weeks, cross-team | MCP server, OAuth flow, WebMCP registration |

## Anti-Rationalizations

| Excuse | Rebuttal |
|--------|----------|
| "Nobody reads llms.txt yet." | Developer tools (Cursor, Claude Code) already consume it. 844K+ sites adopted. Low effort, high optionality. |
| "We'll add MCP later." | A server card at /.well-known/mcp.json is a static JSON file — ship the discovery endpoint now, add tools later. |
| "Our robots.txt is fine." | Traditional robots.txt doesn't distinguish training from retrieval crawlers. Blocking GPTBot doesn't block OAI-SearchBot. |
| "Markdown negotiation is niche." | 45% of Mintlify docs traffic now comes from AI agents. Claude Code generates more doc traffic than Chrome on Windows. |
| "Structured data is just for SEO." | Action schemas (SearchAction, BuyAction) give agents executable entry points. Products with action schema see 3.2x more AI citations. |

## Gotchas

- isitagentready.com penalises missing OAuth metadata even when a site intentionally has no authentication — expect false negatives on public-only sites.
- `.md` URL convention conflicts with usernames/slugs that end in `.md` (e.g., `linktr.ee/juliarose.md` is a real profile, not a markdown endpoint). Use content negotiation via Accept header instead for user-generated URL spaces.
- `/.well-known/mcp.json` (SEP-2127) and `/.well-known/mcp/server-card.json` (SEP-1649) are competing paths — implement both until the spec consolidates.
- WebMCP (`navigator.modelContext`) is a W3C Community Group Draft available in Chrome 146 Canary — not the same as Anthropic's MCP. They are complementary protocols.
- robots.txt is a policy signal, not a security mechanism. It does not prevent scraping — layer with rate limiting and authentication for real protection.
- `Vary: Accept` header is required on any response that does content negotiation — without it, CDNs cache one format and serve it to everyone (cache poisoning).
- Content Signals in robots.txt (ai-usage-preferences) have near-zero adoption (4% of top 200K sites) but are checked by isitagentready.com — include them for score, not enforcement.
- JSON-LD injected via client-side JavaScript is invisible to AI crawlers — always render server-side.

## Related Skills

- `optimise-seo` — traditional SEO foundations (sitemaps, meta tags, CWV, canonicals)
- `agent-native` — designing apps where agents are first-class users with tool parity
- `agents-md` — auditing CLAUDE.md/AGENTS.md instruction files
