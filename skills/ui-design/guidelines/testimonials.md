# Testimonials

Covers: customer quotes, reviews, social proof sections, testimonial cards, quote punctuation, avatars, and attribution.

## Design Rules

- Use hanging punctuation for quotes: `relative before:absolute before:inline before:-translate-x-full before:content-['\201C'] after:inline after:content-['\201D']`
- Always bottom-align avatars/names across equal-height testimonial cards: `flex flex-col justify-between` on each card; group quote content and attribution in their own wrapper elements
- Never add whitespace around quote content in `<p>` tags: write `<p>The quote text</p>` not `<p> The quote text </p>` (breaks hanging punctuation)
- Follow [avatar rules](./avatars.md) and [placeholder content rules](./placeholder-content.md) for testimonial photos
- Use unisex names: avatars are random so names must work for any photo
