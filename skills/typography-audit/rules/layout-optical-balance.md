---
title: Balance Layouts Optically
impact: MEDIUM
tags: optical-centering, visual-balance, alignment, overshoot
---

## Balance Layouts Optically

Optically center elements slightly above true mathematical center: the eye reads the geometric center as too low. Account for overshoot in round and pointed shapes (an "O" must extend slightly past baseline and cap height to look the same size as flat letters). Trust your eye over measurements.

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

Applies to icons in buttons, text in cards, logos in headers, anywhere visual centering beats pixel math.
