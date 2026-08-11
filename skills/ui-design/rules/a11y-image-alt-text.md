---
title: Give Every Image a Correct Alt Attribute
id: a11y-image-alt-text
category: a11y
defaultTier: release-blocker
detect: static
---

## Give Every Image a Correct Alt Attribute

Every `<img>` needs an `alt`: describe the purpose for informative images, use an empty `alt=""` for decorative ones so screen readers skip them. A missing `alt` makes the file name get read aloud. The `alt` is also what renders when the image itself fails to load.

**Incorrect (missing alt, and decorative image announced):**

```tsx
<img src="/chart.png" />
<img src="/divider.svg" alt="decorative swirl divider" />
```

**Correct (purpose described; decorative image silenced):**

```tsx
<img src="/chart.png" alt="Revenue grew 40% from Q1 to Q2" />
<img src="/divider.svg" alt="" />
```
