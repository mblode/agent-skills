---
title: License Fonts Properly
impact: LOW-MEDIUM
tags: licensing, web-fonts, open-source, commercial
---

## License Fonts Properly

Every font has a license that specifies permitted uses. Web fonts, desktop fonts, and app-embedded fonts often require separate licenses. Never use pirated fonts or files converted from a desktop-only license.

**Incorrect (desktop font converted and self-hosted without a web license):**

```css
@font-face {
  font-family: 'Gotham';
  /* .otf from a designer's machine run through a converter;
     the desktop license does not cover web embedding */
  src: url('/fonts/gotham-converted.woff2') format('woff2');
}
```

**Correct (licensed source, terms documented in code):**

```css
@font-face {
  font-family: 'Inter';
  /* SIL OFL 1.1: web use and self-hosting permitted.
     License: /fonts/LICENSE-Inter.txt */
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
}
```

**Checklist:**

- Verify the license covers web use (self-hosted or CDN)
- Check pageview limits on commercial web font licenses
- Confirm embedding rights for apps or PDFs
- Ensure the license covers the number of domains/projects
- Keep license documentation accessible to the team

Open-source sources: Google Fonts (SIL OFL), Adobe Fonts (with Creative Cloud), Font Squirrel, fonts.bunny.net. Commercial foundries: Hoefler&Co, Commercial Type, Klim, Grilli Type, Dinamo, Colophon. When budget is limited, start open-source and upgrade as the brand matures.
