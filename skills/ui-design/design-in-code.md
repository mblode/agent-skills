# Design in Code

Fast, low-fi planning before visual polish.

## Start low-fi

- Plan the layout with ASCII wireframes (in Markdown or a comment block).
- Build structure first; make it usable before making it pretty.
- Use constraints early (grid, spacing, and type scale).

## Copy what works

- Start from a gold-standard product.
- Match layout, spacing, and hierarchy; then adapt to context.
- When refreshing an existing product, keep a live old/new toggle behind a feature flag for fast comparison.
- Tune colour and token changes in the running product when possible, then sync exact values back to the design system.
- Use quick review questions during polish: what should hold focus, which controls are louder than the task, and which borders or icons can be removed with no loss of meaning.

## Tools (defaults)

- shadcn/ui + Tailwind tokens.
- Keep components boring and conventional for faster iteration.
