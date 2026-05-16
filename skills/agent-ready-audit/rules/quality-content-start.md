---
title: Content starts early in page
impact: MEDIUM
tags: content-quality, truncation
---

## Content starts early in page

Actual content must appear within the first 10% of the page source. Navigation, cookie banners, and boilerplate before content wastes agent token budgets and risks truncation before meaningful content begins.

**Failing:**

500 lines of navigation, banners, and scripts before the first paragraph of actual content — agents parsing the raw HTML may hit context limits before reaching the content.

**Passing:**

Content starts within the first 10% of the page. Use semantic HTML (`<main>`, `<article>`) so agents can skip directly to content. Server-side rendered pages naturally front-load content.
