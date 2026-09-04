---
title: Agent output with no rationale or sources
slug: trust-no-confidence-cues
category: trust
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-dashboard
ax-pattern: Confidence Cues
detection: hybrid
related: trust-no-uncertainty-markers
---

## Agent output with no rationale or sources

Agent says "You should refactor this function" with no explanation. User can't evaluate the advice: follows it blindly or ignores it. Neither builds trust.

## What goes wrong

Agent responds with a confident directive and nothing else. User can't tell if it came from docs, past conversations, or hallucination. One wrong answer and they stop trusting all responses, having never had a way to tell good from bad.

## Detection

**Surfaces:** agent-chat, agent-dashboard

**Auditability:** hybrid

**Static signals:**
1. Find agent output components (`role="assistant"`, `<AssistantMessage>`, `<AiResponse>`).
2. Check whether consequential claims expose supporting sources or a concise user-facing rationale, inline or through source components.
3. Flag missing support for a consequential claim, not the absence of a particular child component. Internal reasoning need not be displayed.

**Concrete commands:**
```bash
rg -l 'role.*assistant|AssistantMessage|AiResponse|completion' --type=ts src/
rg -A 15 'role.*assistant|<AssistantMessage|<AiResponse' --type=ts src/ | rg -v 'Citation|Source|Reasoning|Thinking'
rg -n "type === ['\"](reasoning|source-url|source-document)|filter\(.*type === ['\"]text" --type=ts src/
```

**Judgment signals:**
- Even if `<Sources>` exists, check whether it's populated vs. always empty.
- Rationale is needed where it helps assess a consequential recommendation; routine status or self-contained answers need no extra panel.
- Dropping source parts can remove claim support. Omitting private reasoning is not itself a defect; inspect the user-facing explanation and sources.

**False-positive guards:**
- Skip `// ax-audit-ignore:trust-no-confidence-cues`, test, and Storybook files.
- Skip status-only messages ("Done!" confirmations).

## Fix

Expose relevant sources and a concise decision rationale. Do not require private chain-of-thought or a thinking panel.

## Examples

**Anti-pattern (fails):**

```tsx
<div className="agent-response" role="assistant">
  <Markdown>{completion.text}</Markdown>
</div>
```

**Applied (passes):**

```tsx
<div className="agent-response" role="assistant">
  <Markdown>{completion.text}</Markdown>
  {completion.explanation && <p>{completion.explanation}</p>}
  {completion.sources.length > 0 && <CitationList sources={completion.sources} />}
</div>
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent chat | fix-this-sprint |
| Agent config | backlog |
| Agent dashboard | fix-this-sprint |

## Suppression

```tsx
{/* ax-audit-ignore:trust-no-confidence-cues, status-only messages need no rationale */}
<AgentMessage content={statusText} />
```
