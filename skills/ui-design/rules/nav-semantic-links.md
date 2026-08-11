---
title: Use Semantic Links for Navigation
id: nav-semantic-links
category: nav
defaultTier: fix-this-sprint
detect: static
---

## Use Semantic Links for Navigation

Navigation should use `<a>` or framework `<Link>`, not click handlers on generic elements. A click handler on a div loses middle-click, open-in-new-tab, copy-link, and the browser's own back behaviour.

**Incorrect (non-semantic navigation):**

```tsx
<div onClick={() => router.push('/settings')}>Settings</div>
```

**Correct (semantic navigation):**

```tsx
<Link href="/settings">Settings</Link>
```
