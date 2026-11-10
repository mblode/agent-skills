---
name: incident-comms
description: Writes the public status page updates for a Heron Press incident. Use when asked to "post a status update", "write the incident update", or "what do we tell customers about the outage".
---

# Incident Comms

## Steps

1. State what customers are seeing, in their words: "Published posts are not updating", not "cache invalidation is failing".
2. State what is and is not affected.
3. Give the time of the next update, at most 30 minutes away, and keep to it even when there is nothing new.
4. On resolution, say what was wrong in one sentence and that a fuller note follows within five working days.

## Rules

- Never include a customer's name, site address, account id, or email in a public update, including in a screenshot.
- Never state a cause before the incident lead confirms it in the incident channel. A wrong cause published once is quoted for years.
- Do not say data was or was not lost until the storage owner has confirmed it either way. Say it is being checked.
- An update is posted by a person. This skill writes the draft and never calls the status page API.

## Gotchas

- Times on the status page are UTC with the zone written out.
- "Resolved" is used only after 30 minutes of normal metrics. Before that the state is "Monitoring".
