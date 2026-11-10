---
name: frontend-components
description: Comprehensive guidance for building user interface components in the Mossback web client. Covers React components, props, state, hooks, context, forms, inputs, buttons, tables, modals, dialogs, toasts, layout, spacing, typography, colour tokens, icons, responsive behaviour, dark mode, accessibility, keyboard navigation, focus management, loading states, empty states, and error states. Also covers the shared component library, how to add a component to it, how components are documented in the workbench, and how view models are mapped from API responses for display. Helps with building a new screen, fixing a visual bug, making a component accessible, and reusing an existing component. Use when the user mentions a component, the UI, a page, a screen, a form, a button, a modal, styling, CSS, layout, design, React, or the front end. Always follows the Mossback platform conventions, house style, and established best practices.
---

# Frontend Components

## Rules

- Shared components live in `web/src/ui`. Check there before building a new control.
- Styling is Tailwind with the tokens in `web/tailwind.config.ts`. No ad hoc hex values.
- A component that fetches is a Server Component; interactive leaves are Client Components.
- Every interactive control has an accessible name.
