---
title: Overlay input affixes on the field
id: forms-input-affix-hit-target
category: forms
defaultTier: backlog
detect: static
related: interaction-target-size, forms-labels-and-autocomplete
---

## Overlay input affixes on the field

A search icon, currency mark, or unit sitting beside the field as a sibling splits the hit target: clicks on the decoration do not focus the input, and the control reads as two widgets. Prefix and suffix decorations belong on top of the text input, with padding so the value does not collide, and they must not steal pointer events.

## Detection

Search for an icon or addon element as a flex sibling of an input, rather than an overlay inside a `relative` wrapper.

```bash
rg -nUP '(?s)<div[^>]*(flex|grid)[^>]*>\s*<(svg|Icon|Search|span)[^>]*>[\s\S]{0,400}<input\b' -g '*.tsx' -g '*.jsx' src/
```

A separate submit button next to a field (search form, OTP paste) is a second control on purpose: skip it. Skip input groups where the addon is itself a `<button>` that performs an action (show password, clear, generate).

**Incorrect (icon beside the field):**

```tsx
<div className="flex items-center gap-2">
  <SearchIcon />
  <input type="search" name="q" />
</div>
```

**Correct (icon overlaid, clicks reach the input):**

```tsx
<div className="relative">
  <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2" />
  <input type="search" name="q" className="w-full pl-9" />
</div>
```
