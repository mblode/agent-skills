---
title: Imperative Rule Title (e.g. "Use Smart Quotes, Never Straight")
impact: MEDIUM
tags: tag1, tag2, tag3
---

## Imperative Rule Title (must match frontmatter title)

One short paragraph: what the rule requires and why it matters for readability, professionalism, or rendering. Lead with the requirement, not history.

**Incorrect (one phrase naming what's wrong):**

```css
/* Bad example: CSS or HTML, whichever the rule governs */
body {
  line-height: 20px; /* fixed value, doesn't scale */
}
```

**Correct (one phrase naming what's right):**

```css
/* Good example showing the fix */
body {
  line-height: 1.5; /* unitless, scales with font-size */
}
```

Optional closing line: an edge case, exception, or escalation (e.g. "If bandwidth is constrained, drop bold italic rather than relying on faux rendering.").

<!-- Conventions:
  - impact: one of CRITICAL, HIGH, MEDIUM-HIGH, MEDIUM, LOW-MEDIUM; may differ from the category impact in _sections.md.
  - Filename: <prefix>-<slug>.md where <prefix> is a section ID from _sections.md.
  - Every rule MUST have the **Incorrect**/**Correct** pair; checklist-style rules still show a violating and a conforming example.
  - Optional extras after the pair: a key-characters table (entities/shortcuts) or a "Reference: [name](url)" line.
  - Target length: under 60 lines. -->
