---
title: Monospace on everything that is not code
id: slop-mono-overuse
category: slop
defaultTier: backlog
detect: static
related: slop-trending-display-serif, slop-eyebrow-overuse
---

## Monospace on everything that is not code

Labels, nav links, buttons, timestamps, stats, and captions are all set in `font-mono` to make the product look technical. Monospace is a signal: it tells the reader "this is literal, copy it exactly", which is why it works for code, IDs, and keys. Spread across the interface, it stops meaning anything, the code that is actually literal loses its contrast with the copy around it, and the uniform widths slow reading in every label.

## Detection

Count `font-mono` on elements other than `<code>`, `<pre>`, `<kbd>`, and `<samp>`, per file. More than four is the finding.

```bash
rg -oP "<(?!code\b|pre\b|kbd\b|samp\b)[A-Za-z][\w.]*\b[^>]*?className=[\"{\`][^>]*?\bfont-mono\b" -g '*.tsx' -g '*.jsx' src/ \
  | cut -d: -f1 | sort | uniq -c | awk '$1 > 4'
```

Then read what each one holds: confirmed when most are words a person reads rather than values a person copies.

## False positives

- **Tables of IDs, hashes, versions, and keys,** and terminal or log views, where every cell is literal.
- **Developer tools whose brand face is a monospace,** applied by the design system rather than per element.
- **Numbers that need to align** belong in `tabular-nums`, not monospace; when that is the intent, the fix is the swap, not deletion.

## Fix

Keep monospace for literal values and use the body face everywhere else.

```tsx
// before
<span className="font-mono text-xs uppercase">Last deployed</span>
<span className="font-mono">2 hours ago</span>

// after
<span className="text-sm text-muted-foreground">Last deployed 2 hours ago</span>
<code className="font-mono">a1b2c3d</code>
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-mono-overuse, every cell is a hash or key */}
```
