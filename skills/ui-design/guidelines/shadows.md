# Shadows

Covers: cards, modals, popovers, dropdowns, buttons, elevated surfaces, shadow/border pairings.

- Never pair shadows with solid gray borders. Use `ring-1 ring-black/5` or `ring-1 ring-black/10` (or `950` of your neutral).
- Never make elevated elements (cards, modals, popovers with `shadow-*`) darker than their canvas: use `white` or the lightest neutral, not `gray-100`/`gray-50`. Inset panels/wells without outer shadows can be darker.
- Use one depth technique per view: borders-only, tint, soft shadow, or layered shadow. Mixing hard shadows, soft shadows, borders, and tints makes hierarchy feel accidental.
- In dark UI, avoid shadows as the main depth cue. Use surface brightness, borders, or subtle tint because dark shadows either disappear or become too harsh.
- For custom shadows, make blur roughly twice the offset and lower opacity as elevation increases, e.g. `0 4px 8px rgba(...)` reads cleaner than a hard 4px shadow.
