---
title: Caption Video and Transcribe Audio
id: a11y-media-captions
category: a11y
defaultTier: release-blocker
detect: static
---

## Caption Video and Transcribe Audio

Deaf and hard-of-hearing users get nothing from uncaptioned media. Video needs synchronised captions via `<track kind="captions">`; audio-only needs a text transcript. Auto-generated captions alone are not sufficient for meaning-critical media.

## Detection

Find files that render `<video>` or `<audio>` and never ship a captions track; a hit is confirmed when the media carries speech or meaning-critical sound.

```bash
rg -lP '<video\b|<audio\b' -g '*.tsx' -g '*.jsx' src/ \
| xargs -r rg --files-without-match -P 'kind="captions"'
```

A muted decorative background loop has no audio to caption and is not a finding. A shared player component that injects its own `<track>` also matches at each call site, so read the player before reporting.

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
