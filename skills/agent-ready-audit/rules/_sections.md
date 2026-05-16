# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Content Discovery (disc)

**Impact:** CRITICAL
**Description:** llms.txt, llms-full.txt, HTTP Link headers, and HTML directives that help AI agents discover what content exists and where to find it.

## 2. Markdown Delivery (md)

**Impact:** CRITICAL
**Description:** Content negotiation, .md URL endpoints, server-side rendering, and page size limits that ensure AI agents receive clean, parseable content instead of HTML soup.

## 3. Bot Policy (bot)

**Impact:** HIGH
**Description:** robots.txt AI-specific directives, crawler segmentation between training and retrieval bots, content signals, and authentication policies that control how AI systems access the site.

## 4. Agent Protocols (proto)

**Impact:** HIGH
**Description:** MCP server discovery, OAuth protected resource metadata, Agent Skills index, API Catalog, A2A Agent Card, and WebMCP registration that enable programmatic agent interaction.

## 5. Structured Data (schema)

**Impact:** MEDIUM-HIGH
**Description:** JSON-LD schema types, action schemas, knowledge graph patterns, and OpenGraph completeness that help AI agents understand page content and available interactions.

## 6. Content Quality (quality)

**Impact:** MEDIUM
**Description:** Semantic HTML, heading hierarchy, content positioning, code fence validity, and markdown-HTML parity that affect how cleanly AI agents can parse and extract page content.
