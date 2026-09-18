# Border Radius

Covers: rounded cards, panels, buttons, images, screenshots, nested surfaces, any UI element where radius consistency matters.

- Use concentric radii on closely nested rounded elements: define the relationship with CSS variables and `calc()` so the math is enforced, e.g. `rounded-(--radius) p-(--padding)` on the outer element, `rounded-[calc(var(--radius)-var(--padding))]` on the inner. Past roughly 24px of padding, or when the inset is deliberately asymmetric, treat the layers as independent surfaces and keep each component's radius token instead of forcing the math.
- Use `min()` with viewport units for image/screenshot radii instead of fixed `rounded-*`: e.g. `rounded-[min(1vw,12px)]`; match the intended value at full desktop width and scale down proportionally as the screen shrinks.
- Keep one radius family per view: don't mix rounded and sharp corners on sibling elements; pick a small set of radii (controls, cards, fullscreen surfaces) and apply them consistently.
- Continuous corners (squircles) belong on app icons, avatars, and iOS-like tiles where a circular arc looks pinched at large sizes. Use `corner-shape: squircle` where supported, otherwise a superellipse mask. Nested cards, inputs, and buttons stay on CSS `border-radius` so concentric math still holds. Do not mix squircle and circular-arc siblings in one toolbar.
