---
title: Blank-canvas surface with no agent-generated starting content
slug: comm-no-generative-momentum
category: comm
defaultTier: backlog
surfaces: agent-chat, agent-config
ax-pattern: Generative Momentum
detection: observational
related: control-over-conversational, context-under-contextual
---

## Blank-canvas surface with no agent-generated starting content

User opens a new document, email, or report. Empty canvas. Blinking cursor. Agent is available but silent. A half-written draft is easier to shape than an empty page, but the agent doesn't offer one.

## What goes wrong

User clicks "New marketing email" in a tool with their brand voice and audience data. Blank editor. Agent sits idle. A contextual draft would have gotten them editing in ten seconds.

## Detection

**Surfaces:** agent-chat, agent-config

**Auditability:** observational

**Judgment signals:**
- Find creation surfaces (new/create routes, empty editors, blank composition areas).
- Check whether agent-generated content or templates are offered on first load.
- Flag blank-canvas surfaces with no generative starting point where the agent has enough context.

**Concrete commands:**
```bash
rg '(/new|/create|/compose|/draft)' --type=ts -l src/
rg '(EmptyState|BlankCanvas|emptyDocument|initialContent:\s*["'"'"']{2})' --type=ts -l src/
rg '(generateDraft|suggestDraft|aiDraft|startWithAI|TemplatePicker)' --type=ts -l src/
```

**False-positive guards:**
- Skip files with `// ax-audit-ignore:comm-no-generative-momentum`.
- Skip test/Storybook fixtures and code editors where blank is the expected state.

## Fix

Offer an agent-generated draft on blank-canvas surfaces: "Start with AI draft" button, template suggestions, or outline. Always let the user dismiss and start from scratch.

## Default tier and overrides

**Defaults to:** `backlog`

| Surface | Tier |
|---|---|
| Agent chat | backlog |
| Agent config | backlog |

## Examples

**Anti-pattern (fails):**

```tsx
export function NewReport() {
  // Agent has project data, metrics, goals: offers nothing
  return <RichTextEditor initialContent="" />;
}
```

**Applied (passes):**

```tsx
export function NewReport() {
  const project = useProject();
  const { suggestion, dismiss } = useAgentSuggestion({
    prompt: `Draft a report outline for ${project.name}`,
  });
  return (
    <div>
      {suggestion && (
        <Banner onAccept={() => editor.setContent(suggestion)} onDismiss={dismiss}>
          Start with AI outline?
        </Banner>)}
      <RichTextEditor ref={editor} />
    </div>
  );
}
```

## Suppression

```tsx
{/* ax-audit-ignore:comm-no-generative-momentum, code editor, blank canvas is intentional */}
<CodeEditor />
```
