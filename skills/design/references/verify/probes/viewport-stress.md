# Probe: viewport stress

Narrows the viewport and lengthens the content, then finds what overflowed. `layout-long-content-safety` asks whether a layout survives a long name, a dense table, and a small screen; none of those are answerable from a class string.

## What it measures

At each width: whether the document scrolls horizontally, which element caused it, and which text is clipped without an affordance. Then the same checks again with every text node tripled in length.

320px is not an arbitrary floor. WCAG 1.4.10 requires reflow at 320 CSS px, which is what a 1280px viewport at 400% zoom becomes, so a clean pass at 320 is the reflow criterion met. Test the width; do not try to drive browser zoom.

## Running it

```bash
node <skill>/scripts/verify/probe.mjs viewport-stress --url <url>   # 320, 360, 768, 1280, then tripled text
```

## What the script does

At 320, 360, 768, and 1280 it records document overflow with the culprits (fixed elements and anything inside a horizontal scroll container excluded), clipped text with no ellipsis or clamp, body and input font sizes, and the viewport meta. Then it triples every text node and re-runs at the narrowest width.

The culprit list nests: a wide child reports its ancestors too. Take the deepest element in the list as the cause, and report one finding per distinct cause rather than one per element in the chain.

Text cut off with no ellipsis and no line clamp is invisible truncation: the user cannot tell there was more. With an ellipsis it is a deliberate pattern, and the finding is only whether the full value is reachable (a title attribute, a tooltip, a details view).

Tripling is the mechanical form of "does this survive a real customer name". Mutating the DOM directly outlives one render in most apps, but a re-render restores the original strings. Where the app re-renders on an interval or a subscription, use the pseudo-locale route in `theme-locale-matrix.md` instead, which expands the strings at their source.

## Reading the result

| Observation | Rule id |
|---|---|
| Horizontal document scroll at any width | `layout-long-content-safety`, `reproduced` |
| Clipped text with no ellipsis or clamp | `layout-long-content-safety` |
| Overflow appears only after tripling | `layout-long-content-safety`, at lower severity: real but content-dependent |
| Page scales rather than reflows, or pinch zoom is blocked | `mobile-viewport-scaling` |
| Body copy computing under 16px at a mobile width | `type-readable-scale`; on an input, `forms-mobile-input-font-size`, since iOS zooms the page on focus below 16px |

## False positives to guard

- **Deliberate horizontal scrollers.** A carousel, a wide data table in its own `overflow-x: auto` container, and a code block are correct. The failure is the *document* scrolling, so check whether the culprit sits inside a scroll container before reporting it.
- **Off-canvas drawers** parked at `translateX(100%)` extend past the right edge by design. Their computed transform tells you; exclude elements whose parent is `overflow: hidden` and whose offset is a whole viewport width.
- **A 1px overflow** is a rounding artefact of fractional layout, not a defect. The `+1` tolerances in the recipes are there for that, and widening them further hides real findings.
- **Headless font substitution.** Headless Chromium ships different default fonts than the developer's machine, so text metrics and wrapping differ. Confirm a clipped-text finding against a capture before reporting it, and prefer the repo's own container image when it has one.
- **Sticky and fixed chrome** is excluded from the culprit list on purpose, because it is positioned relative to the viewport. Check it separately by scrolling content beneath it.

## Evidence to write

`overflow-<width>.json` per width with the culprit chain, plus a full-page capture at every width that failed. The capture is what shows a reader whether the overflow is a stray shadow or half the page.
