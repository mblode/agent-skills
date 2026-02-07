---
title: Write descriptive alt text for all images
impact: MEDIUM-HIGH
tags: images, alt-text, accessibility
---

## Write descriptive alt text for all images

Every image needs alt text that conveys the information the image provides. Describe what the image shows, not what it is. Empty alt text or generic labels like "screenshot" leave screen reader users with no context.

**Incorrect (missing or generic alt text):**

```markdown
![Screenshot](auth-flow.png)

![Image 1](deployment-diagram.png)
```

**Correct (alt text describes the content):**

```markdown
![Authentication flow showing OAuth redirect from client to provider and back](auth-flow.png)

![Deployment architecture with load balancer routing to three app servers](deployment-diagram.png)
```

Reference: [W3C — Alt text decision tree](https://www.w3.org/WAI/tutorials/images/decision-tree/)
