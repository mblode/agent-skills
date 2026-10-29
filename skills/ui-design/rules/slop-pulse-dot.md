---
title: A pulsing dot with nothing live behind it
id: slop-pulse-dot
category: slop
defaultTier: backlog
detect: static
related: slop-decoration-no-role, slop-unverifiable-proof
---

## A pulsing dot with nothing live behind it

A small green dot with a ping ring sits beside "Now in beta", "Live", or "All systems operational", and nothing on the page is live: the label is a hard-coded string and the dot will be pulsing the day the status page is red. A pulse claims that something is happening right now. When nothing is, it is motion spent on decoration, it pulls the eye away from the heading it sits next to on every frame, and it teaches the visitor that this page's signals are costume.

Use the pulse for state that changes: a recording in progress, a connection that is open, a build that is running.

## Detection

A small rounded element with a ping or pulse animation.

```bash
rg -nUP "<(?:span|div)\b(?=[^>]*?\banimate-(?:ping|pulse)\b)(?=[^>]*?\brounded-full\b)(?=[^>]*?\b(?:size-(?:1|1\.5|2|2\.5|3)|h-(?:1|1\.5|2|2\.5|3))(?![\w.-]))[^>]*>" -g '*.tsx' -g '*.jsx' src/
```

For each hit, find what drives it. Confirmed when the dot always renders and the text beside it is a literal string.

## False positives

- **Driven state.** A dot rendered only while `isRecording`, `status === "live"`, or a socket is open reports something real.
- **Skeleton loaders** use `animate-pulse` on larger blocks and avatars; the size guard skips them, so a match above 12px is not this rule.
- **Product mocks that show a real state** of the product (a live cursor, a sync in progress) are showing behaviour, if the product has it.

## Fix

Drop the dot, or bind it to the state it names and keep it still when the state is static.

```tsx
// before
<span className="size-2 animate-ping rounded-full bg-green-500" /> Now in beta

// after
Now in beta
```

## Suppression

```tsx
{/* ui-audit-ignore:slop-pulse-dot, bound to the live recording state */}
```
