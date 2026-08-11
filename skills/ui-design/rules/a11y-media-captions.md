---
title: Caption Video and Transcribe Audio
id: a11y-media-captions
category: a11y
defaultTier: release-blocker
detect: static
---

## Caption Video and Transcribe Audio

Deaf and hard-of-hearing users get nothing from uncaptioned media. Video needs synchronised captions via `<track kind="captions">`; audio-only needs a text transcript. Auto-generated captions alone are not sufficient for meaning-critical media.

**Incorrect (video with no captions track):**

```tsx
<video src="/demo.mp4" controls />
```

**Correct (captions track + transcript link):**

```tsx
<video controls>
  <source src="/demo.mp4" type="video/mp4" />
  <track kind="captions" src="/demo.en.vtt" srcLang="en" label="English" default />
</video>
<a href="/demo-transcript">Read the transcript</a>
```
