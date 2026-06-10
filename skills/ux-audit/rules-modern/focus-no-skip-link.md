---
title: No skip link before header/nav
slug: focus-no-skip-link
category: focus
defaultTier: backlog
surfaces: dashboard, list, marketing, sign-in
react-apis: <a href="#main">, sr-only utility, :focus-visible
related: focus-on-dynamic-content, focus-not-restored
---

## No skip link before header/nav

Keyboard and screen-reader users who land on a page with a long header or sidebar nav must Tab through every link before reaching the main content. A "Skip to main content" link as the first focusable element is the standard fix. It's invisible until focused (sr-only), then it appears and lets the user jump directly to `<main>`. Without it, every page navigation costs them 10+ tab presses.

## What goes wrong

Dashboard has a top navbar with 8 links and a sidebar with 12. Keyboard user lands on the page; Tab moves through 20 elements before reaching the actual content. On every page load. They give up and use the mouse, which defeats the whole point.

## Detection

**Surfaces:** marketing landing pages with long headers, dashboard layouts, list/feed pages with sidebars. Less critical for single-purpose surfaces (modal, simple sign-in form).

**Static signals:**
1. `rg '<header|<nav' --type=tsx -l app/ src/`: files with a primary nav.
2. For each, look for a sibling skip link (`href="#main"`, `href="#content"`, text matching `/skip to (main|content)/i`).
3. Confirm the target exists (`<main id="main">` or `<div id="content">`).
4. Flag layouts with header/nav but no skip link, especially `app/layout.tsx` / root layout files.

**Concrete commands:**
```bash
# Layouts with header/nav
rg -l '<header|<nav' --type=tsx app/ src/ | xargs rg -L 'href="#main"|href="#content"|skip to' \
  | grep -i layout

# Confirm landing target
rg '<main\b' --type=tsx app/ src/ -l | xargs rg 'id="main"|id="content"'
```

**False-positive guards:**
- Skip files where the header has fewer than 4 focusable elements (skip link adds little value).
- Skip pages that are just a single form (sign-in often doesn't need it).
- Skip files annotated `// ux-audit-ignore:focus-no-skip-link`.

## Fix

Add the skip link as the first child of `<body>` (or the topmost layout).

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
```

```css
/* globals.css: sr-only until focused */
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  background: white;
  outline: 2px solid currentColor;
  z-index: 9999;
}
```

Docs:
- WCAG 2.4.1 Bypass Blocks: https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
- WebAIM skip link guidance: https://webaim.org/techniques/skipnav/

## Default tier and overrides

**Defaults to:** `backlog`

**Surface overrides:**
| Surface | Tier |
|---|---|
| Government / regulated (WCAG-AA contractually required) | release-blocker |
| Dashboard with sidebar + topbar | fix-this-sprint |
| Marketing landing | backlog |
| Single-form sign-in | backlog (often N/A) |
| Internal admin | backlog |

## Examples

**Anti-pattern (fails):**
```tsx
<body>
  <Header /> {/* 8 links */}
  <Sidebar /> {/* 12 links */}
  <main>{children}</main>
</body>
```

**Applied (passes):**
```tsx
<body>
  <a href="#main" className="skip-link">Skip to main content</a>
  <Header />
  <Sidebar />
  <main id="main" tabIndex={-1}>{children}</main>
</body>
```

## Defer-to (when this is another tool's job)

- axe-core: WCAG 2.4.1 rule (`bypass`): primary owner of this finding.
- jsx-a11y: no specific lint rule, but Storybook a11y addon can catch.
- Lighthouse a11y category checks for skip-link presence.

## Suppression

```tsx
{/* ux-audit-ignore:focus-no-skip-link, single-form page, header is 1 link */}
```
