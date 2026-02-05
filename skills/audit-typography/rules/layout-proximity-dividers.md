---
title: Use Proximity and Dividers to Clarify Associations
impact: MEDIUM
tags: proximity, dividers, rules, captions, headings
---

## Use Proximity and Dividers to Clarify Associations

Place captions and descriptions closer to the images or elements they describe. Use dividers (horizontal rules) to separate unrelated sections, placing them above headings rather than below. Dividers below headings visually underline them, which is a Victorian typographic convention that weakens the heading's connection to its content.

**Incorrect (divider below heading, caption far from image):**

```html
<h2>Our Process</h2>
<hr>  <!-- separates heading from its content -->
<p>We follow a three-step approach...</p>

<img src="photo.jpg" alt="Team meeting">

<p class="caption">The team during a strategy session.</p>
<!-- Caption is far from image if other content intervenes -->
```

**Correct (divider above heading, caption adjacent to image):**

```html
<hr>  <!-- separates from previous section -->
<h2>Our Process</h2>
<p>We follow a three-step approach...</p>

<figure>
  <img src="photo.jpg" alt="Team meeting">
  <figcaption>The team during a strategy session.</figcaption>
</figure>
```

Choose between hanging bullets that improve reading or standard indented bullets \u2014 decide based on readability in your specific layout.
