---
title: Use Smart Quotes, Never Straight
impact: CRITICAL
tags: quotes, apostrophes, punctuation, utf-8
---

## Use Smart Quotes, Never Straight

Smart (curly) quotes are the hallmark of professional typography. Straight quotes are a remnant of typewriters and should only appear in code. Dumb quotes in headlines are especially noticeable.

Ensure your site uses UTF-8 encoding and normalize content at build or render time. Enable smart quote conversion in your CMS or build pipeline.

**Incorrect (straight/dumb quotes):**

```html
<p>"It's a beautiful day," she said.</p>
<p>The "best" option isn't always obvious.</p>
```

**Correct (smart/curly quotes):**

```html
<p>&ldquo;It&rsquo;s a beautiful day,&rdquo; she said.</p>
<p>The &ldquo;best&rdquo; option isn&rsquo;t always obvious.</p>
```

Or using UTF-8 directly:

```html
<p>\u201CIt\u2019s a beautiful day,\u201D she said.</p>
```

**Key characters:**

| Character | Name | HTML Entity | Mac Shortcut |
|-----------|------|-------------|--------------|
| \u201C | Left double quote | `&ldquo;` | Opt+[ |
| \u201D | Right double quote | `&rdquo;` | Opt+Shift+[ |
| \u2018 | Left single quote | `&lsquo;` | Opt+] |
| \u2019 | Right single quote / apostrophe | `&rsquo;` | Opt+Shift+] |

Use single quotes inside double quotes (US convention). Reserve straight quotes exclusively for code contexts.
