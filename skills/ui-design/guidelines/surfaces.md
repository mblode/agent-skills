# Surfaces

Covers: cards, wells, borders, dividers, white space, recessed backgrounds, content grouping.

- Don't default to white cards on gray backgrounds: prefer content directly on white, or white cards with just a `border`
- Choose surface treatments by information hierarchy: white space alone for tightly related items; subtle borders/dividers for sibling content needing separation; wells (recessed backgrounds like `bg-gray-50`) for secondary or nested content; cards with borders or shadows for standalone, interactive, or highly distinct items
- Use the lightest separation that works: whitespace, then subtle borders/dividers, then cards; never jump straight to cards
- Reserve cards for independently interactive content (clickable to navigate) or fundamentally different content types
- Container borders must contrast with both adjacent surfaces. On dark-on-darker UI the border is lighter than both surfaces; on light-on-lighter UI it is darker than both.
- Avoid two hard divides touching: a background transition plus a card edge plus a divider creates visual noise. Remove one layer or soften it with whitespace.
- Put simple foregrounds on complex backgrounds, and complex foregrounds on simple backgrounds. Avoid complex-on-complex unless the content is intentionally decorative and low-stakes.
- In containers, outer padding is at least equal to inner gaps between child elements. Related children sit closer to each other than to the container edge.
- Subtle top borders or vertical dividers for sibling items in shared context: stat grids, metric rows, dashboard KPIs
- Divider-separated items: middle items get equal padding on both sides of the divider (`px-*`); the first item in a row gets only `pr-*` (no `pl-*`), the last gets only `pl-*` (no `pr-*`); for horizontal dividers: first item only `pb-*` (no `pt-*`), last only `pt-*` (no `pb-*`); when grid columns change at a breakpoint, reset padding per the new first/last, e.g. a 4-column grid becoming 2-column: items 1 and 3 are now row-starts (no `pl-*`), items 2 and 4 are now row-ends (no `pr-*`); use responsive prefixes like `sm:pl-0` or `lg:pr-0` to override at each breakpoint
- Reconfigure dividers at each breakpoint when grid columns change: use `nth-child` to target items not in the first column: 2 columns use `[&:nth-child(2n)]:border-l-*`; 4 columns use `[&:not(:nth-child(4n+1))]:border-l-*`; adjust the pattern per breakpoint to match the column count; when collapsing to a single column, remove vertical dividers and add horizontal dividers between rows (`border-t-*` on all items except the first)
- Whitespace alone suffices when content has inherent contrast (large numbers vs small labels, bold headings vs body text)
- Never use solid divider colors: use opacity-based like `divide-gray-950/5` or `border-gray-950/10`, not `divide-gray-200` or `border-gray-300`
