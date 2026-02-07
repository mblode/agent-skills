---
title: Use contractions for natural tone
impact: CRITICAL
tags: voice, contractions, tone
---

## Use contractions for natural tone

Contractions (don't, it's, you'll, won't) make documentation sound conversational and approachable. Avoiding contractions produces a stiff, formal tone that creates unnecessary distance between the writer and reader. Documentation that reads like natural speech is easier to scan and more pleasant to follow.

Use common contractions freely. Avoid unusual contractions (mightn't, shan't) that can confuse non-native English speakers.

**Incorrect (overly formal, no contractions):**

```markdown
You do not need to restart the server after changing environment
variables. It is not necessary to redeploy the application. If you
cannot connect, verify that the firewall is not blocking port 443.
You will receive an email when the build is complete.
```

**Correct (natural contractions):**

```markdown
You don't need to restart the server after changing environment
variables. It isn't necessary to redeploy the application. If you
can't connect, verify that the firewall isn't blocking port 443.
You'll receive an email when the build is complete.
```

Reference: [Google developer documentation style guide — Contractions](https://developers.google.com/style/contractions)
