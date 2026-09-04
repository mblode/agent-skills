# Probe: viewport stress

Narrows the viewport and lengthens the content, then finds what overflowed. `layout-long-content-safety` asks whether a layout survives a long name, a dense table, and a small screen; none of those are answerable from a class string.

## What it measures

At each width: whether the document scrolls horizontally, which element caused it, and which text is clipped without an affordance. Then the same checks again with every text node tripled in length.

320px is not an arbitrary floor. WCAG 1.4.10 requires reflow at 320 CSS px, which is what a 1280px viewport at 400% zoom becomes, so a clean pass at 320 is the reflow criterion met. Test the width; do not try to drive browser zoom.

## Recipe: overflow

```js
for (const width of [320, 360, 768, 1280]) {
  await page.setViewportSize({ width, height: 800 });
  const overflow = await page.evaluate(() => {
    const doc = document.scrollingElement;
    if (doc.scrollWidth <= doc.clientWidth + 1) return null;
    const culprits = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if (getComputedStyle(el).position === 'fixed') continue;
      if (r.right > innerWidth + 1 || r.left < -1) {
        culprits.push({ tag: el.tagName, cls: el.className?.toString().slice(0, 60),
                        right: Math.round(r.right), width: Math.round(r.width) });
      }
    }
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, culprits };
  });
}
```

The culprit list nests: a wide child reports its ancestors too. Take the deepest element in the list as the cause, and report one finding per distinct cause rather than one per element in the chain.

## Recipe: clipped text

```js
const clipped = await page.evaluate(() =>
  [...document.querySelectorAll('body *')].filter((el) => {
    if (!el.firstChild || el.firstChild.nodeType !== Node.TEXT_NODE) return false;
    const s = getComputedStyle(el);
    const cut = el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
    const hidden = s.overflow === 'hidden' || s.overflowX === 'hidden' || s.overflowY === 'hidden';
    const affordance = s.textOverflow === 'ellipsis' || s.webkitLineClamp !== 'none';
    return cut && hidden && !affordance;
  }).map((el) => ({ text: el.innerText.slice(0, 60), cls: el.className?.toString().slice(0, 60) })));
```

Text cut off with no ellipsis and no line clamp is invisible truncation: the user cannot tell there was more. With an ellipsis it is a deliberate pattern, and the finding is only whether the full value is reachable (a title attribute, a tooltip, a details view).

## Recipe: long content

Triple every text node in place and re-run both checks. This is the mechanical form of "does this survive a real customer name":

```js
await page.evaluate(() => {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) if (n.nodeValue.trim()) n.nodeValue = n.nodeValue.trim().repeat(3);
});
```

Mutating the DOM directly outlives one render in most apps, but a re-render restores the original strings. Where the app re-renders on an interval or a subscription, use the pseudo-locale route in `probes/theme-locale-matrix.md` instead, which expands the strings at their source.

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
