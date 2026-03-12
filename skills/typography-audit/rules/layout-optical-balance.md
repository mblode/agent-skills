---
title: Balance Layouts Optically
impact: MEDIUM
tags: optical-centering, visual-balance, alignment, overshoot
---

## Balance Layouts Optically

Optically center elements slightly above the true mathematical center \u2014 the human eye perceives the geometric center as too low. Account for overshoot in round and pointed shapes: an "O" must extend slightly beyond the baseline and cap height to appear the same size as flat-edged letters.

Trust your eye over measurements.

**Incorrect (mathematically centered, looks low):**

```css
.modal {
  position: fixed;
  top: 50%;
  transform: translateY(-50%); /* looks like it sags */
}
```

**Correct (optically centered, slightly above midpoint):**

```css
.modal {
  position: fixed;
  top: 45%; /* slightly above center */
  transform: translateY(-50%);
}

/* Or use padding bias */
.card-icon {
  padding: 1rem 1rem 1.25rem 1rem; /* more bottom padding */
}
```

This principle applies to icons in buttons, text in cards, logos in headers, and any element where visual centering matters more than pixel math.
