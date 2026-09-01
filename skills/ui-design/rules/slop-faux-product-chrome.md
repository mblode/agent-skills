---
title: Faux product chrome wrapping nothing
id: slop-faux-product-chrome
category: slop
defaultTier: fix-this-sprint
detect: static
related: slop-unverifiable-proof, slop-decoration-no-role
---

## Faux product chrome wrapping nothing

Three coloured dots in a row, a rounded bar with a URL typed into it, a laptop outline around an empty gradient panel: this is a drawing of a product where the product should be. A visitor reads it as a screenshot, leans in to see what the app actually looks like, and finds there is nothing to see. That is a small betrayal on a page whose whole job is to show what you get, and it is worse than showing no image at all, because it spends the visitor's attention and returns nothing. It also costs real bytes and real layout to render a window frame that will never contain a window.

The failure is the frame with nothing inside it. A browser frame around a genuine product screenshot or video is a normal, well-used device.

## Detection

Three opening signals, and one that only ever corroborates. The finding is confirmed when the chrome demonstrably wraps no real content.

```bash
# 1. Traffic-light dot clusters
rg -nP 'rounded-full[^"`]*\bbg-(red|rose|yellow|amber|green|emerald)-[45]00' -g '*.tsx' src/

# 2. Empty styled panels with a fixed height
rg -nUP '(?s)<div[^>]*className="[^"]*\b(h-\d+|h-\[\d+px\]|aspect-)[^"]*"[^>]*/>' -g '*.tsx' src/

# 3. Device and browser frame components
rg -nP '<(Browser|Safari|Chrome|Mac|Window|Device|Phone|iPhone|Laptop|Tablet)\w*(Frame|Mockup|Window|Chrome|Shell)?\b' -g '*.tsx' src/
```

For signal 1, confirm before reporting: the three dots must be **adjacent siblings** (within about three lines of each other, no element between them) and carry **no adjacent text label**. For signals 2 and 3, open the element and confirm it has no `<img>`, `<video>`, `<Image>`, `children`, or real markup inside.

### Corroborating signal: a URL rendered as text

```bash
rg -nP '>\s*(https?://|www\.)[^<{]+<' -g '*.tsx' src/
```

**This cannot open a finding.** Run it only inside a file one of the three signals above already matched, and only to raise confidence that the frame is a browser rather than a device. A URL printed as text is correct in link previews, copy-to-clipboard fields, CLI output, docs examples, and `<code>` samples, and a repository's own base URLs and config constants are string literals everywhere. Nothing greppable separates those from an address bar; only the surrounding frame does, which is why this signal reports through the others and never on its own.

## False positives

Each of these is a legitimate pattern that the raw greps will hit. Confirm against all four before reporting:

- **A status legend is a real red/amber/green cluster.** Uptime pages, build dashboards, and severity keys all render coloured dots. The discriminator is the label: a legend dot sits beside text ("Operational", "Degraded", "P1"). Traffic-light chrome sits beside nothing. Require adjacency **and** the absence of a label before firing.
- **Skeleton loaders are legitimately empty fixed-height panels.** Skip anything with `animate-pulse`, and skip components named `Skeleton`, `Placeholder`, `Shimmer`, `Loading*`, or rendered inside a `Suspense` fallback. An empty grey box that will be filled in 200ms is doing its job.
- **Some products are browser chrome.** A browser extension, a devtool, a design-system documentation site, a screenshot tool, or a tutorial about the address bar all render window furniture as their subject matter. Only fire when the chrome wraps no real content: if the frame contains a live iframe, a product screenshot, a video, or rendered app markup, it is a presentation device and is fine.
- **A URL as text is often correct.** Displayed link previews, copy-to-clipboard fields, CLI output, docs examples, and `<code>` samples all show URLs as text on purpose, and so do a project's own base URLs and config constants. This is why the URL signal corroborates and never opens a finding.

## Fix

Replace the drawing with the thing, or remove the frame.

```tsx
// before: a window that contains nothing
<div className="rounded-lg border shadow-xl">
  <div className="flex gap-2 border-b p-3">
    <span className="size-3 rounded-full bg-red-500" />
    <span className="size-3 rounded-full bg-yellow-500" />
    <span className="size-3 rounded-full bg-green-500" />
    <div className="ml-4 rounded bg-gray-100 px-3 text-xs">app.example.com</div>
  </div>
  <div className="h-96 bg-linear-to-br from-indigo-50 to-white" />
</div>

// after: the frame earns its place by holding a real screenshot
<div className="rounded-lg border shadow-xl">
  <BrowserBar url={liveDemoUrl} />
  <Image src="/screenshots/dashboard.png" alt="The billing dashboard showing this month's invoices" width={1280} height={800} />
</div>
```

If no real screenshot exists yet, ship the section without the mockup. An honest heading and a link to a live demo beat a picture of a product.

## Why this needs a rule

Window chrome is such a common visual idiom in training data that a model reaches for it as page furniture, and generating it costs nothing, whereas noticing that the frame will ship empty requires asking whether the asset behind it actually exists.

## Default tier and overrides

**Defaults to:** `fix-this-sprint`

| Surface | Tier |
|---|---|
| Marketing landing page or pricing page | fix-this-sprint |
| Public product page or app store listing | fix-this-sprint |
| Internal admin tools | backlog |
| Prototype, spike, or design review branch | backlog |

Never a release blocker: it misleads without breaking anything, and the fix usually waits on a real asset.

## Suppression

```tsx
{/* ui-audit-ignore:slop-faux-product-chrome, this product is a browser extension and the chrome is the subject */}
```
