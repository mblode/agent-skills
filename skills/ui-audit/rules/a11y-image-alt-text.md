---
title: Give Every Image a Correct Alt Attribute
impact: CRITICAL
impactDescription: makes images usable to screen readers and when loading fails
tags: accessibility, images, alt-text
---

## Give Every Image a Correct Alt Attribute

Every `<img>` needs an `alt`. Describe the image's purpose for informative images; use an empty `alt=""` for decorative ones so screen readers skip them. A missing `alt` makes the file name get read aloud.

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
