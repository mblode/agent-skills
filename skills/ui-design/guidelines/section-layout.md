# Section Layout

Covers: page sections, constrained containers, centered vs left-aligned layouts, section padding, grids, stacked content alignment.

## Design Rules

- Align left-aligned sections to the page container edge: never narrow `max-w-*` + `mx-auto`; use a page-level `max-w-*` and constrain inner content separately.
- Align containers and boundings that occupy the same proportion across stacked sections: e.g. a 1/2-width card grid and a 1/2-width split with bounding below share the same column edges. Use consistent grid definitions and gap values so edges line up when scrolling.
- Avoid nested max-width on grids/lists that fill their container: if a feature grid or icon list spans the full constrained width, don't add a narrower `max-w-*`; align it to the page container edges, not floating in the middle. Nested `max-w-*` is fine for self-contained units meant to feel bounded (pricing cards, forms, comparison tables, centered media).
- Use a three-step spacing rhythm so grouping reads from the gaps: tightest within a group, more between groups, most between sections (e.g. 8px / 16px / 32-40px). Keep the same jumps across the page, not per-spot gaps.

## Coding Rules

- Two-element pattern for constrained sections: outer handles background and vertical padding, inner handles max-width, centering, and horizontal padding:

  ```html
  <... class="{vertical-padding}">
    <... class="{max-width} mx-auto {horizontal-padding}">
      ...
    </...>
  </...>
  ```

  Apply consistently across all sections so content edges align when scrolling.
