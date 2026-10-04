---
title: Agent output with no rationale, sources, or uncertainty gradient
slug: trust-no-confidence-cues
category: trust
defaultTier: fix-this-sprint
surfaces: agent-chat, agent-dashboard
ax-pattern: Confidence Cues
detection: hybrid
related: trust-no-escalation-path, parity-unstructured-tool-output
---

## Agent output with no rationale, sources, or uncertainty gradient

Agent says "You should refactor this function" with no explanation, or renders a well-supported recommendation and a guess identically. The user cannot evaluate either: they follow it blindly or ignore it, and neither builds trust. Two halves, one finding: support (rationale or sources behind a consequential claim) and gradient (a visible difference between what the agent is sure of and what it is guessing).

## What goes wrong

Two recommendations in one response: one from the docs, one a guess. Same font, weight, formatting, no sources. The user treats both as equally reliable; the guess is wrong; now they second-guess every future response. Trust is binary when the interface gives no gradient, and one wrong answer costs the good ones too.

## Detection

**Surfaces:** agent-chat, agent-dashboard

**Auditability:** hybrid. The support half is code-auditable; the gradient half is observational and returns `unknown` on static evidence alone.

**Static signals:**
1. Find agent output components (`role="assistant"`, `<AssistantMessage>`, `<AiResponse>`).
2. Support: check whether consequential claims expose sources or a concise user-facing rationale, inline or through source components. Flag missing support for a consequential claim, not the absence of a particular child component. Internal reasoning need not be displayed.
3. Gradient: check for confidence props (`confidence`, `certainty`, `score`) or uncertainty components, and whether they vary.

**Concrete commands:**
```bash
rg -l 'role.*assistant|AssistantMessage|AiResponse|completion' --type=ts src/
rg -A 15 'role.*assistant|<AssistantMessage|<AiResponse' --type=ts src/ | rg -v 'Citation|Source|Reasoning|Thinking'
rg -n "type === ['\"](reasoning|source-url|source-document)|filter\(.*type === ['\"]text" --type=ts src/
rg 'confidence|certainty|ConfidenceBadge|UncertaintyIndicator' --type=ts src/
```

**Judgment signals:**
- Even if `<Sources>` exists, check whether it is populated or always empty.
- Rationale is needed where it helps assess a consequential recommendation; routine status or self-contained answers need no extra panel.
- Dropping source parts can remove claim support. Omitting private reasoning is not itself a defect; inspect the user-facing explanation and sources.
- A badge always showing "high" is not a gradient: check for actual variation. Hedging in prompt instructions is weaker than a structured indicator but better than nothing.

**False-positive guards:**
- Skip `// ax-audit-ignore:trust-no-confidence-cues`, test, and Storybook files.
- Skip status-only messages ("Done!" confirmations) and deterministic outputs where confidence is always 100%.

## Fix

Expose relevant sources and a concise decision rationale, and mark confidence where it varies (badge, score, or hedging language). Do not require private chain-of-thought or a thinking panel.

## Examples

**Anti-pattern (fails):**

```tsx
<ul>
  {recommendations.map((rec) => (
    <li key={rec.id}>{rec.text}</li>
  ))}
</ul>
```

**Applied (passes):**

```tsx
<ul>
  {recommendations.map((rec) => (
    <li key={rec.id}>
      {rec.text}
      {rec.explanation && <p>{rec.explanation}</p>}
      {rec.sources.length > 0 && <CitationList sources={rec.sources} />}
      <ConfidenceBadge level={rec.confidence > 0.8 ? "high" : "low"} />
    </li>
  ))}
</ul>
```

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent chat | fix-this-sprint |
| Agent config | backlog |
| Agent dashboard | fix-this-sprint |

No tool-execution bump. Hedging in prose changes nothing about what a tool did, and a finding that rests on the observational half should not be the single one that flips a verdict. The blockers on that surface are the gate, its payload, and the escape hatch.

## Suppression

```tsx
{/* ax-audit-ignore:trust-no-confidence-cues, status-only messages need no rationale */}
<AgentMessage content={statusText} />
```
