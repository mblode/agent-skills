# Section Layout

Covers: page sections, constrained containers, centered vs left-aligned layouts, section padding, grids, and stacked content alignment.

## Design Rules

- Left-aligned sections align to page container edge: never narrow `max-w-*` + `mx-auto`; use page-level `max-w-*`, constrain inner content separately
- Align containers and boundings that occupy the same proportion across stacked sections: e.g. a 1/2-width card grid and a 1/2-width split with bounding below it should share the same column edges; use consistent grid definitions and gap values so edges line up when scrolling
- Avoid nested max-width constraints on grids/lists that fill their container: if a feature grid or icon list spans the full constrained width, don't add a narrower `max-w-*` on it; the content should align with the page container edges, not float in the middle. Nested `max-w-*` is fine for self-contained units that are meant to feel bounded (pricing cards, forms, comparison tables, centered media).
- Use a three-step spacing rhythm so grouping reads from the gaps: tightest space within a group, more between groups, most between sections (e.g. 8px / 16px / 32-40px); keep the same jumps across the page rather than picking gaps per spot

## Coding Rules

- Use a two-element pattern for constrained page sections: outer element handles background and vertical padding, inner element handles max-width, centering, and horizontal padding:

  ```html
  <... class="{vertical-padding}">
    <... class="{max-width} mx-auto {horizontal-padding}">
      ...
    </...>
  </...>
  ```

  Apply this consistently across all sections on a landing page so content edges align when scrolling.
