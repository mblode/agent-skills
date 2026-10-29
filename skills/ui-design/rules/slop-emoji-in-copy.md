---
title: Emoji in interface copy
id: slop-emoji-in-copy
category: slop
defaultTier: backlog
detect: static
related: slop-decoration-no-role, slop-slogan-headings
---

## Emoji in interface copy

"Ship faster 🚀", "✨ Generate summary", "Built for teams 🤝": an emoji sits at the start or end of a heading, button, or feature line to supply the tone the words did not. It renders differently on every platform (Apple, Google, Windows, and Linux draw a different rocket), ignores the product's icon set, colour, and stroke, and a screen reader announces it by name ("rocket"), mid-sentence. One per heading becomes a page that reads like a chat message rather than a product.

Emoji are content when the user wrote them or picks them: chat messages, reactions, status pickers, a custom workspace icon. The rule is about copy the product wrote.

## Detection

An emoji sharing a text run with words, in JSX text or a copy prop.

```bash
rg -nUP "(?<![=-])>[^<{]*?(?:[A-Za-z][^<{]*?[\x{1F300}-\x{1FAFF}\x{2728}\x{26A1}\x{2705}\x{274C}\x{2B50}\x{2764}]|[\x{1F300}-\x{1FAFF}\x{2728}\x{26A1}\x{2705}\x{274C}\x{2B50}\x{2764}]\x{FE0F}?\s*[A-Za-z])|\b(?:title|label|heading|description|subtitle|cta|text)\s*[:=]\s*\{?\s*[\"'\`](?:[^\"'\`\n]*?[A-Za-z][^\"'\`\n]*?[\x{1F300}-\x{1FAFF}\x{2728}\x{26A1}\x{2705}\x{274C}\x{2B50}\x{2764}]|[\x{1F300}-\x{1FAFF}\x{2728}\x{26A1}\x{2705}\x{274C}\x{2B50}\x{2764}]\x{FE0F}?\s*[A-Za-z])" -g '*.tsx' -g '*.jsx' src/
```

A lone emoji in its own element (`<span>👍</span>`) does not match; that is usually a reaction or a picker option.

## False positives

- **User content and its demos.** Chat bubbles, comments, and message examples carry the user's voice; their emoji are data.
- **Emoji pickers, reactions, and status presets** (`{ text: "On vacation", emoji: "🌴" }`) where choosing the emoji is the feature.
- **A brand that uses one emoji as its mark,** consistently, everywhere. That is an identity, not a tell.

## Fix

Say it in words, or use the project's icon component with an accessible label when an icon earns its place.

```tsx
// before
<h1>Ship faster 🚀</h1>
<Button>✨ Generate summary</Button>

// after
<h1>Ship the release the day it is ready</h1>
<Button><SparkleIcon aria-hidden /> Generate summary</Button>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-emoji-in-copy, the brand mark is this emoji */}
```
