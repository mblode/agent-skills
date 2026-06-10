---
title: Agent ignores available context it should use
slug: context-under-contextual
category: context
defaultTier: backlog
surfaces: agent-chat, agent-tool-execution
ax-pattern: Under-contextual (anti-pattern)
detection: hybrid
related: context-memory-not-visible, context-starvation
---

## Agent ignores available context it should use

The system has the user's project history, preferences, recent activity, and team context, but the agent's prompt doesn't include any of it. The agent asks questions it should already know the answer to. Being under-contextual wastes time and makes the agent feel stupid.

## What goes wrong

User opens a project page and asks "help me write a status update." Agent responds: "What project are you working on?" The project name, recent commits, and open tickets are all in the app state, but the prompt ignores them. Every unnecessary question erodes confidence.

## Detection

**Surfaces:** agent-chat, agent-tool-execution

**Auditability:** hybrid

**Static signals:**
1. Catalog available context sources (user profile, project state, recent activity, team info).
2. Find agent prompt/context assembly functions.
3. Check whether available sources are referenced in context injection.
4. Flag significant context sources never passed to the agent.

**Concrete commands:**
```bash
rg '(useUser|useProject|useTeam|useActivity|currentProject|activeWorkspace)' --type=ts -l src/
rg '(buildPrompt|systemPrompt|assembleContext|getAgentContext)' --type=ts -l src/
rg -A 15 '(buildPrompt|assembleContext|getAgentContext)' --type=ts src/
```

**Judgment signals:**
- Would a human assistant in this position already know the answer?
- Is the missing context high-signal (project name, recent activity) or low-signal?

**False-positive guards:**
- Skip files with `// ax-audit-ignore:context-under-contextual`.
- Skip test/Storybook fixtures and generic agent surfaces with no page-specific context.

## Fix

Inject relevant context at session start using the context.md pattern: "What I Know About This User," "What Exists," "Recent Activity." Update dynamically during the session.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent tool execution | fix-this-sprint |
| Agent chat | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
// User is on /projects/acme-redesign but agent gets no project context
export function ProjectAgent() {
  const { sendMessage } = useAgent({ system: "You are a helpful assistant." });
  return <AgentChat onSend={sendMessage} />;
}
```

**Applied (passes):**

```tsx
export function ProjectAgent() {
  const project = useProject();
  const activity = useRecentActivity(project.id);
  const { sendMessage } = useAgent({
    system: `Assistant for ${project.name}. Recent: ${activity.map((a) => a.summary).join("; ")}`,
  });
  return <AgentChat onSend={sendMessage} />;
}
```

## Suppression

```tsx
{/* ax-audit-ignore:context-under-contextual, generic help chat, no page context needed */}
<HelpAgent />
```
