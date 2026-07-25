---
title: Use Daggers and Special Marks Correctly
impact: LOW-MEDIUM
tags: dagger, double-dagger, footnotes, hedera, manicule
---

## Use Daggers and Special Marks Correctly

Use dagger (†) and double dagger (‡) for footnotes when asterisks are taken or numbering is impractical. Use hedera (❧) and manicule (☞) sparingly, as decoration only.

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

**Footnote marker order:** * † ‡ § ‖ ¶ (then double up: ** †† etc.)
