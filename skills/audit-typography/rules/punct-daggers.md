---
title: Use Daggers and Special Marks Correctly
impact: CRITICAL
tags: dagger, double-dagger, footnotes, hedera, manicule
---

## Use Daggers and Special Marks Correctly

Use dagger (\u2020) and double dagger (\u2021) for footnotes when asterisks are already in use or when numbering is impractical. Use hedera (\u2767) and manicule (\u261e) sparingly as decorative elements only.

**Incorrect (improvised footnote markers):**

```html
<p>This claim requires citation.*</p>
<p>*See appendix A. **See appendix B.</p>
```

**Correct (proper footnote markers):**

```html
<p>This claim requires citation.&dagger;</p>
<p>Another point to note.&Dagger;</p>

<footer>
  <p>&dagger; See appendix A.</p>
  <p>&Dagger; See appendix B.</p>
</footer>
```

**Footnote marker order:** * \u2020 \u2021 \u00a7 \u2016 \u00b6 (then double up: ** \u2020\u2020 etc.)
