---
title: WebMCP tool registration
impact: MEDIUM
tags: protocols, webmcp, w3c
---

## WebMCP tool registration

WebMCP is a W3C Community Group Draft that lets websites expose structured tools to AI agents via `navigator.modelContext` in the browser. Available in Chrome 146 Canary. Complementary to Anthropic's MCP — WebMCP runs client-side in the browser.

**Failing:**

Site has interactive forms and actions but no WebMCP registration — browser-based agents cannot discover or use them programmatically.

**Passing:**

Declarative (HTML forms annotated for WebMCP) or imperative (JavaScript registration via `navigator.modelContext`) tool registration that exposes site actions to agentic browsers.

This is an emerging standard — implement for forward compatibility. Most value today is for sites already targeted by agentic browsers (ChatGPT browsing, Perplexity Comet).
