# Testimonials

Covers: customer quotes, rotating quotes, reviews, social proof sections, testimonial cards, quote punctuation, avatars, and attribution.

## Design Rules

- Hanging punctuation for quotes: `relative before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']`
- Bottom-align avatars/names across equal-height cards: `flex flex-col justify-between` per card; wrap quote and attribution in separate elements
- Rotating or cycling quotes: show them together unless the rotation is the point. A rotation that runs longer than five seconds needs a pause control (WCAG 2.2.2) and stops under reduced motion. Start every quote and its attribution at the same screen position so the reader can find their place after one cycle, and reserve the height of the longest quote so nothing below jumps (`states-layout-shift`)
- Never add whitespace inside quote `<p>` tags: write `<p>The quote text</p>` not `<p> The quote text </p>` (breaks hanging punctuation)
- Photos follow [avatar rules](./components.md#avatars) and [placeholder content rules](./placeholder-content.md)
- Use unisex names so random avatars fit any name
