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

Agent says "You should refactor this function" with no explanation of why. User has no way to evaluate the advice: follows it blindly or ignores it entirely. Neither builds trust.

## What goes wrong

Agent responds with a confident directive and nothing else. User cannot tell if advice comes from docs, past conversations, or hallucination. When the advice is wrong once, user stops trusting all future responses because there was never a way to distinguish good answers from bad.

## Detection

**Surfaces:** agent-chat, agent-dashboard

**Auditability:** hybrid

**Static signals:**
1. Find agent output components (`role="assistant"`, `<AssistantMessage>`, `<AiResponse>`).
2. Check for citation, source, reasoning, or thinking child components.
3. Flag output containers with zero rationale children.

**Concrete commands:**
```bash
rg -l 'role.*assistant|AssistantMessage|AiResponse|completion' --type=ts src/
rg -A 15 'role.*assistant|<AssistantMessage|<AiResponse' --type=ts src/ | rg -v 'Citation|Source|Reasoning|Thinking'
```

**Judgment signals:**
- Even if `<Sources>` exists, check whether it's populated vs. always empty.
- A rationale section for some response types but not others is a partial pass.

**False-positive guards:**
- Skip `// ax-audit-ignore:trust-no-confidence-cues`, test, and Storybook files.
- Skip status-only messages ("Done!" confirmations).

## Fix

Add inline rationale: sources, reasoning steps, or a collapsible thinking section.

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
  {completion.reasoning && <ThinkingBlock steps={completion.reasoning} />}
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
