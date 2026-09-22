---
title: Keep Mobile Input Text at Readable Size
id: forms-mobile-input-font-size
category: forms
defaultTier: fix-this-sprint
detect: static
---

## Keep Mobile Input Text at Readable Size

Set input text to at least 16px on mobile and avoid autofocus on touch-first flows. iOS zooms the viewport in on any field below 16px and does not zoom back out, leaving the user panned into a form they now have to scroll sideways. Do not stop that zoom with `maximum-scale=1` or `user-scalable=no`: that fails WCAG 1.4.4. The field size is the fix.

## Detection

Search for field text below 16px, both in CSS rules whose selector names a field and in Tailwind `text-xs`/`text-sm` on field elements.

```bash
rg -nUP '\b(?:input|textarea|select)\b[^{}/]*\{[^}]*font-size:\s*(?:0?\.\d+rem|(?<![\d.])(?:\d|1[0-5])(?:\.\d+)?px)|<(?:input|textarea|select|Input|Textarea)\b[^>]*className="[^"]*\btext-(?:xs|sm)\b' -g '*.css' -g '*.tsx' -g '*.jsx' src/
```

A rule scoped to pointer devices (inside `@media (pointer: fine)`, or a desktop-only admin bundle) matches but never reaches iOS Safari. Check the enclosing media query and the surface before reporting.

**Incorrect (tiny field text):**

```css
input,
textarea {
  font-size: 13px;
}
```

**Correct (touch-safe field text):**

```css
input,
textarea,
select {
  font-size: 16px;
}
```
