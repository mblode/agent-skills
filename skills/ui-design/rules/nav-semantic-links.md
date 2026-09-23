---
title: Use Semantic Links for Navigation
id: nav-semantic-links
category: nav
defaultTier: fix-this-sprint
detect: static
related: slop-affordance-mismatch, slop-external-arrow-internal-link
---

## Use Semantic Links for Navigation

Navigation should use `<a>` or framework `<Link>`, not click handlers on generic elements. A click handler on a div loses middle-click, open-in-new-tab, copy-link, and the browser's own back behaviour.

A real `<a>` breaks the same promise when it has nowhere to go. `href="#"` jumps the visitor to the top of the page, "Start free trial" pointed at `#pricing` scrolls them to a section that offers the same button again, and `#trial` with no matching `id` does nothing at all. The visitor clicked the one thing the page asked them to click and the page did not move them forward, so they either click again or leave.

## Detection

Find generic elements whose click handler performs a navigation, which is the shape that has no href for the browser to act on.

```bash
rg -nUP '(?s)<(div|span|li)\b[^>]*\bonClick=\{[^}]*(router\.push|navigate\(|location\.href)' -g '*.tsx' -g '*.jsx' src/
```

A card wrapper that widens the hit area around a real nested `<a>` or `<Link>` is legitimate and will not match this pattern, since its handler forwards rather than navigates. If a match does wrap a real link, check whether the handler is a redundant convenience or the only route out.

### Links with no destination

Three shapes, each confirmed by reading the link text and the page around it.

```bash
# 1. Dead links: an href that is only "#"
rg -nP "href=[\"']#[\"']" -g '*.tsx' -g '*.jsx' src/

# 2. Circular CTAs: an action label whose href is an in-page anchor
rg -nUP '<(a|Link)\b(?:=>|[^>])*\bhref="#[^"]*"(?:=>|[^>])*>(?:\s|<[^>]+>)*(Start|Try|Get started|Sign up|Download|Buy|Subscribe|Book|Install)\b' -g '*.tsx' -g '*.jsx' src/

# 3. Dangling anchors: a #fragment with no matching id in the same file
for f in $(rg -l 'href="#[^"]' -g '*.tsx' -g '*.jsx' src/); do
  comm -23 <(rg -oN 'href="#([^"]+)"' -r '$1' "$f" | sort -u) \
           <(rg -oN '\bid="([^"]+)"' -r '$1' "$f" | sort -u) | sed "s|^|$f: #|"
done
```

Signal 2 is a finding when the label promises an action (start a trial, download the app) and the anchor lands on a section rather than on a form that performs it. "See how it works" pointing at `#how-it-works` is a table of contents entry and is correct.

False positives: `href="#main-content"` and other skip links are correct (see `a11y-skip-link-heading-order`). Signal 3 checks one file, so an `id` rendered by an imported section component will look missing; confirm against the rendered page or the component before reporting. A trial CTA that scrolls to an inline sign-up form on the same page is real. `#todo-<purpose>` placeholders left by `markup-from-image.md` are deliberate: report them as open TODOs, which is their job.

**Incorrect (non-semantic navigation, and a link with no destination):**

```tsx
<div onClick={() => router.push('/settings')}>Settings</div>
<a href="#">Start free trial</a>
<a href="#pricing">Start your 14-day trial</a>
```

**Correct (semantic navigation to a real destination):**

```tsx
<Link href="/settings">Settings</Link>
<Link href="/signup">Start free trial</Link>
```

When the destination does not exist yet, do not ship the CTA. A missing route is a product gap to raise, not a slot to fill with `#`.
