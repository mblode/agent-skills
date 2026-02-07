---
title: Write steps with imperative verbs
impact: CRITICAL
tags: structure, procedures, steps, imperative
---

## Write steps with imperative verbs

Introduce each procedure with a complete sentence that states the goal. Start each step with an imperative verb (open, run, click, set, copy). Number sequential steps. This pattern makes procedures scannable and actionable -- readers can see exactly what to do without parsing passive or descriptive language.

Keep each step to one action. If a step requires a sub-action, use lettered sub-steps.

**Incorrect (passive, descriptive steps):**

```markdown
## Changing the port

1. The configuration file needs to be opened.
2. The port value should be changed to the desired number.
3. The server needs to be restarted for the new settings.
```

**Correct (imperative verbs, goal stated up front):**

```markdown
## Change the port

To change the port your application listens on:

1. Open `config/server.yaml` in a text editor.
2. Set the `port` value to the desired number, for example `8080`.
3. Save the file and restart the server:
   ```bash
   systemctl restart myapp
   ```
```

Reference: [Google developer documentation style guide — Procedures](https://developers.google.com/style/procedures)
