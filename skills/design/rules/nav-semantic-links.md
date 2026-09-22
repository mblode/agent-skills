---
title: Use Semantic Links for Navigation
id: nav-semantic-links
category: nav
defaultTier: fix-this-sprint
detect: static
---

## Use Semantic Links for Navigation

Navigation should use `<a>` or framework `<Link>`, not click handlers on generic elements. A click handler on a div loses middle-click, open-in-new-tab, copy-link, and the browser's own back behaviour.

## Detection

Find generic elements whose click handler performs a navigation, which is the shape that has no href for the browser to act on.

```bash
rg -nUP '(?s)<(div|span|li)\b[^>]*\bonClick=\{[^}]*(router\.push|navigate\(|location\.href)' -g '*.tsx' -g '*.jsx' src/
```

A card wrapper that widens the hit area around a real nested `<a>` or `<Link>` is legitimate and will not match this pattern, since its handler forwards rather than navigates. If a match does wrap a real link, check whether the handler is a redundant convenience or the only route out.

**Incorrect (non-semantic navigation):**

```tsx
<div onClick={() => router.push('/settings')}>Settings</div>
```

**Correct (semantic navigation):**

```tsx
<Link href="/settings">Settings</Link>
```
