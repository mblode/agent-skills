# Testimonials

Covers: customer quotes, reviews, social proof sections, testimonial cards, quote punctuation, avatars, and attribution.

## Design Rules

- Hanging punctuation for quotes: `relative before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']`
- Bottom-align avatars/names across equal-height cards: `flex flex-col justify-between` per card; wrap quote and attribution in separate elements
- Never add whitespace inside quote `<p>` tags: write `<p>The quote text</p>` not `<p> The quote text </p>` (breaks hanging punctuation)
- Photos follow [avatar rules](./avatars.md) and [placeholder content rules](./placeholder-content.md)
- Use unisex names so random avatars fit any name
