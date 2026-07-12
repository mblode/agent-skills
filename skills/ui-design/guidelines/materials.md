# Materials

Covers: translucent chrome, backdrop-filter layers, material weight as hierarchy, vibrancy text legibility, scroll edge effects, and reduced-transparency fallbacks. Approximates Apple-style materials on the web.

- Build nav bars, toolbars, and sheets as translucent layers, `backdrop-filter: blur() saturate()` over a semi-transparent background, with content scrolling underneath, rather than opaque bars that consume a fixed strip. A bright top border reads as light catching the material.
- Material weight encodes hierarchy: darker, heavier materials separate structural regions (sidebars); lighter materials draw attention to interactive elements (buttons). Never stack a light translucent surface on another translucent surface: legibility collapses.
- Bigger surfaces read as thicker: give them stronger blur and a deeper shadow than small chips. Consider context-aware shadow, heavier over busy or text content for separation, lighter over plain backgrounds.
- Dim to focus, separate to keep flow. A modal task pairs the surface with a dimming scrim and pushes the background back. A parallel, non-blocking panel uses translucency and offset without a scrim so the flow isn't broken. For stacked sheets, progressively dim and push back each parent layer.
- Vibrancy keeps text legible over changing backgrounds. Over blurred or translucent surfaces, don't use flat gray text: use higher contrast, a slightly heavier weight, and a small letter-spacing bump. Put color on a solid layer, not the translucent foreground.
- Scroll edge effects, not hard dividers. Instead of a 1px border under a sticky header, fade a small blur or gradient mask where content meets floating chrome, only where floating UI actually overlaps content.
- Materialize, don't just fade. For glass or blur surfaces, animate blur radius and scale together on enter and exit, so the surface reads as a real material arriving rather than a plain opacity fade.
- Provide fallbacks: `@media (prefers-reduced-transparency: reduce)` raises background opacity and drops the blur; `@media (prefers-contrast: more)` uses a near-solid background with a defined, contrasting border.

```css
.toolbar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(255, 255, 255, 0.4); /* bright top edge = light catching the material */
}

@media (prefers-reduced-transparency: reduce) {
  .toolbar { background: white; backdrop-filter: none; }
}
```
