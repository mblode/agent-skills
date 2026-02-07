---
title: End with next steps
impact: CRITICAL
tags: structure, navigation, next-steps, links
---

## End with next steps

End tutorials and how-to guides with a "Next steps" section linking to 2-4 related guides or logical next actions. Describe what each link helps the reader do, not just where it goes.

**Incorrect (ends abruptly after the last step):**

```markdown
## Step 3: Verify the deployment

Run the health check endpoint to confirm the service is running:

    curl https://api.example.com/health

You should see `{"status": "ok"}` in the response.
```

**Correct (ends with actionable next steps):**

```markdown
## Step 3: Verify the deployment

Run the health check endpoint to confirm the service is running:

    curl https://api.example.com/health

You should see `{"status": "ok"}` in the response.

## Next steps

- [Configure a custom domain](custom-domains.md) to serve your
  API from your own URL.
- [Set up monitoring](monitoring.md) to get alerts when the
  health check fails.
- [Enable auto-scaling](auto-scaling.md) to handle traffic spikes.
```

Reference: [Diataxis — How-to guides](https://diataxis.fr/how-to-guides/)
