---
title: Preserve Visible Focus States
id: interaction-focus-visible
category: interaction
defaultTier: release-blocker
detect: static
---

## Preserve Visible Focus States

Never remove outlines without a clear `:focus-visible` replacement. With the outline gone, keyboard users cannot see where they are and the interface stops being navigable.

## Detection

Find files that remove the outline and never define a `:focus-visible` replacement anywhere.

```bash
rg -lP 'outline:\s*(none|0)|\boutline-(none|hidden)\b' -g '*.css' -g '*.tsx' -g '*.jsx' src/ \
| xargs -r rg --files-without-match -P 'focus-visible'
```

Tailwind v4 split the old utility: `outline-none` now sets `outline-style: none` for real, and `outline-hidden` keeps a transparent outline so forced-colors mode still draws one. Either is a finding without a `focus-visible:` replacement. `outline-hidden` on a container focused programmatically with `tabIndex={-1}` (a modal panel, a scroll region) matches but has no ring to show and is not a finding. The file-level pairing also cuts the other way: one `focus-visible` rule hides an unrelated outline removal in the same file, so read each hit rather than trusting the file list.

**Incorrect (focus removed):**

```css
button:focus {
  outline: none;
}
```

**Correct (high-contrast focus ring):**

```css
button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```
