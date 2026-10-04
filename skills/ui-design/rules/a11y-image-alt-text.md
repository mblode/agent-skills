---
title: Match Alt Text to the Image's Role
id: a11y-image-alt-text
category: a11y
defaultTier: release-blocker
detect: static
---

## Match Alt Text to the Image's Role

An informative image's `alt` states what the image tells the reader; a decorative image's `alt` is empty (`alt=""`) so screen readers skip it. An `alt` that names the file, says "image of", or describes a decoration makes a screen reader read noise aloud, and it is also what renders when the image fails to load.

Whether an `alt` exists at all is a write-time lint (`jsx-a11y/alt-text`) and an axe check (`image-alt`); this rule judges the `alt` that is there, which neither tool can.

## Detection

Search for `alt` values that restate the medium, name a file, or describe ornament.

```bash
rg -nP 'alt="(?i:(?:image|picture|photo|graphic|icon) of|[^"]*\.(?:png|jpe?g|svg|webp)|[^"]*(?:decorative|divider|background|spacer|swirl))[^"]*"' -g '*.tsx' -g '*.jsx' -g '*.html' src/
```

The grep misses the subtler failure: an informative image (a chart, a screenshot that carries the point) whose `alt` names the subject but not the finding. Read the `alt` of every chart and screenshot in scope against what the surrounding copy needs it to say.

**Incorrect (chart named but not read; decorative image announced):**

```tsx
<img src="/chart.png" alt="Chart" />
<img src="/divider.svg" alt="decorative swirl divider" />
```

**Correct (purpose described; decorative image silenced):**

```tsx
<img src="/chart.png" alt="Revenue grew 40% from Q1 to Q2" />
<img src="/divider.svg" alt="" />
```
