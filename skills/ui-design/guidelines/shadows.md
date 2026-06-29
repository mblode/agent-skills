# Shadows

Covers: cards, modals, popovers, dropdowns, buttons, elevated surfaces, shadow/border pairings.

- Never pair shadows with solid gray borders. Use `ring-1 ring-black/5` or `ring-1 ring-black/10` (or `950` of your neutral).
- Never make elevated elements (cards, modals, popovers with `shadow-*`) darker than their canvas: use `white` or the lightest neutral, not `gray-100`/`gray-50`. Inset panels/wells without outer shadows can be darker.
